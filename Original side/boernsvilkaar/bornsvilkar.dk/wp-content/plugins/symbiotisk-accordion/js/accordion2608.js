/*global jQuery */
jQuery(function($) {
	window.accordionScrolling = window.accordionScrolling || true;
	$('.accordion .acc-header a').on('click', function(event) {
		event.preventDefault();
	});
	$('.accordion').on('shown.bs.collapse', function(evt) {
		var current = $(evt.target).attr('id'),
			content = $('#' + current),
			trigger = $('a[data-target="#'+current+'"]'),
			headerHeight = $("#masthead>.content-wrapper").outerHeight() + $("#wpadminbar").outerHeight(),
			label = trigger.find('.acc-open').text();
		if (typeof ga !== 'undefined') {
			ga('send', 'event', 'Toggle', 'open', label, 1, {'nonInteraction': 1});
		} else if (typeof _gaq !== 'undefined' && typeof _gaq.push === 'function') {
			_gaq.push(['_trackEvent', 'Toggle', 'open', label, 1, 1]);
		}
		trigger.find('.acc-open').hide().end().find('.acc-close').show();
		window.setTimeout(function() {
			$(window).resize();
		}, 500);
		if (window.accordionScrolling) {
			$('html,body').animate({
				scrollTop: content.offset().top - headerHeight - 50
			}, 500);
		}
	});
	$('.accordion').on('hidden.bs.collapse', function(evt) {
		var current = $(evt.target).attr('id'),
			trigger = $('a[data-target="#'+current+'"]');
		trigger.find('.acc-close').hide().end().find('.acc-open').show();
		window.setTimeout(function() {
			$(window).resize();
		}, 500);
	});
	$(this).find('.acc-close').hide().end().find('.acc-open').show();
});