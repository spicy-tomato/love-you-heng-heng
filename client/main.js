(() => {
  console.log("ok");
  const code = getCodeFromUrlParams();
  if (code) {
    saveCode();
  }
  if (savedCode()) {
    verifySavedCode();
  } else {
    setTimeout(() => {
      displayLoginButton();
    }, 1200);
  }
})();

function getCodeFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
}

function saveCode(code) {
  localStorage.setItem("code", code);
}

function savedCode() {
  console.log(!!localStorage.getItem("code"));
  console.log(!localStorage.getItem("code"));
  return !!localStorage.getItem("code");
}

function verifySavedCode() {}

function displayLoginButton() {
  document.querySelector(".login").classList.add("display");
}
