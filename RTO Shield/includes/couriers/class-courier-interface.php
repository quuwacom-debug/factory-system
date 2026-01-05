<?php
/**
 * Courier interface - abstract class for all courier integrations
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes/couriers
 */

abstract class RTO_Shield_Courier_Interface {

	protected $config;
	protected $api_key;
	protected $api_secret;

	public function __construct( $config ) {
		$this->config     = $config;
		$this->api_key    = isset( $config['api_key'] ) ? $config['api_key'] : '';
		$this->api_secret = isset( $config['api_secret'] ) ? $config['api_secret'] : '';
	}

	/**
	 * Get customer delivery history
	 *
	 * @param string $phone Customer phone number
	 * @return array|WP_Error Customer history data or error
	 */
	abstract public function get_customer_history( $phone );

	/**
	 * Test API connection
	 *
	 * @return bool|WP_Error True if connection successful, error otherwise
	 */
	abstract public function test_connection();

	/**
	 * Make HTTP request
	 *
	 * @param string $url API endpoint
	 * @param array $args Request arguments
	 * @return array|WP_Error Response data or error
	 */
	protected function make_request( $url, $args = array() ) {
		$response = wp_remote_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$status_code = wp_remote_retrieve_response_code( $response );
		$body        = wp_remote_retrieve_body( $response );
		$data        = json_decode( $body, true );

		if ( $status_code !== 200 ) {
			return new WP_Error(
				'api_error',
				sprintf( 'API returned status code %d', $status_code ),
				array( 'response' => $data )
			);
		}

		return $data;
	}

	/**
	 * Normalize phone number
	 *
	 * @param string $phone Phone number
	 * @return string Normalized phone number
	 */
	protected function normalize_phone( $phone ) {
		// Remove all non-numeric characters
		$phone = preg_replace( '/[^0-9]/', '', $phone );

		// Add Bangladesh country code if not present
		if ( strlen( $phone ) === 11 && substr( $phone, 0, 2 ) === '01' ) {
			$phone = '88' . $phone;
		} elseif ( strlen( $phone ) === 10 ) {
			$phone = '880' . $phone;
		}

		return $phone;
	}
}
