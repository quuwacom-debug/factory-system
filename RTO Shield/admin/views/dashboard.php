<?php
/**
 * Admin Dashboard View
 *
 * @package RTO_Shield
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get dashboard stats
$stats = RTO_Shield_Analytics::get_summary_stats( 30 );
?>

<div class="wrap rto-shield-admin-wrap">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	
	<div class="rto-shield-card">
		<h2>📊 Last 30 Days Performance</h2>
		
		<div class="rto-shield-stats-grid">
			<div class="rto-shield-stat-box">
				<div class="stat-value"><?php echo esc_html( number_format( $stats['total_checkouts'] ?? 0 ) ); ?></div>
				<div class="stat-label">Total Checkouts</div>
			</div>
			
			<div class="rto-shield-stat-box">
				<div class="stat-value"><?php echo esc_html( number_format( $stats['risky_orders'] ?? 0 ) ); ?></div>
				<div class="stat-label">Risky Orders Detected</div>
			</div>
			
			<div class="rto-shield-stat-box">
				<div class="stat-value"><?php echo esc_html( number_format( $stats['conversions'] ?? 0 ) ); ?></div>
				<div class="stat-label">COD → Prepaid Conversions</div>
			</div>
			
			<div class="rto-shield-stat-box">
				<div class="stat-value"><?php echo esc_html( number_format( $stats['estimated_rto_prevented'] ?? 0 ) ); ?></div>
				<div class="stat-label">RTO Orders Prevented</div>
			</div>
			
			<div class="rto-shield-stat-box">
				<div class="stat-value"><?php echo esc_html( $stats['conversion_rate'] ?? 0 ); ?>%</div>
				<div class="stat-label">Conversion Rate</div>
			</div>
			
			<div class="rto-shield-stat-box">
				<div class="stat-value">৳<?php echo esc_html( number_format( $stats['total_discount_given'] ?? 0, 2 ) ); ?></div>
				<div class="stat-label">Total Discounts Given</div>
			</div>
		</div>
	</div>
	
	<div class="rto-shield-card">
		<h2>🚀 Quick Actions</h2>
		<p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=rto-shield-couriers' ) ); ?>" class="button button-primary">
				Configure Couriers
			</a>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=rto-shield-settings' ) ); ?>" class="button">
				Settings
			</a>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=rto-shield-logs' ) ); ?>" class="button">
				View Risk Logs
			</a>
		</p>
	</div>
	
	<div class="rto-shield-card">
		<h2>ℹ️ About RTO Shield</h2>
		<p>
			<strong>Version:</strong> <?php echo esc_html( RTO_SHIELD_VERSION ); ?><br>
			<strong>Status:</strong> <span style="color: green;">● Active</span>
		</p>
		<p>
			RTO Shield helps you prevent Return-To-Origin losses by identifying risky COD customers 
			and converting them to secured prepaid payments before shipping.
		</p>
	</div>
</div>
