
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
//category request
$('.buy').children('button').click(function(){
  var html = "";
  var state = $('#rent').text();
  $.ajax({
    type: 'POST',
    url: '/find',
    async: false,
    data: {
              state : state
    },
    success: function(data) {
      if (data != null) {
        for (var i = 3; i < 20; i++) {
          var category = data[i]['category'];
          var local = data[i]['local'];
          var state = data[i]['state'];
          var title = data[i]['title'];
          var user = data[i]['user'];
          var price = data[i]['price'];
          var img = data[i]['img'];



          var plus = `<div class="paper">
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
                            <span class="state2" id="state2_${i}">구매</span>
                          </span>
                        </div>
                      </div>`;
          html += plus;

        }
        document.getElementById('masonry_container').innerHTML = html;
      }
    }
  });
});


//masonry
$('#masonry_container').imagesLoaded(function() {
  $('#masonry_container').masonry({
    itemSelector: '.paper',
    columnWidth: 285,
    isAnimated: true
  });
});

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
