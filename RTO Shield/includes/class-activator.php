<?php
/**
 * Fired during plugin activation
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Activator {

	/**
	 * Plugin activation handler
	 *
	 * Creates database tables and sets default options
	 */
	public static function activate() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Plugin settings table
		$table_settings = $wpdb->prefix . 'rtoshield_settings';
		$sql_settings = "CREATE TABLE IF NOT EXISTS $table_settings (
			id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			setting_key VARCHAR(100) UNIQUE NOT NULL,
			setting_value LONGTEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_setting_key (setting_key)
		) $charset_collate;";

		// Courier configurations table
		$table_couriers = $wpdb->prefix . 'rtoshield_couriers';
		$sql_couriers = "CREATE TABLE IF NOT EXISTS $table_couriers (
			id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			courier_name VARCHAR(50) NOT NULL,
			is_enabled BOOLEAN DEFAULT FALSE,
			api_key VARCHAR(255),
			api_secret VARCHAR(255),
			additional_config LONGTEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_courier_enabled (courier_name, is_enabled)
		) $charset_collate;";

		// Customer risk cache table
		$table_cache = $wpdb->prefix . 'rtoshield_customer_cache';
		$sql_cache = "CREATE TABLE IF NOT EXISTS $table_cache (
			id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			phone_hash VARCHAR(64) UNIQUE NOT NULL,
			risk_score INT NOT NULL,
			risk_level VARCHAR(20) NOT NULL,
			delivery_history JSON,
			total_orders INT DEFAULT 0,
			successful_deliveries INT DEFAULT 0,
			refusals INT DEFAULT 0,
			last_courier_sync DATETIME,
			expires_at DATETIME NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_phone_hash (phone_hash),
			INDEX idx_expires_at (expires_at)
		) $charset_collate;";

		// Risk logs table
		$table_logs = $wpdb->prefix . 'rtoshield_risk_logs';
		$sql_logs = "CREATE TABLE IF NOT EXISTS $table_logs (
			id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			order_id BIGINT UNSIGNED,
			customer_phone VARCHAR(20),
			phone_hash VARCHAR(64),
			risk_score INT NOT NULL,
			risk_level VARCHAR(20) NOT NULL,
			action_taken VARCHAR(50),
			popup_shown BOOLEAN DEFAULT FALSE,
			converted BOOLEAN DEFAULT FALSE,
			conversion_method VARCHAR(50),
			discount_given DECIMAL(10,2) DEFAULT 0,
			order_amount DECIMAL(10,2),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_order_id (order_id),
			INDEX idx_phone_hash (phone_hash),
			INDEX idx_created_at (created_at)
		) $charset_collate;";

		// Analytics table
		$table_analytics = $wpdb->prefix . 'rtoshield_analytics';
		$sql_analytics = "CREATE TABLE IF NOT EXISTS $table_analytics (
			id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			date DATE NOT NULL,
			total_checkouts INT DEFAULT 0,
			risky_orders INT DEFAULT 0,
			popups_shown INT DEFAULT 0,
			conversions INT DEFAULT 0,
			cod_blocked INT DEFAULT 0,
			total_discount_given DECIMAL(10,2) DEFAULT 0,
			estimated_rto_prevented INT DEFAULT 0,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			UNIQUE KEY unique_date (date)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql_settings );
		dbDelta( $sql_couriers );
		dbDelta( $sql_cache );
		dbDelta( $sql_logs );
		dbDelta( $sql_analytics );

		// Set default settings
		self::set_default_settings();

		// Initialize courier entries
		self::initialize_couriers();

		// Set plugin version
		update_option( 'rto_shield_version', RTO_SHIELD_VERSION );
		update_option( 'rto_shield_activated', current_time( 'mysql' ) );

		// Schedule cron jobs
		if ( ! wp_next_scheduled( 'rto_shield_daily_analytics' ) ) {
			wp_schedule_event( time(), 'daily', 'rto_shield_daily_analytics' );
		}

		if ( ! wp_next_scheduled( 'rto_shield_cache_cleanup' ) ) {
			wp_schedule_event( time(), 'daily', 'rto_shield_cache_cleanup' );
		}
	}

	/**
	 * Set default plugin settings
	 */
	private static function set_default_settings() {
		$defaults = array(
			'risk_threshold_low'      => 30,
			'risk_threshold_medium'   => 50,
			'risk_threshold_high'     => 70,
			'popup_enabled'           => true,
			'popup_template'          => 'default',
			'popup_timer_seconds'     => 300,
			'discount_enabled'        => true,
			'discount_percentage'     => 10,
			'free_delivery_enabled'   => true,
			'cod_block_threshold'     => 80,
			'cache_duration_hours'    => 24,
		);

		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_settings';

		foreach ( $defaults as $key => $value ) {
			$wpdb->insert(
				$table,
				array(
					'setting_key'   => $key,
					'setting_value' => maybe_serialize( $value ),
				),
				array( '%s', '%s' )
			);
		}
	}

	/**
	 * Initialize courier entries
	 */
	private static function initialize_couriers() {
		$couriers = array( 'steadfast', 'pathao', 'redx', 'paperfly' );

		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_couriers';

		foreach ( $couriers as $courier ) {
			$wpdb->insert(
				$table,
				array(
					'courier_name' => $courier,
					'is_enabled'   => false,
				),
				array( '%s', '%d' )
			);
		}
	}
}
