// build html for messages
function playVideo(url) {
    // #1 - https://github.com/moust/cordova-plugin-videoplayer
    // VideoPlayer.play(url, {
    //         volume: 0.5,
    //         scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT_WITH_CROPPING
    //     },
    //     function(successData) { debugger; },
    //     function(errorData) { debugger; });


    // #2 - ExoPlayer https://github.com/frontyard/cordova-plugin-exoplayer
    var successCallback = function(json) {
        debugger;
        if (parseInt(json.bufferPercentage) < 100 ) {
            $("#spinner").show();
        }
        else{
            $("#spinner").hide();
        }
        if (json.eventType == "TOUCH_EVENT") {
            debugger;
            ExoPlayer.getState(function(es) {
                    if (es.controllerVisible == "true") {
                        ExoPlayer.hideController();
                    } else {
                        ExoPlayer.showController();
                    }
                },
                function(er) { debugger })
        }
        if (json.eventType == "KEY_EVENT" && json.eventKeycode == "KEYCODE_BACK") {
            ExoPlayer.close();
        }


    };

    var errorCallback = function(error) {
        debugger;
    };

    var params = {
        url: url,
        hideTimeout: 10000,
        controller: { // If this object is not present controller will not be visible
            streamImage: 'https://cdn4.iconfinder.com/data/icons/icon-flat-icon-set/50/rewind-512.png',
            streamTitle: '',
            streamDescription: '',
            hideProgress: false, // Hide entire progress timebar
            hidePosition: false, // If timebar is visible hide current position from it
            hideDuration: false, // If timebar is visible Hide stream duration from it
            controlIcons: {
                'exo_rew': 'https://cdn4.iconfinder.com/data/icons/icon-flat-icon-set/50/rewind-512.png',
                'exo_play': 'https://png.icons8.com/metro/1600/play.png',
                'exo_pause': 'https://png.icons8.com/metro/1600/pause.png',
                'exo_ffwd': 'http://simpleicon.com/wp-content/uploads/forward.png'
            }
        }
    };
    debugger;
    ExoPlayer.show(params, successCallback, errorCallback);


    // #3 - https://github.com/nchutchind/cordova-plugin-streaming-media
    // var options = {
    //     successCallback: function() {
    //         console.log("Video was closed without error.");
    //     },
    //     errorCallback: function(errMsg) {
    //         console.log("Error! " + errMsg);
    //     },
    //     orientation: 'landscape',
    //     shouldAutoClose: true, // true(default)/false
    //     controls: true // true(default)/false. Used to hide controls on fullscreen
    // };
    // debugger
    // streamingMedia.playVideo(url, options);
}

function buildMessageHTML(messageText, messageSenderId, messageDateSent, attachmentFileId, messageId, status) {
    var messageAttach;
    if (attachmentFileId) {
        if (status == "video") {
            debugger;
            var videoUrl = QB.content.publicUrl(attachmentFileId) + '/download.xml?token=' + token;
            var playVideoClck = 'playVideo("' + videoUrl + '")'
            console.log(QB.content.publicUrl(attachmentFileId));
            console.log(videoUrl);

            // var a = community.thumbnail.createThumbNail(videoUrl, { width: 50, height: 50 })
            // console.log(a);
            // debugger;
            // PKVideoThumbnail.createThumbnail(videoUrl, "D://", function(optionsData) {
            //     debugger;
            // }, function(successData) {
            //     debugger;
            // }, function(failData) { debugger; });
            var thumbnailImgSrc = 'img/videoPlayThumbnail.png';
            messageAttach = '<a alt="attachment" class="attachments img-responsive" onclick=' + playVideoClck + '> <img style="width:150%" src=' + thumbnailImgSrc + '></img></a>'
        } else {
            debugger;
            var imgPath = QB.content.publicUrl(attachmentFileId) + '/download.xml?token=' + token;
            messageAttach = '<img src="' + imgPath + '" alt="attachment" class="attachments img-responsive imgPreview" id="img' + attachmentFileId + '" />';
        }
        // messageAttach = '<img src="' + QB.content.publicUrl(attachmentFileId) + '/' + '/download.xml?token=' + token + '" alt="attachment" class="attachments img-responsive" />';
    }

    var isMessageSticker = stickerpipe.isSticker(messageText);

    var delivered = '<img class="icon-small" src="img/delivered.jpg" alt="" id="delivered_' + messageId + '">';
    var read = '<img class="icon-small" src="img/read.jpg" alt="" id="read_' + messageId + '">';

    var messageTextHtml = messageText;
    if (messageAttach) {
        messageTextHtml = messageAttach;
    } else if (isMessageSticker) {
        messageTextHtml = '<div class="message-sticker-container"></div>';

        stickerpipe.parseStickerFromText(messageText, function(sticker, isAsync) {
            if (isAsync) {
                $('#' + messageId + ' .message-sticker-container').html(sticker.html);
            } else {
                messageTextHtml = sticker.html;
            }
        });
    }

    var messageHtml =
        '<div class="list-group-item" id="' + messageId + '">' +
        '<time datetime="' + messageDateSent + '" class="pull-right">' +
        jQuery.timeago(messageDateSent) +
        '</time>' +

        '<h4 class="list-group-item-heading">' + messageSenderId + '</h4>' +
        '<p class="list-group-item-text">' +
        messageTextHtml +
        '<a class="message-del" id=' + messageId + '><i class="glyphicon glyphicon-trash"></i></a></p>' +
        delivered + read +
        '</div>';
    return messageHtml;
}

