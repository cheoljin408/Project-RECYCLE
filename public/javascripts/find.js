
//var $('.row button').attr(btn_flag) = false;

$('.row button').click(function () {
  if ($(this).css("color") == "rgb(215, 222, 222)") {
    $(this).css("color", "black");
    $(this).css("border", "1px black solid");
  }
  else {
    $(this).css("color", "#d7dede");
    $(this).css("border", "1px #d7dede solid");
  }
});


// $.post('/find', function (data) {
//   console.log(data);
//   console.log(nimg);

//   var img = new Array();
//   for (var i = 3; i < 10; i++) {
//     var img = data[i]['img'];

//     var plus = `        <div class="paper">
//     <div class="paper-holder">
//       <a><img width="190" src="${img}" /></a>
//     </div>
//     <p class="paper-description">Lorem ipsum dolor sit amet</p>
//     <div class="paper-content">
//       <a class="paper-link" href="#"><img src="http://placekitten.com/30/30" /></a>
//       <p class="paper-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sem mi, egestas a facilisis eget, egestas ut magna.</p>
//     </div>
//   </div>`;

//     html += plus;
//   }
//   document.getElementById('masonry_container').outerHTML = html;  
//   $('#masonry_container').append(html);
// });
$('#masonry_container').imagesLoaded(function () {
  $('#masonry_container').masonry({
    itemSelector: '.paper',
    columnWidth: 285,
    isAnimated: true
  });
});