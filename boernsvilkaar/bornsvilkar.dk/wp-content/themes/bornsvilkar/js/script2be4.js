function debounce(func, threshold, execAsap) {
	var timeout;

	return function debounced () {
		var obj = this, args = arguments;
		function delayed () {
			if (!execAsap)
				func.apply(obj, args);
			timeout = null;
		}

		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);

		timeout = setTimeout(delayed, threshold || 100);
	};
}

function calculateHeaderHeight() {
	headerHeight = 0;
	if (jQuery('#header').length) {
		headerHeight = jQuery("#header").outerHeight();
	}
	if (jQuery('#wpadminbar').length) {
		headerHeight += jQuery("#wpadminbar").outerHeight();
	}
}

if (bv.post_id_front){
	ids = JSON.parse(localStorage.getItem('last_ids'));
	if (ids){
			last_ids = JSON.parse(localStorage.getItem('last_ids'));
			if(jQuery.inArray(bv.post_id_front, last_ids) === -1) { //item not in array
				last_ids.unshift(bv.post_id_front);
			}
	} else {
		var last_ids = [];
		last_ids.push(bv.post_id_front);
	}
	last_ids = last_ids.slice(0,3);
	localStorage.setItem('last_ids', JSON.stringify(last_ids));
}

var autoScrolling = false;
function scrollToTarget($target, duration, padding, callback) {
	var destination, distance;
	duration = duration || 1000;
	padding = padding || 0;
	autoScrolling = true;
	if ($target.length) {
		calculateHeaderHeight();
		destination = $target.offset().top - headerHeight - padding;
		distance = destination - jQuery(document).scrollTop();
		jQuery('html,body').animate({
			scrollTop: destination
		}, duration, function() {
			calculateHeaderHeight();
			var newDest = $target.offset().top - headerHeight - padding,
				newDist = newDest - destination,
				newDuration = Math.abs(newDist / distance) * duration;
			if (Math.abs(newDist) >= 1) {
				jQuery('html,body').animate({
					scrollTop: newDest
				}, newDuration, function() {
					if (callback) {
						callback();
					}
					window.setTimeout(function() {
						autoScrolling = false;
					}, 100);
				});
			} else {
				if (callback) {
					callback();
				}
				window.setTimeout(function() {
					autoScrolling = false;
				}, 100);
			}
		});
		return false;
	}
}

