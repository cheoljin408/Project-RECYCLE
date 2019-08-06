

//var $('.row button').attr(btn_flag) = false;

$('.row button').click(function(){
  if($(this).css("color") == "rgb(215, 222, 222)")
  {
    $(this).css("color","black");
    $(this).css("border","1px black solid");
  }
  else {
    $(this).css("color","#d7dede");
    $(this).css("border","1px #d7dede solid");
  }
});
