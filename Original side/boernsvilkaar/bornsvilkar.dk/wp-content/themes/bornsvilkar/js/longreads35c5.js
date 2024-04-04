jQuery(function($) {
	var wrapper = $('main');
	// Fade cover backgrounds into each other as the content scrolls past
	$('.scroll-story').each(function() {
		var story = $(this);
		var covers = [];
		var inners = [];
		var $covers = $('<div class="covers"></div>');
		story.append($covers);
		var $inners = $('<div class="inners"></div>');
		story.append($inners);
		story.find('>.wp-block-cover').each(function(idx) {
			var cover = $(this);
			var inner = $(this).clone(true);
			cover.find('.wp-block-cover__inner-container').remove();
			cover.css({'position': 'absolute', 'top': 0});
			cover.data('idx', idx);
			inner.data('idx', idx);
			if (idx > 1) {
				cover.css({'opacity': '0'});
			}
			inner.children(':not(.wp-block-cover__inner-container)').remove();
			inner.css({'background-image': 'none'});
			inner.removeClass('rocket-lazyload').removeAttr('data-bg');
			$covers.append(cover);
			$inners.append(inner);
			covers.push(cover);
			inners.push(inner);
		});
		// These data attributes are not used for the scroll story itself, but for others who need to adapt to it
		$covers.data('inners', inners);
		$inners.data('covers', covers);
		story.css({'position': 'relative'});
		
		var scrollHandler = function() {
			var scroll = window.scrollY;
			var secondaryOffset = 0;
			if (story.prev().length == 0 && story.parent().hasClass('entry-content')) {
				secondaryOffset = story.parent().offset().top;
			}
			if (story[0].offsetTop <= scroll + secondaryOffset && (story[0].offsetTop + wrapper[0].offsetHeight - window.innerHeight >= scroll )) {
				covers.forEach(function(cover) {
					cover.css({'position': 'fixed'});
				});
				var top = (scroll - story[0].offsetTop);
				var totalHeight = 0;
				var currentIdx = 0;

				for(var i = 0 ; i < covers.length; i++) {
					var inner = inners[i];
					var height = inner[0].scrollHeight;
					if (totalHeight + height < top) {
						totalHeight += height;
						currentIdx = i + 1;
					} else {
						break;
					}
				}
				if (currentIdx == covers.length) {
					covers.forEach(function(cover) {
						//cover.css({'position': 'absolute'});
					});
				}
				for(var i = 0 ; i < covers.length - 1 ; i++) {
					var cover = covers[i + 1];
					if (currentIdx > i) {
						cover.css({'opacity': 1});
						continue;
					} else if (i > currentIdx) {
						cover.css({'opacity': 0});
						continue;
					}
					var inner = inners[i];

					var height = inner[0].scrollHeight;
					var current = 1 - (height - (top - totalHeight)) / height;

					var start = 0.60; // Start fading at 60% of contents
					var end = 1.0; // And complete fading at 100%

					var level  = (current - start) / (end - start);
					cover.css({'opacity': level});
				}
			} else {
				covers.forEach(function(cover) {
					//cover.css({'position': 'absolute'});
				});

				for(var i = 0 ; i < covers.length - 1 ; i++){
					var cover = covers[i];
					if (i == 0) {
						cover.css('opacity', 1);
					} else {
						cover.css('opacity', 0);
					}
				}
			}
		};
		$(document).on('scroll', scrollHandler);
		$(document).on('resize', scrollHandler);
		$(document).scroll();
	});
});

