/*global jQuery, window */
jQuery(document).ready(function($) {
	$('.chart-selector').on('click', 'li', function() {
		var cs = $(this).parents('.chart-selector');
		var id = cs.data('id');
		// Commented out series state handler, since there no longer seems to be a way to get the state
		// var chart = window['chart_' + id];
		// var state = chart.state();
		// var i;
		// for (i = 0; i < state.disabled.length; i++) {
		// 	jQuery.each(window['data_set_' + id], function(idx, series) {
		// 		window['data_set_' + id][idx].values[i]['disabled'] = state['disabled'][i];
		// 		window['short_data_' + id][idx].values[i]['disabled'] = state['disabled'][i];
		// 	});
		// }
		cs.find('li').removeClass('btn-success');
		$(this).addClass('btn-success');
		window['active_' + id] = $(this).data('set');
		window['handle_resize_'+id](true);
		return false;
	});
});
