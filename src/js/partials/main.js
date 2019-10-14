$(document).ready(function() {
    startInterval();
    //http://special2.woman.ru/mig/get_motivation.php
    $.getJSON('get_motivation.json', function(data) {
        $('.mig-circle .text').html(data.motivation);
    });

    //http://special2.woman.ru/mig/situations.php
    $.getJSON('situations.json', function(data) {
        countQuestions = data.situations.length;
        $.each(data.situations, function( index, value ) {
            $('.test__cards').prepend('<div class="test__card test-card"><div class="test__number"><span class="num_cur">'+(index+1)+'</span>/<span class="num_max">'+countQuestions+'</span></div><div class="card__pic"><img src="'+value.image+'" alt=""></div><div class="card__text">'+value.text+'</div></div>');
        });
        $('.test__cards .test__card:last-child').addClass('current');

        let w = $(window).width();
        let k = w > 1024 ? 100 : 60;

        $('.test__card').drags({
            z_index: 1,
            cursor: 'pointer',
            filterDrag: function(obj) {
                return obj.filter('.current');
            },
            onStart: function(obj) {
                let start = Math.round(obj.position().left);
                obj.data('start',start);
                obj.data('left',start);
            },
            onMove: function(obj,e) {
                let left = Math.round(obj.position().left);
                obj.data('left', left);
                let pos = left - obj.data('start');
                let offs = pos /w * k;
                obj.css('transform','rotate('+offs+'deg) scale('+
                    (1 -Math.abs(offs/100))+')');
                if (Math.abs(pos) > 40) {
                    curAnswer = pos < 0 ? 1 : 2;
                    if (pos > 0){
                        $('.test__button.left').removeClass('current');
                        $('.test__button.right').addClass('current');
                    } else {
                        $('.test__button.left').addClass('current');
                        $('.test__button.right').removeClass('current');
                    }
                }

                resetInterval();
            },
            onDrop: function (obj,e) {
                let res = obj.data('left') - obj.data('start');
                if (Math.abs(res) > 40) {
                    selectAnswer(res  > 0);
                    nextQuest(obj);
                }
                obj.css({top:'', left: ''});
                obj.css('transform','');
                $('.test__button').removeClass('current');
                resetInterval();
            }
        });
    });

    $.getJSON('results.json', function(data) {
        results = data.results;
        $('.question').html(results[0].text);
        $('.smile .text').html(results[0].procent+'%');
    });
});


wow = new WOW({
    mobile: false
});
wow.init();


var counter = 0;
var timer = null;

function tictac(){
    counter++;
    if (counter == 5){
        $.getJSON('get_motivation.json', function(data) {
            $('.mig-circle .text').html(data.motivation);
        });
        $('.mig-circle').addClass('active');
    }
}

function resetInterval(){
    $('.mig-circle').removeClass('active');
    clearInterval(timer);
    counter=0;
    timer= setInterval("tictac()", 1000);
}
function startInterval(){
    if (!timer){
        timer= setInterval("tictac()", 1000);
    }
}
function stopInterval(){
    clearInterval(timer);
}


resultNumber = 0;
testResults = [];
curNumber = 0;
procent = 0;

$('.test__button.left').click(function () {
    selectAnswer(false);
    var item = $('.test__card.current');
    nextQuest(item);
    item.css({top:'', left: ''});
    item.css('transform','');
    $('.test__button').removeClass('current');
    resetInterval();
});

$('.test__button.right').click(function () {
    selectAnswer(true);
    var item = $('.test__card.current');
    nextQuest(item);
    item.css({top:'', left: ''});
    item.css('transform','');
    $('.test__button').removeClass('current');
    resetInterval();
});


function selectAnswer(res){
    if (res) {
        resultNumber++;
        if (resultNumber > 20) resultNumber = 20;

        testResults.push(1);
    } else {
        testResults.push(0);
    }
    if (curNumber === countQuestions-1) testEnd(procent.toFixed());
    else curNumber++;
}

function nextQuest(obj) {
    obj.remove();
    $('.test__cards .test__card:last-child').addClass('current');
}

