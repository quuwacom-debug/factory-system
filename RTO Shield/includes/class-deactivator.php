<?php
/**
 * Fired during plugin deactivation
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Deactivator {

	/**
	 * Plugin deactivation handler
	 *
	 * Cleans up scheduled cron jobs
	 */
	public static function deactivate() {
		// Clear scheduled cron jobs
		$timestamp = wp_next_scheduled( 'rto_shield_daily_analytics' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'rto_shield_daily_analytics' );
		}

		// Clear cache cleanup cron
		$timestamp = wp_next_scheduled( 'rto_shield_cache_cleanup' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'rto_shield_cache_cleanup' );
		}

		// Note: We don't delete tables or data on deactivation
		// This preserves merchant data if they temporarily deactivate
		// Data deletion only happens on uninstall
	}
}
