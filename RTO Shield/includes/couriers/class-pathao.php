<?php
/**
 * Pathao courier integration
 *
 * @package    RTO_Shield
 * @subpackage RTO_Shield/includes/couriers
 */

class RTO_Shield_Courier_Pathao extends RTO_Shield_Courier_Interface {

	private $base_url = 'https://api-hermes.pathao.com/api/v1';

	/**
	 * Get customer delivery history from Pathao
	 *
	 * @param string $phone Customer phone number
	 * @return array|WP_Error Customer history data
	 */
	public function get_customer_history( $phone ) {
		$phone = $this->normalize_phone( $phone );

		$url = $this->base_url . '/orders/customer-history';

		$args = array(
			'method'  => 'GET',
			'headers' => array(
				'Authorization' => 'Bearer ' . $this->api_key,
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

		// Parse Pathao response
		if ( isset( $response['data'] ) ) {
			$data = $response['data'];

			$total = isset( $data['total_orders'] ) ? (int) $data['total_orders'] : 0;
			$successful = isset( $data['successful_deliveries'] ) ? (int) $data['successful_deliveries'] : 0;
			$failed = isset( $data['failed_deliveries'] ) ? (int) $data['failed_deliveries'] : 0;

			return array(
				'total_orders' => $total,
				'successful'   => $successful,
				'refusals'     => $failed,
				'success_rate' => $total > 0 ? ( $successful / $total ) * 100 : 0,
			);
		}

		return new WP_Error( 'invalid_response', 'Invalid response from Pathao API' );
	}

	/**
	 * Test Pathao API connection
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
