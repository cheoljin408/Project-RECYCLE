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
