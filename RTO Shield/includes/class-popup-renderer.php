<?php
/**
 * Popup renderer class
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes
 */

class RTO_Shield_Popup_Renderer {

	/**
	 * Render popup HTML
	 *
	 * @param array $config Popup configuration
	 * @return string HTML content
	 */
	public static function render( $config ) {
		$template = isset( $config['template'] ) ? $config['template'] : 'default';
		$template_file = RTO_SHIELD_PLUGIN_DIR . "templates/popup-{$template}.php";

		if ( ! file_exists( $template_file ) ) {
			$template_file = RTO_SHIELD_PLUGIN_DIR . 'templates/popup-default.php';
		}

		ob_start();
		include $template_file;
		return ob_get_clean();
	}

	/**
	 * Get popup data for JavaScript
	 *
	 * @param array $config Popup configuration
	 * @return array Popup data
	 */
	public static function get_popup_data( $config ) {
		$discount_percent = isset( $config['discount_percent'] ) ? $config['discount_percent'] : 10;
		$free_delivery    = isset( $config['free_delivery'] ) ? $config['free_delivery'] : true;
		$timer_seconds    = isset( $config['timer_seconds'] ) ? $config['timer_seconds'] : 300;

		return array(
			'discount_percent' => $discount_percent,
			'free_delivery'    => $free_delivery,
			'timer_seconds'    => $timer_seconds,
			'currency_symbol'  => get_woocommerce_currency_symbol(),
		);
	}
}
