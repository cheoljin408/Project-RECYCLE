//infinite scroll
var page = 0;
$(window).scroll(function() {
  if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    var cateObj = category();
    page += 10;
    getPlusData(cateObj.buy, cateObj.theme, cateObj.region, cateObj.low_price, cateObj.high_price, page, $(window).scrollTop());
  }
});

// like buttons
function likeClick(id) {
  var image = document.getElementById(`like${id}`);
  
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


  if(image.src.match("/images/like-red.png"))
  {
    $.ajax({
      type:'POST',
      url:'/like_plus',
      data:{
        postID:id
      },
      success: function(data) {
        $(`#like${id}`).siblings().remove();
        $(`#like_${id}`).append(`<span id="like-text">${data[0]['article_like']}</span>`);
      }
    });
  }
  else if(image.src.match("/images/like.png"))
  {
    $.ajax({
      type:'POST',
      url:'/like_minus',
      data:{
        postID:id
      }
    });
  }
}


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
function getData(buy, theme, region, low_price, high_price, page, scroll) {
  $.ajax({
    type: 'post',
    url: '/find',
    async: false,
    data: {
      buy: buy,
      theme: theme,
      region: region,
      low_price: low_price,
      high_price: high_price,
      page: page
    },
    success: function(data) {
      var len = data.length;
      var html = "";

      $('#masonry_container').remove();
      $('.section2 > .container').append(`<div id="masonry_container" class='masonry' style="margin:0 auto;"></div>`);

      //상품이 있을 때 ===================
      if (len != 0) {
        $('#noneItem').css('display', 'none');

        for (var i = 0; i < len; i++) {
          var id = data[i]['id'];
          var category = data[i]['category'];
          var local = data[i]['local'];
          var state = data[i]['state'];
          var title = data[i]['title'];
          var user = data[i]['user'];
          var price = data[i]['price'];
          var img = data[i]['img'];
          var like = data[i]['article_like'];
          var view = data[i]['article_view'];

          var plus = `<div class="paper" >
                              <div class="paper-holder" id="${id}">
                                <a><img width="225" src="${img}" /></a>
                              </div>
                              <div class="paper-description">
                                <p id='title'>${title}</p>
                                <p id="userId">${user}</p>
                              </div>
                              <div class="paper-content">
                                <span id="price">${price}원</span>
                                <span class="paper-state">
                                  <input class="state" style="display:none" value="${state}"/>
                                  <span class="rental">렌탈</span>
                                  <span class="buy">판매</span>
                                </span>
                              </div>
                              <div class="paper-info">
                                <span class="like" id="like_${id}">
                                  <img id="like${id}" onclick="likeClick(${id})" src="/images/like.png">
                                  <span id="like-text">${like}</span>
                                </span>
                                <span id="views"><img src="/images/views.png">${view}</span>
                              </div>
                            </div>`;
          html += plus;
        }

        document.getElementById('masonry_container').innerHTML = html;

        // masonry input
        setTimeout(function() {
          $('#masonry_container').masonry({
            itemSelector: '.paper',
            columnWidth: 285,
            isAnimated: true,
            isFitWidth: true
          });
        }, 300);

        // rental vs buy - css
        setTimeout(function() {
          $('.state').each(function(i, e) {
            if ($(this).val() == '렌탈') {
              $(this).siblings(`.rental`).attr('id', 'state_check');
              $(this).siblings(`.buy`).attr('id', 'state_uncheck');
            } else {
              $(this).siblings(`.buy`).attr('id', 'state_check');
              $(this).siblings(`.rental`).attr('id', 'state_uncheck');
            }
          });
        }, 300);

      }
      //=========================================


      // 상품 없을 때 ===================
      else if (len == 0) {
        $('#noneItem').css('display', 'block');
      }
      //=========================================


      //상품 클릭하면 상세 페이지로 이동
      $(".paper-holder").click(function() {
        console.log($(this).attr('id'));
        var postid = $(this).attr('id');
        console.log(postid);
        document.location.href = `/find-ex?id=${postid}`;
      });
    }

  });
}

function getPlusData(buy, theme, region, low_price, high_price, page, scroll) {
  $.ajax({
    type: 'post',
    url: '/find',
    async: false,
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
      var html = "";
      //상품이 있을 때 ===================
      if (len != 0) {
        $('#noneItem').css('display', 'none');

        for (var i = 0; i < len; i++) {
          var id = data[i]['id'];
          var category = data[i]['category'];
          var local = data[i]['local'];
          var state = data[i]['state'];
          var title = data[i]['title'];
          var user = data[i]['user'];
          var price = data[i]['price'];
          var img = data[i]['img'];
          var like = data[i]['article_like'];
          var view = data[i]['article_view'];

          var plus = `<div class="paper">
                              <div class="paper-holder" id="${id}">
                                <a><img width="225" src="${img}" /></a>
                              </div>
                              <div class="paper-description">
                                <p id='title'>${title}</p>
                                <p id="userId">${user}</p>
                              </div>
                              <div class="paper-content">
                                <span id="price">${price}원</span>
                                <span class="paper-state">
                                  <input class="state" style="display:none" value="${state}"/>
                                  <span class="rental">렌탈</span>
                                  <span class="buy">판매</span>
                                </span>
                              </div>
                              <div class="paper-info">
                                <span class="like" id="like_${id}">
                                  <img id="like${id}" onclick="likeClick(${id})" src="/images/like.png">
                                  <span id="like-text">${like}</span>
                                  
                                </span>
                                <span id="views"><img src="/images/views.png">${view}</span>
                              </div>
                            </div>`;
          html += plus;
        }
        var $items = $(html);
        $(`#masonry_container`).append($items).masonry('appended', $items);

        // masonry input
        setTimeout(function() {
          $('#masonry_container').masonry({
            itemSelector: '.paper',
            columnWidth: 285,
            isAnimated: true,
            isFitWidth: true
          });
        }, 300);

        // rental vs buy - css
        setTimeout(function() {
          $('.state').each(function(i, e) {
            if ($(this).val() == '렌탈') {
              $(this).siblings(`.rental`).attr('id', 'state_check');
              $(this).siblings(`.buy`).attr('id', 'state_uncheck');
            } else {
              $(this).siblings(`.buy`).attr('id', 'state_check');
              $(this).siblings(`.rental`).attr('id', 'state_uncheck');
            }
          });
        }, 300);
      }
      //=========================================


      //상품 클릭하면 상세 페이지로 이동
      $(".paper-holder").click(function() {
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

//카테고리 찾기 클릭시 카테고리 값 얻고, 서버 통신
$('#find').click(function() {
  //$('#masonry_container').masonry( 'remove', $('.paper') );
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


//top buttons ======================================
$(".top").click(function() {
  $('html').animate({
    scrollTop: 0
  }, 600);
});

$(window).scroll(function() {
  if ($(this).scrollTop() > 500) {
    $('.top').css("bottom", "30px");
    $('.top').css("transition-duration", "0.5s");
  } else {
    $('.top').css("bottom", "-70px");
  }
});

$('.top').find('img').hover(function() {
  $('#top_img').attr("src", "/images/top2.png");

  $('.top').find('img').css("animationName", "top_big");
  $('.top').find('img').css("animationDuration", "0.6s");
  $('.top').find('img').css("animationTimingFunction", "linear");
}, function() {
  $('#top_img').attr("src", "/images/top.png");
  $('.top').find('img').css("animation", "");
});
//=================================================================
