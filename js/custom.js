jQuery(document).ready(function ($) {

    // Preloader
    $(window).on('load', function () {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
    });

    // Hero rotating texts
    $("#hero .rotating").Morphext({
        animation: "flipInX",
        separator: ",",
        speed: 3000
    });

    // Initiate the wowjs
    new WOW().init();

    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: {opacity: 'show'},
        speed: 400
    });

    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({id: 'mobile-nav'});
        $mobile_nav.find('> ul').attr({'class': '', 'id': ''});
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function (e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function (e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function (e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    // Stick the header at top on scroll
    $("#header").sticky({topSpacing: 0, zIndex: '50'});

    // Smoth scroll on page hash links
    $('a[href*="#"]:not([href="#"])').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {

                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }

                return false;
            }
        }
    });

    // Back to top button
    $(window).scroll(function () {

        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }

    });

    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

});


(function ($) {
    'use strict';

    // VARS

    var $window = $(window);
    var windowHeight = getViewPortHeight();
    var portfolioGrid = $('#portfolio-grid-container');

    /*----------------------------------------------------*/
    /* MOBILE DETECT FUNCTIONS
     /*----------------------------------------------------*/
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);

        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    /*----------------------------------------------------*/
    /*  One Page Portfolio Section
     /*----------------------------------------------------*/

    /*********************************
     init cubeportfolio
     *********************************/

    portfolioGrid.cubeportfolio({
        filters: '#filters-container',
        loadMore: '#loadMore-container',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        rewindNav: true,
        scrollByPage: false,
        defaultFilter: '*',
        animationType: portfolioGrid.data('animationtype'),
        gapHorizontal: portfolioGrid.data('gaphorizontal'),
        gapVertical: portfolioGrid.data('gapvertical'),
        gridAdjustment: 'responsive',
        mediaQueries: [{
                width: 1100,
                cols: 3
            }, {
                width: 800,
                cols: 2
            }, {
                width: 500,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
        caption: portfolioGrid.data('caption'),
        displayType: 'lazyLoading',
        displayTypeSpeed: 100,
        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        //lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        // singlePage popup
        singlePageDelegate: '.cbp-singlePage',
        singlePageDeeplinking: true,
        singlePageStickyNavigation: true,
        //singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
        singlePageCallback: function (url, element) {
            // to update singlePage content use the following method: this.updateSinglePage(yourContent)
            var t = this;

            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                timeout: 10000
            })
                    .done(function (result) {
                        t.updateSinglePage(result);
                        if ($('.cbp-popup-navigation-wrap').find('.cube-header-logo').length == 0) {
                            $('.cbp-popup-navigation-wrap').prepend('<div class="cube-header-logo hidden-xs"> <img alt="logo" src=' + portfolioGrid.data('logo') + ' class="img-responsive"></div>');
                        }
                    })
                    .fail(function () {
                        t.updateSinglePage('AJAX Error! Please refresh the page!');
                    });
        },
    });

    /*********************************
     add listener for load more
     *********************************/
    $('.cbp-l-loadMore-button-link').on('click.cbp', function (e) {
        e.preventDefault();
        var clicks, me = $(this), oMsg;

        if (me.hasClass('cbp-l-loadMore-button-stop')) {
            return;
        }

        // get the number of times the loadMore link has been clicked
        clicks = $.data(this, 'numberOfClicks');
        clicks = (clicks) ? ++clicks : 1;
        $.data(this, 'numberOfClicks', clicks);

        // set loading status
        oMsg = me.text();
        me.text('LOADING...');

        // perform ajax request
        $.ajax({
            url: me.attr('href'),
            type: 'GET',
            dataType: 'HTML'
        }).done(function (result) {
            var items, itemsNext;

            // find current container
            items = $(result).filter(function () {
                return $(this).is('div' + '.cbp-loadMore-block' + clicks);
            });

            portfolioGrid.cubeportfolio('appendItems', items.html(),
                    function () {
                        // put the original message back
                        me.text(oMsg);

                        // check if we have more works
                        itemsNext = $(result).filter(function () {
                            return $(this).is('div' + '.cbp-loadMore-block' + (clicks + 1));
                        });

                        if (itemsNext.length === 0) {
                            me.text('NO MORE WORKS');
                            me.addClass('cbp-l-loadMore-button-stop');
                        }

                    });

        }).fail(function () {
            // error
        });

    });

    function getViewPortHeight() {
        //detech ios chrome
        if (navigator.userAgent.match('CriOS')) {
            return window.innerHeight;
        }

        return $window.height();
    }

    $.fn.parallax = function (xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;
        //get the starting position of each element to have parallax applied to it
        function update() {

            $this.each(function () {

                firstTop = $this.offset().top;
            });
            if (outerHeight) {
                getHeight = function (jqo) {
                    return jqo.outerHeight(true);
                };
            } else {
                getHeight = function (jqo) {
                    return jqo.height();
                };
            }

            // setup defaults if arguments aren't specified
            if (arguments.length < 1 || xpos === null)
                xpos = "50%";
            if (arguments.length < 2 || speedFactor === null)
                speedFactor = 0.5;
            if (arguments.length < 3 || outerHeight === null)
                outerHeight = true;
            // function to be called whenever the window is scrolled or resized

            var pos = $window.scrollTop();
            $this.each(function () {
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);
                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }

                $this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
            });
        }

        $window.on('scroll', update).resize(update);
        update();
    };

})(jQuery);
