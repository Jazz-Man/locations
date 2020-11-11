const $$ = require('domtastic');
const template = require('../module/template');
const Hooks = require("../module/hooks");

function wasp_init() {
	const mapContainer = $$('[data-map-container]');

	if (mapContainer.length) {
		const mapContainerID = '#' + mapContainer.attr('id');

		if (mapContainer.length) {
			
			require.ensure([], function (require) {
				const mapStyle = require('../module/map-styles');
				const GMaps = require('../module/gmaps');
				const AjaxForm = require('../module/ajax-form');
				const overlays = [];
				const map = new GMaps({
					div: mapContainerID,
					zoom: 7,
//					zoomControl:       false,
					mapTypeControl: false,
					scaleControl: false,
					streetViewControl: false,
					lat: 48.3028985,
					lng: 26.6933423,
					mapType: "roadmap",
					height: '100%',
					width: '100%',
					styles: mapStyle,
					idle: function (e) {
						map.removeOverlay();
						form_init();
					}
				});

				map.addControl({
					id:                   'listings-map-view-controll',
					position:             'top_right',
					content:              template('listings-map-view-controll'),
					disableDefaultStyles: true
				});
				
				map.addControl({
					id:                   'listings-map-search-form',
					position:             'top_left',
					content:              template('listings-map-search-form'),
					disableDefaultStyles: true
				});
				
				function form_init() {
					const form = new AjaxForm({
						elem: '[data-ajax-form]',

						ajax_complete: function (data) {

							if (data.length) {
								const marcers = data;
								marcers.forEach(function (item) {
									if (!item.acf.listing_address.lat || !item.acf.listing_address.lng) {
										return;
									}
									const lat = item.acf.listing_address.lat;
									const lng = item.acf.listing_address.lng;

									const markerContent = template('map-marker', item);

									map.drawOverlay({
										mouseenter: function (e) {
											marcerMouseEvent(e);
										},
										mouseleave: function (e) {
											marcerMouseEvent(e);
										},
										click: function (e) {
											const current_zoom = map.map.getZoom();

											map.setCenter(e.lat(), e.lng());
											map.map.setZoom(current_zoom + 2);
										},
										lat: lat,
										lng: lng,
										content: markerContent,
										layer: 'overlayImage',
										verticalAlign: 'bottom',
										horizontalAlign: 'center'
									});

									overlays.push(new google.maps.LatLng(lat, lng));

								});

//								if (overlays.length) {
//									var bounds = new google.maps.LatLngBounds();
//									overlays.forEach(function (e) {
//										bounds.extend(e);
//									});
//									map.map.fitBounds(bounds);
//								}
							}

						}
					});
				}
				
				function marcerMouseEvent(e) {
					const marker = $$(e.el).find('.marker');
					const markerID = marker.attr('data-marker-id');
					const resultsContent = $$('#results-content');
					const itemResult = resultsContent.find("[data-listing-id='" + markerID + "'] > a");

					itemResult.toggleClass('hover-state');
				}
				
			}, 'wpas');
		}
	}
}

Hooks.addAction("_init", wasp_init);
Hooks.addAction("pageLoader.processEnd", wasp_init);
