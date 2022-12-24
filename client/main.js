const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");
localStorage.setItem("code", code);