function testEnd(procent) {
    stopInterval();
    var status = '';
    var dataUrl = '';
    var dataTitle = '';
    var dataImage="https://bolitgolova.wday.ru/images/share.jpg";
    if (procent > 66){
        status = 'result-3';
        dataTitle = "У меня " + $('.title-3').html().toLowerCase();
        dataUrl = "https://bolitgolova.wday.ru/share/3/";
    } else if (procent > 33){
        status = 'result-2';
        dataTitle = "У меня " + $('.title-2').html().toLowerCase();
        dataUrl = "https://bolitgolova.wday.ru/share/2/";
    } else{
        status = 'result-1';
        dataTitle = "У меня " + $('.title-1').html().toLowerCase();
        dataUrl = "https://bolitgolova.wday.ru/share/1/";
    }
    $('.section-2').slideUp(300,function () {
        $('.section-result .border-block').addClass(status);
        $('.section-result').slideDown(300);
        $('.section-result .share .flex-block').attr('data-url', dataUrl);
        $('.section-result .share .flex-block').attr('data-title', dataTitle);
        $('.section-result .share .flex-block').attr('data-image', dataImage);
    });

    //отправка данных
    var resultSend = JSON.stringify( testResults );
    $.ajax({
        type: "POST",
        //url: "lihk_to_result.php",
        url: "http://localhost/results.php",
        data: { ansver : resultSend },
        success: function(data) {
            var parse = JSON.parse(data);
            results = parse.results;
            $('.question').html(results[0].text);
            $('.smile .text').html(results[0].procent+'%');
        }
    });
}



$('.line-block').on('mousemove',function (e) {
    offset = $(this).offset();

    cursor = (e.pageX - offset.left);
    width = $(this).outerWidth();
    percent = cursor / width * 100 - 4.2417559;


    let w = $(window).width();
    if (w > 1024){
        if (percent > 89.6) {
            percent = 89.6;
        } else if (percent < -0.15){
            percent = -0.15;
        }

        $('.smile').removeClassWild("status_*");
        if (percent > 72.8){
            $('.smile').addClass('status_5');
        } else if (percent > 53.4){
            $('.smile').addClass('status_4');
        } else if (percent > 34.6){
            $('.smile').addClass('status_3');
        } else if (percent > 15){
            $('.smile').addClass('status_2');
        }

        $('.smile').css({'left':percent+'%'});

        if (percent > 87.6){
            $('.question').html(results[19].text);
            $('.smile .text').html(results[19].procent+'%');
        } else if (percent > 83.4){
            $('.question').html(results[18].text);
            $('.smile .text').html(results[18].procent+'%');
        } else if (percent > 79.2){
            $('.question').html(results[17].text);
            $('.smile .text').html(results[17].procent+'%');
        } else if (percent > 75.2){
            $('.question').html(results[16].text);
            $('.smile .text').html(results[16].procent+'%');
        } else if (percent > 67.5){
            $('.question').html(results[15].text);
            $('.smile .text').html(results[15].procent+'%');
        } else if (percent > 63.5){
            $('.question').html(results[14].text);
            $('.smile .text').html(results[14].procent+'%');
        } else if (percent > 59.2){
            $('.question').html(results[13].text);
            $('.smile .text').html(results[13].procent+'%');
        } else if (percent > 55.1){
            $('.question').html(results[12].text);
            $('.smile .text').html(results[12].procent+'%');
        } else if (percent > 48.5){
            $('.question').html(results[11].text);
            $('.smile .text').html(results[11].procent+'%');
        } else if (percent > 44.45){
            $('.question').html(results[10].text);
            $('.smile .text').html(results[10].procent+'%');
        } else if (percent > 40.15){
            $('.question').html(results[9].text);
            $('.smile .text').html(results[9].procent+'%');
        } else if (percent > 36.1){
            $('.question').html(results[8].text);
            $('.smile .text').html(results[8].procent+'%');
        } else if (percent > 29.45){
            $('.question').html(results[7].text);
            $('.smile .text').html(results[7].procent+'%');
        } else if (percent > 25.3){
            $('.question').html(results[6].text);
            $('.smile .text').html(results[6].procent+'%');
        } else if (percent > 21.1){
            $('.question').html(results[5].text);
            $('.smile .text').html(results[5].procent+'%');
        } else if (percent > 17.05){
            $('.question').html(results[4].text);
            $('.smile .text').html(results[4].procent+'%');
        } else if (percent > 10.3){
            $('.question').html(results[3].text);
            $('.smile .text').html(results[3].procent+'%');
        } else if (percent > 6.2){
            $('.question').html(results[2].text);
            $('.smile .text').html(results[2].procent+'%');
        } else if (percent > 2.1){
            $('.question').html(results[1].text);
            $('.smile .text').html(results[1].procent+'%');
        } else {
            $('.question').html(results[0].text);
            $('.smile .text').html(results[0].procent+'%');
        }
    } else {
        if (percent > 87.3) {
            percent = 87.3;
        } else if (percent < -2.3){
            percent = -2.3;
        }

        $('.smile').removeClassWild("status_*");
        if (percent > 70.3){
            $('.smile').addClass('status_5');
        } else if (percent > 51.5){
            $('.smile').addClass('status_4');
        } else if (percent > 32.6){
            $('.smile').addClass('status_3');
        } else if (percent > 13.7){
            $('.smile').addClass('status_2');
        }

        $('.smile').css({'left':percent+'%'});


        if (percent > 85.3){
            $('.question').html(results[19].text);
            $('.smile .text').html(results[19].procent+'%');
        } else if (percent > 81.2){
            $('.question').html(results[18].text);
            $('.smile .text').html(results[18].procent+'%');
        } else if (percent > 77){
            $('.question').html(results[17].text);
            $('.smile .text').html(results[17].procent+'%');
        } else if (percent > 72.9){
            $('.question').html(results[16].text);
            $('.smile .text').html(results[16].procent+'%');
        } else if (percent > 65.3){
            $('.question').html(results[15].text);
            $('.smile .text').html(results[15].procent+'%');
        } else if (percent > 61.1){
            $('.question').html(results[14].text);
            $('.smile .text').html(results[14].procent+'%');
        } else if (percent > 57){
            $('.question').html(results[13].text);
            $('.smile .text').html(results[13].procent+'%');
        } else if (percent > 52.9){
            $('.question').html(results[12].text);
            $('.smile .text').html(results[12].procent+'%');
        } else if (percent > 46.3){
            $('.question').html(results[11].text);
            $('.smile .text').html(results[11].procent+'%');
        } else if (percent > 42.1){
            $('.question').html(results[10].text);
            $('.smile .text').html(results[10].procent+'%');
        } else if (percent > 38){
            $('.question').html(results[9].text);
            $('.smile .text').html(results[9].procent+'%');
        } else if (percent > 33.9){
            $('.question').html(results[8].text);
            $('.smile .text').html(results[8].procent+'%');
        } else if (percent > 27.2){
            $('.question').html(results[7].text);
            $('.smile .text').html(results[7].procent+'%');
        } else if (percent > 23.1){
            $('.question').html(results[6].text);
            $('.smile .text').html(results[6].procent+'%');
        } else if (percent > 19){
            $('.question').html(results[5].text);
            $('.smile .text').html(results[5].procent+'%');
        } else if (percent > 14.9){
            $('.question').html(results[4].text);
            $('.smile .text').html(results[4].procent+'%');
        } else if (percent > 8.15){
            $('.question').html(results[3].text);
            $('.smile .text').html(results[3].procent+'%');
        } else if (percent > 4.1){
            $('.question').html(results[2].text);
            $('.smile .text').html(results[2].procent+'%');
        } else if (percent > -0.1){
            $('.question').html(results[1].text);
            $('.smile .text').html(results[1].procent+'%');
        } else {
            $('.question').html(results[0].text);
            $('.smile .text').html(results[0].procent+'%');
        }
    }
});