jQuery(function($) {

	jQuery(function($) {
		function scaleHeroes() {
			var width = $(window).width();
			$('.section-bg[data-sizes]').each(function() {
				var $that = $(this),
					old = parseInt($that.data('current-size'), 10),
					sizes = $that.data('sizes'),
					img = new Image(),
					w, cur, url;
				cur = old;
				for (w in sizes) {
					w = parseInt(w, 10);
					if (w > cur && cur < width + 100) {
						cur = w;
					}
				}
				if (cur !== old) {
					$that.data('current-size', cur);
					url = sizes[cur];
					img.onload = function() {
						$that.css({
							'background-image': "url('"+url+"')",
						});
						window.setTimeout(function() {
							$that.css({
								'filter': 'blur(0px)'
							});
							$that.siblings('.blur-bg').css('filter', 'blur(0px)');
						}, 100);
					};
					img.src = url;
				}
			});
		}
		scaleHeroes();
		$(window).smartresize(scaleHeroes);
	});

	(function($,sr){
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null;
			}

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	};
	// smartresize
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

	})(jQuery,'smartresize');

	$('a.smooth, .smooth a').on('click', function() {
		$(this).blur();
		var target = $(this.hash);
		target = target.length ? target : $('a[name=' + this.hash.slice(1) +']');
		return scrollToTarget(target);
	});

	if (window.location.hash == '#fund') {
		scrollToTarget(jQuery('#fund').parents('section'), 500);
	}
	var handleAccordionAnchor = function(scroll) {
		if (window.location.hash != '') {
			var anchor = jQuery('.accordion-anchor[name=' + window.location.hash.substring(1) + ']');
			if (anchor.length) {
				jQuery(anchor.data('target')).collapse('show');
				if (scroll) {
					scrollToTarget(anchor, 100);
				}
			}
		}
	};
	handleAccordionAnchor(true);
	window.addEventListener( 'hashchange', handleAccordionAnchor);

	$('.henvisning-archive form select').on('change', function() {
		$(this).parents('form').submit();
	});

	$('.gform_body select').each(function() {
		var opts = {language: 'da'}, plc = $(this).find('option.gf_placeholder');
		if (plc.length) {
			opts.placeholder = plc.text();
		}
		$(this).select2(opts);
	});

	$('.header-search button').on('click', function() {
		var $inp = $('.header-search input[name="s"]');
		if ($inp.hasClass('show') && $inp.val() !== '') {
			$inp.parents('form').trigger('submit');
		} else {
			window.setTimeout(function() {
				$inp.focus();
			}, 100);
		}
	});

	// Hide header on on scroll down, show it again on scroll up
	var didScroll;
	var lastScrollTop = 0;
	var scrollDelta = 5;
	var navbarHeight = $('header.wp-block-template-part').outerHeight();



	$(window).scroll(function(event){
		if (!autoScrolling) {
		    didScroll = true;
		}
	});

	setInterval(function() {
	    if (didScroll) {
	        hasScrolled();
	        didScroll = false;
	    }
	}, 250);

	function hasScrolled() {
	    var st = $(this).scrollTop();

	    // Make sure they scroll more than delta
	    if(Math.abs(lastScrollTop - st) <= scrollDelta) {
	        return;
	    }

	    // Recalculate navbar height because sometimes we get it wrong on first calculation
	    navbarHeight = $('header.wp-block-template-part').outerHeight();

	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st <= navbarHeight) {
	        $('header.wp-block-template-part').removeClass('hide-header').removeClass('show-header').css('top', '0px');

	    } else if (st > lastScrollTop && st > navbarHeight){
	        // Scroll Down
	        $('header.wp-block-template-part').removeClass('show-header').addClass('hide-header').css('top', '-'+navbarHeight+'px');
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $('header.wp-block-template-part').removeClass('hide-header').addClass('show-header').css('top', '-'+navbarHeight+'px');
	        }
	    }

	    lastScrollTop = st;
	}

	$(window).scroll(function() {
		if (window.scrollY > window.innerHeight * 0.66) {
			$('.scroll-to-top').addClass('show-button').removeClass('hide-button');
		} else {
			$('.scroll-to-top').removeClass('show-button').addClass('hide-button');
		}
	});
	
	$(window).scroll();

	$('body').on('click', 'form.quiz .gquiz-field .gfield_radio > li', function() {
		$(this).parent().find('li.clicked').removeClass('clicked').find('input').prop('checked', false);
		$(this).find('input').prop('checked', true);
		$(this).addClass('clicked');
		$('.quiz .gform_next_button').css('pointer-events', 'inherit').removeClass('disabled');
	});

	$('body').on('click', '.gform_confirmation_wrapper.quiz .facebook-share', function() {
		var $this = $(this);
		var data = {
			method: 'share_open_graph',
			action_type: 'og.shares',
			action_properties: JSON.stringify({
				object: {
					'og:url': $this.data('url'),
					'og:title': $this.data('title'),
					'og:description': $this.data('description'),
					'og:image': $this.data('image')
				}
			})
		};
		FB.ui(data, function(response){
		});
		return false;
	});

	$('.quiz .question-wrapper h4').css('display', 'block');
	$('.quiz .gform_next_button').css('pointer-events', 'none').addClass('disabled');

	// new TypeIt($('.quiz .question-wrapper h4:visible')[0], {
	// 	speed: 25,
	// 	cursor: false,
	// 	afterComplete: function() {
	// 		$('.quiz .question-wrapper h5').addClass('animate');
	// 	}
	// });

	$(document).bind('gform_page_loaded', function(event, form_id, current_page) {
		$('.quiz .question-wrapper h4').css('display', 'block');
		$('.quiz .gform_next_button').css('pointer-events', 'none').addClass('disabled');
		new TypeIt($('.quiz .question-wrapper h4:visible')[0], {
			speed: 25,
			cursor: false,
			afterComplete: function(instance) {
				$('.quiz .question-wrapper h5').addClass('animate');
			}
		});
		if ($('.quiz_wrapper').length) {
			scrollToTarget($('.quiz_wrapper').parent(), 300);
		}
	});

	$('.factbox .expand').on('click', function() {
		var $t = $(this), $p = $t.prev();
		var open_text = $(this).data('open_text');
		var close_text = $(this).data('close_text');
		if ($p.hasClass('collapsed')) {
			$p.removeClass('collapsed');
			$t.text(close_text);
		} else {
			$p.addClass('collapsed');
			$t.text(open_text);
			scrollToTarget($p, 100);
		}
		$(document).trigger('bv-factbox-changed');
	});
	
	$('.factbox .toggle a').on('click', function() {
		var $t = $(this), $p = $t.parents('.factbox');
		var open_text = $(this).data('open_text');
		var close_text = $(this).data('close_text');
		if ($p.hasClass('collapsed')) {
			$p.removeClass('collapsed');
			$t.text(close_text);
		} else {
			$p.addClass('collapsed');
			$t.text(open_text);
		}
		$(document).trigger('bv-factbox-changed');
	});

	// $(document).bind('gform_confirmation_loaded', function() {
	// 	$('.gform_confirmation_wrapper').fitVids();
	// });
});