// build html for dialogs
function buildDialogHtml(dialogId, dialogUnreadMessagesCount, dialogIcon, dialogName, dialogLastMessage) {
    var UnreadMessagesCountShow = '<span class="badge">' + dialogUnreadMessagesCount + '</span>';
    UnreadMessagesCountHide = '<span class="badge" style="display: none;">' + dialogUnreadMessagesCount + '</span>';

    var isMessageSticker = stickerpipe.isSticker(dialogLastMessage);

    var dialogHtml =
        '<a href="#" class="list-group-item inactive" id=' + '"' + dialogId + '"' + ' onclick="triggerDialog(' + "'" + dialogId + "'" + ')">' +
        (dialogUnreadMessagesCount === 0 ? UnreadMessagesCountHide : UnreadMessagesCountShow) +
        '<h4 class="list-group-item-heading">' + dialogIcon + '&nbsp;&nbsp;&nbsp;' +
        '<span>' + dialogName + '</span>' +
        '</h4>' +
        '<p class="list-group-item-text last-message">' +
        (dialogLastMessage === null ? "" : (isMessageSticker ? 'Sticker' : dialogLastMessage)) +
        '</p>' +
        '</a>';
    return dialogHtml;
}

// build html for typing status
function buildTypingUserHtml(userId, userLogin) {
    var typingUserHtml =
        '<div id="' + userId + '_typing" class="list-group-item typing">' +
        '<time class="pull-right">writing now</time>' +
        '<h4 class="list-group-item-heading">' + userLogin + '</h4>' +
        '<p class="list-group-item-text"> . . . </p>' +
        '</div>';

    return typingUserHtml;
}

// build html for users list
function buildUserHtml(userLogin, userId, isNew) {
    var userHtml = "<a href='#' id='" + userId;
    if (isNew) {
        userHtml += "_new'";
    } else {
        userHtml += "'";
    }
    userHtml += " class='col-md-12 col-sm-12 col-xs-12 users_form' onclick='";
    userHtml += "clickToAdd";
    userHtml += "(\"";
    userHtml += userId;
    if (isNew) {
        userHtml += "_new";
    }
    userHtml += "\")'>";
    userHtml += userLogin;
    userHtml += "</a>";

    return userHtml;
}

var openImagePeview = function() {
    debugger;
    // ;
}

$(function() {
    $(document).on('click', '.message-del', function(e) {

        var params = { force: 1 },
            messageId = $(this).attr('id');
        QB.chat.message.delete(messageId, params, function(err, res) {
            if (res) {
                console.log('message deleted successfully');
                $('#messages-list #' + messageId).css("display", "none");
            } else {
                console.log(err);
            }
        });

    });

    $(document).on('click', '.imgPreview', function(e) {
        PhotoViewer.show(e.target.src)
        debugger;

    });


});