
jQuery(function($) {
	var infScrPage = 2;
	var finished = false;

	function getSearchField() {
		var search = $('.letter-search').val();
		if (search === $('.letter-search').attr('placeholder')) {
			search = '';
		}
		return search;
	}
	function getSearchCategory() {
		var search = $('select[name="brev_kategori"]').val();
		return search;
	}
	function getSearchParameters() {
		var search = getSearchField();
		var cat = getSearchCategory();
		return {action: 'bv_get_letters', s: search, cat: cat};
	}
	function replaceLetterList() {
		var params = getSearchParameters();

		$.get(bv.ajaxurl, params, function(data) {
			if ($('.post-type-archive-brev .article-holder').data().hasOwnProperty('infiniteScroll')) {
				$('.post-type-archive-brev .article-holder').infiniteScroll('destroy');
			}
			$('.post-type-archive-brev .article-holder').replaceWith('<div class="article-holder">' + data + '</div>');

			if ($(data).length < 20) {
				finished = true;
			} else {
				infScrPage = 2;
				finished = false;
				resetInfiniteScroll();
			}
		});
	}

	function resetInfiniteScroll() {
		var $lc = $('.post-type-archive-brev .article-holder');
		$lc.infiniteScroll({
			path: function() {
				if (finished) {
					return false;
				}
				var params = getSearchParameters();
				params.page = infScrPage;

				return bv.ajaxurl + '?' + $.param(params);
			},
			append: false,
			history: false,
			button: '.load-more-button',
			status: '.page-load-status',
			responseType: 'text'
		});
		var $b = $('.load-more-button').hide();
		$lc.on('load.infiniteScroll', onPageLoad);
		$lc.on('load.infiniteScroll', function(event, response) {
			infScrPage++;
			if (response === '') {
				finished = true;
			} else {
				var r = $(response);
				$lc.infiniteScroll('appendItems', r);
			}
		});
		function onPageLoad() {
			if (infScrPage === 5) {
				$lc.infiniteScroll('option', { loadOnScroll: false });
				$b.show();
				$lc.off('load.infiniteScroll', onPageLoad);
			}
		}
	}

	resetInfiniteScroll();

	var prevSearch = '';
	var prevCat = '';
	var debouncedRefresh = debounce(function() {
		if (getSearchField() !== prevSearch || getSearchCategory() !== prevCat) {
			prevSearch = getSearchField();
			prevCat = getSearchCategory();
			replaceLetterList();
		}
	}, 500);
	$('.topic-search.ajax-search select[name="brev_kategori"]').on('change', debouncedRefresh);
	$('.ajax-search .letter-search').on('change keyup', debouncedRefresh);
	$('.ajax-search .letter-search').on('keypress keyup', function(e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13) {
			e.preventDefault();
			return false;
		}
	});

	var commentsPage = 1;
	$('.load-comments').on('click', function() {
		$('.comments-spinner').css('display', 'block');
		var $t = $(this), prevPos = $(window).scrollTop(), prevHeight = $('.reply-holder').outerHeight();
		var params = {action: 'bv_get_comments', post: $t.data('post'), page: commentsPage, initial: $t.data('current-ids')};
		$t.css('pointer-events', 'none');
		$.get(bv.ajaxurl, params, function(data) {
			var newPos, newHeight;
			$('.comments-spinner').css('display', 'none');
			$t.parent().after(data);
			newHeight = $('.reply-holder').outerHeight();
			newPos = prevPos + newHeight - prevHeight;
			$(window).scrollTop(newPos);
			if (1 + commentsPage * 10 > $t.data('count')) {
				$t.hide();
			}
			$t.css('pointer-events', 'initial');
			commentsPage++;
		});
		return false;
	});
	$('.comments-spinner').css('display', 'none');
});
