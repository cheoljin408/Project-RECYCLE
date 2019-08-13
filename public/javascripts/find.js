//var $('.row button').attr(btn_flag) = false;

$('.row button').click(function() {
  if ($(this).css("color") == "rgb(215, 222, 222)") {
    $(this).css("color", "black");
    $(this).css("border", "1px black solid");
  } else {
    $(this).css("color", "#d7dede");
    $(this).css("border", "1px #d7dede solid");
  }
});

$('#masonry_container').imagesLoaded(function() {
  $('#masonry_container').masonry({
    itemSelector: '.paper',
    columnWidth: 285,
    isAnimated: true
  });
});

// 변수 지정
var slideWrapper =  document.getElementsByClassName('container'),
	slideContainer  = document.getElementsByClassName('slider-container'),
	slides = document.getElementsByClassName('slide'),
	slideCount = slides.length,
	currentIndex = 0,
	topHeight = 0,
	navPrev = document.getElementById('prev'),
	navNext =  document.getElementById('next');

//슬라이드의 높이 확인하여 부모의 높이로 지정하기


// 슬라이드가 있으면 가로로 배열하기
if (slideCount > 0) {
	for (var i = 0; i < slideCount; i++) {
	slides[i].style.left = 100 * i + "%";
	}
}


