/**
 * Created by ohayon_m on 17/08/15.
 */

define(["activity/sample-ressources", "activity/palettes/template-palette", "activity/palettes/size-palette"], function (SampleRessources, templatePalette, sizePalette) {

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
        [{text: "3+4"}, {text: "7"}],
        [{text: "5+5"}, {text: "10"}],
        [{text: "5+6"}, {text: "11"}],
        [{text: "4+4"}, {text: "8"}],
        [{text: "4+5"}, {text: "9"}],
        [{text: "3+3"}, {text: "6"}],
        [{text: "2+2"}, {text: "4"}],
        [{text: "1+1"}, {text: "2"}],
        [{text: "1+2"}, {text: "3"}],
        [{text: "9+9"}, {text: "18"}],
        [{text: "10+9"}, {text: "19"}],
        [{text: "8+8"}, {text: "16"}],
        [{text: "8+9"}, {text: "17"}],
        [{text: "7+7"}, {text: "14"}],
        [{text: "7+8"}, {text: "15"}],
        [{text: "6+6"}, {text: "12"}]
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
        ui: {audios: []},
        templates: [TEMPLATE_SUMS, TEMPLATE_LETTERS, TEMPLATE_SOUNDS],
        template: TEMPLATE_LETTERS,
        game: {
            selectedCards: [],
            mode: MODE_SPLITTED,
            cards: [],
            host: "",
            currentPlayer: "",
            players: [],
            size: 4
        },
        computeCards: computeCards,
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
        MemorizeApp.game.cards = [];
        MemorizeApp.game.selectedCards = [];

        if (!MemorizeApp.template) {
            return;
        }
        var suffledTemplate = JSON.parse(JSON.stringify(shuffle(MemorizeApp.template)));

        if (MemorizeApp.game.mode == MODE_CLASSIC) {
            var cards = [];
            for (var i = 0; i < suffledTemplate.length && i < MemorizeApp.game.size * MemorizeApp.game.size / 2; i++) {
                var card1 = suffledTemplate[i][0];
                var card2 = suffledTemplate[i][1];

                card1.id = i;
                card2.id = i;

                cards.push(card1);
                cards.push(card2);
            }
            MemorizeApp.game.cards = shuffle(cards);
        }

        if (MemorizeApp.game.mode == MODE_SPLITTED) {
            var cards1 = [];
            var cards2 = [];

            for (var i = 0; i < MemorizeApp.game.size * MemorizeApp.game.size / 2 && i < suffledTemplate.length; i++) {
                var card1 = suffledTemplate[i][0];
                var card2 = suffledTemplate[i][1];

                card1.id = i;
                card2.id = i;

                cards1.push(card1);
                cards2.push(card2);
            }

            var shuffledCard1 = shuffle(cards1);
            for (var i = 0; i < shuffledCard1.length; i++) {
                MemorizeApp.game.cards.push(shuffledCard1[i]);
            }

            var shuffledCard2 = shuffle(cards2);
            for (var i = 0; i < shuffledCard2.length; i++) {
                MemorizeApp.game.cards.push(shuffledCard2[i]);
            }
        }

    }


    function resizeText() {
        var elements = document.getElementsByClassName('textCard');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            while (el.scrollHeight > el.offsetHeight) {
                el.style.fontSize = parseInt(el.style.fontSize) - 1 + "px";
            }
            while (el.scrollWidth > el.offsetWidth) {
                el.style.fontSize = parseInt(el.style.fontSize) - 1 + "px";
            }
        }

    }

    function generateCardDiv(card, minSize) {
        if (card.image) {
            var div = document.createElement("div");
            div.style.background = "url('" + card.image + "')";
            div.style.backgroundRepeat = "no-repeat";
            div.style.backgroundSize = "contain";
            div.style.webkitBackgroundSize = "contain";
            div.style.backgroundPosition = "center center";
            div.style.height = minSize + "px";
            div.style.width = minSize + "px";

            return div;
        }

        if (card.text) {
            var div = document.createElement("div");
            div.className += "textCard";
            div.style.textAlign = "center";
            div.style.display = "block";
            div.innerHTML = card.text;
            div.style.lineHeight = minSize + "px";
            div.style.fontSize = minSize + 'px';
            div.style.color = "#000";
            div.style.width = minSize + "px";
            div.style.height = minSize + "px";

            return div;
        }
    }

    function createContext() {
        if (memorizeApp.context) {
            return;
        }
        var context = window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext;

        if (!context) {
            return;
        }
        context = new context();
        memorizeApp.context = context;

        // create empty buffer
        var buffer = context.createBuffer(1, 1, 22050);
        var source = context.createBufferSource();
        memorizeApp.source = source;
        source.buffer = buffer;

        // connect to output (your speakers)
        source.connect(context.destination);

        // play the file
        source.start(0);

    }

    function drawGame() {
        MemorizeApp.ui.gameGrid.innerHTML = "";

        var gameDiv = document.createElement("div");
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var middle = MemorizeApp.game.cards.length / 2;

        var minSize = height;
        if (width < height) {
            minSize = width;
        }
        minSize = minSize - (56 + 20) * 2;
        minSize = minSize / MemorizeApp.game.size;

        for (var i = 0; i < MemorizeApp.game.cards.length; i++) {
            var card = MemorizeApp.game.cards[i];

            if (i % MemorizeApp.game.size == 0 && i > 0) {
                var div = document.createElement("div");
                div.style.clear = "both";
                gameDiv.appendChild(div);
            }
            var fullCardDiv = document.createElement("div");
            fullCardDiv.cardPosition = i;
            fullCardDiv.style.margin = "5px";
            fullCardDiv.style.webkitTransition = "transform 0.5s";
            fullCardDiv.style.transition = "transform 0.5s";
            fullCardDiv.style.transformStyle = "preserve-3d";
            fullCardDiv.style.webkitTransformStyle = "preserve-3d";
            fullCardDiv.style.position = "relative";
            if (!card.solved) {
                fullCardDiv.style.webkitTransform = "rotateY(180deg)";
                fullCardDiv.style.transform = "rotateY(180deg)";
            }
            if (MemorizeApp.game.selectedCards.length != 0) {
                if (MemorizeApp.game.selectedCards[0].cardPosition == fullCardDiv.cardPosition) {
                    fullCardDiv.style.webkitTransform = "";
                    fullCardDiv.style.transform = "";
                }
            }

            fullCardDiv.style.float = "left";
            fullCardDiv.style.height = minSize + "px";
            fullCardDiv.style.width = minSize + "px";


            var front = document.createElement("div");
            if (MemorizeApp.game.mode == MODE_CLASSIC) {
                front.style.background = "#aaa url(icons/number1.svg)";
            }
            if (MemorizeApp.game.mode == MODE_SPLITTED) {
                if (i < middle) {
                    front.style.background = "#aaa url(icons/number1.svg)";
                } else {
                    front.style.background = "#aaa url(icons/number2.svg)";
                }
            }
            front.zIndex = 2;
            front.style.webkitBackfaceVisibility = "hidden";
            front.style.backfaceVisibility = "hidden";
            front.style.webkitTransform = "rotateY(180deg)"
            front.style.transform = "rotateY(180deg)"
            front.style.backgroundPosition = "center center";
            front.style.backgroundRepeat = "no-repeat";
            front.style.height = minSize + "px";
            front.style.position = "absolute";
            front.style.top = "0px";
            front.style.left = "0px";
            front.style.width = minSize + "px";

            var div = document.createElement("div");
            var generatedDiv = generateCardDiv(MemorizeApp.game.cards[i], minSize);
            div.appendChild(generatedDiv);

            div.style.height = minSize + "px";

            div.style.webkitBackfaceVisibility = "hidden";
            div.style.backfaceVisibility = "hidden";
            div.style.mozBackfaceVisibility = "hidden";
            div.style.position = "absolute";
            //div.style.zIndex = 99;
            div.style.top = "0px";
            div.style.left = "0px";
            div.style.width = minSize + "px";
            div.style.background = "#fff";
            div.style.border = "1px solid #ccc";

            fullCardDiv.card = card;

            var clickEvent = "click";
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                clickEvent = "touchstart";
            }
            fullCardDiv.addEventListener(clickEvent, function () {
                createContext();

                var t = this;

                if (t.card.solved) {
                    return;
                }
                if (MemorizeApp.game.selectedCards.length == 2) {
                    return;
                }

                if (MemorizeApp.game.mode == MODE_SPLITTED && MemorizeApp.game.selectedCards.length == 1) {
                    if (t.cardPosition < middle && MemorizeApp.game.selectedCards[0].cardPosition < middle) {
                        return;
                    }
                    if (t.cardPosition >= middle && MemorizeApp.game.selectedCards[0].cardPosition >= middle) {
                        return;
                    }
                }

                t.style.webkitTransform = "";
                t.style.transform = "";

                MemorizeApp.game.selectedCards.push(t);


                if (this.card.sound) {

                    var b64 = TEMPLATE_SOUNDS[0][0].sound.split("base64,")[1];
                    b64 = Base64Binary.decodeArrayBuffer(btoa(atob(b64)));


                    if (MemorizeApp.context) {
                        MemorizeApp.context.decodeAudioData(b64, function (buffer) {
                            var source = MemorizeApp.context.createBufferSource(); // creates a sound source
                            MemorizeApp.source = source;
                            source.buffer = buffer;
                            source.connect(MemorizeApp.context.destination);
                            source.start(0);
                        }, function (err) {
                            console.log("err(decodeAudioData): " + err);
                        });
                    }

                }

                if (MemorizeApp.game.selectedCards.length == 1) {
                    return;
                }

                if (MemorizeApp.game.selectedCards[0].card.id == t.card.id) {
                    MemorizeApp.game.selectedCards[0].card.solved = true;
                    t.card.solved = true;
                    MemorizeApp.game.selectedCards = [];
                    return;
                }

                setTimeout(function () {
                    try {
                        t.style.webkitTransform = "rotateY(180deg)";
                        t.style.transform = "rotateY(180deg)";
                        MemorizeApp.game.selectedCards[0].style.webkitTransform = "rotateY(180deg)";
                        MemorizeApp.game.selectedCards[0].style.transform = "rotateY(180deg)";
                        MemorizeApp.game.selectedCards = [];
                    } catch (e) {}
                }, 2000)


            }, false);
            fullCardDiv.appendChild(div);
            fullCardDiv.appendChild(front);
            gameDiv.appendChild(fullCardDiv);

        }

        MemorizeApp.ui.gameGrid.appendChild(gameDiv);
        resizeText();
    }

    function onUsersListChanged(users) {
    }

    function initUI(callback) {
        MemorizeApp.ui.gameGrid = document.getElementById("game-grid");
        MemorizeApp.ui.gameEditor = document.getElementById("game-editor");

        MemorizeApp.ui.gameTemplatesButton = document.getElementById("game-templates-button");
        MemorizeApp.ui.gameSizeButton = document.getElementById("game-size-button");
        MemorizeApp.ui.gameResetButton = document.getElementById("game-reset-button");
        MemorizeApp.ui.gameResetButton.addEventListener("click", function () {
            MemorizeApp.computeCards();
            MemorizeApp.drawGame();
        });

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
        MemorizeApp.ui.gameGrid.innerHTML = "";
        MemorizeApp.game.selectedCards = [];

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

        MemorizeApp.drawGame();
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

    var Base64Binary = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        _arrayBufferToBase64: function (buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },

        /* will return a  Uint8Array type */
        decodeArrayBuffer: function (input) {
            var bytes = (input.length / 4) * 3;
            var ab = new ArrayBuffer(bytes);
            this.decode(input, ab);

            return ab;
        },

        removePaddingChars: function (input) {
            var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
            if (lkey == 64) {
                return input.substring(0, input.length - 1);
            }
            return input;
        },

        decode: function (input, arrayBuffer) {
            //get last chars to see if are valid
            input = this.removePaddingChars(input);
            input = this.removePaddingChars(input);

            var bytes = parseInt((input.length / 4) * 3, 10);

            var uarray;
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var j = 0;

            if (arrayBuffer)
                uarray = new Uint8Array(arrayBuffer);
            else
                uarray = new Uint8Array(bytes);

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            for (i = 0; i < bytes; i += 3) {
                //get the 3 octects in 4 ascii chars
                enc1 = this._keyStr.indexOf(input.charAt(j++));
                enc2 = this._keyStr.indexOf(input.charAt(j++));
                enc3 = this._keyStr.indexOf(input.charAt(j++));
                enc4 = this._keyStr.indexOf(input.charAt(j++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                uarray[i] = chr1;
                if (enc3 != 64) uarray[i + 1] = chr2;
                if (enc4 != 64) uarray[i + 2] = chr3;
            }

            return uarray;
        }
    }

    return MemorizeApp;
});