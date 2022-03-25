/**
 * rmlibrary-template - RM Library module template
 * @version 1.0.0
 *
 * This code is developed using Rich Media's proprietary code library
 * and may not be reproduced, altered, reverse engineered, or otherwise
 * copied or distributed in whole or in part, without the express
 * written permission of Rich Media.
 */
(function (root, factory) {
if (typeof define === 'function' && define.amd) { define(["jquery"], factory); } else { if (!root.rmlibrary) root.rmlibrary = {}; root.rmlibrary.carousel = factory(jQuery); }
}(this, function (jQuery) {
null
/**
 * rm-amd-loader - AMD Loader for the RM Library
 * @version 0.1.6
 *
 * This code is developed using Rich Media's proprietary code library
 * and may not be reproduced, altered, reverse engineered, or otherwise
 * copied or distributed in whole or in part, without the express
 * written permission of Rich Media.
 */
var define,require;!function(){function r(r,e){if(Array.prototype.map)return r.map(e);var t=[];if("function"!=typeof e)throw new TypeError;for(var o=0;o<r.length;o++)t.push(e.call(null,r[o],o,r));return t}function e(r,e){for(var t=0;t<r.length;t+=1)if(r[t]===e)return t;return-1}function t(r,e){if(!/^\.\.?\//.test(e))return e;for(var t=r.split("/"),o=t.slice(0,t.length-1).concat(e.split("/")),n=[],u=0;u<o.length;u+=1)"."===o[u]||(".."===o[u]?n.pop():n.push(o[u]));return n.join("/")}function o(r){return function(e){return u(e,r)}}function n(e,t,n){return r(e,function(r){return"require"===r?o(t):"exports"===r?i[t].module.exports:"module"===r?i[t].module:u(r,t)})}function u(r,o,u){o&&(r=t(o,r)),u||(u=[]);var p=i[r];if(!p||!p.factory)throw"Error loading mod.";if(-1!==e(u,r))throw"No circular dependancies.";if(u.push(r),!p.loaded){p.module.exports={};var f=p.deps&&n(p.deps,r,u);p.module.exports=p.factory.apply(null,f),p.loaded=!0}return p.module.exports}var i={};define=function(r,e,t){if("string"!=typeof r)throw new Error("Modules must be names with a string.");"[object Array]"!==Object.prototype.toString.call(e)&&(t=e,e=["require","exports","module"]),i[r]={id:r,deps:e,factory:t},i[r].module={id:r,exports:i[r].exports}},define.amd={},require=function(r,e){return"string"==typeof r?u(r):("[object Array]"!==Object.prototype.toString.call(r)&&(e=r,r=[]),r=n(r),"function"==typeof e&&e.apply(null,r),void 0)}}();
/*global window */
define('polyfillIE',['jquery'],function ($) {
	function addIE8Tag(){
		var DEBUG_TAG = "";
		//var DEBUG_TAG = "IE8";
		if((/MSIE 8/i).test(window.navigator.userAgent)){
			$('html').addClass("IE8");
		}
		else {
			$('html').addClass(DEBUG_TAG);
		}
	}
	function polyfillBind(){
		if (!Function.prototype.bind) {
		  Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
			  // closest thing possible to the ECMAScript 5
			  // internal IsCallable function
			  throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}
			var aArgs   = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP    = function() {},
				fBound  = function() {
				  return fToBind.apply(this instanceof fNOP ? this : oThis,
						 aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			if (this.prototype) {
			  // Function.prototype doesn't have a prototype property
			  fNOP.prototype = this.prototype;
			}
			fBound.prototype = new fNOP();

			return fBound;
		  };
		}
	}
	function fixConsole(){
		//console fix for older versions of IE
	    try{
	        window.console.log('Console detected.');
	    }
	    catch(err){
	        window.console = {};
	        window.console.log = window.console.error = window.console.info = window.console.debug = window.console.warn = window.console.trace = window.console.dir = window.console.dirxml = window.console.group = window.console.groupEnd = window.console.time = window.console.timeEnd = window.console.assert = window.console.profile = function(/*obj*/) { /*alert(obj.toString());*/ };
	    }
	}
	return function(){
		polyfillBind();
		addIE8Tag();
		fixConsole();
	};
});
/*jslint browser: true*/
/*global console*/
define('carousel',['jquery','./polyfillIE'],function ($,polyfill) {
	var strings = {
		"en" : {
			"nextSlide" : "next slide",
			"previousSlide" : "previous slide",
			"gotoSlide" : "go to slide ",
			"play" : "play",
			"pause" : "pause"
		},
		"fr" : {
			"nextSlide" : "diapositive suivante",
			"previousSlide" : "diapositive précédente",
			"gotoSlide" : "aller à diapositive ",
			"play" : "lancer",
			"pause" : "pause"
		}
	};
	var lang = (/^fr/i).test($("html").attr('lang'))? "fr" : 'en';
	polyfill();
	var IE8 = $('html').hasClass("IE8");
	function _moveSlide(){
		if(IE8){
			$(this.elem).children().eq(0).css("left", 100  * (this.slide % this.children) *-1 +"%");
		}
		else {
			if(typeof this.options.outsideScrollElem != "undefined"){
				this.options.outsideScrollElem.siblings().stop(true,true).fadeOut();
				$(this.options.outsideScrollElem).eq(this.slide).delay(300).fadeIn();
			}

			var slide = this.elem.attr("data-slide");

			var current = this.elem.children().children().eq(slide);
			current.attr("aria-hidden", false).attr("tabindex", 0).children("a").attr("tabindex", 0);

			current.siblings().attr("aria-hidden", true).each(function(){
				$(this).attr("tabindex", -1).children("a").attr("tabindex",-1);
			});
            var $main = $(this.elem);

            var animateInTime = (typeof $main.data("animate-in-time") != "undefined") ? $main.data("animate-in-time") : 750;
            var animateOutTime = (typeof $main.data("animate-out-time") != "undefined") ? $main.data("animate-out-time") : 750;

            var $current = $(this.elem).find(".carousel-item.current");

            (this.slideDirection == 1)? $current.addClass("animate out left"):$current.addClass("animate out right");

            setTimeout(function(){
                //Remove Current Slide
                 $current.removeClass("current animate left right out");

                $(this.elem).children().css("left", 100  * (this.slide % this.children) *-1 +"%")

                //Update Pagination
                $(this.options.pagination).children().eq($(this.elem).attr("data-slide")).addClass("current").attr("aria-selected", true).siblings().removeClass("current").attr("aria-selected", false);

                //Update New slide to display
                var $newSlide = $(this.elem).find(".carousel-item").eq(slide);
                $newSlide.addClass("current");

                //Add Animation Classes
                var direction = (this.slideDirection == 1)? "right" : "left";
                $newSlide.addClass(direction).addClass("in");
                setTimeout(function(){
                    $newSlide.removeClass(direction).removeClass("in").addClass("animate");
                },50);

                setTimeout(function(){
                    $newSlide.removeClass("animate right left");
                    if(this.focusTop) current.focus();
                    this.focusTop = true;
                    this.allowClick = true;

                }.bind(this), animateInTime);

            }.bind(this), animateOutTime);
		}
	}
	function _callMove(){

		if(!this.options.infiniteRotate){
			(this.slide+1 == this.children)?this.options.nextBtn.addClass("disabled") : this.options.nextBtn.removeClass("disabled");
			(this.slide-1 < 0)?this.options.previousBtn.addClass("disabled") : this.options.previousBtn.removeClass("disabled");
		}

		if(this.options.transitionFunction === undefined) {
			(_moveSlide).bind(this)();
		} else {
			this.options.transitionFunction.bind(this)();
		}
		this.options.callback.bind(this)();
		//this.allowClick = true;
	}
	function RMCarousel(elem){
		this.elem = elem;
		this.children = elem.children().length;
		this.childWidth = elem.children().eq(0).width();
		this.slide = 0;
		this.init = true;
		this.playing = false;
		this.dotsEmbeded = false;
		this.ArrowsEmbeded = false;
		this.allowClick = true;
        this.slideDirection = "";
		this.focusTop = true;
		if(!this.elem.children().hasClass('generatedTrack')){
			elem.children().first().addClass("current").attr("aria-hidden", false).attr("tabindex", 0).siblings().attr("aria-hidden", true).each(function(){
				$(this).attr("tabindex", -1).children("a").attr("tabindex",-1);
			});
			this.elem.html(
				$("<div>")
					.addClass('generatedTrack')
					.html(elem.children().detach())
			);//wrap the children in a track for sliding
		}
		else {
			this.childWidth = elem.children().children().eq(0).width();
			this.children = elem.children().children().length;
		}

		$(window).on('resize', (function(){
			setTimeout(function(){

				var w = (!this.options.overrideWidth) ? elem.width() : $(elem.selector).children().children().first().width();
				var l = (!this.options.overrideWidth) ? 0 : elem.width()/2 -$(elem.selector).children().children().first().width()/2;
				this.elem
					.children('.generatedTrack')
					//.css({'width': this.children * w, left: 100  * (this.slide % this.children) *-1 +"%",position:"absolute"})
					//.css({'width': this.children * w, left: l, height: "100%", position: "relative" !!PROPER WORKING VERSION
                    .css({'width': this.children * w, height: "100%", position: "relative"
					//,position:"absolute"
					})
						.children().removeAttr("style")
						.css({'width': w});//resize track and children
			}.bind(this));
		}).bind(this));
		$(window).trigger('resize'); //resize carousel on resize and trigger it to initialize it
		(AccessibilizeMe).bind(this)();
		return this;
	}

	function AccessibilizeMe(){
		$(this.elem).children().children().off('focusin').focusin((function(){
			if(this.elem[0].carousel.options.autoTransition == true) {
				this.elem[0].carousel.stop();
			}
		}).bind(this));
	}

	 function _getPos(evt) {
		if(typeof (evt.pageX) !== 'undefined') {
            return evt.pageX;
        } else if(typeof (evt.clientX) !== 'undefined'){
            return evt.clientX;
        } else if(typeof (evt.originalEvent.touches[0].pageX) !== 'undefined') {
            return evt.originalEvent.touches[0].pageX;
        }
    }
	//statebool true for enabled
	RMCarousel.prototype.enableSwipe = function(stateBool){
		if(stateBool){
			$(this.elem).on('touchstart.carouselSwipe', (function(evt){
				this.startPos = _getPos(evt);
			}).bind(this));

			$(this.elem).on('touchend.carouselSwipe', (function(){
				var distance = Math.max(this.startPos,this.movePos) - Math.min(this.startPos,this.movePos);
				if(distance < this.options.swipeThreshold){
					return false;
				}
				this.elem[0].carousel.playToggle();
				if(this.startPos < this.movePos){
					this.elem[0].carousel.previous();
				}
				else if (this.startPos > this.movePos){
					this.elem[0].carousel.next();
				}
				this.elem[0].carousel.playToggle();

			}).bind(this));

			$(this.elem).on('touchmove.carouselSwipe', (function(evt){
				this.movePos = _getPos(evt);
			}).bind(this));
		}
		else{
			$(this.elem).off('.carouselSwipe');
		}
	};
	RMCarousel.prototype.gotoSlide = function(slide){
		if(!this.allowClick)
			return false;
		this.allowClick = false;
		this.slide = slide;
		$(this.elem).attr("data-slide", this.slide % this.children);
		_callMove.bind(this)();
	};
	RMCarousel.prototype.next = function(){
		if(!this.allowClick)
			return false;

		if(!this.options.infiniteRotate && this.options.nextBtn.hasClass("disabled"))
			return false;

		this.allowClick = false;
        this.slide = (this.slide + 1 >= this.children)?0:this.slide + 1;
		$(this.elem).attr("data-slide", this.slide);
        this.slideDirection = 1;
		_callMove.bind(this)();
	};
	RMCarousel.prototype.previous = function(){
		if(!this.allowClick)
			return false;

		if(!this.options.infiniteRotate && this.options.previousBtn.hasClass("disabled"))
			return false;

		this.allowClick = false;
		this.slide = this.slide - 1 < 0 ? this.children -1 : this.slide -1;
		$(this.elem).attr("data-slide", this.slide);
        this.slideDirection = -1;
		_callMove.bind(this)();
	};
	RMCarousel.prototype.playToggle = function(){
		if(this.playing){
			clearInterval(this.intervalHandle);
			this.playing = false;
            this.options.pagination.find(this.options.paginationPause).addClass("paused");
		}
		else {
			this.playing = true;
            this.options.pagination.find(this.options.paginationPause).removeClass("paused");
			this.intervalHandle = setInterval ((function(){
				if(this.init){
					this.init = false;
					//$(window).resize();
				}
				$(this.elem).attr("data-slide", ++this.slide % this.children);
				this.focusTop = false;
				_callMove.bind(this)(false);
                $()
			}).bind(this),this.options.transitionTimer * 1000 );
		}
	};
	RMCarousel.prototype.stop = function(){
		if(this.playing){
			clearInterval(this.intervalHandle);
			this.playing = false;
            this.options.pagination.find(this.options.paginationPause).addClass("paused");
		}
	};
	RMCarousel.prototype.play = function(){
		if(this.playing){
			clearInterval(this.intervalHandle);
			this.playing = false;
		}
		this.playing = true;
		this.intervalHandle = window.setInterval ((function(){
			$(this.elem).attr("data-slide", ++this.slide % this.children);
			_callMove.bind(this)();
		}).bind(this),this.options.transitionTimer * 1000 );
        this.options.pagination.find(this.options.paginationPause).removeClass("paused");
		return this.playing;
	};
	RMCarousel.prototype.destroy = function(){
		clearInterval(this.intervalHandle);
	};
	RMCarousel.prototype.generateDirectionalButtons = function($p, $n){
		$p.addClass("generatedPrevious generatedArrow").attr("data-dir",-1).on("click keyup", moveHandler.bind(this));
		$n.addClass("generatedNext generatedArrow").attr("data-dir",1).on("click keyup", moveHandler.bind(this));


		function moveHandler(e){
			var code = e.keyCode || e.which;
			if(code == 13 || code == 32  || e.type != "keyup") {
				this.elem[0].carousel.playToggle();
				var v = $(e.target).attr("data-dir");
				v = (typeof v == "undefined") ? $(e.target).parent().attr("data-dir") : v;

				if (v < 0) {
					this.elem[0].carousel.previous();
				}
				else {
					this.elem[0].carousel.next();
				}
				this.elem[0].carousel.playToggle();
			}
		}

		return {
			next : $n,
			prev : $p
		};
	};

	function updatePlayButtonState(userTriggered){
		var $toggle = $(this.elem).find('.playToggle');
		if(this.playing){
			$toggle.removeClass('pauseMode');
			$toggle.addClass('playMode');
			$toggle.find('.inner').text(strings[lang].pause);
			if(userTriggered)
				this.userPaused = false;
		}
		else {
			$toggle.removeClass('playMode');
			$toggle.addClass('pauseMode');
			$toggle.find('.inner').text(strings[lang].play);
		}
	}

	RMCarousel.prototype.generateDots = function($rt){
        var that = this;
		for(var i = 0; i < this.children; i++) {
			var $item = this.options.paginationTemplate.clone();
			$item.removeAttr("id")
				.attr("data-idx", i)
				.attr("role",'tab')
				.attr("aria-selected",(this.slide % this.children) == i)
				.append($('<div class="sr-only">').html(strings[lang].gotoSlide + (i+1) ))
			if(i==0)$item.addClass("current");
			$rt.append($item);
		}

		$rt.children().on('click keyup',(function(e){
			var code = e.keyCode || e.which;
			if(code == 13 || code == 32 || e.type != "keyup") {
				this.elem[0].carousel.playToggle();
				var v = $(e.target).attr("data-idx");
				$(this.elem).attr("data-slide", v);
                this.slideDirection = (this.slide > Number(v))?1:-1;
				this.slide = Number(v);
				_callMove.bind(this)();
				this.elem[0].carousel.playToggle();
			}
		}).bind(this));

        var $pause = this.options.paginationPauseTemplate.clone();
        $pause.removeAttr("id").appendTo(this.options.pagination);
        $pause.on('click keyup', function(e){
            that.elem[0].carousel.playToggle();
        });

		return $rt;

	};
	RMCarousel.prototype.options = function(options){
		this.options = $.extend(
			{},
			{
				infiniteRotate : true,
				swipeThreshold : 100, //calculated in px
				autoTransition : true,
				transitionTimer : 2,
				transitionDuration : 2,
				"callback" : function(){},
				transitionFunction : undefined, //function override function expects one param, (bool) forward, set false for prev
				transitionClasses : {}
			},
			options
		);
		$.each( this.options.transitionClasses, function(k,v) {
			this.elem.children().css(k,v);
		}.bind(this));
	};
	return RMCarousel;
});
/*global setTimeout, window*/
define('index',['jquery', './carousel'], function ($, RMC) {
    $.fn.RMCarousel = function(ACTION,options){
		if(typeof ACTION == "string"){
			switch(ACTION){
				case "PLAY":
					return this[0].carousel.play();
				case "PAUSE":
				case "TOGGLE":
					return this[0].carousel.playToggle();
				case "STOP":
					this[0].carousel.stop();
					break;
				case "OPTIONS":
					this[0].carousel.options(options);
					break;
				case "NEXT":
					this[0].carousel.next();
					break;
				case "PREVIOUS":
					this[0].carousel.previous();
					break;
				case "GOTO":
					this[0].carousel.gotoSlide(options);
					break;
				case "DELETE":
					this[0].carousel.destroy();
					this[0].carousel = undefined;
					break;
				case "DOTS":
					this[0].carousel.generateDots.bind(this[0].carousel)(true);
					break;
				case "ENABLESWIPE":
					this[0].carousel.enableSwipe(true);
					break;
				case "DISABLESWIPE":
					this[0].carousel.enableSwipe(false);
					break;
			}
		}
		else {
			if(this[0].carousel !== undefined){
				$(window).trigger('resize');
			}
			else {
				this[0].carousel = new RMC(this);
				this[0].carousel.options(ACTION);
				if(this[0].carousel.options.autoPlay) this[0].carousel.playToggle();
				if(!this[0].carousel.options.infiniteRotate) this[0].carousel.options.previousBtn.addClass("disabled");
				if(typeof this[0].carousel.options.outsideScrollElem != "undefined")$(this[0].carousel.options.outsideScrollElem).eq(0).fadeIn();
				this[0].carousel.enableSwipe(true);
				$(window).trigger('resize');
				setTimeout((function(){
					this[0].carousel.generateDirectionalButtons.bind(this[0].carousel)(this[0].carousel.options.previousBtn, this[0].carousel.options.nextBtn);
					this[0].carousel.generateDots.bind(this[0].carousel)(this[0].carousel.options.pagination);
				}).bind(this));
			}
			//console.log(this[0]);
		}
		return this;
	};
	//START

});
define('jquery', [], function () { return jQuery; });
    return require('index')
}));
