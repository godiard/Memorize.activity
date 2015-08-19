/* Start of the app, we require everything that is needed */
define(function (require) {
    require(['domReady!', "sugar-web/activity/activity", "sugar-web/graphics/presencepalette", 'activity/memorize-app'], function (doc, activity, presencePalette, memorizeApp) {
        activity.setup();
        window.memorizeApp = memorizeApp;

        if (window.top.sugar.environment.sharedId) {
            memorizeApp.initUI(function () {
                initPresence(activity, memorizeApp, presencePalette);
            })
        } else {
            memorizeApp.initUI(function () {
                initPresence(activity, memorizeApp, presencePalette);
                memorizeApp.computeCards();
                memorizeApp.drawGame();
                loadData(activity, memorizeApp, function () {
                    memorizeApp.drawGame();
                });
            })

        }
    });
});

function loadData(activity, memorizeApp, callback) {

    var timeout = 0;
    if (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) {
        chrome.storage.local.get('sugar_settings', function (values) {
            timeout = 500;
        });
    } else {
        timeout = 0;
    }

    setTimeout(function () {
        activity.getDatastoreObject().loadAsText(function (error, metadata, jsonData) {
            if (jsonData == null) {
                return;
            }

            var data = JSON.parse(jsonData);
            if (data == null) {
                return;
            }

            if (data.mode) {
                memorizeApp.game.mode = data.mode;
            }

            if (data.cards) {
                memorizeApp.game.cards = data.cards;
            }

            if (data.template) {
                memorizeApp.game.template = data.template;
            }

            if (data.size) {
                memorizeApp.game.size = data.size;
            }

            if (!data.cards || data.cards.length == 0) {
                memorizeApp.computeCards();
            }

            if (callback) {
                callback();
            }
        });
    }, timeout);
}

function initPresence(activity, memorizeApp, presencepalette, callback) {
    activity.getPresenceObject(function (error, presence) {
        memorizeApp.presence = presence;
        var networkButton = document.getElementById("network-button");
        var presencePalette = new presencepalette.PresencePalette(networkButton, undefined, presence);
        presence.onSharedActivityUserChanged(function (msg) {
            presencePalette.onSharedActivityUserChanged(msg);
        });

        //We use one of the palette feature that allows us to get the full list of current users everytime the list changes
        presencePalette.onUsersListChanged(function (users) {
            memorizeApp.onUsersListChanged(users);
        });

        presencePalette.addEventListener('shared', function () {
            shareActivity(activity, presence, memorizeApp)
        });


        // Launched with a shared id, activity is already shared
        if (window.top && window.top.sugar && window.top.sugar.environment && window.top.sugar.environment.sharedId) {
            shareActivity(activity, presence, memorizeApp);
            presencePalette.setShared(true);

        }

        if (callback) {
            callback();
        }
    });
}

function shareActivity(activity, presence, memorizeApp) {

    memorizeApp.shareActivity();

    var userSettings = presence.getUserInfo();

    // Not found, create a new shared activity
    if (!window.top.sugar.environment.sharedId) {
        presence.createSharedActivity('org.olpcfrance.MemorizeActivity', function (groupId) {
            //console.log(groupId)
        });
    }

    // Show a disconnected message when the WebSocket is closed.
    presence.onConnectionClosed(function (event) {
        console.log(event);
        console.log("Connection closed");
    });

    // Handle messages received
    presence.onDataReceived(function (data) {
        console.log(data)
    });

    presence.listUsers(function (users) {
        console.log(users)
    })

    //if (!PaintApp.data.isHost) {
    //    PaintApp.data.presence.listUsers(function (users) {
    //            sendMessage({
    //                action: "entranceToDataURLRequest " + users[0].networkId
    //            })
    //        }
    //    )

    //}
}