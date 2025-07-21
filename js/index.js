function openMenuTopNav() {
  var x = document.getElementById("menuTopNav");
  if (x.className === "header__nav--topNav") {
    x.className += " responsive";
  } else {
    x.className = "header__nav--topNav";
  }
}

