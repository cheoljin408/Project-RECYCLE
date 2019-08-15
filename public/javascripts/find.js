
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
