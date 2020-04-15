//homescreen images and dropdown stuff
function toggleDropdown() {
    document.getElementById("mainDropdown").classList.toggle("show");
    document.getElementById("dropButton").classList.toggle("rotate");
}

function showImage(index) {
    var slides = document.getElementsByClassName("slide");

    for(var i = 0; i < slides.length; i++){
        if (slides[i].classList.contains('show')) {
            slides[i].classList.remove('show');
        }
    }
    slides[index].classList.toggle("show");
}
  
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }

    var dropdowns = document.getElementsByClassName("dropbtn");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('rotate')) {
        openDropdown.classList.remove('rotate');
      }
    }
  }
}
