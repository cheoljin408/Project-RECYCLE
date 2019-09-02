function innerLoading() {
  $('.spinner-border').css('display', 'inline-block');
  setTimeout(function() {
    $('.spinner-border').css('display', 'none');
  }, 1000);
}

//infinite scroll
var page = 0;
$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height() && item_len != 0) {
    innerLoading();
    var cateObj = category();
    page += 10;
    getData(cateObj.buy, cateObj.theme, cateObj.region, cateObj.low_price, cateObj.high_price, page, $(window).scrollTop());
  }
});

// like buttons
function likeClick(i) {
  var image = document.getElementById(`like${i}`);
  if (image.src.match("/images/like.png")) {
    image.src = "/images/like-red.png";
    image.style.animationName = "like_big";
    image.style.animationDuration = "0.4s";
    image.style.animationTimingFunction = "linear";
    image.style.animationDelay = "0s";
    image.style.animationIterationCount = "1";
    image.style.animationDirection = "normal";
    image.style.animationFillMode = "forwards";
    image.style.animationPlayState = "running";
  } else {
    image.src = "/images/like.png";
    image.style.animation = "";
  }
}


/*
//masonry rental vs buy
  if ($(`#state_${i}`).text() == "렌탈") {
    $(`#state1_${i}`).css("background-color", "#7fcacb");
    $(`#state1_${i}`).css("color", "white");
    $(`#state1_${i}`).css("padding", "5.5px");
    $(`#state2_${i}`).css("border-style", "solid");
    $(`#state2_${i}`).css("border-color", "#7fcacb");
    $(`#state2_${i}`).css("border-width", "0.5px");
    $(`#state2_${i}`).css("background-color", "white");
    $(`#state2_${i}`).css("color", "#7fcacb");
  } else {
    $(`#state1_${i}`).css("background-color", "white");
    $(`#state1_${i}`).css("color", "#7fcacb");
    $(`#state1_${i}`).css("border-style", "solid");
    $(`#state1_${i}`).css("border-color", "#7fcacb");
    $(`#state1_${i}`).css("border-width", "0.5px");
    $(`#state2_${i}`).css("padding", "5.5px");
    $(`#state2_${i}`).css("background-color", "#7fcacb");
    $(`#state2_${i}`).css("color", "white");
  }
  */


// 카테고리 값들을 얻어옴
function category() {
  var buy, low_price, high_price;
  var theme = new Array();
  var region = new Array();

  // 1. 상태 얻어오기
  if ($.trim($('.buy').find(".active").text()) == "") {
    buy = 'ALL';
  } else {
    buy = $.trim($('.buy').find(".active").text());
  }


  // 2. 가격 얻어오기
  if ($('#low_price').val() != "" && $('#high_price').val() != "") {
    low_price = $('#low_price').val();
    high_price = $('#high_price').val();
  } else {
    low_price = 'ALL';
    high_price = 'ALL';
  }

  // 3. 테마 얻어오기
  var count = 0;
  for (var i = 0; i < $('.thema').find('button').length; i++) {
    if ($('.thema').find('button')[i]['style'].borderColor == 'black') {
      theme[count] = $('.thema').find('button')[i].outerText;
      count++;
    }
  }
  if (count === 0) {
    theme = 'ALL';
  }


  // 4. 지역 얻어오기
  count = 0;
  for (var i = 0; i < $('.region').find('button').length; i++) {
    if ($('.region').find('button')[i]['style'].borderColor == 'black') {
      region[count] = $('.region').find('button')[i].outerText;
      count++;
    }
  }
  if (count === 0) {
    region = 'ALL';
  }

  return {
    buy: buy,
    low_price: low_price,
    high_price: high_price,
    theme: theme,
    region: region
  }
}

