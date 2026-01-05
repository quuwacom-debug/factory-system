<?php
/**
 * Paperfly courier integration
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes/couriers
 */

class RTO_Shield_Courier_Paperfly extends RTO_Shield_Courier_Interface {

	private $base_url = 'https://api.paperfly.com.bd/v2';

	/**
	 * Get customer delivery history from Paperfly
	 *
	 * @param string $phone Customer phone number
	 * @return array|WP_Error Customer history data
	 */
	public function get_customer_history( $phone ) {
		$phone = $this->normalize_phone( $phone );

		$url = $this->base_url . '/customer/reliability';

		$args = array(
			'method'  => 'GET',
			'headers' => array(
				'Authorization' => $this->api_key,
				'Content-Type'  => 'application/json',
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

		// Parse Paperfly response
		if ( isset( $response['total_parcels'] ) ) {
			$total = isset( $response['total_parcels'] ) ? (int) $response['total_parcels'] : 0;
			$successful = isset( $response['successful'] ) ? (int) $response['successful'] : 0;
			$refused = isset( $response['refused'] ) ? (int) $response['refused'] : 0;

			return array(
				'total_orders' => $total,
				'successful'   => $successful,
				'refusals'     => $refused,
				'partial'      => isset( $response['partial'] ) ? (int) $response['partial'] : 0,
				'success_rate' => isset( $response['cod_collection_rate'] ) ? (float) $response['cod_collection_rate'] : 0,
			);
		}

		return new WP_Error( 'invalid_response', 'Invalid response from Paperfly API' );
	}

	/**
	 * Test Paperfly API connection
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
