jQuery(function($) {
	function refreshFilteredCatalogue($wrapper) {
		$('.catalogue-more').show();
		$('.catalogue-more').data('page', 2);
		var search = $wrapper.find('input[name="search"]');
		var s = search.val();
		var button = $wrapper.find('a.filter.active');
		var data = {
			'action': 'catalogue_load_results',
			'defaults': search.data('defaults'),
			'search': s,
			'paged' : 1
		};
		var term = '';
		var taxonomy = '';
		if (button.length) {
			button.each(function() {
				taxonomy = $(this).data('taxonomy');
				data[taxonomy] = ( data[taxonomy] instanceof Array ) ? data[taxonomy] : [];
				if ($(this).data('types')) {
					$(this).data('types').split(',').forEach(function(term) {
						data[taxonomy].push(term);
					});
				} else {
					term = $(this).data('term');
					data[taxonomy].push(term);
				}
			});
		}
		$.ajax(bv.ajaxurl, {
			data: data,
			dataType: 'json',
			success: function(data) {
				var grid = $wrapper.next();
				var items = $(data.html);
				$wrapper.find('.num-results').text(data.num_results);
				if (data.num_results !== 1) {
					$wrapper.find('.results-plural').show();
				} else {
					$wrapper.find('.results-plural').hide();
				}
				catalogueShowDots(false);
				grid.empty().append(items);
				if (items.length > 0){
					classes = $(items)[0].classList.value;
					if (classes.indexOf("left-tiles-false") >= 0){
						$('.catalogue-more').hide();
						$('.three-dots').hide();
						$(grid).append(items);
						return;
					}
				}
			}
		});
	}

	$('.catalogue-more').click(function(e){
		e.preventDefault();
		var page = parseInt($(this).data('page'));
		$(this).data('page', page+1);
		var params = {};
		$wrapper = $(this).parent().parent().find('.catalogue-filter');
		var button = $wrapper.find('a.filter.active');
		var button_text = $(button).text();
		grid = $(this).parent().parent().find('.catalogue-content-grid');
		var search = $wrapper.find('input[name="search"]');
		var s = search.val();
		var data = {
			'action': 'catalogue_load_results',
			'defaults': search.data('defaults'),
			'search': s,
			'paged' : page
		};
		var term = '';
		var taxonomy = '';
		if (button.length) {
			button.each(function() {
				term = $(this).data('term');
				taxonomy = $(this).data('taxonomy');
				data[taxonomy] = ( data[taxonomy] instanceof Array ) ? data[taxonomy] : [];
				data[taxonomy].push(term);
			});
		}
		catalogueShowDotsOnly(true);

		$.ajax(bv.ajaxurl, {
			data: data,
			dataType: 'json',
			success: function(data) {
				var items = $(data.html);
				if (items.length > 0){
					classes = $(items)[0].classList.value;
					if (classes.indexOf("left-tiles-false") >= 0){
						$('.catalogue-more').hide();
						$('.three-dots').hide();
						$(grid).append(items);
						return;
					}
				}
				catalogueShowDotsOnly(false);
				$(grid).append(items);
			}
		});
	});
	
	$('.catalogue-filter .reset-search').hide();
	$(document).on('click', '.catalogue-filter .reset-search', function() {
		$('.btn.filter.theme').show();
		$('.catalogue-filter .reset-search').hide();
		catalogueShowDots(true);
		var wrapper = $(this).parents('.catalogue-filter');
		wrapper.find('.filter').removeClass('active');
		wrapper.find('input[name="search"]').val('');
		refreshFilteredCatalogue(wrapper);
		changeCatalogueHistory();
		return false;
	});

	$(document).on('submit', '.catalogue-filter form', function() {
		refreshFilteredCatalogue($(this).parents('.catalogue-filter'));
		return false;
	});

	function catalogueShowDots(action=true){
		if (action){
			$('.catalogue-content-grid').empty();
			$('.three-dots').show();
			$('.catalogue-viser').hide();
		} else {
			$('.three-dots').hide();
			$('.catalogue-viser').show();
		}
	}

	function catalogueShowDotsOnly(action=true){
		if (action){
			$('.catalogue-more').hide();
			$('.three-dots').show();
		} else {
			$('.catalogue-more').show();
			$('.three-dots').hide();
		}
	}

	function getCatalogueParams(){
		search = $('.catalogue-filter').find('input[name="search"]');
		s = search.val();
		topics = $('.catalogue-filter').find('a.filter.topic.active');
		themes = $('.catalogue-filter').find('a.filter.theme.active');
		types = $('.catalogue-filter').find('a.filter.post-type.active');
		themes_arr = [];
		topics_arr = [];
		types_arr = [];
		$.each( themes, function( key, theme ) {
			themes_arr.push($(theme).attr('data-term'));
		});
		$.each( topics, function( key, topic ) {
			topics_arr.push($(topic).attr('data-term'));
		});
		$.each( types, function( key, type ) {
			if ($(type).data('types')) {
				$(type).data('types').split(',').forEach(function(term) {
					types_arr.push(term);
				});
			} else {
				types_arr.push($(type).attr('data-term'));
			}
		});
		params = {};
		params.themes = themes_arr;
		params.topics = topics_arr;
		params.types = types_arr;
		params.search = s;
		if (themes_arr.length || topics_arr.length || types_arr.length || !!s) {
			$('.catalogue-filter .btn.reset-search').show();
		} else {
			$('.catalogue-filter .btn.reset-search').hide();
		}
		return params;
	}

	function changeCatalogueHistory() {
		var params = getCatalogueParams();
		var stateObj = { topics: params.topics, themes: params.themess, types: params.types, search: params.search};
		window.history.replaceState(stateObj, "historyApi", "?topics="+params.topics+'&themes='+params.themes+'&types='+params.types+'&search='+params.search);
	}

	$(document).ready(function(){
		var topics = getUrlParameter('topics');
		var themes = getUrlParameter('themes');
		var types = getUrlParameter('types');
		if (themes == true){
			themes = false;
		}
		if (themes){
			themes = themes.split(',')
		}
		if (topics == true){
			topics = false;
		}
		if (topics){
			topics = topics.split(',');
		}
		if (types == true){
			types = false;
		}
		if (types){
			types = types.split(',');
		}
		var search = getUrlParameter('search');
		if (search == true){
			search = false;
		}
		if (search){
			$('.search-filter').find('input').val(search);
		}
		if (Array.isArray(themes)) {
			$.each( themes, function( key, theme ) {
				$('*.theme[data-term="'+theme+'"]').addClass('active');
			});
		}
		if (Array.isArray(topics)) {
			$.each( topics, function( key, theme ) {
				$('*.topic[data-term="'+theme+'"]').addClass('active');
			});
		}
		if (Array.isArray(types)) {
			$.each( types, function( key, theme ) {
				$('*.post-type[data-term="'+theme+'"]').addClass('active');
			});
		}
		if (topics || themes || types || search){
			$('.catalogue-filter .btn.reset-search').show();
			filterVisibleThemesAndTypes();
			catalogueShowDots(true);
			refreshFilteredCatalogue($('.catalogue-filter'));
		}
	});
	
	$(document).on('click', '.catalogue-filter a.filter.theme', function() {
		catalogueShowDots(true);
		var wrapper = $(this).parents('.catalogue-filter');
		var alreadyActive = $(this).hasClass('active');
		if (!alreadyActive){
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
		filterVisibleThemesAndTypes();
		refreshFilteredCatalogue(wrapper);
		changeCatalogueHistory();
		return false;
	});

	$(document).on('click', '.catalogue-filter a.filter.post-type', function() {
		catalogueShowDots(true);
		var wrapper = $(this).parents('.catalogue-filter');
		var alreadyActive = $(this).hasClass('active');
		if (!alreadyActive){
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
		refreshFilteredCatalogue(wrapper);
		changeCatalogueHistory();
		return false;
	});
	
	function filterVisibleThemesAndTypes() {
		if ($('.catalogue-filter .btn.filter.topic.active').length === 0) {
			$('.catalogue-filter li:has(.btn.filter.theme)').show();
		} else {
			$('.catalogue-filter li:has(.btn.filter.theme)').hide();
			$('.catalogue-filter .btn.filter.topic.active').each(function() {
				themes = $(this).attr('data-themes');
				themes = themes.split(',');
				themes.forEach(function(theme) {
					$('.catalogue-filter li:has(.btn.filter.theme[data-term="'+theme+'"])').show();
				});
			});
		}
		$('.catalogue-filter li:has(.btn.filter.post-type)').hide();
		// Filter post types with a ((topic OR topic) AND (theme OR theme)) approach
		// So if a topic has three post types and a theme has four, still only show the three that match
		let topicTypes = [];
		let themeTypes = [];
		$('.catalogue-filter .btn.filter.topic.active').each(function() {
			types = $(this).attr('data-post-types');
			types = types.split(',');
			types.forEach(function(type) {
				if (!topicTypes.includes(type)) {
					topicTypes.push(type);
				}
			});
		});
		$('.catalogue-filter .btn.filter.theme.active').each(function() {
			types = $(this).attr('data-post-types');
			types = types.split(',');
			types.forEach(function(type) {
				if (!themeTypes.includes(type)) {
					themeTypes.push(type);
				}
			});
		});
		let intersection;
		if (themeTypes.length == 0 && topicTypes.length == 0) {
			$('.catalogue-filter li:has(.btn.filter.post-type)').show();
			return;
		} else if (themeTypes.length == 0) {
			intersection = topicTypes;
		} else if (topicTypes.length == 0) {
			intersection = themeTypes;
		} else {
			intersection = topicTypes.filter(function(v) { return themeTypes.indexOf(v) !== -1; });
		}
		intersection.forEach(function(type) {
			$('.catalogue-filter li:has(.btn.filter.post-type[data-term="'+type+'"])').show();
			$('.catalogue-filter li:has(.btn.filter.post-type[data-types*="'+type+'"])').show();
		});
	}
	
	$(document).on('click', '.catalogue-filter a.filter.topic', function() {
		catalogueShowDots(true);
		var wrapper = $(this).parents('.catalogue-filter');
		var alreadyActive = $(this).hasClass('active');
		if (!alreadyActive){
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
		filterVisibleThemesAndTypes();
		refreshFilteredCatalogue(wrapper);
		changeCatalogueHistory();
		return false;
	});

	$('.catalogue-filter .search-filter').on('submit', function(e){
		val = $(this).find('input').val();
		// catalogueShowDots(true);
		refreshFilteredCatalogue($('.catalogue-filter'));
		changeCatalogueHistory();
		e.preventDefault();
	});
});