$('.line-block').on('touchstart touchmove ',function (e) {
    var touch = e.touches[0];
    offset = $(this).offset();
    cursor = (touch.pageX - offset.left);
    width = $(this).outerWidth();
    percent = cursor / width * 100 - 4.2417559;


    let w = $(window).width();
    if (w > 1024){
        if (percent > 89.6) {
            percent = 89.6;
        } else if (percent < -0.15){
            percent = -0.15;
        }

        $('.smile').removeClassWild("status_*");
        if (percent > 72.8){
            $('.smile').addClass('status_5');
        } else if (percent > 53.4){
            $('.smile').addClass('status_4');
        } else if (percent > 34.6){
            $('.smile').addClass('status_3');
        } else if (percent > 15){
            $('.smile').addClass('status_2');
        } else {
            $('.smile').addClass('status_1');
        }

        $('.smile').css({'left':percent+'%'});

        if (percent > 87.6){
            $('.question').html(results[19].text);
            $('.smile .text').html(results[19].procent+'%');
        } else if (percent > 83.4){
            $('.question').html(results[18].text);
            $('.smile .text').html(results[18].procent+'%');
        } else if (percent > 79.2){
            $('.question').html(results[17].text);
            $('.smile .text').html(results[17].procent+'%');
        } else if (percent > 75.2){
            $('.question').html(results[16].text);
            $('.smile .text').html(results[16].procent+'%');
        } else if (percent > 67.5){
            $('.question').html(results[15].text);
            $('.smile .text').html(results[15].procent+'%');
        } else if (percent > 63.5){
            $('.question').html(results[14].text);
            $('.smile .text').html(results[14].procent+'%');
        } else if (percent > 59.2){
            $('.question').html(results[13].text);
            $('.smile .text').html(results[13].procent+'%');
        } else if (percent > 55.1){
            $('.question').html(results[12].text);
            $('.smile .text').html(results[12].procent+'%');
        } else if (percent > 48.5){
            $('.question').html(results[11].text);
            $('.smile .text').html(results[11].procent+'%');
        } else if (percent > 44.45){
            $('.question').html(results[10].text);
            $('.smile .text').html(results[10].procent+'%');
        } else if (percent > 40.15){
            $('.question').html(results[9].text);
            $('.smile .text').html(results[9].procent+'%');
        } else if (percent > 36.1){
            $('.question').html(results[8].text);
            $('.smile .text').html(results[8].procent+'%');
        } else if (percent > 29.45){
            $('.question').html(results[7].text);
            $('.smile .text').html(results[7].procent+'%');
        } else if (percent > 25.3){
            $('.question').html(results[6].text);
            $('.smile .text').html(results[6].procent+'%');
        } else if (percent > 21.1){
            $('.question').html(results[5].text);
            $('.smile .text').html(results[5].procent+'%');
        } else if (percent > 17.05){
            $('.question').html(results[4].text);
            $('.smile .text').html(results[4].procent+'%');
        } else if (percent > 10.3){
            $('.question').html(results[3].text);
            $('.smile .text').html(results[3].procent+'%');
        } else if (percent > 6.2){
            $('.question').html(results[2].text);
            $('.smile .text').html(results[2].procent+'%');
        } else if (percent > 2.1){
            $('.question').html(results[1].text);
            $('.smile .text').html(results[1].procent+'%');
        } else {
            $('.question').html(results[0].text);
            $('.smile .text').html(results[0].procent+'%');
        }
    } else {
        if (percent > 87.3) {
            percent = 87.3;
        } else if (percent < -2.3){
            percent = -2.3;
        }

        $('.smile').removeClassWild("status_*");
        if (percent > 70.3){
            $('.smile').addClass('status_5');
        } else if (percent > 51.5){
            $('.smile').addClass('status_4');
        } else if (percent > 32.6){
            $('.smile').addClass('status_3');
        } else if (percent > 13.7){
            $('.smile').addClass('status_2');
        } else {
            $('.smile').addClass('status_1');
        }

        $('.smile').css({'left':percent+'%'});


        if (percent > 85.3){
            $('.question').html(results[19].text);
            $('.smile .text').html(results[19].procent+'%');
        } else if (percent > 81.2){
            $('.question').html(results[18].text);
            $('.smile .text').html(results[18].procent+'%');
        } else if (percent > 77){
            $('.question').html(results[17].text);
            $('.smile .text').html(results[17].procent+'%');
        } else if (percent > 72.9){
            $('.question').html(results[16].text);
            $('.smile .text').html(results[16].procent+'%');
        } else if (percent > 65.3){
            $('.question').html(results[15].text);
            $('.smile .text').html(results[15].procent+'%');
        } else if (percent > 61.1){
            $('.question').html(results[14].text);
            $('.smile .text').html(results[14].procent+'%');
        } else if (percent > 57){
            $('.question').html(results[13].text);
            $('.smile .text').html(results[13].procent+'%');
        } else if (percent > 52.9){
            $('.question').html(results[12].text);
            $('.smile .text').html(results[12].procent+'%');
        } else if (percent > 46.3){
            $('.question').html(results[11].text);
            $('.smile .text').html(results[11].procent+'%');
        } else if (percent > 42.1){
            $('.question').html(results[10].text);
            $('.smile .text').html(results[10].procent+'%');
        } else if (percent > 38){
            $('.question').html(results[9].text);
            $('.smile .text').html(results[9].procent+'%');
        } else if (percent > 33.9){
            $('.question').html(results[8].text);
            $('.smile .text').html(results[8].procent+'%');
        } else if (percent > 27.2){
            $('.question').html(results[7].text);
            $('.smile .text').html(results[7].procent+'%');
        } else if (percent > 23.1){
            $('.question').html(results[6].text);
            $('.smile .text').html(results[6].procent+'%');
        } else if (percent > 19){
            $('.question').html(results[5].text);
            $('.smile .text').html(results[5].procent+'%');
        } else if (percent > 14.9){
            $('.question').html(results[4].text);
            $('.smile .text').html(results[4].procent+'%');
        } else if (percent > 8.15){
            $('.question').html(results[3].text);
            $('.smile .text').html(results[3].procent+'%');
        } else if (percent > 4.1){
            $('.question').html(results[2].text);
            $('.smile .text').html(results[2].procent+'%');
        } else if (percent > -0.1){
            $('.question').html(results[1].text);
            $('.smile .text').html(results[1].procent+'%');
        } else {
            $('.question').html(results[0].text);
            $('.smile .text').html(results[0].procent+'%');
        }
    }

});

$('.border-block').mouseleave(function (e) {
    $('.smile').removeAttr( 'style' ).removeClassWild("status_*");
    $('.question').html(results[0].text);
    $('.smile .text').html(results[0].procent+'%');
});



(function($) {
    $.fn.removeClassWild = function(mask) {
        return this.removeClass(function(index, cls) {
            var re = mask.replace(/\*/g, '\\S+');
            return (cls.match(new RegExp('\\b' + re + '', 'g')) || []).join(' ');
        });
    };
})(jQuery);


