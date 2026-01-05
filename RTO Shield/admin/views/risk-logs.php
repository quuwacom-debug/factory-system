<?php
/**
 * Admin Risk Logs View
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $wpdb;
$table = $wpdb->prefix . 'rtoshield_risk_logs';

// Pagination
$per_page = 20;
$current_page = isset( $_GET['paged'] ) ? max( 1, intval( $_GET['paged'] ) ) : 1;
$offset = ( $current_page - 1 ) * $per_page;

$logs = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT * FROM $table ORDER BY created_at DESC LIMIT %d OFFSET %d",
		$per_page,
		$offset
	)
);

$total_logs = $wpdb->get_var( "SELECT COUNT(*) FROM $table" );
$total_pages = ceil( $total_logs / $per_page );
?>

<div class="wrap rto-shield-admin-wrap">
	<h1>Risk Check Logs</h1>
	<p>Monitor real-time risk assessments performed at checkout.</p>

	<div class="rto-shield-card">
		<table class="wp-list-table widefat fixed striped">
			<thead>
				<tr>
					<th scope="col">Date/Time</th>
					<th scope="col">Order ID</th>
					<th scope="col">Customer Phone</th>
					<th scope="col">Risk Score</th>
					<th scope="col">Risk Level</th>
					<th scope="col">Action Taken</th>
					<th scope="col">Converted?</th>
				</tr>
			</thead>
			<tbody>
				<?php if ( $logs ) : ?>
					<?php foreach ( $logs as $log ) : ?>
						<tr>
							<td><?php echo esc_html( date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $log->created_at ) ) ); ?></td>
							<td><?php echo $log->order_id ? esc_html( $log->order_id ) : '-'; ?></td>
							<td><?php echo esc_html( $log->customer_phone ); ?></td>
							<td>
								<span style="font-weight:bold; color: <?php echo ( $log->risk_score > 70 ) ? 'red' : ( ( $log->risk_score > 40 ) ? 'orange' : 'green' ); ?>;">
									<?php echo esc_html( $log->risk_score ); ?>
								</span>
							</td>
							<td><?php echo esc_html( strtoupper( $log->risk_level ) ); ?></td>
							<td><?php echo esc_html( str_replace( '_', ' ', $log->action_taken ) ); ?></td>
							<td><?php echo $log->converted ? '✅ YES' : '❌ NO'; ?></td>
						</tr>
					<?php endforeach; ?>
				<?php else : ?>
					<tr>
						<td colspan="7">No risk logs found yet.</td>
					</tr>
				<?php endif; ?>
			</tbody>
		</table>

		<!-- Pagination UI -->
		<?php if ( $total_pages > 1 ) : ?>
			<div class="tablenav">
				<div class="tablenav-pages">
					<?php
					echo paginate_links( array(
						'base'      => add_query_arg( 'paged', '%#%' ),
						'format'    => '',
						'prev_text' => '&laquo;',
						'next_text' => '&raquo;',
						'total'     => $total_pages,
						'current'   => $current_page,
					) );
					?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</div>
