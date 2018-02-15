var currentUser;

function redirectToDashboard() {
    $("#spinner").show();
    window.location.href = "dashboard.html";
    $("#spinner").hide();
}

function logOut() {
	$("#spinner").show();
    localStorage.setItem("isLogout", "true");
    localStorage.removeItem("userData");
    localStorage.removeItem("userApikey");
    window.location.href = "index.html";
}
$(function() {
    $("#spinner").show();
    if (localStorage.getItem("userData") != null) {
        var qbUserData = JSON.parse(atob(localStorage.getItem("userData")));
        currentUser = qbUserData;
        connectToChat(qbUserData);
    } else {
        window.location.href = "/";
    }
});