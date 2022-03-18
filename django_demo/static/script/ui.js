// URL mapping, from hash to a function that responds to that URL action
const router = {
  "/home/": () => showContent("content-home"),
  "/profile": () =>
    requireAuth(() => showContent("content-profile"), "/profile"),
  "/login": () => login()
};

//Declare helper functions

/**
 * Iterates over the elements matching 'selector' and passes them
 * to 'fn'
 * @param {*} selector The CSS selector to find
 * @param {*} fn The function to execute for every element
 */
const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

/**
 * Tries to display a content panel that is referenced
 * by the specified route URL. These are matched using the
 * router, defined above.
 * @param {*} url The route URL
 */
const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }

  return false;
};

/**
 * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
 * @param {*} element The element to check
 */
const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

/**
 * Displays a content panel specified by the given element id.
 * All the panels that participate in this flow should have the 'page' class applied,
 * so that it can be correctly hidden before the requested content is shown.
 * @param {*} id The id of the content to show
 */
const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

/**
 * Updates the user interface
 */
const updateUI = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0.getUser();
      console.log('auth0-spa-js .getUser', user);
      document.getElementById("profile-data").innerText = JSON.stringify(
        user,
        null,
        2
      );

      const isMailVerified = user.email_verified;

      if(isMailVerified){
        eachElement(".mail-verified-invisible", (e) => e.classList.add("hidden"));
        eachElement(".mail-verified-visible", (e) => e.classList.remove("hidden"));
        setDashboardInfo("");
        loadDataGrid();
      }
      else{
        eachElement(".mail-verified-invisible", (e) => e.classList.remove("hidden"));
        eachElement(".mail-verified-visible", (e) => e.classList.add("hidden"));
      }

      document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));

      document.getElementById("qsLoginBtn").setAttribute('disabled', '');

      const userDetail = await GetUserDetail(user.sub);
      var isSocial = userDetail.identities[0].isSocial

      if(isSocial){
        eachElement(".is-social-invisible", (e) => e.classList.add("hidden"));
      }
      else{
        eachElement(".is-social-invisible", (e) => e.classList.remove("hidden"))
      }
    } else {

      eachElement(".mail-verified-invisible", (e) => e.classList.add("hidden"));
      eachElement(".is-social-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));

      document.getElementById("qsLoginBtn").removeAttribute('disabled')
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }

  console.log("UI updated");
};

const setWaitIcon = (isWaiting) => {
  if(isWaiting){
    eachElement(".wait-visible", (e) => e.classList.remove("hidden"));
  }
  else{
    eachElement(".wait-visible", (e) => e.classList.add("hidden"))
  }
}

const setElementDisabled = (id, disable) => {
    if(disable){
        document.getElementById(id).setAttribute('disabled', '');
    }
    else{
        document.getElementById(id).removeAttribute('disabled')
    }
}

const setDashboardInfo = (info) => {
    const defaultStr= "<p>This is dashboard. </p>"
    eachElement(".dashboard-info", (e) => (e.innerHTML = defaultStr + info));
}

const clearResetPassword = () => {
    //group-reset-password
    eachElement(".group-reset-password", (e) => (e.value = ""));
}

window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};