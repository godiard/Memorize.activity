/* Start of the app, we require everything that is needed */
define(function (require) {
    require(['domReady!', "sugar-web/activity/activity", 'activity/memorize-app'], function (doc, activity, memorizeApp) {

        var onAndroid = /Android/i.test(navigator.userAgent);
        if (window.location.search.indexOf('onAndroid') > -1) {
            onAndroid = true;
        };

        if (onAndroid) {
            // hide activity button on android
            var activityButton = document.getElementById("activity-button");
            activityButton.style.display = 'none';
            var stopButton = document.getElementById("stop-button");
            stopButton.style.display = 'none';
        };

        window.memorizeApp = memorizeApp;

        memorizeApp.activity = activity;
        memorizeApp.activity.setup();

        memorizeApp.initUI(function () {
            memorizeApp.computeCards();
            memorizeApp.drawGame();
            loadData(memorizeApp.activity, memorizeApp, function () {
                memorizeApp.drawGame();
            });
        })
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

            if (data.game) {
                memorizeApp.game = data.game;
                memorizeApp.game.multiplayer = false;
                memorizeApp.game.selectedCards = [];
                memorizeApp.game.currentPlayer = "";
                memorizeApp.game.players = []
            }

            if (callback) {
                callback();
            }
        });
    }, timeout);
}
