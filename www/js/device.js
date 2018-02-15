    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
        // localStorage.setItem("deviceId", btoa(device.uuid));        
        console.log(device.uuid);
        localStorage.setItem("platform", btoa(device.platform));
        FirebasePlugin.getToken(function(token) {
            localStorage.setItem("deviceId", token);
            console.log(token);

        }, function(error) {
            console.error(error);
        });

        FirebasePlugin.onNotificationOpen(function(notification) {
            debugger;
            console.log(notification);
        }, function(error) {
            debugger;
            console.error(error);
        });

        window.FirebasePlugin.onTokenRefresh(function(token) {
            // save this server-side and use it to push notifications to this device
            // var requestData = {
            //     'user_id': '1',
            //     'device_id': '1234567890987654321234567890987654321234567890'
            // };
            if (localStorage.getItem("loggedInUserData") != "" && localStorage.getItem("loggedInUserData") != undefined) {
                var loggedInUserData = JSON.parse(atob(localStorage.getItem("loggedInUserData")));
                // if (loggedInUserData != "" && loggedInUserData != undefined) {
                // var requestFormData = new FormData();
                // requestFormData.append('user_id', loggedInUserData.custUserId);
                // requestFormData.append('device_id', token);
                // debugger;
                // $.post('http://worthyconsultants.in/invite/api/v1/user/fcm/update', requestFormData, function(response) {
                //         debugger;
                //     })
                //     .fail(function(jqXHR, textStatus, errorThrown) {
                //         debugger;
                //         // $("#spinner").hide();
                //         // alert("Some error Occured.!");
                //     });
                // } 
            }



            console.log(token);
        }, function(error) {
            console.error(error);
        });
    }