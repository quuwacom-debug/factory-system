<?php
/**
 * Settings management class
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Settings {

	/**
	 * Get a setting value
	 */
	public static function get( $key, $default = null ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_settings';

		$value = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT setting_value FROM $table WHERE setting_key = %s",
				$key
			)
		);

		if ( $value === null ) {
			return $default;
		}

		return maybe_unserialize( $value );
	}

	/**
	 * Set a setting value
	 */
	public static function set( $key, $value ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_settings';

		$exists = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM $table WHERE setting_key = %s",
				$key
			)
		);

		if ( $exists ) {
			$wpdb->update(
				$table,
				array( 'setting_value' => maybe_serialize( $value ) ),
				array( 'setting_key' => $key ),
				array( '%s' ),
				array( '%s' )
			);
		} else {
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
	 * Get all settings
	 */
	public static function get_all() {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_settings';

		$results = $wpdb->get_results( "SELECT setting_key, setting_value FROM $table" );

		$settings = array();
		foreach ( $results as $row ) {
			$settings[ $row->setting_key ] = maybe_unserialize( $row->setting_value );
		}

		return $settings;
	}

	/**
	 * Get enabled couriers
	 */
	public static function get_enabled_couriers() {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_couriers';

		return $wpdb->get_results(
			"SELECT * FROM $table WHERE is_enabled = 1",
			ARRAY_A
		);
	}

	/**
	 * Get courier configuration
	 */
	public static function get_courier( $courier_name ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_couriers';

		return $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE courier_name = %s",
				$courier_name
			),
			ARRAY_A
		);
	}

	/**
	 * Update courier configuration
	 */
	public static function update_courier( $courier_name, $data ) {
		global $wpdb;
		$table = $wpdb->prefix . 'rtoshield_couriers';

		$wpdb->update(
			$table,
			$data,
			array( 'courier_name' => $courier_name ),
			null,
			array( '%s' )
		);
	}
}
