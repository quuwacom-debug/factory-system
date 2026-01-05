<?php
/**
 * Checkout handler - intercepts WooCommerce checkout
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Checkout_Handler {

	private $plugin_name;
	private $version;

	/**
	 * Register all hooks related to the public-facing functionality
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}


	/**
	 * Enqueue frontend styles
	 */
	public function enqueue_styles() {
		if ( is_checkout() ) {
			wp_enqueue_style(
				$this->plugin_name . '-popup',
				RTO_SHIELD_PLUGIN_URL . 'public/css/popup.css',
				array(),
				$this->version
			);
		}
	}

	/**
	 * Enqueue frontend scripts
	 */
	public function enqueue_scripts() {
		if ( is_checkout() ) {
			wp_enqueue_script(
				$this->plugin_name . '-popup-logic',
				RTO_SHIELD_PLUGIN_URL . 'public/js/popup.js',
				array( 'jquery' ),
				$this->version,
				true
			);

			wp_enqueue_script(
				$this->plugin_name . '-checkout',
				RTO_SHIELD_PLUGIN_URL . 'public/js/checkout.js',
				array( 'jquery', $this->plugin_name . '-popup-logic' ),
				$this->version,
				true
			);

			wp_localize_script(
				$this->plugin_name . '-checkout',
				'rtoShield',
				array(
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'nonce'    => wp_create_nonce( 'rto_shield_risk_check' ),
				)
			);
		}
	}

	/**
	 * Add phone field listener to checkout
	 */
	public function add_phone_field_listener() {
		// This will be handled by JavaScript
		// Just ensure the popup container exists
		echo '<div id="rto-shield-popup-container"></div>';
	}

	/**
	 * AJAX handler for risk check
	 */
	public function ajax_check_risk() {
		check_ajax_referer( 'rto_shield_risk_check', 'nonce' );

		$phone = isset( $_POST['phone'] ) ? sanitize_text_field( $_POST['phone'] ) : '';

		if ( empty( $phone ) ) {
			wp_send_json_error( array( 'message' => 'Phone number required' ) );
		}

		// Calculate risk
		$calculator = new RTO_Shield_Risk_Calculator();
		$risk_data  = $calculator->calculate_risk( $phone );

		// Log the risk check
		$this->log_risk_check( $phone, $risk_data );

		// Determine action
		$action = $this->determine_action( $risk_data['score'] );

		// Prepare response
		$response = array(
			'risk_score'  => $risk_data['score'],
			'risk_level'  => $risk_data['level'],
			'action'      => $action,
			'show_popup'  => $action === 'show_popup',
			'block_cod'   => $action === 'block_cod',
		);

		// If showing popup, include popup configuration and HTML
		if ( $action === 'show_popup' ) {
			$popup_config = $this->get_popup_config();
			$response['popup_config'] = $popup_config;
			$response['popup_html']   = RTO_Shield_Popup_Renderer::render( $popup_config );
		}

		wp_send_json_success( $response );
	}

	/**
	 * Apply conversion discount
	 */
	public function apply_conversion_discount( $cart ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) return;

		if ( WC()->session->get( 'rto_shield_converted' ) ) {
			$percentage = RTO_Shield_Settings::get( 'discount_percentage', 10 );
			$discount   = ( $cart->get_subtotal() * $percentage ) / 100;
			
			if ( $discount > 0 ) {
				$cart->add_fee( sprintf( 'Prepaid Discount (%d%%)', $percentage ), -$discount );
			}
		}
	}

	/**
	 * Apply free shipping on conversion
	 */
	public function apply_free_shipping_conversion( $rates, $package ) {
		if ( WC()->session->get( 'rto_shield_converted' ) && RTO_Shield_Settings::get( 'free_delivery_enabled', true ) ) {
			foreach ( $rates as $rate_key => $rate ) {
				$rates[$rate_key]->cost = 0;
			}
		}
		return $rates;
	}

	/**
	 * AJAX handler to record conversion
	 */
	public function ajax_record_conversion() {
		$phone = isset( $_POST['phone'] ) ? sanitize_text_field( $_POST['phone'] ) : '';
		
		if ( ! empty( $phone ) ) {
			WC()->session->set( 'rto_shield_converted', true );
			WC()->session->set( 'rto_shield_customer_phone', $phone );
			
			// Update log
			global $wpdb;
			$table = $wpdb->prefix . 'rtoshield_risk_logs';
			$wpdb->update(
				$table,
				array( 'converted' => 1, 'action_taken' => 'popup_converted' ),
				array( 'customer_phone' => $phone, 'converted' => 0 ),
				array( '%d', '%s' ),
				array( '%s', '%d' )
			);

			wp_send_json_success( array( 'message' => 'Conversion recorded' ) );
		}
		wp_send_json_error();
	}

	/**
	 * Determine action based on risk score
	 */
	private function determine_action( $risk_score ) {
		$high_threshold     = RTO_Shield_Settings::get( 'risk_threshold_high', 70 );
		$block_threshold    = RTO_Shield_Settings::get( 'cod_block_threshold', 80 );
		$popup_enabled      = RTO_Shield_Settings::get( 'popup_enabled', true );

		if ( $risk_score >= $block_threshold ) {
			return 'block_cod';
		} elseif ( $risk_score >= $high_threshold && $popup_enabled ) {
			return 'show_popup';
		} else {
			return 'allow';
		}
	}

	/**
	 * Get popup configuration
	 */
	private function get_popup_config() {
		return array(
			'template'           => RTO_Shield_Settings::get( 'popup_template', 'default' ),
			'timer_seconds'      => RTO_Shield_Settings::get( 'popup_timer_seconds', 300 ),
			'discount_enabled'   => RTO_Shield_Settings::get( 'discount_enabled', true ),
			'discount_percent'   => RTO_Shield_Settings::get( 'discount_percentage', 10 ),
			'free_delivery'      => RTO_Shield_Settings::get( 'free_delivery_enabled', true ),
		);
	}

	/**
	 * Log risk check
	 */
	private function log_risk_check( $phone, $risk_data ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_risk_logs';

		$wpdb->insert(
			$table,
			array(
				'customer_phone' => $phone,
				'phone_hash'     => hash( 'sha256', $phone ),
				'risk_score'     => $risk_data['score'],
				'risk_level'     => $risk_data['level'],
				'action_taken'   => 'risk_checked',
				'popup_shown'    => false,
			),
			array( '%s', '%s', '%d', '%s', '%s', '%d' )
		);
	}

	/**
	 * Validate checkout - block COD if necessary
	 */
	public function validate_checkout() {
		// This will be implemented in Phase 5
		// For now, just a placeholder
	}
}
