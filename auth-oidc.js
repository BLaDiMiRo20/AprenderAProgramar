const authority = "https://auth.gcfglobal.org";
const client_id = "0oNWZdC23Ts2XuVwJCiYm";
const clientUri = "https://edu.gcfglobal.org/";
const config = {
    authority: authority,
    client_id: client_id,
    redirect_uri: clientUri + "callback",
    post_logout_redirect_uri: clientUri,
    response_type: "code",
    scope: "openid profile email offline_access",
};
const USER_ACCESS_TOKEN_KEY = "userAccessToken";
const mgr = new Oidc.UserManager(config);
const logoutHeader = document.getElementById("header-loggout");
const proccessProfile = (userProfile)=>{
    const profileObject = JSON.parse(userProfile || "{}");
    if (profileObject && profileObject.access_token) {
        localStorage.setItem(USER_ACCESS_TOKEN_KEY, profileObject.access_token);
        const event = new CustomEvent("token_set",{
            detail: {
                user: profileObject,
            },
        });
        document.dispatchEvent(event);
    } else {
        const errorSigninEvent = new CustomEvent("signin_error",{
            detail: {
                message: "user not logged in",
            },
        });
        document.dispatchEvent(errorSigninEvent);
    }
}
;
window.addEventListener("storage", function(e) {
    if (e.storageArea === sessionStorage && e.key && e.key.includes("oidc.user")) {
        proccessProfile(e.newValue);
    }
});
mgr.removeUser().then(()=>{
    localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
    sessionStorage.removeItem('oidc.user');
    mgr.signinSilent().catch();
}
).catch((error)=>{}
);