jQuery(function($) {
	function controlVideoWithScroll(wrapper, video) {
		const scrollVideo = function() {
			if(video.duration) {
				const distanceFromTop = window.scrollY + wrapper.getBoundingClientRect().top;
				const rawPercentScrolled = (window.scrollY - distanceFromTop) / (wrapper.scrollHeight - window.innerHeight);
				const percentScrolled = Math.min(Math.max(rawPercentScrolled, 0), 1);
				
				video.currentTime = video.duration * percentScrolled;
			}
			requestAnimationFrame(scrollVideo);
		}
		requestAnimationFrame(scrollVideo);
	}
	
	$('.scrollvideo video').each(function() {
		if ($(this).parents('.scroll-story').length && $(this).parents('.wp-block-cover.scrollvideo').length) {
			var idx = $(this).parents('.wp-block-cover.scrollvideo').data('idx');
			var inner = $(this).parents('.covers').data('inners')[idx];
			controlVideoWithScroll(inner[0], this);
		} else {
			controlVideoWithScroll($(this).parents('.scrollvideo')[0], this);
		}
	});
});
jQuery('.scrollvideo video').on('play', function(evt) {
	this.pause();
});

(function($) {
	// Two part initialization, to remove any highlight quickly, but not
	// attach code before .scroll-story handling above has done its cloning
	// work. Otherwise the element we attached to is cloned and removed.
	$('.is-style-dynamic-highlight .has-inline-background').each(function() {
		var $t = $(this).removeClass('has-inline-background').addClass('to-be-highlighted');
		$t.data('background', $t.css('backgroundColor'));
		$t.css('backgroundColor', 'inherit');
	});
	$(function($) {
		$('.is-style-dynamic-highlight .to-be-highlighted').each(function() {
			var $t = $(this);
			var $cl = $t.clone().empty().css({'backgroundColor': $t.data('background')});
			var fulltext = $t.text();
			$t.before($cl);
			$(window).on('scroll', function() {
				var margin = window.innerHeight / 4;
				var top = $t[0].getBoundingClientRect().top;
				if (top > window.innerHeight - margin) {
					$t.text(fulltext);
					$cl.empty();
					return;
				}
				if (top < margin) {
					$t.empty();
					$cl.text(fulltext);
					return;
				}
				var pctScrolled = 1 - (top - margin) / (window.innerHeight - 2 * margin);
				var len = Math.ceil(fulltext.length * pctScrolled);
				$t.text(fulltext.substring(len));
				$cl.text(fulltext.substring(0, len));
			});
		});
	});

	$('.is-style-fade-in .has-inline-color').each(function() {
		var $t = $(this).addClass('to-be-faded');
		$t.css('opacity', 0);
	});
	$(function($) {
		$('.is-style-fade-in .to-be-faded').each(function() {
			var $t = $(this);
			$(window).on('scroll', function() {
				var margin = window.innerHeight / 4;
				var top = $t[0].getBoundingClientRect().top;
				if (top > window.innerHeight - margin * 1) {
					$t.css('opacity', 0);
					return;
				}
				if (top < margin) {
					$t.css('opacity', 1);
					return;
				}
				var pctScrolled = (top - margin) / (window.innerHeight - 2 * margin);
				$t.css('opacity', 1 - Math.pow(pctScrolled, 2));
			});
		});
	});

	// Two part initialization, to remove text quickly, but not
	// attach code before .scroll-story handling above has done its cloning
	// work. Otherwise the element we attached to is cloned and removed.
	$('.is-style-text-on-scroll').each(function() {
		var $t = $(this);
		$t.wrap('<div class="text-on-scroll-wrapper">');
		$t.parent().css({'position': 'relative'});
		var $cl = $t.clone();
		$cl.empty().removeClass('is-style-text-on-scroll');
		// Without position absolute, the initial characters can blink a little
		// But with position absolute, center and right aligns don't work
		if (!$cl.hasClass('has-text-align-center') && !$cl.hasClass('has-text-align-right')) {
			$cl.css({'position': 'absolute'});
		}
		// Remove classes like has-yellow-color because they get set with important, overriding our transparent
		$t.removeClass(function (index, className) {
			var classes = (className.match(/(^|\s)has-.*?color/g) || []).join(' ');
			return classes;
		});
		$t.css({'color': 'transparent'});
		var fulltext = $t.text();
		$t.before($cl);
		$t.data('fulltext', fulltext);
	});
	$(function($) {
		$('.is-style-text-on-scroll').each(function() {
			var $t = $(this),
				$cl = $t.prev(),
				fulltext = $t.data('fulltext');
			$(window).on('scroll', function() {
				var start = window.innerHeight / 4;
				var end = window.innerHeight - window.innerHeight * .40;
				var size = end - start;
				var top = $t[0].getBoundingClientRect().top;
				var currentPosition =  -(top - window.innerHeight);
				var pctScrolled = (currentPosition - start) / size;
				if (window.scrollY < 10) {
					$cl.empty();
					return;
				}
				if (currentPosition < start) {
					$cl.empty();
					return;
				}
				if (currentPosition > end) {
					$cl.text(fulltext);
					return;
				}
				var len = Math.ceil(fulltext.length * pctScrolled);
				$cl.text(fulltext.substring(0, len));
			});
		});
	});
})(jQuery);

