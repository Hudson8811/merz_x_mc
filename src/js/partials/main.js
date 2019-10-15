$(document).ready(function() {
    var swiper = new Swiper('.swiper-container.articles', {
        slidesPerView: 'auto',
        spaceBetween: 0
    });


    $('.scroll').on('click', function () {
        var el = $(this);
        var dest = el.attr('href'); // получаем направление
        if (dest !== undefined && dest !== '') { // проверяем существование
            $('body').removeClass('blocked');
            $('html').animate({
                    scrollTop: $(dest).offset().top // прокручиваем страницу к требуемому элементу
                }, 500 // скорость прокрутки
            );
        }
        return false;
    });


    var ps;


    $('.articles .right').hover(function () {
        if (ps) ps.destroy();
        ps = new PerfectScrollbar(this, {
            wheelPropagation : false,
            swipeEasing: true,
            suppressScrollX: true
        });
    },function () {
        if (ps) ps.destroy();
        ps = null;
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

$('.test-main .left, .test-main .right').click(function () {
    var value = $(this).data('value');
    if (isImg == 1){
        var img = $(this).data('img');
        $('.test-main .img-block .'+img+'[data-value="'+value+'"]').addClass('active');
    }
    if (value == 1){
        otvet1++;
    } else {
        otvet2++;
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
        $('.test').slideUp();
        if (otvet1 > otvet2){
            $('.results1').show();
        } else {
            $('.results2').show();
        }
        $('.results').slideDown();
    }
}