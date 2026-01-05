<?php
/**
 * Risk calculation engine
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Risk_Calculator {

	/**
	 * Calculate risk score for a customer
	 *
	 * @param string $phone Customer phone number
	 * @return array Risk data with score and level
	 */
	public function calculate_risk( $phone ) {
		// Check cache first
		$cached = $this->get_cached_risk( $phone );
		if ( $cached && ! $this->is_cache_expired( $cached ) ) {
			return $cached;
		}

		// Fetch data from enabled couriers
		$courier_data = $this->fetch_courier_data( $phone );

		// Calculate risk score
		$risk_score = $this->compute_risk_score( $courier_data );
		$risk_level = $this->get_risk_level( $risk_score );

		// Cache the result
		$risk_data = array(
			'score'            => $risk_score,
			'level'            => $risk_level,
			'courier_data'     => $courier_data,
			'total_orders'     => $this->sum_field( $courier_data, 'total_orders' ),
			'successful'       => $this->sum_field( $courier_data, 'successful' ),
			'refusals'         => $this->sum_field( $courier_data, 'refusals' ),
		);

		$this->cache_risk_data( $phone, $risk_data );

		return $risk_data;
	}

	/**
	 * Get cached risk data
	 */
	private function get_cached_risk( $phone ) {
		global $wpdb;
		$table      = $wpdb->prefix . 'rtoshield_customer_cache';
		$phone_hash = hash( 'sha256', $phone );

		$cached = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE phone_hash = %s AND expires_at > NOW()",
				$phone_hash
			),
			ARRAY_A
		);

		if ( ! $cached ) {
			return null;
		}

		return array(
			'score'        => (int) $cached['risk_score'],
			'level'        => $cached['risk_level'],
			'courier_data' => json_decode( $cached['delivery_history'], true ),
			'total_orders' => (int) $cached['total_orders'],
			'successful'   => (int) $cached['successful_deliveries'],
			'refusals'     => (int) $cached['refusals'],
			'cached'       => true,
		);
	}

	/**
	 * Check if cache is expired
	 */
	private function is_cache_expired( $cached ) {
		return isset( $cached['cached'] ) && $cached['cached'] === false;
	}

	/**
	 * Fetch data from all enabled couriers
	 */
	private function fetch_courier_data( $phone ) {
		$enabled_couriers = RTO_Shield_Settings::get_enabled_couriers();
		$courier_data     = array();

		foreach ( $enabled_couriers as $courier_config ) {
			$courier_name = $courier_config['courier_name'];
			$courier      = $this->get_courier_instance( $courier_name, $courier_config );

			if ( $courier ) {
				$data = $courier->get_customer_history( $phone );
				if ( $data && ! is_wp_error( $data ) ) {
					$courier_data[ $courier_name ] = $data;
				}
			}
		}

		return $courier_data;
	}

	/**
	 * Get courier instance
	 */
	private function get_courier_instance( $courier_name, $config ) {
		switch ( $courier_name ) {
			case 'steadfast':
				return new RTO_Shield_Courier_Steadfast( $config );
			case 'pathao':
				return new RTO_Shield_Courier_Pathao( $config );
			case 'redx':
				return new RTO_Shield_Courier_RedX( $config );
			case 'paperfly':
				return new RTO_Shield_Courier_Paperfly( $config );
			default:
				return null;
		}
	}

	/**
	 * Compute risk score based on courier data
	 *
	 * Scoring algorithm:
	 * - Delivery Success Rate: 35%
	 * - Refusal History: 25%
	 * - Phone Age: 15%
	 * - Order Amount: 10%
	 * - Address Quality: 10%
	 * - Time of Order: 5%
	 */
	private function compute_risk_score( $courier_data ) {
		if ( empty( $courier_data ) ) {
			return 50; // Default medium risk if no data
		}

		$total_orders = $this->sum_field( $courier_data, 'total_orders' );
		$successful   = $this->sum_field( $courier_data, 'successful' );
		$refusals     = $this->sum_field( $courier_data, 'refusals' );

		if ( $total_orders === 0 ) {
			return 50; // New customer = medium risk
		}

		// Calculate success rate (0-100)
		$success_rate = ( $successful / $total_orders ) * 100;

		// Calculate refusal rate (0-100)
		$refusal_rate = ( $refusals / $total_orders ) * 100;

		// Weighted risk score (inverted - higher success = lower risk)
		$risk_score = 0;

		// Success rate factor (35% weight) - inverted
		$risk_score += ( 100 - $success_rate ) * 0.35;

		// Refusal rate factor (25% weight)
		$risk_score += $refusal_rate * 0.25;

		// Phone age factor (15% weight) - more orders = lower risk
		$age_risk = max( 0, 100 - ( $total_orders * 10 ) ); // 10 orders = very low risk
		$risk_score += $age_risk * 0.15;

		// Order amount factor (10% weight) - placeholder for now
		$risk_score += 50 * 0.10;

		// Address quality factor (10% weight) - placeholder
		$risk_score += 50 * 0.10;

		// Time of order factor (5% weight) - placeholder
		$risk_score += 50 * 0.05;

		return min( 100, max( 0, round( $risk_score ) ) );
	}

	/**
	 * Get risk level from score
	 */
	private function get_risk_level( $score ) {
		$thresholds = array(
			'low'      => RTO_Shield_Settings::get( 'risk_threshold_low', 30 ),
			'medium'   => RTO_Shield_Settings::get( 'risk_threshold_medium', 50 ),
			'high'     => RTO_Shield_Settings::get( 'risk_threshold_high', 70 ),
		);

		if ( $score <= $thresholds['low'] ) {
			return 'low';
		} elseif ( $score <= $thresholds['medium'] ) {
			return 'medium';
		} elseif ( $score <= $thresholds['high'] ) {
			return 'high';
		} else {
			return 'critical';
		}
	}

	/**
	 * Cache risk data
	 */
	private function cache_risk_data( $phone, $risk_data ) {
		global $wpdb;
		$table      = $wpdb->prefix . 'rtoshield_customer_cache';
		$phone_hash = hash( 'sha256', $phone );

		$cache_hours = RTO_Shield_Settings::get( 'cache_duration_hours', 24 );
		$expires_at  = date( 'Y-m-d H:i:s', strtotime( "+{$cache_hours} hours" ) );

		$wpdb->replace(
			$table,
			array(
				'phone_hash'            => $phone_hash,
				'risk_score'            => $risk_data['score'],
				'risk_level'            => $risk_data['level'],
				'delivery_history'      => wp_json_encode( $risk_data['courier_data'] ),
				'total_orders'          => $risk_data['total_orders'],
				'successful_deliveries' => $risk_data['successful'],
				'refusals'              => $risk_data['refusals'],
				'last_courier_sync'     => current_time( 'mysql' ),
				'expires_at'            => $expires_at,
			),
			array( '%s', '%d', '%s', '%s', '%d', '%d', '%d', '%s', '%s' )
		);
	}

	/**
	 * Sum a field across all courier data
	 */
	private function sum_field( $courier_data, $field ) {
		$sum = 0;
		foreach ( $courier_data as $data ) {
			if ( isset( $data[ $field ] ) ) {
				$sum += (int) $data[ $field ];
			}
		}
		return $sum;
	}
}
