var buy, low_price, high_price;
var theme = new Array();
var region = new Array();

// 카테고리 값들을 얻어옴
function category(){
  // 1. 상태 얻어오기
  if($.trim($('.buy').find(".active").text())==""){
    buy = 'ALL';
  }
  else{
    buy = $.trim($('.buy').find(".active").text());
  }


  // 2. 가격 얻어오기
  if($('#low_price').val() != "" && $('#high_price').val() != ""){
    low_price = $('#low_price').val();
    high_price = $('#high_price').val();
  }
  else{
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



  // 4. 지역 얻어오기
  count = 0;
  for (var i = 0; i < $('.region').find('button').length; i++) {
    if ($('.region').find('button')[i]['style'].borderColor == 'black') {
      region[count] = $('.region').find('button')[i].outerText;
      count++;
    }
  }

}
//서버에 데이터 보내고 받음
function getData(buy, theme, region, low_price, high_price) {
  console.log('client 테마 = ' + theme);
  console.log('client 지역 = ' + region);
  console.log('client 상태 = ' + buy);
  console.log('client 가격 = ' + low_price);

  $.ajax({
    type: 'post',
    url: '/find',
    async: false,
    data: {
      buy: buy,
      theme: theme,
      region: region,
      low_price: low_price,
      high_price: high_price
    },
    success: function(data) {
      console.log(data);


      
      $('.masonry').append('<script src="/javascripts/jquery.masonry.min.js"></script>');
  
      $('#masonry_container').detach();
      $('.section2 > .container').append(`<div id="masonry_container" class='masonry' style="margin:0 auto;"></div>`);


      var html = "";
      if (data != null) {
        var len = data.length;
        if(data.length>=20)
        {
          len = 20;
        }
        for (var i = 0; i < len; i++) {
          var id = data[i]['id'];
          var category = data[i]['category'];
          var local = data[i]['local'];
          var state = data[i]['state'];
          var title = data[i]['title'];
          var user = data[i]['user'];
          var price = data[i]['price'];
          var img = data[i]['img'];
          var plus = `<div class="paper masonry-brick" id="${id}">
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
                              <span id="state_${i}" style="display:none">${state}</span>
                              <span class="state1" id="state1_${i}">렌탈</span>
                              <span class="state2" id="state2_${i}">판매</span>
                            </span>
                          </div>
                        </div>`;
          html += plus;
        }
        console.log($('#masonry_container'));
        document.getElementById('masonry_container').innerHTML = html;

        setTimeout(function() {
          $('#masonry_container').masonry({
            itemSelector: '.paper',
            columnWidth: 285,
            isAnimated: true,
            isFitWidth: true
          });
        }, 0);
       
      }
      $(".masonry-brick").click(function () {
        console.log($(this).attr('id'));
        var postid = $(this).attr('id');
        console.log(postid);
        document.location.href = `/find-ex?id=${postid}`;
      });
    }
  });
}

category();
getData('ALL', 'ALL', 'ALL', 'ALL');

//클릭시 카테고리 값 얻고, 서버 통신

$('#find').click(function() {
  category();
  getData(buy, theme, region, low_price, high_price);
});

// 이미지 클릭시 상세페이지 redirect



//category
$('.row button').click(function() {
  if ($(this).css("color") == "rgb(215, 222, 222)") {
    $(this).css("color", "black");
    $(this).css("border", "1px black solid");
  } else {
    $(this).css("color", "#d7dede");
    $(this).css("border", "1px #d7dede solid");
  }
});

//masonry
  // $('#masonry_container').masonry({
  //   itemSelector: '.paper',
  //   columnWidth: 285,
  //   isAnimated: true,
  //   isFitWidth: true
  // });


//masonry rental vs buy
for(var i=3;i<20;i++)
{
  if ($(`#state_${i}`).text() == "렌탈") {
    $(`#state1_${i}`).css("background-color","#7fcacb");
    $(`#state1_${i}`).css("color","white");
    $(`#state1_${i}`).css("padding","5.5px");
    $(`#state2_${i}`).css("border-style","solid");
    $(`#state2_${i}`).css("border-color","#7fcacb");
    $(`#state2_${i}`).css("border-width","0.5px");
    $(`#state2_${i}`).css("background-color","white");
    $(`#state2_${i}`).css("color","#7fcacb");
  }
  else{
    $(`#state1_${i}`).css("background-color","white");
    $(`#state1_${i}`).css("color","#7fcacb");
    $(`#state1_${i}`).css("border-style","solid");
    $(`#state1_${i}`).css("border-color","#7fcacb");
    $(`#state1_${i}`).css("border-width","0.5px");
    $(`#state2_${i}`).css("padding","5.5px");
    $(`#state2_${i}`).css("background-color","#7fcacb");
    $(`#state2_${i}`).css("color","white");
  }
}



