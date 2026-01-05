<?php
/**
 * Admin area functionality
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/admin
 */

class RTO_Shield_Admin {

	private $plugin_name;
	private $version;

	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	/**
	 * Enqueue admin styles
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			$this->plugin_name,
			RTO_SHIELD_PLUGIN_URL . 'admin/css/admin.css',
			array(),
			$this->version
		);
	}

	/**
	 * Enqueue admin scripts
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			$this->plugin_name,
			RTO_SHIELD_PLUGIN_URL . 'admin/js/admin.js',
			array( 'jquery' ),
			$this->version,
			true
		);

		wp_localize_script(
			$this->plugin_name,
			'rtoShieldAdmin',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'rto_shield_admin_nonce' ),
			)
		);
	}

	/**
	 * Add admin menu
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'RTO Shield', 'rto-shield' ),
			__( 'RTO Shield', 'rto-shield' ),
			'manage_woocommerce',
			'rto-shield',
			array( $this, 'display_dashboard' ),
			'dashicons-shield',
			56
		);

		add_submenu_page(
			'rto-shield',
			__( 'Dashboard', 'rto-shield' ),
			__( 'Dashboard', 'rto-shield' ),
			'manage_woocommerce',
			'rto-shield',
			array( $this, 'display_dashboard' )
		);

		add_submenu_page(
			'rto-shield',
			__( 'Settings', 'rto-shield' ),
			__( 'Settings', 'rto-shield' ),
			'manage_woocommerce',
			'rto-shield-settings',
			array( $this, 'display_settings' )
		);

		add_submenu_page(
			'rto-shield',
			__( 'Couriers', 'rto-shield' ),
			__( 'Couriers', 'rto-shield' ),
			'manage_woocommerce',
			'rto-shield-couriers',
			array( $this, 'display_couriers' )
		);

		add_submenu_page(
			'rto-shield',
			__( 'Risk Logs', 'rto-shield' ),
			__( 'Risk Logs', 'rto-shield' ),
			'manage_woocommerce',
			'rto-shield-logs',
			array( $this, 'display_logs' )
		);
	}

	/**
	 * Display dashboard page
	 */
	public function display_dashboard() {
		include RTO_SHIELD_PLUGIN_DIR . 'admin/views/dashboard.php';
	}

	/**
	 * Display settings page
	 */
	public function display_settings() {
		include RTO_SHIELD_PLUGIN_DIR . 'admin/views/settings-general.php';
	}

	/**
	 * Display couriers page
	 */
	public function display_couriers() {
		include RTO_SHIELD_PLUGIN_DIR . 'admin/views/settings-couriers.php';
	}

	/**
	 * Display logs page
	 */
	public function display_logs() {
		include RTO_SHIELD_PLUGIN_DIR . 'admin/views/risk-logs.php';
	}

	/**
	 * Register settings
	 */
	public function register_settings() {
		$this->loader->add_action( 'wp_ajax_rto_shield_test_courier', $this, 'ajax_test_courier' );
	}

	/**
	 * AJAX handler for testing courier connection
	 */
	public function ajax_test_courier() {
		check_ajax_referer( 'rto_shield_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error( array( 'message' => 'Unauthorized' ) );
		}

		$courier_name = isset( $_POST['courier'] ) ? sanitize_text_field( $_POST['courier'] ) : '';

		if ( empty( $courier_name ) ) {
			wp_send_json_error( array( 'message' => 'Courier name required' ) );
		}

		$config = RTO_Shield_Settings::get_courier( $courier_name );
		
		if ( ! $config ) {
			wp_send_json_error( array( 'message' => 'Courier config not found' ) );
		}

		// Use a dummy phone number for testing
		$courier_class = 'RTO_Shield_Courier_' . ucfirst( $courier_name );
		if ( ! class_exists( $courier_class ) ) {
			wp_send_json_error( array( 'message' => 'Courier class not found' ) );
		}

		$courier = new $courier_class( $config );
		$result  = $courier->test_connection();

		if ( is_wp_error( $result ) ) {
			wp_send_json_error( array( 'message' => $result->get_error_message() ) );
		}

		wp_send_json_success( array( 'message' => 'Connection successful!' ) );
	}
}
