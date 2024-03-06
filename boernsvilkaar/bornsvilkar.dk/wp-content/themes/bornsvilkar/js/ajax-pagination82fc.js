jQuery(function($) {
	$('.ajax-pagination-block .pagination-loading').hide();
	$('body').on('click', '.ajax-pagination-block .wp-block-button', function(e) {
		e.preventDefault();
		const button = $( this );
		const wrapper = button.parents('.ajax-pagination-block');
		const queryEl = wrapper.closest( '.wp-block-query' );
		const postTemplateEl = queryEl.find( '.wp-block-post-template' );
		
		if ( queryEl.length && postTemplateEl.length ) {
			const block = JSON.parse( queryEl.attr( 'data-attrs' ) );
			const hash = queryEl.attr( 'data-hash');
			const maxPages = block.attrs.query.pages || 0;
			per_page = block.attrs.query.perPage;
			var params = {};
			var u = new URL(window.location.href);
			params.action = 'query_render_more_pagination';
			params.attrs = queryEl.attr( 'data-attrs' );
			params.paged = queryEl.attr( 'data-paged' );
			params.hash = hash;
			params.s = u.searchParams.get('s');
			page_number = Number(params.paged)+1;
			queryEl.attr( 'data-paged', page_number );
			loading = $(this).find('.pagination-loading');
			button.hide();
			loading.show();
			dots = $(this).parent().find('.pagination-loading-dots');
			$(button).hide();
			$(dots).show();
			hide_button = false;
			if ($('.per_page_s').length){
				per_page = parseInt($('.results-s-dhk').attr('data-per-page-s-dhk'));
				total_found = parseInt($('.total_found_s').html());
				curr_page = parseInt(params.paged)+1;
				total_showing = per_page*curr_page;
				if (total_showing > total_found){
					$('.per_page_s').text(total_found);
					hide_button = true;
				} else {
					$('.per_page_s').text(total_showing);
				}
			}
			$.ajax({
				url : '/wp-admin/admin-ajax.php',
				data : params,
				type : 'POST',
				success: function( data ) {
					$(dots).hide();
					const nextPage = Number( queryEl.attr( 'data-paged' ) ) + 1;
					if ( maxPages > 0 && nextPage >= maxPages ) {
						$(this).remove();
					}
					if ( data.responseJSON ) {
						// console.log( data.responseJSON ); // eslint-disable-line
					}
					else {
						if ( data.length > 2 && data) {
							lii = $(data).find('li');
							if (lii.length == 0 || lii.length < per_page){
								$(this).remove();
							}
							html_data = $(data).find( '.wp-block-post-template' ).html() || '';
							html = html_data.replace(/type-post/g, 'type-post post'); 
							if (html){
								postTemplateEl.append( html );
								postTemplateEl.attr( 'data-paged', page_number );
								$(dots).hide();
								$(button).show();
							} else {
								$(this).remove();
							}
							if (hide_button){
								$(button).hide();
							}
							return;
						}
						$(this).remove();
					}
				}
			});
		}
	});
});
