$.ajax({
  type: 'post',
  url: '/',
  async: true,
  success: function(data) {
    var html1 = "";
    var html2 = "";

    for(var i=0;i<5;i++){
      var plus1 ="";

      var id = data[i]['id'];
      var title = data[i]['title'];
      var user = data[i]['user'];
      var img = data[i]['img'];

      if(i!=0){
        plus1 = `<div class="artwork_list_block">
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
      else{
        html2 = `<div class="artwork_list_block">
                    <img src="${img}">
                    <div class="artwork_list_mask">
                      <div class="artwork_list_mask_block">
                        <h4>${title}</h4>
                        <span>${user}</span>
                      </div>
                    </div>
                  </div>`
      }

    }
    document.getElementById('artwork_list_2').innerHTML = html2;
    document.getElementById('artwork_list_1').innerHTML = html1;

  }

});



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
