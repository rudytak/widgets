var lightLabel = document.querySelector('label[for="theme-blue-light"]');
var darkLabel = document.querySelector('label[for="theme-blue-dark"]');

var lightSwitch = document.getElementById("theme-blue-light");
var darkSwitch = document.getElementById("theme-blue-dark");

lightSwitch.onchange = function () {
  setTimeout(function () {
    if (lightSwitch.checked == true) {
      setCookie("preferedTheme", "light", 360);
      try {
        document.getElementById("rtl-stylesheet").remove();
        document.getElementById("app-stylesheet").remove();
      } catch (e) {}
    }
  }, 50);
};
darkSwitch.onchange = function () {
  setTimeout(function () {
    if (darkSwitch.checked == true) {
      setCookie("preferedTheme", "dark", 360);
      try {
        document.getElementById("rtl-stylesheet").remove();
        document.getElementById("app-stylesheet").remove();
      } catch (e) {}
      checkTheme();
    }
  }, 100);
};

if (getCookie("preferedTheme") == "dark") {
	darkLabel.click();
} else {
	lightLabel.click();
}