jQuery(function($) {
	gsap.registerPlugin(ScrollTrigger);
	var stickyScrollTriggers = [];
	var setupStickyScrollTriggers = function() {
		stickyScrollTriggers.forEach(function(st) {
			st.kill();
		});
		if ($(window).width() >= 600) {
			$('.sticky-wrapper .sticky').each(function() {
				var elem = this, wrapper = $(this).parents('.sticky-wrapper')[0];
				var st = ScrollTrigger.create({
					trigger: wrapper,
					start: "top top",
					end: "bottom "+$(this).outerHeight()+"px",
					pin: this
				});
				stickyScrollTriggers.push(st);
			});
			ScrollTrigger.sort();
		}
	};
	$(window).on('resize', setupStickyScrollTriggers);
	window.setTimeout(setupStickyScrollTriggers, 1000);
	$('iframe').on('load', setupStickyScrollTriggers);
	$(document).on('bv-factbox-changed', setupStickyScrollTriggers);

	$('.is-style-swap-items').each(function() {
		var swap = this;
		$(this).css({'position': 'relative'});
		var children = $(this).children();
		var timeline = gsap.timeline({});
		children.each(function(idx, elem) {
			if (idx == 0) {
				return;
			}
			timeline.to(elem, {opacity:1, duration:1, ease:'none'});
			timeline.to(elem, {opacity:1, duration:2, ease:'none'});
			if(idx !== children.length - 1) {
				timeline.to(elem, {opacity:0, duration:1, ease:'none'});
			}
			$(this).css({'opacity': 0, 'position': 'absolute', 'top': 0});
		});
		ScrollTrigger.create({
			animation: timeline,
			scrub: true,
			trigger: swap,
			pin: true,
			end: `${timeline.duration() * 15}%`
		});
	});
	
	$('.side-scroll').each(function() {
		var ss = this, start = $(this).data('start'), end = $(this).data('end');
		$(ss).css('--side-scroll-position', start + 'vw');
		ScrollTrigger.create({
			trigger: ss,
			start: "top bottom",
			end: "bottom top",
			scrub: true,
			onUpdate: function(gs) {
				$(ss).css('--side-scroll-position', (start + (end - start) * gs.progress) + 'vw');
			}
		});
	});

	ScrollTrigger.sort();
});

(function($) {
	if ($('.scroll-effects-wrapper').length) {
		$('.scroll-effects-wrapper').each(function() {
			$(this).children()
				.attr('data-aos', $(this).data('effect'))
				.attr('data-aos-offset', $(this).data('offset'))
				.attr('data-aos-delay', $(this).data('delay'))
				.attr('data-aos-duration', $(this).data('duration'))
				.attr('data-aos-easing', $(this).data('easing'))
				.attr('data-aos-anchor-placement', $(this).data('anchor-placement'))
				;
		});
		AOS.refreshHard();
	}
})(jQuery);
