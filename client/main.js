(async () => {
  const code = getCodeFromUrlParams();
  let canExchange = true;
  if (code) {
    try {
      const authorizeCode = await exchangeAuthorizationCode(code);
      if (authorizeCode) {
        saveCode(authorizeCode);
        window.history.pushState({}, document.title, window.location.pathname);
      } else {
        throw Error("No authorization code found");
      }
    } catch (e) {
      canExchange = false;
    }
  }
  if (canExchange && savedCode()) {
    await verifySavedCode();
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

async function exchangeAuthorizationCode(code) {
  const res = await axios.get("http://localhost:3000/exchange", {
    params: { code },
  });
  return res.data?.access_token;
}

function saveCode(code) {
  localStorage.setItem("code", code);
}

function savedCode() {
  const code = localStorage.getItem("code");
  return (
    !!localStorage.getItem("code") && code != "null" && code != "undefined"
  );
}

async function verifySavedCode() {
  const code = localStorage.getItem("code");
  axios
    .get("https://googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${code}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
}

function displayLoginButton() {
  document.querySelector(".login").classList.add("display");
}

async function login() {
  const res = await axios.get("http://localhost:3000/generateAuthUrl");
  const authorizeUrl = res.data;
  window.location.href = authorizeUrl;
}
