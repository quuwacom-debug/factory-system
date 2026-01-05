<?php
/**
 * Steadfast courier integration
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes/couriers
 */

class RTO_Shield_Courier_Steadfast extends RTO_Shield_Courier_Interface {

	private $base_url = 'https://portal.packzy.com/api/v1';

	/**
	 * Get customer delivery history from Steadfast
	 *
	 * @param string $phone Customer phone number
	 * @return array|WP_Error Customer history data
	 */
	public function get_customer_history( $phone ) {
		$phone = $this->normalize_phone( $phone );

		$url = $this->base_url . '/get_customer_info';

		$args = array(
			'method'  => 'POST',
			'headers' => array(
				'Api-Key'    => $this->api_key,
				'Secret-Key' => $this->api_secret,
				'Content-Type' => 'application/json',
			),
			'body'    => wp_json_encode( array(
				'phone' => $phone,
			) ),
			'timeout' => 10,
		);

		$response = $this->make_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		// Parse Steadfast response
		if ( isset( $response['status'] ) && $response['status'] == 200 && isset( $response['data'] ) ) {
			$data = $response['data'];

			return array(
				'total_orders' => isset( $data['total_orders'] ) ? (int) $data['total_orders'] : 0,
				'successful'   => isset( $data['delivered'] ) ? (int) $data['delivered'] : 0,
				'refusals'     => isset( $data['returned'] ) ? (int) $data['returned'] : 0,
				'cancelled'    => isset( $data['cancelled'] ) ? (int) $data['cancelled'] : 0,
				'success_rate' => isset( $data['success_rate'] ) ? (float) $data['success_rate'] : 0,
			);
		}

		return new WP_Error( 'invalid_response', 'Invalid response from Steadfast API' );
	}

	/**
	 * Test Steadfast API connection
	 *
	 * @return bool|WP_Error
	 */
	public function test_connection() {
		// Test with a dummy phone number
		$result = $this->get_customer_history( '01700000000' );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return true;
	}
}
