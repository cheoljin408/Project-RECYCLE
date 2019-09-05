// nav fade-in/out
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "-70px";
  } else {
    document.getElementById("navbar").style.top = "0";

  }
  prevScrollpos = currentScrollPos;
}


// 금주의 작품
$.ajax({
  type: 'post',
  url: '/',
  async: true,
  success: function(data) {
    var html1 = "";
    var html2 = "";

    for (var i = 0; i < 5; i++) {
      var plus1 = "";

      var id = data[i]['id'];
      var title = data[i]['title'];
      var user = data[i]['user'];
      var img = data[i]['img'];

      if (i != 0) {
        plus1 = `<div class="artwork_list_block" id="${id}">
                    <img src="${img}">
                    <div class="artwork_list_mask">
                      <div class="artwork_list_mask_block">
                        <h4>${title}</h4>
                        <span>${user}</span>
                      </div>
                    </div>
                  </div>`;
        html1 += plus1;
      } else {
        html2 = `<div class="artwork_list_block" id="${id}">
                    <img style="height:427px;" src="${img}" >
                    <div class="artwork_list_mask">
                      <div class="artwork_list_mask_block">
                        <h4 style="font-size:22px">${title}</h4>
                        <span style="font-size:18px">${user}</span>
                      </div>
                    </div>
                  </div>`
      }

    }
    document.getElementById('artwork_list_2').innerHTML = html2;
    document.getElementById('artwork_list_1').innerHTML = html1;
    //상품 클릭하면 상세 페이지로 이동
    $(".artwork_list_block").click(function() {
      console.log($(this).attr('id'));
      var postid = $(this).attr('id');
      console.log(postid);
      document.location.href = `/find-ex?id=${postid}`;
    });
  }
});


// 더보기 버튼 click
$('#more').click(function(){
  $.ajax({
    type: 'post',
    url: '/',
    async: true,
    success: function(data) {
      var html1 = `<div id="artwork_list_1">`;
      var html2 = "";

      for (var i = 5; i < 10; i++) {
        var plus1 = "";

        var id = data[i]['id'];
        var title = data[i]['title'];
        var user = data[i]['user'];
        var img = data[i]['img'];

        if (i != 5) {
          plus1 = `<div class="artwork_list_block" id="${id}">
                      <img src="${img}">
                      <div class="artwork_list_mask">
                        <div class="artwork_list_mask_block">
                          <h4>${title}</h4>
                          <span>${user}</span>
                        </div>
                      </div>
                    </div>`;
          html1 += plus1;
        }
        else {
          html2 = `  <div id="artwork_list_2">
          <div class="artwork_list_block" id="${id}">
                      <img style="height:427px;" src="${img}" >
                      <div class="artwork_list_mask">
                        <div class="artwork_list_mask_block">
                          <h4 style="font-size:22px">${title}</h4>
                          <span style="font-size:18px">${user}</span>
                        </div>
                      </div>
                    </div>
                    </div>`
        }
      }
      html1+= '</div>'
      $(`.artwork`).append(html2);
      $(`.artwork`).append(html1);


      //상품 클릭하면 상세 페이지로 이동
      $(".artwork_list_block").click(function() {
        console.log($(this).attr('id'));
        var postid = $(this).attr('id');
        console.log(postid);
        document.location.href = `/find-ex?id=${postid}`;
      });

      //더보기 버튼 없애고, 더 많은 작품 보기 활성화
      $('#more').css('display','none');
      $('#relocation').css('display','inline-block');
    }
  });
})

//더 많은 작품 보기 click
$('#relocation').click(function(){
  document.location.href = `/find`;
})
