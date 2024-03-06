jQuery(function($) {
	function refreshFilteredPublications($wrapper) {
		$('.publications-grid').empty();
		$('.load-more-publications').show();
		$('.load-more-publications').data('page', 2);
		$('.load-more-publications .publications-more').data('page', 2);
		$wrapper = $('.publications-content-grid').parent().parent();
		var search = $('#publications-search');
		var s = search.val();
		var custom_cats = $('.publications-content-grid').data('custom-cats-ids');
		var button = $('.publications-filter').find('a.filter.active');
		var data = {
			'action': 'publications_get_results',
			'search': s,
			'paged' : 1,
			'custom_cats' : custom_cats,
			'per_page': $('.publications-grid').data('per-page')
		};
		var term = '';
		var taxonomy = '';
		var cats = false;
		if (!button.length){
			var button = $('.publications-filter').find('a.filter.category');
		}
		var cat_buttons = $('.publications-filter').find('a.filter.category.active');
		var tag_buttons = $('.publications-filter').find('a.filter.tag.active');

		if (cat_buttons.length) {
			var cats = [];
			cat_buttons.each(function() {
				term_id = $(this).data('term-id');
				cats.push(term_id);
			});
		}
		if (tag_buttons.length){
			var tags = [];
			tag_buttons.each(function() {
				term_id = $(this).data('term-id');
				tags.push(term_id);
			});
		}
		makeBVAjaxCall(data, $wrapper, cats, tags);
	}

	function makeBVAjaxCall(data, $wrapper, cats = false, tags = false) {
		if (cats.length){
			data.cats = cats;
		}
		if (tags.length){
			data.tags = tags;
		}
		$.ajax(bv.ajaxurl, {
			data: data,
			dataType: 'json',
			success: function(data) {
				var grid = $('.publications-grid');
				var items = $(data.html);
				publicationsShowDots(false);
				$(grid).empty();
				grid.append(items);
				if (items.length > 0){
					classes = $(items)[0].classList.value;
					if (classes.indexOf("left-tiles-false") >= 0){
						$('.load-more-publications').hide();
						$('.three-dots').hide();
						$(grid).append(items);
						return;
					}
				} else {
					$('.load-more-publications').hide();
					$('.three-dots').hide();
					$(grid).append(items);
					$(grid).append('<h3 style="text-align:center">Desværre er der intet, der matcher din søgning.</h3>');
					return;
				}
			}
		});
	}

	function getTagsBVPublications(){
		var tag_buttons = $('.publications-filter').find('a.filter.tag.active');
		tags = false;
		if (tag_buttons.length){
			tags = [];
			tag_buttons.each(function() {
				term_id = $(this).data('term-id');
				tags.push(term_id);
			});
		}
		return tags;
	}
	$(document).on('click', '.publications-more', function(e) {
		e.preventDefault();
		cat = $(this).parent().data('cat');
		var page = parseInt($(this).data('page'));
		$(this).data('page', page+1);
		var params = {};
		grid = $(this).parent().prev().prev();
		load_more_button = $(this).parent();
		three_dots = $(this).parent().prev();
		var search = $('#publications-search');
		var s = search.val();
		var tags = getTagsBVPublications();
		var data = {
			'action': 'publicationts_get_load_more',
			'search': s,
			'cat' : cat,
			'paged' : page,
			'per_page': $('.publications-grid').data('per-page')
		};
		if (tags){
			data.tags = tags;
		}
		$(load_more_button).hide();
		$(three_dots).show();
		$.ajax(bv.ajaxurl, {
			data: data,
			dataType: 'json',
			success: function(data) {
				$(three_dots).hide();
				var items = $(data.html);
				if (items.length > 0){
					classes = $(items)[0].classList.value;
					$(load_more_button).show();
					if (classes.indexOf("left-tiles-false") >= 0){
						$(load_more_button).hide();
						$('.three-dots').hide();
						$(grid).append(items);
						return;
					}
				} else {
					$(load_more_button).hide();
					$('.three-dots').hide();
					$(grid).append(items);
					return;
				}
				$(grid).append(items);
			}
		});
	});
	
	// $('.publications-filter .reset-search').hide();
	// $(document).on('click', '.publications-filter .reset-search', function() {
	// 	var page = parseInt($(this).data('page', 2));
	// 	$('.load-more-publications .publications-more').data('page', 2);
	// 	$('.publications-filter li:has(.btn.filter.tag)').show();
	// 	$('.publications-filter .reset-search').hide();
	// 	publicationsShowDots(true);
	// 	var wrapper = $(this).parents('.publications-filter');
	// 	wrapper.find('.filter').removeClass('active');
	// 	wrapper.find('input[name="search"]').val('');

	// 	refreshFilteredPublications(wrapper);
	// 	changeCatalogueHistory();
	// 	return false;
	// });

	// $(document).on('submit', '.publications-filter form', function() {
	// 	var wrapper = $(this).parent();
	// 	refreshFilteredPublications(wrapper);
	// 	return false;
	// });

	function publicationsShowDots(action=true){
		if (action){
			$('.publications-content-grid').empty();
			$('.three-dots').show();
			$('.catalogue-viser').hide();
		} else {
			$('.three-dots').hide();
			$('.catalogue-viser').show();
		}
	}

	function publicationsLoadMore(action=true, button_load=false){
		if (button_load){
			class_name = '.three-dots.load-btn';
		} else {
			class_name = '.three-dots.publications-grid';
		}
		if (action){
			$('.load-more-publications').hide();
			$(class_name).show();
		} else {
			$('.load-more-publications').show();
			$(class_name).hide();
		}
	}

	function getPublicationsParams(){
		s = $('#publications-search').val();
		if (s == 'undefined'){
			s = '';
		}
		category = $('.publications-filter').find('a.filter.category.active');
		tags = $('.publications-filter').find('a.filter.tag.active');
		tags_arr = [];
		category_arr = [];
		types_arr = [];
		$.each( tags, function( key, theme ) {
			tags_arr.push($(theme).attr('data-term'));
		});
		$.each( category, function( key, topic ) {
			category_arr.push($(topic).attr('data-term'));
		});
		params = {};
		params.per_page = $('.publications-grid').data('per-page');
		params.categories = category_arr;
		params.tags = tags_arr;
		params.search = s;
		if (tags_arr.length || category_arr.length || !!s) {
			$('.publications-filter .btn.reset-search').show();
		} else {
			$('.publications-filter .btn.reset-search').hide();
		}
		return params;
	}

	function changeCatalogueHistory() {
		var params = getPublicationsParams();
		var stateObj = { categories: params.categories, tags: params.tags, search: params.search};
		window.history.replaceState(stateObj, "historyApi", "?kategorier="+params.categories+'&tags='+params.tags+'&search='+params.search);
	}

	$(document).ready(function(){
		var categories = getUrlParameter('kategorier');
		var tags = getUrlParameter('tags');
		if (categories){
			categories = categories.split(',')
		}
		if (tags){
			tags = tags.split(',');
		}
		var search = getUrlParameter('search');
		if (search){
			$('.search-filter').find('input').val(search);
			if (search == 'undefined'){
				search = false;
				$('.search-filter').find('input').val('');
			}
		}
		$.each( categories, function( key, cat ) {
			$('*.category[data-term="'+cat+'"]').addClass('active');
			$('*.category[data-term="'+cat+'"]').prepend('<strong class="mark-x"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-red-color">X </mark></strong>');
		});
		$.each( tags, function( key, tag ) {
			$('*.tag[data-term="'+tag+'"]').addClass('active');
		});
		if (categories || tags || search){
			$('.publications-filter .btn.reset-search').show();
			filterVisibleThemesAndTypes();
			publicationsShowDots(true);
			refreshFilteredPublications($('.publications-content-grid').parent().parent());
		}
	});
	
	$(document).on('click', '.publications-filter a.filter.category', function(e) {
		e.preventDefault();
		publicationsShowDots(true);
		var wrapper = $('.publications-content-grid');
		var alreadyActive = $(this).hasClass('active');
		if (!alreadyActive){
			$(this).prepend('<strong class="mark-x"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-red-color">X </mark></strong>');
			$(this).addClass('active');
		} else {
			$(this).find('.mark-x').remove();
			$(this).removeClass('active');
		}
		filterVisibleThemesAndTypes();
		$('.publications-grid').empty();
		refreshFilteredPublications(wrapper);
		changeCatalogueHistory();
		return false;
	});

	$(document).on('click', '.publications-filter a.filter.tag', function() {
		publicationsShowDots(true);
		var wrapper = $(this).parents('.publications-filter');
		var alreadyActive = $(this).hasClass('active');
		if (!alreadyActive){
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
		refreshFilteredPublications(wrapper);
		changeCatalogueHistory();
		return false;
	});
	
	function filterVisibleThemesAndTypes() {
		if ($('.publications-filter .btn.filter.category.active').length === 0) {
			$('.publications-filter li:has(.btn.filter.tag)').show();
		} else {
			$('.publications-filter li:has(.btn.filter.tag)').hide();
			$('.publications-filter .btn.filter.category.active').each(function() {
				themes = $(this).attr('data-themes');
				themes = themes.split(',');
				themes.forEach(function(theme) {
					$('.publications-filter li:has(.btn.filter.tag[data-term="'+theme+'"])').show();
				});
			});
		}
	}
	
	$('.publications-filter .search-filter').on('submit', function(e){
		val = $(this).find('input').val();
		publicationsShowDots(true); 
		var wrapper = $(this).parent();
		refreshFilteredPublications(wrapper);
		changeCatalogueHistory();
		e.preventDefault();
	});

	var prevSearch = '';
	var debouncedRefresh = debounce(function() {
		if (getSearchField() !== prevSearch) {
			prevSearch = getSearchField();
			publicationsShowDots(true); 
			refreshFilteredPublications($('.publications-content-grid').parent().parent());
			changeCatalogueHistory();
		}
	}, 500);

	function getSearchField() {
		var search = $('#publications-search').val();
		if (search === $('#publications-search').attr('placeholder')) {
			search = '';
		}
		return search;
	}
	$('#publications-search').on('change keyup', debouncedRefresh);

});