var have_initialized_bv_track = false;

function bv_track(category, action, label, value) {
	if (window.ga) {
		if (!have_initialized_bv_track) {
			ga('create', window.bvs.analytics, 'auto', 'bv_track');
			have_initialized_bv_track = true;
		}
		ga('bv_track.send', 'event', category, action, label, value);
	}
	if (window.__gaTracker) {
		if (!have_initialized_bv_track) {
			__gaTracker('create', window.bvs.analytics, 'auto', 'bv_track');
			have_initialized_bv_track = true;
		}
		__gaTracker('bv_track.send', 'event', category, action, label, value);
	}
}

function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
	    sURLVariables = sPageURL.split('&'),
	    sParameterName,
	    i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

jQuery(function($) {

var $grid = $('.tiles-grid').isotope({
 	itemSelector: '.grid-tile',
	layoutMode: 'packery',
	percentPosition: true,
	packery: {
	  gutter: 0,
	}
});

$grid.imagesLoaded().progress( function() {
  	$grid.isotope('layout');
  	// $('.bottom-left').show();
  	var tag = getUrlParameter('tag');
	if (tag) {
		$('.tiles-filter .filter[data-slug="' + tag + '"]').click();
	}
});

$('.tiles-filter .filter').on('click', function() {
	$('.tiles-filter .filter').removeClass('active');
	$(this).addClass('active');
	if ($(this).data('filter') == '*'){
		var filter = '*';
	}
	else {
		var filter = '.filter-'+$(this).data('filter');
	}
	$('.tiles-grid').isotope({filter: filter});
	var tag = $(this).data('filter').substring(1);
	var tag = $(this).data('filter');
	window.history.replaceState({}, "tag", "?tag=" + tag);
});

$('.file-type-Video').click(function(){
	$(this).find('.top-container').find('.img-holder').removeClass('tile-bg-light tile-bg-dark');
	$(this).find('.top-container').find('.img-holder').find('img').each(function() {
		if (!$(this).parents('.cookieconsent-optout-marketing').length) {
			$(this).hide();
		}
	});
	$(this).find('.top-container').find('.img-holder').find('.video-wrap').show();
	$(this).find('.top-container').find('.img-holder').next('.bottom-left').hide();
});

$(document).ready(function(){

	$.fn.isInViewport = function() {
	    var elementTop = $(this).offset().top;
	    var elementBottom = elementTop + $(this).outerHeight();
	    var viewportTop = $(window).scrollTop();
	    var viewportBottom = viewportTop + $(window).height();
	    return elementBottom > viewportTop && elementTop < viewportBottom;
	};

	$(window).on('resize scroll', function() {
		if ($('.menu-panel').hasClass('active')){
			if (!$('.menu-panel').isInViewport()) {
				$('.menu-panel').removeClass('active');
			}
		}
	});

var tid;
$('.op-dots-slider').on('init', function(event, slick){
    window.setTimeout(function() {
      var autoplay = $('.op-slider').attr('data-autoplay');
      if (autoplay){
        $('.op-dots-slider .current').trigger('click');
        startInterval();
      }
    }, 300);
});

var autoplay = $('.op-slider').attr('data-autoplay');
var speed = $('.op-slider').attr('data-speed');
if (autoplay == 1){
  autoplay = false;
  initial = $('.op-slider').attr('data-count');
} else {
  autoplay = false;
  initial = 0;
}
$('.op-slider').slick({
	infinite: false,
	dots: false,
	arrows: false,
	autoplay: autoplay,
	autoplaySpeed: speed,
	initialSlide: parseInt(initial),
	'asNavFor': $('.op-nav')
});
// $('.op-slider-image').slick({
// 	infinite: true,
// 	dots: false,
// 	arrows: false,
// 	fade: true,
// 	cssEase: 'linear',
// 	'asNavFor': $('.op-nav')
// });
$('.op-dots-slider').slick({
	center:false,
	dots: false,
	arrows: false,
	slidesToShow: 3,
	infinite: false,
	'asNavFor': $('.op-nav'),
	responsive: [
	  {
	    breakpoint: 1024,
	    settings: {
	      slidesToShow: 3,
	      slidesToScroll: 1,
	      dots: false,
	      centerMode: true
	    }
	  },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: false,
        centerMode: true
      }
    },
  ]
  });
});

