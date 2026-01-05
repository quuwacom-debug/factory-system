=== RTO Shield ===
Contributors: rtoshield
Tags: woocommerce, cod, rto, bangladesh, ecommerce, checkout, payment
Requires at least: 5.8
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Smart Checkout Intelligence for E-commerce in Bangladesh. Prevent RTO by converting risky COD orders to secured prepaid payments.

== Description ==

**RTO Shield** is the ultimate solution for Bangladesh's e-commerce merchants struggling with Return-To-Origin (RTO) losses from Cash-On-Delivery orders.

= The Problem =

* High RTO rates destroy profit margins
* Fake and refused orders waste shipping costs
* No way to identify risky customers before shipping
* Merchants discover bad customers only after delivery failure

= The Solution =

RTO Shield integrates with your courier partners to:

* Pull real customer delivery history at checkout
* Calculate risk scores in real-time
* Intercept risky COD orders with intelligent conversion offers
* Convert high-risk COD to secured prepaid payments
* Cut RTO losses before shipping

= Key Features =

* **Courier Integration**: Steadfast, Pathao, RedX, Paperfly
* **Real-Time Risk Scoring**: Instant customer reliability check
* **Smart Popup**: Timed conversion offers with urgency
* **Dynamic Discounts**: Auto-apply prepaid incentives
* **Payment Flexibility**: Works with any WooCommerce gateway
* **Analytics Dashboard**: Track conversions and RTO prevention
* **24-Hour Caching**: Fast performance with smart caching

= How It Works =

1. Customer enters phone number at checkout
2. Plugin checks delivery history from courier APIs
3. Risk score calculated based on past performance
4. High-risk customers see conversion popup
5. Offer: Free delivery + discount for prepaid
6. Customer converts → RTO prevented
7. Merchant saves money and inventory

= Supported Couriers =

* Steadfast
* Pathao
* RedX
* Paperfly

Each merchant uses their own courier API keys.

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/rto-shield/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to WooCommerce → RTO Shield
4. Configure your courier API keys
5. Customize popup and discount settings
6. Start preventing RTO!

== Frequently Asked Questions ==

= Does this work without WooCommerce? =

No, RTO Shield requires WooCommerce to be installed and active.

= Which couriers are supported? =

Currently: Steadfast, Pathao, RedX, and Paperfly. More coming soon!

= Do I need API keys from couriers? =

Yes, you'll need your own API credentials from each courier you use.

= Will this slow down my checkout? =

No! We use 24-hour caching. First check takes ~2 seconds, subsequent checks are instant.

= What payment gateways work with this? =

All WooCommerce payment gateways! We just switch from COD to your existing prepaid options.

= Can I customize the popup design? =

Yes! Multiple templates available with full customization options.

== Screenshots ==

1. Admin dashboard showing RTO prevention metrics
2. Courier configuration page
3. Popup customization settings
4. Live conversion popup on checkout
5. Risk logs viewer

== Changelog ==

= 1.0.0 =
* Initial release
* Courier integrations: Steadfast, Pathao, RedX, Paperfly
* Real-time risk scoring
* Smart conversion popup
* Analytics dashboard
* 24-hour caching system

== Upgrade Notice ==

= 1.0.0 =
Initial release of RTO Shield. Start preventing RTO losses today!
