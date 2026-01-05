<?php
/**
 * The core plugin class
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield {

	/**
	 * The loader that's responsible for maintaining and registering all hooks
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin
	 */
	public function __construct() {
		$this->version     = RTO_SHIELD_VERSION;
		$this->plugin_name = 'rto-shield';

		$this->load_dependencies();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin
	 */
	private function load_dependencies() {
		// Core classes
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-loader.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-settings.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-risk-calculator.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-checkout-handler.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-popup-renderer.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/class-analytics.php';

		// Courier integrations
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/couriers/class-courier-interface.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/couriers/class-steadfast.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/couriers/class-pathao.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/couriers/class-redx.php';
		require_once RTO_SHIELD_PLUGIN_DIR . 'includes/couriers/class-paperfly.php';

		// Admin classes
		require_once RTO_SHIELD_PLUGIN_DIR . 'admin/class-admin.php';

		$this->loader = new RTO_Shield_Loader();
	}

	/**
	 * Register all hooks related to the admin area
	 */
	private function define_admin_hooks() {
		$plugin_admin = new RTO_Shield_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_admin_menu' );
		$this->loader->add_action( 'admin_init', $plugin_admin, 'register_settings' );
	}

	/**
	 * Register all hooks related to the public-facing functionality
	 */
	private function define_public_hooks() {
		$checkout_handler = new RTO_Shield_Checkout_Handler( $this->get_plugin_name(), $this->get_version() );

		// Enqueue frontend assets
		$this->loader->add_action( 'wp_enqueue_scripts', $checkout_handler, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $checkout_handler, 'enqueue_scripts' );

		// WooCommerce checkout hooks
		$this->loader->add_action( 'woocommerce_after_checkout_billing_form', $checkout_handler, 'add_phone_field_listener' );
		$this->loader->add_action( 'wp_ajax_rto_shield_check_risk', $checkout_handler, 'ajax_check_risk' );
		$this->loader->add_action( 'wp_ajax_nopriv_rto_shield_check_risk', $checkout_handler, 'ajax_check_risk' );
		
		// Conversion hooks
		$this->loader->add_action( 'wp_ajax_rto_shield_record_conversion', $checkout_handler, 'ajax_record_conversion' );
		$this->loader->add_action( 'wp_ajax_nopriv_rto_shield_record_conversion', $checkout_handler, 'ajax_record_conversion' );
		$this->loader->add_action( 'woocommerce_cart_calculate_fees', $checkout_handler, 'apply_conversion_discount', 20 );
		$this->loader->add_filter( 'woocommerce_package_rates', $checkout_handler, 'apply_free_shipping_conversion', 10, 2 );

		$this->loader->add_action( 'woocommerce_checkout_process', $checkout_handler, 'validate_checkout' );

		// Cron jobs
		$analytics = new RTO_Shield_Analytics();
		$this->loader->add_action( 'rto_shield_daily_analytics', $analytics, 'aggregate_daily_stats' );
		$this->loader->add_action( 'rto_shield_cache_cleanup', $analytics, 'cleanup_expired_cache' );
	}

	/**
	 * Run the loader to execute all hooks
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin
	 */
	public function get_version() {
		return $this->version;
	}
}
