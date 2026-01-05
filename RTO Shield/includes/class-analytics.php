<?php
/**
 * Analytics tracking class
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Analytics {

	/**
	 * Aggregate daily statistics (cron job)
	 */
	public function aggregate_daily_stats() {
		global $wpdb;
		$logs_table      = $wpdb->prefix . 'rtoshield_risk_logs';
		$analytics_table = $wpdb->prefix . 'rtoshield_analytics';

		$yesterday = date( 'Y-m-d', strtotime( '-1 day' ) );

		// Get stats for yesterday
		$stats = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT 
					COUNT(*) as total_checkouts,
					SUM(CASE WHEN risk_level IN ('high', 'critical') THEN 1 ELSE 0 END) as risky_orders,
					SUM(CASE WHEN popup_shown = 1 THEN 1 ELSE 0 END) as popups_shown,
					SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions,
					SUM(CASE WHEN action_taken = 'cod_blocked' THEN 1 ELSE 0 END) as cod_blocked,
					SUM(discount_given) as total_discount_given
				FROM $logs_table
				WHERE DATE(created_at) = %s",
				$yesterday
			),
			ARRAY_A
		);

		if ( $stats ) {
			// Estimate RTO prevented (conversions + blocked orders)
			$rto_prevented = (int) $stats['conversions'] + (int) $stats['cod_blocked'];

			$wpdb->replace(
				$analytics_table,
				array(
					'date'                   => $yesterday,
					'total_checkouts'        => (int) $stats['total_checkouts'],
					'risky_orders'           => (int) $stats['risky_orders'],
					'popups_shown'           => (int) $stats['popups_shown'],
					'conversions'            => (int) $stats['conversions'],
					'cod_blocked'            => (int) $stats['cod_blocked'],
					'total_discount_given'   => (float) $stats['total_discount_given'],
					'estimated_rto_prevented' => $rto_prevented,
				),
				array( '%s', '%d', '%d', '%d', '%d', '%d', '%f', '%d' )
			);
		}
	}

	/**
	 * Cleanup expired cache (cron job)
	 */
	public function cleanup_expired_cache() {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_customer_cache';

		$wpdb->query( "DELETE FROM $table WHERE expires_at < NOW()" );
	}

	/**
	 * Get dashboard stats
	 */
	public static function get_dashboard_stats( $days = 30 ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_analytics';

		$start_date = date( 'Y-m-d', strtotime( "-{$days} days" ) );

		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE date >= %s ORDER BY date ASC",
				$start_date
			),
			ARRAY_A
		);
	}

	/**
	 * Get summary stats
	 */
	public static function get_summary_stats( $days = 30 ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_analytics';

		$start_date = date( 'Y-m-d', strtotime( "-{$days} days" ) );

		$stats = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT 
					SUM(total_checkouts) as total_checkouts,
					SUM(risky_orders) as risky_orders,
					SUM(popups_shown) as popups_shown,
					SUM(conversions) as conversions,
					SUM(cod_blocked) as cod_blocked,
					SUM(total_discount_given) as total_discount_given,
					SUM(estimated_rto_prevented) as estimated_rto_prevented
				FROM $table
				WHERE date >= %s",
				$start_date
			),
			ARRAY_A
		);

		// Calculate conversion rate
		if ( $stats && $stats['popups_shown'] > 0 ) {
			$stats['conversion_rate'] = round( ( $stats['conversions'] / $stats['popups_shown'] ) * 100, 2 );
		} else {
			$stats['conversion_rate'] = 0;
		}

		return $stats;
	}
}
