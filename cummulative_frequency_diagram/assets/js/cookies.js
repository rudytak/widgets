function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCSS(cssPath, linkId) {
  let oldlink = document.getElementById(linkId);
  oldlink.href = cssPath;
}

function checkTheme() {
  let rtlLink = document.createElement("link");
  let appLink = document.createElement("link");

  rtlLink.setAttribute("id", "rtl-stylesheet");
  appLink.setAttribute("id", "app-stylesheet");

  rtlLink.setAttribute("rel", "stylesheet");
  appLink.setAttribute("rel", "stylesheet");

  rtlLink.href = "assets/css/app-dark.rtl.css";
  appLink.href = "assets/css/app-dark.css";

  if (
    getCookie("preferedTheme") == "" ||
    getCookie("preferedTheme") == "light"
  ) {
    setCookie("preferedTheme", "light", 360);
  } else {
    document.head.appendChild(appLink);
    document.head.appendChild(rtlLink);
  }
}

checkTheme();