//서버에 데이터 보내고 받음
var html = "";
var item_len;
function getData(buy, theme, region, low_price, high_price, page, scroll) {
  $.ajax({
    type: 'post',
    url: '/find',
    async: true,
    data: {
      buy: buy,
      theme: theme,
      region: region,
      low_price: low_price,
      high_price: high_price,
      page: page
    },
    success: function(data) {
      //카테고리 찾기 버튼 눌렀을 때는 html reset
      if (scroll == 0) {
        html = "";
      }

      var len = data.length;

      //상품이 있을 때 ===================
      if (len != 0) {
        item_len = 1;
        $('#noneItem').css('display', 'none');
        $('#masonry_container').remove();
        $('.section2 > .container').append(`<div id="masonry_container" class='masonry' style="margin:0 auto;"></div>`);

        for (var i = 0; i < len; i++) {
          var id = data[i]['id'];
          var category = data[i]['category'];
          var local = data[i]['local'];
          var state = data[i]['state'];
          var title = data[i]['title'];
          var user = data[i]['user'];
          var price = data[i]['price'];
          var img = data[i]['img'];
          var plus = `<div class="paper" id="${id}">
                              <div class="paper-holder">
                                <a><img width="225" src="${img}" /></a>
                              </div>
                              <div class="paper-description">
                                <p id='title'>${title}</p>
                                <p id="userId">${user}</p>
                              </div>
                              <div class="paper-content">
                                <span id="price">${price}원</span>
                                <span class="paper-state">
                                  <input class="state${i}" style="display:none" value="${state}"/>
                                  <span class="rental">렌탈</span>
                                  <span class="buy">판매</span>
                                </span>
                              </div>
                              <div class="paper-info">
                                <span id="like"><img id="like${i}" onclick="likeClick(${i})"src="/images/like.png">127</span>
                                <span id="views"><img src="/images/views.png">302</span>
                              </div>
                            </div>`;
          html += plus;



        }

        //무한스크롤하면 container 없앴다가
        $('.section2 > .container').css('display', 'none');
        document.getElementById('masonry_container').innerHTML = html;

        // masonry input
        setTimeout(function() {
          // 무한스크롤 끝나면 다시 생김
          $('.section2 > .container').css('display', 'block');
          $('#masonry_container').masonry({
            itemSelector: '.paper',
            columnWidth: 285,
            isAnimated: true,
            isFitWidth: true
          });
        }, 1000);

        // rental vs sell
        // if($('this').find('.state').text() == '렌탈'){
        //   $('.rental').attr('id','state_check');
        //   $('.buy').attr('id','state_uncheck');
        // }
        //$('.state ~ .rental').attr('id','state_check');
        //console.log($('.state').get());


        for(var i =0 ; i<10;i++)
        {
          if($('state').val() == '렌탈')
          {
            $('this ~ .rental').attr('id','state_check');
            $('this ~ .buy').attr('id','state_uncheck');
          }
        }

      }
      //=========================================


      // 상품 없을 때 ===================
      else if(len==0 && html == "") {
        item_len = 0;
        $('#masonry_container').remove();
        $('#noneItem').css('display', 'block');
      }
      //=========================================


      // scroll 위치 기억
      setTimeout(function() {
        $('html').animate({
          scrollTop: scroll
        }, 0);
      }, 1000);


      //상품 클릭하면 상세 페이지로 이동
      $(".paper").click(function() {
        item_len = 1;
        console.log($(this).attr('id'));
        var postid = $(this).attr('id');
        console.log(postid);
        document.location.href = `/find-ex?id=${postid}`;
      });
    }

  });
}

// init 작업
getData('ALL', 'ALL', 'ALL', 'ALL', 'ALL', 0, 0);

//클릭시 카테고리 값 얻고, 서버 통신
$('#find').click(function() {
  page = 0;
  var cateObj = category();
  getData(cateObj.buy, cateObj.theme, cateObj.region, cateObj.low_price, cateObj.high_price, 0, 0);
});

//category - theme, region
$('.row button').click(function() {
  if ($(this).css("color") == "rgb(215, 222, 222)") {
    $(this).css("color", "black");
    $(this).css("border", "1px black solid");
  } else {
    $(this).css("color", "#d7dede");
    $(this).css("border", "1px #d7dede solid");
  }
});

//category - reset
$("#reset").click(function() {
  document.location.href = `/find`;
});


//top buttons
$(".top").click(function() {
  $('html').animate({
    scrollTop: 0
  }, 600);
});

$(window).scroll(function() {
  if ($(this).scrollTop() > 500) {
    $('.top').css("bottom", "20px");
    $('.top').css("transition-duration", "0.5s");
  } else {
    $('.top').css("bottom", "-45px");
  }
});

$('.top').find('img').hover(function() {
  $('#top_img').attr("src", "/images/top2.png");

  $('.top').find('img').css("animationName", "top_big");
  $('.top').find('img').css("animationDuration", "0.4s");
  $('.top').find('img').css("animationTimingFunction", "linear");
}, function() {
  $('#top_img').attr("src", "/images/top.png");
  $('.top').find('img').css("animation", "");
});
