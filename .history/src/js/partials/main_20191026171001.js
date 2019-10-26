$(document).ready(function() {


    function detectmob() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i) ||
            $( window ).width() < 1024
        ) {
            return true;
        } else {
            return false;
        }
    }

    if (detectmob()) {

        $('.scroll').on('click', function () {
            event.preventDefault();
            var el = $(this);
            var dest = el.attr('href');
            if (dest !== undefined && dest !== '') {
                $('body').removeClass('blocked');
                $('html,body').animate({
                        scrollTop: $(dest).offset().top
                    }, 500
                );
            }
            return false;
        });

    } else {
        $('#fullpage').fullpage({
            navigation: false,
            verticalCentered: false,
            scrollOverflow: true,
            scrollOverflowOptions: {
                scrollbars: false,
            },
            onLeave: function (origin, destination, direction) {
                if(destination.index == 0){
                    fullpage_toggle(true);
                }
                if(destination.index == 1){
                    fullpage_toggle(true);
                }
                if(destination.index == 2){
                    fullpage_toggle(false);
                    if (swiper.activeIndex == 0){
                        fullpage_toggle(true,'up');
                    }
                    if (swiper.isEnd){
                        fullpage_toggle(true,'down');
                    }
                }
                if(destination.index == 4){
                    fullpage_toggle(true);
                }
            }
        });

        function fullpage_toggle(toggle, direction) {
            $.fn.fullpage.setAllowScrolling(toggle, direction);
            $.fn.fullpage.setKeyboardScrolling(toggle, direction);
        }

        $('.scroll').on('click', function () {
            event.preventDefault();
            var el = $(this);
            var dest = el.data('slide');
            $.fn.fullpage.moveTo(dest);
            return false;
        });

    }



    var swiper = new Swiper('.swiper-container.articles', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        releaseOnEdges: true,
        touchReleaseOnEdges: true,
        mousewheel: {
            invert: false,
            releaseOnEdges:true,
        },
        on:{
            reachBeginning: function () {
                if (!detectmob()) {
                    setTimeout(function () {
                        fullpage_toggle(true,'up');
                    },100)
                }
            },
            reachEnd: function () {
                if (!detectmob()) {
                    setTimeout(function () {
                        fullpage_toggle(true,'down');
                    },100)
                }
            }
        }
    });

    swiper.on('slideChangeTransitionStart', function () {
        var cat = $('.swiper-slide-active').data('cat');
        if (!cat) cat = 1;
        var target = $('.tabs .tab[data-cat="'+cat+'"]');
        $(".button-prev").appendTo(target);
        $(".button-next").appendTo(target);
        $(".home").appendTo(target);
        $('.tabs .tab').removeClass('active');
        target.addClass('active');
        var first = $('.tabs .swiper-wrapper').offset().left;
        var second = target.offset().left;
        var distance = first - second;

        $( ".tabs .swiper-wrapper" ).animate({
            left: distance,
        }, 100);

        if (!detectmob()) {
            fullpage_toggle(false);
            if (swiper.activeIndex == 0) {
                setTimeout(function () {
                    fullpage_toggle(true, 'up');
                }, 100)
            } else {
                $.fn.fullpage.moveTo(3);
            }
        }

    });

    $('.tabs .tab span').click(function () {
        var target = $(this).parent();
        changeTab(target);
    });

    $('.button-prev').click(function () {
        if (!$(this).parent().is(':first-child')){
            var target = $(this).parent().prev();
            changeTab(target);
        }
    });

    $('.button-next').click(function () {
        if (!$(this).parent().is(':last-child')){
            var target = $(this).parent().next();
            changeTab(target);
        }
    });

    $('.home').click(function () {
        var cat = $(this).parent().data('cat');
        $('.articles').find('.swiper-slide[data-cat="'+cat+'"]').first().addClass('goTo');
        swiper.slideTo(getSlideIndexByClass('goTo'));
    });


    $(".tabs .swiper-wrapper").swipe( {
        swipe:function(event, direction, distance, duration, fingerCount){
            if (direction == 'left') {
                if (!$(this).find('.tab.active').is(':last-child')){
                    var target = $(this).find('.tab.active').next();
                    changeTab(target);
                }
            }
            if (direction == 'right') {
                if (!$(this).find('.tab.active').is(':first-child')){
                    var target = $(this).find('.tab.active').prev();
                    changeTab(target);
                }
            }
        },
        triggerOnTouchEnd:false,
        threshold:150
    });

    function changeTab(target) {
        var cat = target.data('cat');
        $('.articles').find('.swiper-slide[data-cat="'+cat+'"]').first().addClass('goTo');
        if (!detectmob()) {
            swiper.slideTo(getSlideIndexByClass('goTo'));
        } else {
            swiper.slideTo(getSlideIndexByClass('goTo') - 1);
        }
        $(".button-prev").appendTo(target);
        $(".button-next").appendTo(target);
        $(".home").appendTo(target);
        $('.tabs .tab').removeClass('active');
        target.addClass('active');

        var first = $('.tabs .swiper-wrapper').offset().left;
        var second = target.offset().left;
        var distance = first - second;

        $( ".tabs .swiper-wrapper" ).animate({
            left: distance,
        }, 100);


        if($('.swiper-slide.tab.active').index()){

        }

        console.log($('.swiper-slide.tab.active').index()+' '+ ($('.swiper-slide.tab').length - 1));
    }

    function getSlideIndexByClass(className) {
        var index2 = 0;
        $.each($('.articles .swiper-wrapper').children(), function(i, item) {
            if ($(item).hasClass(className)) {
                index = i;
                $(item).removeClass('goTo');
                return false;
            }
        });
        return index;
    }






    var ps;
    $('.articles .right').hover(function () {
        if (ps) ps.destroy();
        ps = new PerfectScrollbar(this, {
            wheelPropagation : true,
            swipeEasing: true,
            suppressScrollX: true
        });
    },function () {
        if (ps) ps.destroy();
        ps = null;
    });



    $('.articles .item:not(.video-block)').click(function () {
       if ($( window ).width() < 1024){
           $('.fancy-block').html($(this).find('.right').html());

           $.fancybox.open({
               src  : $('.fancy-block'),
               type : 'inline',
               animationEffect: "zoom-in-out",
           });
       }
    });



});

