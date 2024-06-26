function toggleAccountNavCollapse(iSelected) {
    if (iSelected) {
        $("#accountNavcollapse").slideToggle(250);
    }
}
document.addEventListener("token_set", (e)=>{
    const userData = e.detail.user;
    $("#movileSignin").addClass("hide_element");
    $("#movileSignup").addClass("hide_element");
    $("#movileProfile").removeClass("hide_element");
    $("#movileLogout").removeClass("hide_element");
    $("#movileDashboard").removeClass("hide_element");
    if (userData.profile.picture) {
        setProfilePicture(userData.profile.picture);
    }
}
);
function setProfilePicture(url) {
    $("#avatarIconOnMovile").addClass("hide_element");
    $("#dropdownIconOnMovile").addClass("hide_element");
    $("#avatarImageOnMovile").removeClass("hide_element");
    $("#avatarImageOnMovile").attr("src", url);
}