var tid;
function startInterval(){
  var speed = $('.op-slider').attr('data-speed');
  tid = setInterval(slideIt, speed);
}
function slideIt() {
  $('.op-slider').slick('slickPrev');
}
function abortTimer() {
  clearInterval(tid);
}

function goBackSlider(){
  $('.op-dots-slider .last_slide').trigger('click');
  startInterval();
}

$('.quote-nav .arrow.previous').addClass('disabled');
$('.op-dots-slider').on('beforeChange', function(event, { slideCount: count }, currentSlide, nextSlide){
  $('.quote-nav .arrow').removeClass('disabled');
  if (currentSlide == 1 && (nextSlide != 2)) {
    $('.quote-nav .previous').addClass('disabled');
  }
  if (count == (nextSlide + 1)){
    $('.quote-nav .next').addClass('disabled');
  }
});

$('.op-slider').on('swipe', function() {
  abortTimer();
});
$('.op-dots-slider').on('click', '.slick-slide', function(){
  index = $(this).attr('data-slick-index');
  $('[id^=opinion-dot-]').removeClass('current');
  $(this).find('div').addClass('current');
  if (index){
    abortTimer();
    $('.op-slider').slick('slickGoTo',parseInt(index));
  }
});
$('.opinion-slider').on('afterChange', function(event, slick, currentSlide) {
		$('[id^=opinion-dot-]').removeClass('current');
		$('#opinion-dot-'+currentSlide+'').addClass('current');
		$('.op-slider-image').removeClass('slick-initialized');
		$('#vis_mener_img-'+currentSlide).addClass('slick-initialized');
    var autoplay = $('.op-slider').attr('data-autoplay');
    if (autoplay){
      if (currentSlide == 1){
        var speed = $('.op-slider').attr('data-speed');
        setTimeout(goBackSlider, parseInt(speed)+500);
      }
    }
});

$('.quote-nav .arrow.previous').click(function(){
  $('.op-slider').slick('slickPrev');
  $('.op-dots-slider').slick('slickPrev');
  abortTimer();
});

$('.quote-nav .arrow.next').click(function(){
  $('.op-slider').slick('slickNext');
  $('.op-dots-slider').slick('slickNext');
  abortTimer();
});

$('.quotes-slider').each(function() {
  var autoplay = ($(this).attr("data-autoplayslider"));
  if (autoplay == true){
  	autoplay = true;
  }
  else {
  	autoplay = false;
  }
  $(this).slick({
    slidesToScroll: 1,
    swipeToSlide: true,
    rows: 1,
    slidesToShow: 1,
    arrows: false,
    dots: true,
    infinite: true,
    variableWidth: false,
    autoplaySpeed: $(this).attr("data-speed"),
    autoplay: autoplay,
    centerMode: false,
  });
});
});


jQuery(function($) {
	$('.counter-value').each(function() {
		var num = new Intl.NumberFormat('da-DK').format(Math.floor($(this).data('count-from')));
		$(this).text(num).data('counter-done', false);
	});
});

jQuery(window).load(function() {
	var $ = jQuery;
	$(window).scroll(function() {
		$('.counter-value').each(function() {
			var $t = $(this);
			var oTop = $t.offset().top - window.innerHeight;
			if (!$t.data('counter-done') && $(window).scrollTop() > oTop) {
				var countFrom = $t.data('count-from'),
					countTo = $t.data('count-to');
				$({
					countNum: countFrom
				}).animate({
					countNum: countTo
				}, {
					duration: 3000,
					easing: 'swing',
					step: function() {
						var num = new Intl.NumberFormat('da-DK').format(Math.floor(this.countNum));
						$t.text(num);
					},
					complete: function() {
						var num = new Intl.NumberFormat('da-DK').format(Math.floor(this.countNum));
						$t.text(num);
					}
				});
				$t.data('counter-done', true);
			}
		})
	});
	$(window).scroll();
});