currentQuestion = 1;
isImg = 0;
countQuestions = 1;
quests = '';

otvet1 = 0;
otvet2 = 0;

$.getJSON('test.json', function(data) {
    quests = data;
    countQuestions = quests.test.length;
    $('#total').html(countQuestions);
    $('#current').html(currentQuestion);

    var left = quests.test[0].left[0];
    var right = quests.test[0].right[0];
    var img  = quests.test[0].image;
    $('#left').html(left.label).parent().data('value',left.value).data('img',img);
    $('#right').html(right.label).parent().data('value',right.value).data('img',img);

    if (img != "") {
        isImg = 1;
    }
});

$('.test-main .left, .test-main .right').hover(function () {
    if (isImg == 1){
        var value = $(this).data('value');
        var img = $(this).data('img');
        $('.test-main .img-block .'+img+'[data-value="'+value+'"]').addClass('hover');
    }
},function() {
    $('.test-main .img-block img').removeClass('hover');
});

testResults = [];

$('.test-main .left, .test-main .right').click(function () {
    var value = $(this).data('value');
    if (isImg == 1){
        var img = $(this).data('img');
        $('.test-main .img-block .'+img+'[data-value="'+value+'"]').addClass('active');
    }
    if (value == 1){
        otvet1++;
        testResults.push(value);
    } else {
        otvet2++;
        testResults.push(value);
    }
    nextQuest();
});


function nextQuest() {
    isImg = 0;
    currentQuestion++;
    if (currentQuestion <= countQuestions){
        $('#current').html(currentQuestion);
        var left = quests.test[currentQuestion-1].left[0];
        var right = quests.test[currentQuestion-1].right[0];
        var img  = quests.test[currentQuestion-1].image;
        $('#left').html(left.label).parent().data('value',left.value).data('img',img);
        $('#right').html(right.label).parent().data('value',right.value).data('img',img);

        if (img != "") {
            isImg = 1;
        }
    } else {
        $('.results .img-block').html($('.test-main .img-block').html());
        if (otvet1 > otvet2){
            $('.results1').show();
        } else {
            $('.results2').show();
        }
        $('.test').fadeOut(500,function() {
            $('.results').fadeIn(500,function(){
                $.fn.fullpage.reBuild();
            });
        });

        //отправка данных
        var resultSend = JSON.stringify( testResults );
        $.ajax({
            type: "POST",
            url: "/save_collage/",
            data: { ansver : resultSend },
            success: function(data) {
                var parse = JSON.parse(data);
                results = parse.share;
                $('.results .social').attr('data-url', results[0].url);
                $('.results .social').attr('data-image', results[0].image);
                $('.results .social').attr('data-title', results[0].title);
                $('.results .social').attr('data-description', results[0].description);
            }
        });
    }
}
