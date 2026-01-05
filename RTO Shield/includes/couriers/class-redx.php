<?php
/**
 * RedX courier integration
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes/couriers
 */

class RTO_Shield_Courier_RedX extends RTO_Shield_Courier_Interface {

	private $base_url = 'https://openapi.redx.com.bd/v1';

	/**
	 * Get customer delivery history from RedX
	 *
	 * @param string $phone Customer phone number
	 * @return array|WP_Error Customer history data
	 */
	public function get_customer_history( $phone ) {
		$phone = $this->normalize_phone( $phone );

		$url = $this->base_url . '/customer/stats';

		$args = array(
			'method'  => 'POST',
			'headers' => array(
				'API-ACCESS-TOKEN' => $this->api_key,
				'Content-Type'     => 'application/json',
			),
			'body'    => wp_json_encode( array(
				'customer_phone' => $phone,
			) ),
			'timeout' => 10,
		);

		$response = $this->make_request( $url, $args );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		// Parse RedX response
		if ( isset( $response['success'] ) && $response['success'] && isset( $response['data'] ) ) {
			$data = $response['data'];

			$total = isset( $data['orders'] ) ? (int) $data['orders'] : 0;
			$delivered = isset( $data['delivered'] ) ? (int) $data['delivered'] : 0;
			$refused = isset( $data['refused'] ) ? (int) $data['refused'] : 0;

			return array(
				'total_orders' => $total,
				'successful'   => $delivered,
				'refusals'     => $refused,
				'success_rate' => isset( $data['delivery_rate'] ) ? (float) $data['delivery_rate'] : 0,
			);
		}

		return new WP_Error( 'invalid_response', 'Invalid response from RedX API' );
	}

	/**
	 * Test RedX API connection
	 *
	 * @return bool|WP_Error
	 */
	public function test_connection() {
		$result = $this->get_customer_history( '01700000000' );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return true;
	}
}
