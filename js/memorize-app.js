/**
 * Created by ohayon_m on 17/08/15.
 */

define(["activity/sample-ressources"], function (SampleRessources) {

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    var MODE_CLASSIC = "classic";
    var MODE_SPLITTED = "splitted";

    var TEMPLATE_SUMS = [
        [{text: "5+5"}, {text: "10"}],
        [{text: "5+6"}, {text: "11"}],
        [{text: "4+4"}, {text: "8"}],
        [{text: "4+5"}, {text: "9"}],
        [{text: "3+3"}, {text: "6"}],
        [{text: "3+4"}, {text: "7"}],
        [{text: "2+2"}, {text: "4"}],
        [{text: "1+1"}, {text: "2"}],
        [{text: "1+2"}, {text: "3"}],
        [{text: "9+9"}, {text: "18"}],
        [{text: "10+9"}, {text: "19"}],
        [{text: "8+8"}, {text: "16"}],
        [{text: "8+9"}, {text: "17"}],
        [{text: "7+7"}, {text: "14"}],
        [{text: "7+8"}, {text: "15"}],
        [{text: "6+6"}, {text: "12"}],
        [{text: "6+7"}, {text: "13"}]
    ];

    var TEMPLATE_LETTERS = [
        [{text: "A"}, {text: "a"}],
        [{text: "B"}, {text: "b"}],
        [{text: "C"}, {text: "c"}],
        [{text: "D"}, {text: "d"}],
        [{text: "E"}, {text: "e"}],
        [{text: "F"}, {text: "f"}],
        [{text: "G"}, {text: "g"}],
        [{text: "H"}, {text: "h"}],
        [{text: "I"}, {text: "i"}],
        [{text: "J"}, {text: "j"}],
        [{text: "K"}, {text: "k"}],
        [{text: "L"}, {text: "l"}],
        [{text: "M"}, {text: "m"}],
        [{text: "N"}, {text: "n"}],
        [{text: "O"}, {text: "o"}],
        [{text: "P"}, {text: "p"}],
        [{text: "Q"}, {text: "q"}],
        [{text: "R"}, {text: "r"}],
        [{text: "S"}, {text: "s"}],
        [{text: "T"}, {text: "t"}],
        [{text: "U"}, {text: "u"}],
        [{text: "V"}, {text: "v"}],
        [{text: "W"}, {text: "w"}],
        [{text: "X"}, {text: "x"}],
        [{text: "Y"}, {text: "y"}],
        [{text: "Z"}, {text: "z"}]
    ];

    var TEMPLATE_SOUNDS = [
        [{image: SampleRessources.imageMan, sound: SampleRessources.soundHello}, {
            image: SampleRessources.imageMan,
            sound: SampleRessources.soundHello
        }],
        [{image: SampleRessources.imageMan, sound: SampleRessources.soundHello}, {
            image: SampleRessources.imageMan,
            sound: SampleRessources.soundHello
        }],
        [{image: SampleRessources.imageMan, sound: SampleRessources.soundHello}, {
            image: SampleRessources.imageMan,
            sound: SampleRessources.soundHello
        }],
        [{image: SampleRessources.imageMan, sound: SampleRessources.soundHello}, {
            image: SampleRessources.imageMan,
            sound: SampleRessources.soundHello
        }]
    ];

    var MemorizeApp = {
        ui: {},
        templates: [TEMPLATE_SUMS, TEMPLATE_LETTERS, TEMPLATE_SOUNDS],
        template: TEMPLATE_LETTERS,
        game: {
            mode: MODE_CLASSIC,
            cards: [],
            host: "",
            currentPlayer: "",
            players: []
        },
        computeCards: computeCards,
        size: 4,
        inEditMode: false,
        shareActivity: shareActivity,
        initUI: initUI,
        drawGame: drawGame,
        onUsersListChanged: onUsersListChanged
    };

    function shareActivity() {
        MemorizeApp.inEditMode = false;
        leaveEditMode();
        disableEditMode();
    }

    function computeCards() {
        MemorizeApp.cards = [];

        var suffledTemplate = shuffle(MemorizeApp.template);

        if (MemorizeApp.game.mode == MODE_CLASSIC) {
            var cards = [];
            for (var i = 0; i < suffledTemplate.length && i < MemorizeApp.size; i++) {
                var card1 = suffledTemplate[i][0];
                var card2 = suffledTemplate[i][1];

                card1.id = i;
                card2.id = i;

                cards.push(card1);
                cards.push(card2);
                console.log(card1, card2);
            }
            MemorizeApp.cards = shuffle(cards);
        } else {
            var cards1 = [];
            var cards2 = [];

            for (var i = 0; i < MemorizeApp.size && i < suffledTemplate.length; i++) {
                var card1 = suffledTemplate[i][0];
                var card2 = suffledTemplate[i][1];

                card1.id = i;
                card2.id = i;

                cards1.push(card1);
                cards2.push(card2);
            }

            var shuffledCard1 = shuffle(cards1);
            for (var i = 0; i < MemorizeApp.size && i < shuffledCard1.length; i++) {
                MemorizeApp.cards.push(shuffledCard1[i]);
            }

            var shuffledCard2 = shuffle(cards2);
            for (var i = 0; i < MemorizeApp.size && i < shuffledCard2.length; i++) {
                MemorizeApp.cards.push(shuffledCard2[i]);
            }
        }

    }

    function drawGame() {
        console.log(MemorizeApp.cards);
    }

    function onUsersListChanged(users) {
    }

    function initUI(callback) {
        MemorizeApp.ui.gameGrid = document.getElementById("game-grid");
        MemorizeApp.ui.gameEditor = document.getElementById("game-editor");

        MemorizeApp.ui.gameTemplatesButton = document.getElementById("game-templates-button");
        MemorizeApp.ui.gameSizeButton = document.getElementById("game-size-button");
        MemorizeApp.ui.gameResetButton = document.getElementById("game-reset-button");

        MemorizeApp.ui.gameEditorButton = document.getElementById("game-editor-button");
        MemorizeApp.ui.gameEditorInsertModeButton = document.getElementById("game-editor-insert-mode-button");
        MemorizeApp.ui.gameEditorPlayModeButton = document.getElementById("game-editor-play-mode-button");
        MemorizeApp.ui.gameEditorClearButton = document.getElementById("game-editor-clear-button");

        MemorizeApp.ui.gameEditorButton.addEventListener("click", function () {
            if (MemorizeApp.inEditMode) {
                leaveEditMode();
            } else {
                enterEditMode();
            }
        });

        MemorizeApp.ui.gameEditorInsertModeButton.disabled = true;
        MemorizeApp.ui.gameEditorInsertModeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorPlayModeButton.disabled = true;
        MemorizeApp.ui.gameEditorPlayModeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorClearButton.disabled = true;
        MemorizeApp.ui.gameEditorClearButton.style.opacity = 0.3;

        if (callback) {
            callback();
        }
    }

    function enterEditMode() {
        MemorizeApp.inEditMode = true;

        /* Disable game buttons */

        MemorizeApp.ui.gameTemplatesButton.disabled = true;
        MemorizeApp.ui.gameTemplatesButton.style.opacity = 0.3;

        MemorizeApp.ui.gameSizeButton.disabled = true;
        MemorizeApp.ui.gameSizeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameResetButton.disabled = true;
        MemorizeApp.ui.gameResetButton.style.opacity = 0.3;

        /* Enable editor buttons */

        MemorizeApp.ui.gameEditorInsertModeButton.disabled = false;
        MemorizeApp.ui.gameEditorInsertModeButton.style.opacity = 1;

        MemorizeApp.ui.gameEditorPlayModeButton.disabled = false;
        MemorizeApp.ui.gameEditorPlayModeButton.style.opacity = 1;

        MemorizeApp.ui.gameEditorClearButton.disabled = false;
        MemorizeApp.ui.gameEditorClearButton.style.opacity = 1;

        MemorizeApp.ui.gameEditorButton.style.backgroundImage = "url(icons/play.svg)";
    }

    function leaveEditMode() {
        MemorizeApp.inEditMode = false;

        /* Enable game buttons */

        MemorizeApp.ui.gameTemplatesButton.disabled = false;
        MemorizeApp.ui.gameTemplatesButton.style.opacity = 1;

        MemorizeApp.ui.gameSizeButton.disabled = false;
        MemorizeApp.ui.gameSizeButton.style.opacity = 1;

        MemorizeApp.ui.gameResetButton.disabled = false;
        MemorizeApp.ui.gameResetButton.style.opacity = 1;

        /* Disable editor buttons */

        MemorizeApp.ui.gameEditorInsertModeButton.disabled = true;
        MemorizeApp.ui.gameEditorInsertModeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorPlayModeButton.disabled = true;
        MemorizeApp.ui.gameEditorPlayModeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorClearButton.disabled = true;
        MemorizeApp.ui.gameEditorClearButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorButton.style.backgroundImage = "url(icons/cog.svg)";
    }

    function disableEditMode() {
        /* Disable All editor buttons */

        MemorizeApp.ui.gameEditorButton.disabled = true;
        MemorizeApp.ui.gameEditorButton.style.opacity = 0.3;
        MemorizeApp.ui.gameEditorButton.style.backgroundImage = "url(icons/cog.svg)";

        MemorizeApp.ui.gameEditorInsertModeButton.disabled = true;
        MemorizeApp.ui.gameEditorInsertModeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorPlayModeButton.disabled = true;
        MemorizeApp.ui.gameEditorPlayModeButton.style.opacity = 0.3;

        MemorizeApp.ui.gameEditorClearButton.disabled = true;
        MemorizeApp.ui.gameEditorClearButton.style.opacity = 0.3;
    }

    return MemorizeApp;
});