AOS.init();

jQuery(function($) {
	if ($('body.logged-in').length) {
		window.setTimeout(function() {
			$('svg.exportable').each(function(idx) {
				var thesvg = this;
				var setDownloadLink = function(that) {
					var html = that.outerHTML;
					if ($(that).hasClass('nvd3-svg')) {
						html = html.replace(/<svg (.*data-height=")([\d]+)/, '<svg viewBox="0 0 1000 $2" $1$2');
					}
					var code = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(html);
					var filename = document.title.replace(/(.*?) - .*/, '$1-' + (idx + 1) + '.svg');
					var link = '<div class="download-svg"><a href="'+code+'" download="'+filename+'" class="fa fa-download"></a></div>';
					if ($(that).next().hasClass('download-svg')) {
						$(that).next().replaceWith(link);
					} else {
						$(that).after(link);
					}
				}
				setDownloadLink(thesvg);
				$(this).on('svg-update', function() {
					window.setTimeout(function() {
						setDownloadLink(thesvg);
					}, 500);
				});
			});
		}, 1000);
	}
});

jQuery(function($) {
	$(document).on('click', 'a', function() {
		var loc = window.location;
		var clickData = {
			'event': 'link-click',
			'page': loc.pathname,
			'section': $(this).parents('section').attr('id'),
			'link': $(this).attr('href'),
			'linkname': $(this).text().trim().replace(/\n+/g, ' ').replace(/\t+/g, ' ')
		};
		if (loc.host.match(/dev\./) || loc.host.match(/staging\./)) {
			console.log("Link click", clickData);
		} else {
			if (window.dataLayer) {
				window.dataLayer.push(clickData);
			}
		}
	});

$('.mener-more').click(function(e){
	e.preventDefault();
	var page = parseInt($(this).data('page'));
	$(this).data('page', page+1);
	var button = $(this);
	var button_text = button.text();
	var params = {};
	params.action = 'bvLoadMoreMener';
	params.page = page;
	$.ajax({
	  url : bv.ajaxurl,
	  data : params,
	  type : 'GET',
	  beforeSend : function ( xhr ) {
		button.text('Henter...');
	  },
	  success : function( data ){
		if( data ) {
		  classes = $(data)[0].firstElementChild.classList.value;
		  $('.content-mener').append(data);
		  button.text(button_text);
		  if (classes.indexOf("left-tiles-false") >= 0){
			button.remove();
		  }
		} else {
		  button.remove();
		}
	  }
	});
});

$(document).ready(function() {
	var nyheder_page = getUrlParameter('nyheder_page');
	if (nyheder_page) {
		loadMoreBlockNews(nyheder_page);
	}
	var tab_link = getUrlParameter('tab_link');
	if (tab_link){
		$('.tab-list ul li a[href="#'+tab_link+'"]').tab('show')
	}
 });

  function changeNewsBlockHistory(page) {
	var stateObj = { page: page};
	window.history.replaceState(stateObj, "historyApi", "?nyheder_page="+page);
  }

  function loadMoreBlockNews(page){
	var current_page_id = parseInt($('.nyheder-more').data('id'));
	var button = $('.nyheder-more').find('a');
	var button_text = button.text();
	var params = {};
	params.action = 'bvLoadMoreNyheder';
	params.post_type = $('.nyheder-more').data('post_type');
	params.page = page;
	params.current_page_id = current_page_id;
	params.history = true;
	page = parseInt(page);
	$('.nyheder-more').data('page', page+1);
	$.ajax({
	  url : bv.ajaxurl,
	  data : params,
	  type : 'GET',
	  beforeSend : function ( xhr ) {
		button.text('Henter...');
	  },
	  success : function( data ){
		if( data ) {
		  classes = $(data)[0].firstElementChild.classList.value;
		  $('.news-loader').append(data);
		  button.text(button_text);
		  if (classes.indexOf("left-tiles-false") >= 0){
			button.remove();
		  }
		} else {
		  button.remove();
		}
	  }
	});
  }
  $('.nyheder-more').click(function(e){
  	e.preventDefault();
  	var page = parseInt($(this).data('page'));
  	changeNewsBlockHistory(page);
  	var current_page_id = parseInt($(this).data('id'));
  	$(this).data('page', page+1);
  	var button = $(this).find('a');
  	var button_text = button.text();
  	var params = {};
  	params.action = 'bvLoadMoreNyheder';
  	params.post_type = $('.nyheder-more').data('post_type');
  	params.page = page;
  	params.current_page_id = current_page_id;
  	$.ajax({
  		url : bv.ajaxurl,
  		data : params,
  		type : 'GET',
  		beforeSend : function ( xhr ) {
  			button.text('Henter...');
  		},
  		success : function( data ){
  			if( data ) {
  				classes = $(data)[0].firstElementChild.classList.value;
  				$('.news-loader').append(data);
  				button.text(button_text);
  				if (classes.indexOf("left-tiles-false") >= 0){
  					button.remove();
  				}
  			} else {
  				button.remove();
  			}
  		}
  	});
  });

});

jQuery(document).on('gform_page_loaded', function(event, form_id, current_page){
	scrollToTarget(jQuery('#gform_wrapper_' + form_id), 300);
});

jQuery(function($) {
	function refreshFilteredArticles($wrapper) {
		var search = $wrapper.find('input[name="search"]');
		var s = search.val();
		var post_type = search.data('post_type');
		var taxonomy = search.data('taxonomy');
		var button = $wrapper.find('a.filter.active');
		var data = {
			'action': 'cfb_article_series',
			'post_type': post_type,
			'taxonomy': taxonomy,
			'search': s
		};
		var term = '';
		var taxonomy = '';
		if (button.length) {
			term = button.data('term');
			taxonomy = button.data('taxonomy');
			data[taxonomy] = term;
		}
		$.ajax(bv.ajaxurl, {
			data: data,
			dataType: 'json',
			success: function(data) {
				var grid = $wrapper.next().find('.tiles-grid');
				var items = $(data.html);
				$wrapper.find('.num-results').text(data.num_results);
				grid.empty().append(items);
				grid.isotope('appended', items).isotope('layout');
			}
		});
	}
	
	$(document).on('click', '.cfb-article-series .reset-search', function() {
		var wrapper = $(this).parents('.cfb-article-series');
		wrapper.find('.filter').removeClass('active');
		wrapper.find('input[name="search"]').val('');
		refreshFilteredArticles(wrapper);
		return false;
	});

	$(document).on('submit', '.cfb-article-series form', function() {
		refreshFilteredArticles($(this).parents('.cfb-article-series'));
		return false;
	});
	
	$(document).on('click', '.cfb-article-series a.filter', function() {
		var wrapper = $(this).parents('.cfb-article-series');
		wrapper.find('.filter').removeClass('active');
		$(this).addClass('active');
		refreshFilteredArticles(wrapper);
		return false;
	});

	$('.tab-list ul li a').click(function(){
		tab = $(this).attr('href');
		tab = tab.replace('#', "");
		var stateObj = { tab: tab};
		window.history.replaceState(stateObj, "historyApi", "?tab_link="+tab);
	});
	
	$(document).on('click', '.accordion .header', function(){
		if ($(this).hasClass('open')){
			$(this).removeClass('open');
		} else {
			$(this).addClass('open');
		}
	});
	
	$(document).on('click', '.donation .gfield_radio label', function() {
		let radioParent = $(this).parents('.gfield_radio'),
			radioControl = radioParent.find('.gchoice_other_control'),
			parent = $(this).parent(),
			control = parent.find('.gchoice_other_control');
		radioControl.removeClass('selected');
		control
			.addClass('selected')
			.attr('inputmode', 'numeric')
			.on('keypress', function(event) {
				var code = (event.keyCode ? event.keyCode : event.which);
				if (code < 48 || code > 57) {
					event.preventDefault();
				}
			});
		window.setTimeout(function() {
			control.focus();
			if (control.val() != parseInt(control.val(), 10)) {
				control.val('');
			}
		}, 10);
		window.setInterval(function() {
			parent.find('.gchoice_other_control:not(:visible)').removeClass('selected');
		}, 500);
	});
});

// window.addEventListener('CookiebotOnAccept', function() {
// 	window.setTimeout(function() {
// 		jQuery('#wrapper, #main, .hero-block').fitVids({customSelector: "iframe[data-cli-src^='https://www.youtube.com']",ignore: ".hero-block .video-holder"});
// 	}, 500);
// });

jQuery(function($) {
	if ($('.header-underline').length) {
		var scrollPosition = 0;
		var updating = false;
		var $w = $(window);
		$('.header-underline').css('right', '100%');
		function updateReadingProgress(scrollTop) {
			var height = $(document).height() - $w.height(),
			pct = (scrollTop / height) * 100;
			if (pct > 100) {
				pct = 100;
			}
			$('.header-underline').css('right', (100-pct) + '%');
		}
		$w.on('scroll', function() {
			scrollPosition = $w.scrollTop();
			if (!updating) {
				window.requestAnimationFrame(function() {
					updateReadingProgress(scrollPosition);
					updating = false;
				});
				updating = true;
			}
		});
	}
});

jQuery(function($) {
	$(document).on('change', '.gpoll_field .gfield_radio .gfield-choice-input', function(evt) {
		$(this).parents('.gfield_radio').find('label').removeClass('selected');
		if ($(this).prop('checked')) {
			$(this).next().addClass('selected');
		}
	});
	$('.gpoll_field .gfield_radio .gfield-choice-input').each(function() {
		if ($(this).prop('checked')) {
			$(this).next().addClass('selected');
		}
	});

	if ($('.gform_confirmation_wrapper .gpoll_container').length) {
		var target = $('.gform_confirmation_wrapper:has(.gpoll_container)');
		if (target.parents('.wp-block-group').length) {
			target = target.parents('.wp-block-group');
		}
		scrollToTarget(target, 1);
	}
});

jQuery(function($) {
	if ($('.ticker-block').length) {
		$('.ticker-block').each(function() {
			const $t = $(this), winWidth = $(window).innerWidth();
			$t.css({
				'display': 'flex',
				'flex-wrap': 'nowrap',
				'white-space': 'nowrap',
			});
		});
		window.setTimeout(function() {
			$('.ticker-block').each(function() {
				const $t = $(this), winWidth = $(window).innerWidth();
				var contentWidth = 0;
				$t.find('>*').each(function() {
					if ($(this).hasClass('wp-block-group')) {
						$(this).find('>*').each(function() {
							contentWidth  += $(this).outerWidth(true);
						});
					} else {
						contentWidth  += $(this).outerWidth(true);
					}
				});
				if (contentWidth < 1) {
					console.log("Content width is too small to render ticker", $t);
					return;
				}
				let direction = -1;
				let ticker = $('<div class="the-ticker" style="display: flex; flex-wrap: nowrap; white-space: nowrap;">'+$t[0].innerHTML+'</div>');
				$t.empty().append(ticker);
				for (let i = 0; i * contentWidth < winWidth * 2; i++) {
					$t.append(ticker.clone());
				}
				let speed = $t.data('speed');
				if (speed == 0) {
					speed = 30;
				}
				if (speed < 0) {
					direction = 1;
					speed = Math.abs(speed);
				}
				$t.css({'rotate': $t.data('rotation') + 'deg'});
				let tickerWidth = $t[0].offsetWidth;
				let initDuration = contentWidth / speed;
				
				gsap.to($t.find('.the-ticker'), {
					duration: initDuration,
					xPercent: 100 * direction,
					ease: "none",
					repeat: -1
				});
			});
		}, 20);

	}
	
	$(document).on('click', '.search-trigger a', function(e){
		e.preventDefault();
		
		if ($('body').hasClass('show-search')){
			$('body').removeClass('show-search');
		} else {
			$('body').addClass('show-search');
			$('.menu-panel').removeClass('active');
			return false; 
		}
	});

	$(document).click(function(event) {
		var $target = $(event.target);
		if(!$target.closest('.menu-panel').length && $('.menu-panel').hasClass('active')) {
			$('.menu-panel').removeClass('active');
		}
	});

	$(document).click(function(event) {
		$('body').removeClass('showing-fundraising-form');
	});

	$(document).on('click', 'header.wp-block-template-part nav a[href^="#"]', function(e) {
		let anchor = $(this).attr('href'),
			target = $('.menu-panel' + anchor);
		if (target.length) {
			if (target.hasClass('active')) {
				target.removeClass('active');
			} else {
				$('.menu-panel').removeClass('active');
				$('body').removeClass('show-search');
				target.addClass('active');
			}
			return false;
		}
	});
	
	$(document).on('click', 'nav button', function() {
		$('body').removeClass('show-search');
	});
	
	$(document).on('click', '.toggle-panel', function() {
		$('.menu-panel').removeClass('active');
		$('.wp-block-navigation__responsive-container-open').click();
	});
});