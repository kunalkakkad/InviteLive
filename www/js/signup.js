var customerId = "f18f"; // Need to hardcoded everytime.

var signupFn = function() {
    $("#spinner").show();
    if ($("#passwordSameCb")[0].checked) {
        $("#password").val($("#mobile").val());
    }
    var signupData = $('#signupForm').serialize();    
    debugger;
    $.post('http://worthyconsultants.in/invite/api/v1/customer/user', signupData, function(response) {
        $("#spinner").hide();
        if (!response.error) {
            var responseData = response.userdetails[0];
            qbUserData = {
                id: responseData.quickbloxId,
                name: responseData.userMobile,
                login: responseData.userEmail.split('@')[0],
                pass: responseData.quickbloxPwd
            }
            localStorage.setItem("userApikey", btoa(JSON.stringify(responseData.apiKey)))
            localStorage.setItem("userData", btoa(JSON.stringify(qbUserData)))
            window.location.href = "dashboard.html";
        } else {
            alert(response.message);
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        $("#spinner").hide();
        alert("Some error Occured.!");
    });
};

var passwordSameCbFn = function() {
    if (this.checked) {
        $("#password").val("");
        $("#password").val($("#mobile").val());
        $("#passwordBlock").hide();
    } else {
        $("#passwordBlock").show();
    }

};

$(function() {
    $("#spinner").hide();
    $("#user_id").val(customerId);
    $("#platform").val(atob(localStorage.getItem("platform")));
    $("#device_id").val(localStorage.getItem("deviceId"));
    $("#passwordBlock").hide();
    $("#signup").on('click', signupFn);
    $("#passwordSameCb").on('change', passwordSameCbFn)
})