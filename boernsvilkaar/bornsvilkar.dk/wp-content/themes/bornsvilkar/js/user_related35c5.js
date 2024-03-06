jQuery(function($) {
	ids = localStorage.getItem('last_ids');
	if (ids){
		ids = JSON.parse(localStorage.getItem('last_ids'));
		var data = {
			'action': 'bv_load_relateds',
			'last_ids': ids
		};
		$.ajax(bv.ajaxurl, {
			data: data,
			type : 'GET',
			success: function(data) {
				$('.bv-related-block').empty();
				$('.bv-related-block').append(data);
				$('.bv-related-block').append('<p class="load-more-3-bv"><span class="has-off-white-background-color">Vis 3 nye forslag ➔</span</p>');
			}
		});
	}

	$('body').on('click', '.load-more-3-bv', function() {
		$(this).remove();
		$('.user-related-column').removeClass('hidden');
	});
});