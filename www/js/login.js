var loginFn = function() {
    $("#spinner").show();
    var loginData = $('#loginForm').serialize();
    var qbUserData = {};
    $.post('http://worthyconsultants.in/invite/api/v1/user/login', loginData, function(response) {

            if (!response.error) {
                var responseData = response.userdetails[0];
                debugger;
                qbUserData = {
                    id: responseData.quickbloxId,
                    name: responseData.userMobile,
                    login: responseData.userEmail.split('@')[0],
                    pass: responseData.quickbloxPwd
                }
                localStorage.setItem("loggedInUserData", btoa(JSON.stringify(responseData)))
                localStorage.setItem("userData", btoa(JSON.stringify(qbUserData)))
                if (localStorage.getItem("isRememberMe")) {
                    localStorage.setItem("username", btoa($("#email").val()));
                    localStorage.setItem("password", btoa($("#password").val()));
                }
                localStorage.removeItem("isLogout");
                localStorage.removeItem("deviceId");
                FirebasePlugin.getToken(function(token) {
                    localStorage.setItem("deviceId", token);

                    var requestFormData = new FormData();
                    requestFormData.append('user_id', responseData.custUserId);
                    requestFormData.append('device_id', token);
                    debugger;

                    $.ajax({
                        url: 'http://worthyconsultants.in/invite/api/v1/user/fcm/update',
                        type: 'POST',
                        cache: false,
                        processData: false,
                        contentType: false,
                        // data : requestFormData.serialize(),
                        data: requestFormData,
                        success: function(data) {
                            debugger;
                            $("#spinner").hide();
                            window.location.href = "dashboard.html";
                            console.log('ok');
                        },
                        fail: function(err) {
                            debugger;
                            $("#spinner").hide();
                            alert("Some error Occured.!");
                        }
                        //return false; //
                    });


                    console.log(token);
                }, function(error) {
                    $("#spinner").hide();
                    alert(error);
                    console.error(error);
                });
            } else {
                $("#spinner").hide();
                alert("Incorrect Username or Password.!");
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#spinner").hide();
            alert("Some error Occured.!");
        });
}

var rememberMeFn = function() {
    if (this.checked) {
        localStorage.setItem("isRememberMe", true);
    } else {
        localStorage.removeItem("isRememberMe");
    }
}

var redirectToSignUp = function() {
    window.location.href = "signup.html";
}

$(function() {
    $("#spinner").hide();
    // $("#login").on('click', loginFn);
    $("#rememberMeCb").on('change', rememberMeFn);
    var rememberMe = localStorage.getItem("isRememberMe");
    var email = localStorage.getItem("username");
    var password = localStorage.getItem("password");
    if (rememberMe != "" && rememberMe != null) {
        $("#email").val(atob(email));
        $("#password").val(atob(password));

        if (localStorage.getItem("isLogout") == null) {
            $("#login").trigger("click");
        } else {
            $("#rememberMeCb")[0].checked = true;
        }
    }
})