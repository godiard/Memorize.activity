/**
 * Created by ohayon_m on 17/08/15.
 */

define(function (require) {

    // load game souds
    var bellSoundData = null;
    require(['bell'], function (url) {
        bellSoundData = url;
    });

    var trumpetSoundData = null;
    require(['trumpet'], function (url) {
        trumpetSoundData = url;
    });


        var SampleRessources = require("activity/sample-ressources");
        var templatePalette = require("activity/palettes/template-palette");
        var sizePalette = require("activity/palettes/size-palette");
        var lzString = require("activity/lz-string");
        var activity = require("sugar-web/activity/activity");
        var localizationData = require("activity/localization-data");

        require("activity/persistence");
        var cordobaIO = new persistence.CordobaIO();

        var FOUND_COLOR = "#84f060";
        var MODE_CLASSIC = "classic";
        var MODE_SPLITTED = "splitted";
        var MODE_EQUAL = "equal";
        var MODE_NON_EQUAL = "non_equal";
        var INLINE_RES = "#inline#";
        var CARD_MARGIN = 8;
        var BOARD_MARGIN = 15;
        var MAX_SECONDS_AUDIO = 7;

        // used to load word games
        var categories = null;
        var wordTranslations = null;

        var onAndroid = /Android/i.test(navigator.userAgent);
        if (window.location.search.indexOf('onAndroid') > -1) {
            onAndroid = true;
        };

        var onXo = ((window.innerWidth == 1200) && (window.innerHeight >= 900));
        var sugarCellSize = 75;
        var sugarSubCellSize = 15;
        if (!onXo && !onAndroid) {
            sugarCellSize = 55;
            sugarSubCellSize = 11;
        };

        var lang = navigator.language.substr(0, 2);
        console.log('LANG ' + lang);

        function _(text) {
            // this function add a fallback for the case of translation not found
            // can be removed when we find how to read the localization.ini
            // file in the case of local html file opened in the browser
            translation = localizationData[lang][text];
            if (translation == '') {
                translation = text;
            };
            return translation;
        };

        var TEMPLATE_SUMS = {
            name: _("Addition"), icon: "addition.svg",
            // cards are randomly created
            cards: null,
            cardsFunction: createAdditionCards,
            pairMode: MODE_NON_EQUAL,
            mode: MODE_SPLITTED,
            demo: true
        };

        var TEMPLATE_LETTERS = {
            name: _("Letters"), icon: "letters.svg", cards: [
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
            ],
            pairMode: MODE_NON_EQUAL,
            mode: MODE_SPLITTED,
            demo: true
        };

        var TEMPLATE_SOUNDS = {
            name: _("Sounds"), icon: "sounds.svg", cards: [
                [{image: INLINE_RES + "drumkit1_b", sound: INLINE_RES + "beat1_a"}],
                [{image: INLINE_RES + "drumkit2_b", sound: INLINE_RES + "beat1_b"}],
                [{image: INLINE_RES + "drumkit3_b", sound: INLINE_RES + "beat1_c"}],
                [{image: INLINE_RES + "drumkit4_b", sound: INLINE_RES + "beat8"}],
                [{image: INLINE_RES + "drumkit5_b", sound: INLINE_RES + "beat10"}],
                [{image: INLINE_RES + "drumkit6_b", sound: INLINE_RES + "beat3"}],
                [{image: INLINE_RES + "drumkit7_b", sound: INLINE_RES + "beat4"}],
                [{image: INLINE_RES + "drumkit8_b", sound: INLINE_RES + "beat14"}],
                [{image: INLINE_RES + "drumkit9_b", sound: INLINE_RES + "beat6_2"}],
                [{image: INLINE_RES + "drumkit10_b", sound: INLINE_RES + "beat2"}],
                [{image: INLINE_RES + "drumkit11_b", sound: INLINE_RES + "beat16"}],
                [{image: INLINE_RES + "drumkit12_b", sound: INLINE_RES + "beat17"}],
                [{image: INLINE_RES + "guitar1_2", sound: INLINE_RES + "bending_a"}],
                [{image: INLINE_RES + "guitar2_2", sound: INLINE_RES + "bending_b"}],
                [{image: INLINE_RES + "guitar3_2", sound: INLINE_RES + "flashcomp2a"}],
                [{image: INLINE_RES + "guitar4_2", sound: INLINE_RES + "flashcomp2b"}],
                [{image: INLINE_RES + "guitar5_2", sound: INLINE_RES + "gedaempft"}],
                [{image: INLINE_RES + "guitar6_2", sound: INLINE_RES + "ungedaempft"}],
                [{image: INLINE_RES + "guitar7_2", sound: INLINE_RES + "jimi4"}],
                [{image: INLINE_RES + "guitar8_2", sound: INLINE_RES + "git_hit1"}],
                [{image: INLINE_RES + "guitar9_2", sound: INLINE_RES + "git_hit4"}],
                [{image: INLINE_RES + "guitar10_2", sound: INLINE_RES + "jimi1"}],
                [{image: INLINE_RES + "guitar11_2", sound: INLINE_RES + "flasholet4"}],
                [{image: INLINE_RES + "guitar12_2", sound: INLINE_RES + "guitcello"}]
            ],
            pairMode: MODE_EQUAL,
            mode: MODE_CLASSIC,
            demo: true
        };

        function createWordCards(category) {
            var cardsArray = [];
            var words = categories[category].slice(0);
            var wordList = [];
            words.forEach(function(word, idx, array) {
                var translated = word;
                if (wordTranslations != null) {
                    translated = wordTranslations[word];
                };
                if (translated == '') {
                    console.log('WORD ' + word + ' UNTRANSLATED (' + category + ')');
                };
                if ((translated != null ) && (translated != '')) {
                    translated = translated.replace(/ /g, ' ');
                    //var imgData = require('images/' + word + '.png');
                    //cardsArray.push([{text: translated}, {image: imgData}]);
                    cardsArray.push([{text: translated}, {image: './images/' + word + '.png'}]);
                };
            });
            return cardsArray;
        };

        function initTemplatesList() {
            var templates = [TEMPLATE_SUMS, TEMPLATE_LETTERS, TEMPLATE_SOUNDS];

            // add words games
            if (categories == null) {
                categories = require("activity/categories_words");
            };
            if (wordTranslations == null) {
                switch(lang) {
                    case 'es':
                        wordTranslations = require("activity/words_es");
                        break;
                    case 'fr':
                        wordTranslations = require("activity/words_fr");
                        break;
                    case 'ht':
                        wordTranslations = require("activity/words_ht");
                        break;
                };
            };
            var categoryNames = ['actions', 'adjectives', 'animals',
                'bodyparts', 'clothes', 'colors', 'constructions',
                'emotions', 'food', 'fruits', 'furnitures',
                'houseware', 'jobs', 'nature', 'objects', 'people',
                'plants', 'sports', 'transports', 'tools', 'vegetables'];

            // sort translated categories
            var translatedCategories = {};
            categoryNames.forEach(function(category, idx, array) {
                var translatedCategory = category;
                if (wordTranslations != null) {
                    translatedCategory = wordTranslations[category];
                };
                translatedCategories[translatedCategory] = category;
            });

            Object.keys(translatedCategories).sort().forEach(function(
                    translatedCategory, idx, array) {
                var gameTemplate = {
                    name: translatedCategory, icon: "letters.svg",
                    cards: createWordCards(translatedCategories[translatedCategory]),
                    pairMode: MODE_NON_EQUAL,
                    mode: MODE_SPLITTED,
                    demo: true
                };
                templates.push(gameTemplate);
            });

            return templates;
        };

        var MemorizeApp = {
            strings: {add: _("Add"), update: _("Update"), remove: _("Remove")},
            ui: {},
            templates: initTemplatesList(),
            isHost: false,
            game: {
                template: TEMPLATE_LETTERS,
                multiplayer: false,
                selectedCards: [],
                mode: TEMPLATE_LETTERS.mode,
                cards: [],
                currentPlayer: "",
                players: [],
                pairMode: TEMPLATE_LETTERS.pairMode,
                size: 4,
            },
            editor: {pairMode: TEMPLATE_LETTERS.pairMode, card1: {}, card2: {}, selectedPair: -1},
            computeCards: computeCards,
            inEditMode: false,
            shareActivity: shareActivity,
            initUI: initUI,
            drawGame: drawGame,
            onUsersListChanged: onUsersListChanged,
            onDataReceived: onDataReceived
        };

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        function shareActivity(isHost) {
            if (!MemorizeApp.presence.isConnected()) {
                return;
            }
            MemorizeApp.inEditMode = false;

            leaveEditMode();
            disableEditMode();

            MemorizeApp.game.multiplayer = true;
            MemorizeApp.isHost = isHost;
            MemorizeApp.me = MemorizeApp.presence.userInfo;
            MemorizeApp.game.currentPlayer = MemorizeApp.me.networkId;
            MemorizeApp.ui.gamePlayers.style.display = "block";
        }

        function createAdditionCards() {
            //generate 'addition' cards on the fly
            var cardsArray = [];
            for (var result=2; result < 20; result++) {
                var a = Math.floor(Math.random() * (result -1)) + 1;
                var b = result - a;
                var key = String(a + '+' + b);
                var value = String(a + b);
                cardsArray.push([{text: key}, {text: value}])
            };
            return cardsArray;
        };

        function computeCards() {
            MemorizeApp.game.cards = [];
            MemorizeApp.game.selectedCards = [];
            MemorizeApp.game.cardsFound = 0;

            if (!MemorizeApp.game.template) {
                return;
            }
            MemorizeApp.game.mode = MemorizeApp.game.template.mode;
            MemorizeApp.game.pairMode = MemorizeApp.game.template.pairMode;
            MemorizeApp.editor.pairMode = MemorizeApp.game.template.pairMode;
            MemorizeApp.game.demo = MemorizeApp.game.template.demo;
            MemorizeApp.ui.gameEditorSaveButton.disabled = MemorizeApp.game.demo;
            MemorizeApp.game.name = MemorizeApp.game.template.name;

            var shuffledTemplate = {name: MemorizeApp.game.template.name, cards: []};
            if (MemorizeApp.game.template.cards != null) {
                shuffledTemplate.cards = JSON.parse(
                    JSON.stringify(shuffle(MemorizeApp.game.template.cards)));
            } else {
                cardsArray = MemorizeApp.game.template.cardsFunction();
                shuffledTemplate.cards = cardsArray;
                MemorizeApp.game.template.cards = cardsArray;
            };

            var cardsNumber = 0;
            if (MemorizeApp.game.size % 2 == 0) {
                cardsNumber = MemorizeApp.game.size * MemorizeApp.game.size;
            } else {
                cardsNumber = MemorizeApp.game.size * MemorizeApp.game.size - 2;
            }
            MemorizeApp.game.cardsNumber = cardsNumber;

            if (MemorizeApp.game.mode == MODE_CLASSIC) {
                var cards = [];
                for (var i = 0; i < shuffledTemplate.cards.length && i < cardsNumber / 2; i++) {
                    var card1 = shuffledTemplate.cards[i][0];
                    if (MemorizeApp.editor.pairMode == MODE_EQUAL) {
                        var card2 = shuffledTemplate.cards[i][0];
                    } else {
                        var card2 = shuffledTemplate.cards[i][1];
                    };
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

                for (var i = 0; i < cardsNumber / 2 && i < shuffledTemplate.cards.length; i++) {
                    var card1 = shuffledTemplate.cards[i][0];
                    var card2 = shuffledTemplate.cards[i][1];

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
            saveGame();
        }

        function resizeTextByClassName(className) {
            var elements = document.getElementsByClassName(className);
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                resizeText(el);
            }
        }

        function resizeText(el) {
            while (el.scrollHeight > el.offsetHeight) {
                el.style.fontSize = (parseInt(el.style.fontSize) - 1) + "px";
            }
            while (el.scrollWidth > el.offsetWidth) {
                var fontSize = parseInt(el.style.fontSize);
                el.style.fontSize = (fontSize - Math.round(fontSize / 10)) + "px";
            }
        }

        function generateCardDiv(card, minSize) {
            if (card.image) {
                if (card.image.indexOf(INLINE_RES) == 0) {
                    card.image = SampleRessources[card.image.slice(INLINE_RES.length)];
                }
                var div = document.createElement("div");
                div.className = "card-div";
                div.style.backgroundImage = "url('" + card.image + "')";
                div.style.height = minSize + "px";
                div.style.width = minSize + "px";

                return div;
            }

            if (card.text) {
                if (card.text.indexOf(INLINE_RES) == 0) {
                    card.text = SampleRessources[card.text.slice(INLINE_RES.length)];
                }
                var div = document.createElement("div");
                div.className = "text-card";
                div.innerHTML = card.text;
                div.style.lineHeight = minSize + "px";
                div.style.fontSize = (minSize * 0.8) + 'px';
                div.style.width = minSize + "px";
                div.style.height = minSize + "px";

                return div;
            }
        }

        function createAudioContextIfMissing() {
            if (MemorizeApp.context) {
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
            MemorizeApp.context = context;

            var buffer = context.createBuffer(1, 1, 22050);
            var source = context.createBufferSource();
            MemorizeApp.source = source;
            source.buffer = buffer;

            source.connect(context.destination);
            source.start(0);
        }

        function createFullCardDiv(i, minSize, card) {
            var fullCardDiv = document.createElement("div");
            fullCardDiv.className = "full-card";
            fullCardDiv.cardPosition = i;
            fullCardDiv.style.height = minSize + "px";
            fullCardDiv.style.width = minSize + "px";
            if (card.solved) {
                fullCardDiv.style.webkitTransform = "rotateY(180deg)";
                fullCardDiv.style.transform = "rotateY(180deg)";
            } else {
                fullCardDiv.style.webkitTransform = "";
                fullCardDiv.style.transform = "";
            }
            if (MemorizeApp.game.selectedCards.length != 0) {
                if (MemorizeApp.game.selectedCards[0].cardPosition == fullCardDiv.cardPosition) {
                    fullCardDiv.style.webkitTransform = "";
                    fullCardDiv.style.transform = "";
                }
            }

            return fullCardDiv;
        }

        function createFrontDiv(i, middle, minSize) {
            var front = document.createElement("div");
            front.className = "front-card";
            if (MemorizeApp.game.mode == MODE_SPLITTED) {
                if (i < middle) {
                    front.style.backgroundImage = "url(icons/number1.svg)";
                } else {
                    front.style.backgroundImage = "url(icons/number2.svg)";
                }
            }
            front.zIndex = 2;
            front.style.height = minSize + "px";
            front.style.width = minSize + "px";
            return front;
        }

        function createDiv(i, minSize, card) {
            var div = document.createElement("div");
            var generatedDiv = generateCardDiv(MemorizeApp.game.cards[i], minSize);
            div.appendChild(generatedDiv);
            div.className = "back-card";
            div.style.height = minSize + "px";
            div.style.width = minSize + "px";
            if (card.solved) {
                div.style.backgroundColor = FOUND_COLOR;
            }

            return div;
        }

        function playAudio(base64AudioData) {
            createAudioContextIfMissing();
            var b64 = base64AudioData.split("base64,")[1];
            b64 = Base64Binary.decodeArrayBuffer(btoa(atob(b64)));

            if (MemorizeApp.context) {
                MemorizeApp.context.decodeAudioData(b64, function (buffer) {
                    var source = MemorizeApp.context.createBufferSource(); // creates a sound source
                    if (MemorizeApp.source) {
                        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                            try {
                                MemorizeApp.source.noteOff(0);
                            } catch (e) {
                            }
                        } else {
                            try {
                                MemorizeApp.source.stop(0);
                            } catch (e) {
                            }
                        }
                    }
                    MemorizeApp.source = source;
                    source.buffer = buffer;
                    source.connect(MemorizeApp.context.destination);
                    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                        try {
                            source.noteOn(0);
                        } catch (e) {
                        }
                    } else {
                        try {
                            source.start(0);
                        } catch (e) {

                        }
                    }
                    MemorizeApp.context.timer = setTimeout(function() {
                        source.stop()}, MAX_SECONDS_AUDIO * 1000);

                }, function (err) {
                    console.log("err(decodeAudioData): " + err);
                });
            }
        }

        function cardClick(div, fromMe, user) {
            var middle = MemorizeApp.game.cards.length / 2;

            var t = div;

            if (t.card.solved || MemorizeApp.game.selectedCards.length == 2) {
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

            t.style.webkitTransform = "rotateY(180deg)";
            t.style.transform = "rotateY(180deg)";

            MemorizeApp.game.selectedCards.push(t);

            if (t.card.sound) {
                if (t.card.sound.indexOf(INLINE_RES) == 0) {
                    t.card.sound = SampleRessources[t.card.sound.slice(INLINE_RES.length)];
                }
                playAudio(t.card.sound);
            }

            if (MemorizeApp.game.selectedCards.length == 1) {
                return;
            }

            if (MemorizeApp.game.selectedCards[0].card.id == t.card.id) {
                MemorizeApp.game.selectedCards[0].card.solved = true;
                t.card.solved = true;

                for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                    if (MemorizeApp.game.players[i].networkId == user.networkId) {
                        MemorizeApp.game.players[i].score = MemorizeApp.game.players[i].score + 1;
                    }
                }

                displayUsersAndScores();
                var div1 = MemorizeApp.game.selectedCards[0].resultDiv;
                var div2 = t.resultDiv;
                setTimeout(function () {
                    div1.style.backgroundColor = FOUND_COLOR;
                    div2.style.backgroundColor = FOUND_COLOR;
                    div1.parentElement.style.borderColor = FOUND_COLOR;
                    div2.parentElement.style.borderColor = FOUND_COLOR;
                }, 1000);

                MemorizeApp.game.selectedCards = [];
                MemorizeApp.game.cardsFound += 2;
                if (MemorizeApp.game.cardsFound == MemorizeApp.game.cardsNumber) {
                    playAudio(trumpetSoundData);
                } else {
                    playAudio(bellSoundData);
                };
                saveGame();
                return;
            }

            MemorizeApp.game.currentPlayer = "";

            setTimeout(function () {
                try {
                    t.style.webkitTransform = "";
                    t.style.transform = "";
                    MemorizeApp.game.selectedCards[0].style.webkitTransform = "";
                    MemorizeApp.game.selectedCards[0].style.transform = "";
                    MemorizeApp.game.selectedCards = [];

                    setTimeout(function () {
                        if (fromMe) {
                            for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                                if (MemorizeApp.game.players[i].online && MemorizeApp.game.players[i].networkId != MemorizeApp.me.networkId) {
                                    MemorizeApp.game.currentPlayer = MemorizeApp.game.players[i].networkId;
                                    sendMessage({
                                        action: "updateCurrentPlayer",
                                        currentPlayer: MemorizeApp.game.currentPlayer
                                    });
                                    displayUsersAndScores();
                                    break;
                                }
                            }
                        }
                    }, 300);


                } catch (e) {
                }
            }, 2000)

        }

        function saveGame() {
            MemorizeApp.activity.getDatastoreObject().setDataAsText(JSON.stringify({game: MemorizeApp.game}));
            MemorizeApp.activity.getDatastoreObject().save(function (error, meta) {
            });
        }

        //var saveButton = document.getElementById("doc-save");
        //saveButton.addEventListener('click', function (e) {

        function askGameName() {
            // create a dialog to ask a name
            dialog = document.getElementById('ask-name-dialog');
            if (dialog != undefined) {
                dialog.style.display = 'block';
                return;
            };

            var dialog = document.createElement("div");
            dialog.className = "ask-name-dialog";
            dialog.id = 'ask-name-dialog';

            var inputDiv = document.createElement("div");
            inputDiv.className = 'card-btns-container';
            var label = document.createTextNode('Select game name:');

            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.style.marginRight = "auto";
            input.style.marginLeft = "20px";
            input.style.marginBottom = "10px";
            input.style.fontSize = "20px";
            input.style.display = 'table-cell';
            input.value = MemorizeApp.game.name != undefined ? MemorizeApp.game.name : '';

            var elements = [label, input];
            elements.forEach(function(el, idx, array) {
                inputDiv.appendChild(el);
            });

            // add buttons
            var btnDiv = document.createElement("div");
            btnDiv.className = 'card-btns-container';
            var buttonSize = '60px';
            var acceptBtn = createEditionBtn(buttonSize, 'icons/dialog-ok.svg', null);
            var cancelBtn = createEditionBtn(buttonSize, 'icons/dialog-cancel.svg', null);
            acceptBtn.addEventListener("click", function (e) {
                MemorizeApp.game.name = input.value;
                storeGame();
                dialog.style.display = 'none';
            });
            cancelBtn.addEventListener("click", function (e) {
                dialog.style.display = 'none';
            });
            var btns = [acceptBtn, cancelBtn];
            btns.forEach(function(btn, idx, array) {
                btn.style.display = 'table-cell';
                btnDiv.appendChild(btn);
            });
            dialog.appendChild(inputDiv);
            dialog.appendChild(btnDiv);
            document.body.appendChild(dialog);
        };

        function storeGame() {
            var content = JSON.stringify({game: MemorizeApp.game});
            var fileName = MemorizeApp.game.name + '.memorize';
            if (onAndroid) {
                cordobaIO.save(content, fileName);
                //activity.showAlert(_('ToonSaved'),
                //    _('FileSavedSuccessfully'), null, null);
            } else {
                saveAs(content, fileName);
            };
        };

        function onCardClick() {
            if (MemorizeApp.game.multiplayer) {
                if (MemorizeApp.game.currentPlayer != MemorizeApp.me.networkId) {
                    return;
                }
                sendMessage({action: "cardClick", position: this.cardPosition});
                if (MemorizeApp.game.players.length == 0 || MemorizeApp.game.players.length == 1) {
                    cardClick(this, true);
                }
                for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                    if (MemorizeApp.game.players[i].networkId == MemorizeApp.me.networkId) {
                        cardClick(this, true, MemorizeApp.game.players[i]);
                    }
                }
            } else {
                cardClick(this, true);
            }

        }

        function drawGame() {
            if (MemorizeApp.editor.pairMode == MODE_EQUAL) {
                MemorizeApp.ui.gameEditorInsertModeButton.style.backgroundImage = "url(icons/pair-equals.svg)"
            } else {
                MemorizeApp.ui.gameEditorInsertModeButton.style.backgroundImage = "url(icons/pair-non-equals.svg)"
            }
            if (MemorizeApp.game.template.mode == MODE_CLASSIC) {
                MemorizeApp.ui.gameEditorPlayModeButton.style.backgroundImage = "url(icons/grouped_game1.svg)";
            } else {
                MemorizeApp.ui.gameEditorPlayModeButton.style.backgroundImage = "url(icons/grouped_game2.svg)";
            }

            MemorizeApp.ui.gameSizeButton.style.background = "url(icons/" + MemorizeApp.game.size + "x" + MemorizeApp.game.size + ".svg)";
            MemorizeApp.ui.gameTemplatesButton.style.backgroundImage = "url(icons/" + MemorizeApp.game.template.icon + ")";

            MemorizeApp.ui.gameGrid.innerHTML = "";
            MemorizeApp.ui.gameGrid.style.marginTop = BOARD_MARGIN + 'px';

            var gameDiv = MemorizeApp.ui.gameGrid;
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var middle = MemorizeApp.game.cards.length / 2;

            var boardSize = height;
            if (width < height) {
                boardSize = width;
            }


            var minSize = ((boardSize - sugarCellSize - BOARD_MARGIN * 2) /
                MemorizeApp.game.size) - CARD_MARGIN * 2;

            for (var i = 0; i < MemorizeApp.game.cards.length; i++) {
                var card = MemorizeApp.game.cards[i];

                if (i % MemorizeApp.game.size == 0 && i > 0) {
                    var div = document.createElement("div");
                    div.style.clear = "both";
                    gameDiv.appendChild(div);
                }

                var fullCardDiv = createFullCardDiv(i, minSize, card);
                var front = createFrontDiv(i, middle, minSize);
                var div = createDiv(i, minSize, card);

                fullCardDiv.card = card;
                fullCardDiv.resultDiv = div;

                var clickEvent = "click";
                if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                    clickEvent = "touchstart";
                }
                fullCardDiv.addEventListener(clickEvent, onCardClick, false);
                fullCardDiv.appendChild(div);
                fullCardDiv.appendChild(front);
                gameDiv.appendChild(fullCardDiv);
            }

            var gridWidth = minSize * parseInt(MemorizeApp.game.size) +
                CARD_MARGIN * parseInt(MemorizeApp.game.size) * 2;

            gameDiv.style.width = gridWidth + "px";
            gameDiv.style.marginLeft = "auto";
            gameDiv.style.marginRight = "auto";

            resizeTextByClassName('text-card');
        }

        function onDataReceived(data) {
            if (data.user.networkId == MemorizeApp.me.networkId) {
                return;
            }

            data.content = JSON.parse(lzString.decompressFromUTF16(data.content));

            if (data.content.action == "updateCurrentPlayer") {
                MemorizeApp.game.currentPlayer = data.content.currentPlayer;
                displayUsersAndScores();
            }

            if (data.content.action == "updateGame") {
                MemorizeApp.game = data.content.game;
                MemorizeApp.ui.gameSizeButton.style.background = "url(icons/" + MemorizeApp.game.size + "x" + MemorizeApp.game.size + ".svg)";
                MemorizeApp.ui.gameTemplatesButton.style.backgroundImage = "url(icons/" + MemorizeApp.game.template.icon + ")";
                MemorizeApp.drawGame();
                displayUsersAndScores();
                saveGame();
            }

            if (data.content.action == "cardClick") {
                var notFilteredCards = MemorizeApp.ui.gameGrid.childNodes;
                var cards = [];

                for (var i = 0; i < notFilteredCards.length; i++) {
                    if (!notFilteredCards[i].style.clear || notFilteredCards[i].style.clear == "") {
                        cards.push(notFilteredCards[i]);
                    }
                }

                for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                    if (MemorizeApp.game.players[i].networkId == data.user.networkId) {
                        cardClick(cards[data.content.position], false, MemorizeApp.game.players[i]);
                    }
                }
            }
        }

        function sendMessage(content) {
            if (!MemorizeApp.game.multiplayer) {
                return;
            }
            var sharedId = window.top.sugar.environment.sharedId;
            if (!sharedId) {
                sharedId = MemorizeApp.presence.getSharedInfo().id
            }

            MemorizeApp.presence.sendMessage(sharedId, {
                user: MemorizeApp.presence.getUserInfo(),
                content: lzString.compressToUTF16(JSON.stringify(content))
            });
        }

        function displayUsersAndScores() {
            if (MemorizeApp.game.players.length == 0) {
                return;
            }
            var div = document.createElement("div");

            var myTurn = false;
            if (MemorizeApp.game.currentPlayer == MemorizeApp.me.networkId) {
                myTurn = true;
            }
            var canPlay = document.createElement("div");
            canPlay.style.float = "left";
            canPlay.style.marginTop = "10px";
            canPlay.style.width = "30px";
            canPlay.style.marginRight = "3px";
            canPlay.style.borderRight = "1px solid #fff";
            canPlay.style.height = "30px";
            if (myTurn) {
                canPlay.style.backgroundImage = "url(icons/play.svg)"
            } else {
                canPlay.style.backgroundImage = "url(icons/sandclock.svg)"
            }
            canPlay.style.backgroundPosition = "center center";
            canPlay.style.backgroundRepeat = "no-repeat";
            div.appendChild(canPlay);

            for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                var player = MemorizeApp.game.players[i];
                var d = document.createElement("div");
                d.style.paddingTop = "15px";
                var xoColor = generateXOLogoWithColor(player.colorvalue);
                var scores = "";
                for (var j = 0; j < player.score; j++) {
                    scores += '<img style="height:13px;" src="icons/pair-add.svg">';
                }
                d.innerHTML = '<img style="height:23px; vertical-align:middle; " src="' + xoColor + '"><span style="color:#fff;">' + player.name + "</span> " + scores;
                d.style.float = "left";
                if (i != 0) {
                    d.style.marginLeft = "10px";
                }
                div.appendChild(d);
            }
            MemorizeApp.ui.gamePlayers.innerHTML = "";
            MemorizeApp.ui.gamePlayers.appendChild(div);
        }

        function onUsersListChanged(users) {
            for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                MemorizeApp.game.players[i].online = false;
            }

            if (!MemorizeApp.hasLoadedMultiplayer && users.length >= 3) {
                document.getElementById("stop-button").click();
                return;
            }

            MemorizeApp.hasLoadedMultiplayer = true;


            if (users.length == 1) {
                MemorizeApp.isHost = true;
                MemorizeApp.game.currentPlayer = MemorizeApp.me.networkId;
                MemorizeApp.game.selectedCards = [];
                drawGame();
                displayUsersAndScores();
                return;
            }

            for (var i = 0; i < users.length; i++) {
                var found = false;
                for (var j = 0; j < MemorizeApp.game.players.length; j++) {
                    if (MemorizeApp.game.players[j].networkId == users[i].networkId) {
                        MemorizeApp.game.players[j].online = true;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    var user = users[i];
                    user.score = 0;
                    user.online = true;
                    MemorizeApp.game.players.push(user);
                }
            }
            if (MemorizeApp.isHost) {
                sendMessage({action: "updateGame", game: MemorizeApp.game});
            }
            displayUsersAndScores();
        }

        var xoLogo = '<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC \'-//W3C//DTD SVG 1.1//EN\'  \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\' [<!ENTITY stroke_color "#010101"><!ENTITY fill_color "#FFFFFF">]><svg enable-background="new 0 0 55 55" height="55px" version="1.1" viewBox="0 0 55 55" width="55px" x="0px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" y="0px"><g display="block" id="stock-xo_1_"><path d="M33.233,35.1l10.102,10.1c0.752,0.75,1.217,1.783,1.217,2.932   c0,2.287-1.855,4.143-4.146,4.143c-1.145,0-2.178-0.463-2.932-1.211L27.372,40.961l-10.1,10.1c-0.75,0.75-1.787,1.211-2.934,1.211   c-2.284,0-4.143-1.854-4.143-4.141c0-1.146,0.465-2.184,1.212-2.934l10.104-10.102L11.409,24.995   c-0.747-0.748-1.212-1.785-1.212-2.93c0-2.289,1.854-4.146,4.146-4.146c1.143,0,2.18,0.465,2.93,1.214l10.099,10.102l10.102-10.103   c0.754-0.749,1.787-1.214,2.934-1.214c2.289,0,4.146,1.856,4.146,4.145c0,1.146-0.467,2.18-1.217,2.932L33.233,35.1z" fill="&fill_color;" stroke="&stroke_color;" stroke-width="3.5"/><circle cx="27.371" cy="10.849" fill="&fill_color;" r="8.122" stroke="&stroke_color;" stroke-width="3.5"/></g></svg>';

        function generateXOLogoWithColor(color) {
            var coloredLogo = xoLogo;
            coloredLogo = coloredLogo.replace("#010101", color.stroke);
            coloredLogo = coloredLogo.replace("#FFFFFF", color.fill);

            return "data:image/svg+xml;base64," + btoa(coloredLogo);
        }

        function initUI(callback) {
            MemorizeApp.ui.gameGrid = document.getElementById("game-grid");
            MemorizeApp.ui.gamePlayers = document.getElementById("game-players");
            MemorizeApp.ui.gameEditor = document.getElementById("game-editor");

            MemorizeApp.ui.gameTemplatesButton = document.getElementById("game-templates-button");

            if (onAndroid) {
                cordobaIO.getFilesList(function (fileList) {
                    console.log(fileList);
                    fileList.forEach(function(fileName, idx, array) {
                        if (fileName.endsWith('.memorize')) {
                            fileName = fileName.substring(fileName.lastIndexOf('/') + 1);
                            var gameName = fileName.substring(0, fileName.indexOf('.memorize'));
                            var gameTemplate = {
                                name: gameName, icon: "custom.svg",
                                cards: [],
                                pairMode: MODE_NON_EQUAL,
                                mode: MODE_SPLITTED,
                                demo: false
                            };
                            createCardsStoredGame(gameTemplate, fileName);
                            MemorizeApp.templates.push(gameTemplate);
                        };
                    });
                    loadTemplatesPallete();
                });
            } else {
                loadTemplatesPallete();
            };

            MemorizeApp.ui.gameSizeButton = document.getElementById("game-size-button");
            var sp = new sizePalette.SizePalette(MemorizeApp.ui.gameSizeButton);
            sp.addEventListener('size', function (e) {
                for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                    MemorizeApp.game.players[i].score = 0;
                }
                MemorizeApp.game.size = e.detail.value;
                MemorizeApp.ui.gameSizeButton.style.background = "url(icons/" + e.detail.value + "x" + e.detail.value + ".svg)";
                MemorizeApp.computeCards();
                MemorizeApp.drawGame();
                sendMessage({action: "updateGame", game: MemorizeApp.game});
            });

            MemorizeApp.ui.gameResetButton = document.getElementById("game-reset-button");
            MemorizeApp.ui.gameResetButton.addEventListener("click", function () {
                for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                    MemorizeApp.game.players[i].score = 0;
                }
                MemorizeApp.game.selectedCards = [];
                MemorizeApp.game.cards = [];
                displayUsersAndScores();
                MemorizeApp.computeCards();
                MemorizeApp.drawGame();
                sendMessage({action: "updateGame", game: MemorizeApp.game});
            });

            MemorizeApp.ui.gameEditorButton = document.getElementById("game-editor-button");
            MemorizeApp.ui.gameEditorInsertModeButton = document.getElementById("game-editor-insert-mode-button");
            MemorizeApp.ui.gameEditorPlayModeButton = document.getElementById("game-editor-play-mode-button");

            MemorizeApp.ui.gameEditorPlayModeButton.addEventListener("click", function() {
                if (MemorizeApp.game.template.mode == MODE_CLASSIC) {
                    MemorizeApp.game.template.mode = MODE_SPLITTED;
                    MemorizeApp.ui.gameEditorPlayModeButton.style.backgroundImage = "url(icons/grouped_game2.svg)";
                } else {
                    MemorizeApp.game.template.mode = MODE_CLASSIC;
                    MemorizeApp.ui.gameEditorPlayModeButton.style.backgroundImage = "url(icons/grouped_game1.svg)";
                }
                saveGame();
                displayEditor();
            });

            MemorizeApp.ui.gameEditorClearButton = document.getElementById("game-editor-clear-button");
            MemorizeApp.ui.gameEditorSaveButton = document.getElementById("game-editor-save-button");
            MemorizeApp.ui.gameEditorSaveButton.addEventListener("click", function() {
                askGameName();
            });

            MemorizeApp.ui.gameEditorInsertModeButton.addEventListener("click", function() {
               if (MemorizeApp.editor.pairMode == MODE_EQUAL) {
                   MemorizeApp.game.pairMode = MODE_NON_EQUAL;
                   MemorizeApp.editor.pairMode = MODE_NON_EQUAL;
                   MemorizeApp.ui.gameEditorInsertModeButton.style.backgroundImage = "url(icons/pair-non-equals.svg)"
               } else {
                   MemorizeApp.game.pairMode = MODE_EQUAL;
                   MemorizeApp.editor.pairMode = MODE_EQUAL;
                   MemorizeApp.ui.gameEditorInsertModeButton.style.backgroundImage = "url(icons/pair-equals.svg)"
               }
                saveGame();
                displayEditor();
            });

            MemorizeApp.ui.gameEditorClearButton.addEventListener("click", function() {
                activity.showConfirmationAlert(_('ATENTION'),
                    _('RemoveAllConfirmMessage'),
                    _('Yes'), _('No'), function(result) {
                        if (result) {
                            MemorizeApp.game.template.cards = [];
                            saveGame();
                            displayEditor();
                        };
                    });
            });

            MemorizeApp.ui.gameEditorButton.addEventListener("click", function () {
                if (MemorizeApp.inEditMode) {
                    leaveEditMode();
                } else {
                    enterEditMode();
                }
            });

            MemorizeApp.ui.gameEditorInsertModeButton.disabled = true;
            MemorizeApp.ui.gameEditorPlayModeButton.disabled = true;
            MemorizeApp.ui.gameEditorClearButton.disabled = true;
            MemorizeApp.ui.gameEditorSaveButton.disabled = true;

            if (callback) {
                callback();
            }
        }

        function loadTemplatesPallete() {
            var gt = new templatePalette.TemplatePalette(MemorizeApp.ui.gameTemplatesButton, undefined, MemorizeApp.templates);
            gt.addEventListener('template', function (e) {
                for (var i = 0; i < MemorizeApp.game.players.length; i++) {
                    MemorizeApp.game.players[i].score = 0;
                }
                MemorizeApp.game.template = e.detail.value;
                MemorizeApp.ui.gameTemplatesButton.style.backgroundImage = "url(icons/" + e.detail.value.icon + ")";
                MemorizeApp.computeCards();
                MemorizeApp.drawGame();
                sendMessage({action: "updateGame", game: MemorizeApp.game});
            });

        };

        function createCardsStoredGame(gameTemplate, fileName) {
            console.log('createCardsStoredGame ' + fileName);
            cordobaIO.read(fileName, function(content) {
                var game = JSON.parse(content)['game'];
                console.log('game ' + game);
                gameTemplate.cards = game.template.cards;
                gameTemplate.pairMode = game.pairMode;
                gameTemplate.mode = game.mode;
            });
        };

        function enterEditMode() {
            MemorizeApp.inEditMode = true;
            MemorizeApp.ui.gameGrid.innerHTML = "";
            MemorizeApp.ui.gameGrid.style.display = "none";
            MemorizeApp.ui.gameEditor.style.display = "block";
            MemorizeApp.game.selectedCards = [];
            MemorizeApp.editor.selectedPair = -1;

            /* Disable game buttons */

            MemorizeApp.ui.gameTemplatesButton.disabled = true;
            MemorizeApp.ui.gameSizeButton.disabled = true;
            MemorizeApp.ui.gameResetButton.disabled = true;

            /* Enable editor buttons */

            MemorizeApp.ui.gameEditorInsertModeButton.disabled = false;
            MemorizeApp.ui.gameEditorPlayModeButton.disabled = false;
            MemorizeApp.ui.gameEditorClearButton.disabled = false;
            MemorizeApp.ui.gameEditorSaveButton.disabled = MemorizeApp.game.demo;

            MemorizeApp.ui.gameEditorButton.style.backgroundImage = "url(icons/play.svg)";

            displayEditor();

            var minSize = document.body.clientWidth;
            if (minSize > document.body.clientHeight) {
                minSize = document.body.clientHeight;
            }

            var editorElement = document.getElementsByClassName('edit-card-box')[0];
            var editorHeight = editorElement.offsetHeight;
            MemorizeApp.ui.gameEditor.style.paddingTop =
                (minSize * 2 / 3 - sugarCellSize - editorHeight) / 2 + "px";
        }

        function generateEditorDiv(card) {
            var minSize = document.body.clientWidth;
            if (minSize > document.body.clientHeight) {
                minSize = document.body.clientHeight;
            }
            var buttonSize = parseInt((minSize / 3.5) / 5) + "px";

            var e = document.createElement("div");
            e.style.width = parseInt(minSize / 3.5) + "px";
            e.className = "edit-card-box";

            var d = document.createElement("div");
            var cardSize = parseInt(minSize / 3.5) - 10;
            d.style.width = cardSize + "px";
            d.style.height = cardSize + "px";
            d.style.fontSize = (cardSize * 0.8) + "px";
            d.style.lineHeight = cardSize + "px";
            d.className = "edit-card";
            d.style.position = 'relative';
            if (card && card.text) {
                d.innerHTML = card.text;
            }
            if (card.image) {
                if (card.image.indexOf(INLINE_RES) == 0) {
                    card.image = SampleRessources[card.image.slice(INLINE_RES.length)]
                }
                d.style.backgroundImage = "url('" + card.image + "')";
            }
            if (card.sound) {
                if (card.sound.indexOf(INLINE_RES) == 0) {
                    card.sound = SampleRessources[card.sound.slice(INLINE_RES.length)];
                }
                var playBtn = document.createElement("div");
                playBtn.className = 'play-sound-button';
                playBtn.style.width = buttonSize;
                playBtn.style.height = buttonSize;
                playBtn.style.borderRadius = parseInt((minSize / 3.5) / 10) + "px";
                playBtn.addEventListener("click", function (e) {playAudio(card.sound)});
                d.appendChild(playBtn);
            }

            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.style.marginRight = "auto";
            input.style.marginLeft = "auto";
            input.style.width = parseInt(minSize / 3.5) - 10 + "px";
            input.style.marginBottom = "10px";
            input.style.fontSize = "20px";
            input.tanIndex = 1;
            input.card = card;
            if (card && card.text) {
                input.value = card.text;
            }

            input.linkedDiv = d;
            input.onkeyup = function () {
                this.linkedDiv.innerHTML = this.value;
                this.linkedDiv.style.fontSize = this.linkedDiv.style.width;
                this.card.text = this.value;
                resizeText(this.linkedDiv);
            };

            // add image and sound buttons
            var btnDiv = document.createElement("div");
            btnDiv.className = 'card-btns-container';

            var imageBtn = createEditionBtn(buttonSize, 'icons/image.svg', null);
            var audioBtn = createEditionBtn(buttonSize, 'icons/audio.svg', null);
            var clearBtn = createEditionBtn(buttonSize, 'icons/dialog-cancel.svg', null);
            imageBtn.addEventListener("click", function (e) {imageBtnCb(card)});
            clearBtn.addEventListener("click", function (e) {clearCardBtnCb(card)});
            audioBtn.addEventListener("click", function (e) {audioBtnCb(card)});
            var btns = [imageBtn, audioBtn, clearBtn];
            btns.forEach(function(btn, idx, array) {
                btn.style.display = 'table-cell';
                btnDiv.appendChild(btn);
            });
            e.appendChild(input);
            e.appendChild(d);
            e.appendChild(btnDiv);
            return e;
        }

        function clearCardBtnCb(card) {
            card.text = '';
            card.image = '';
            card.sound = '';
            updatePairModel();
        };

        function imageBtnCb(card) {
            var imageChooser = document.getElementById('image-loader');

            imageChooser.addEventListener('change', function (event) {
                // Read file here.
                var reader = new FileReader();
                reader.onloadend = (function () {
                    card.image = reader.result;
                    updatePairModel();
                });

                var file = imageChooser.files[0];
                if (file) {
                    reader.readAsDataURL(file);
                };
            }, false);

            imageChooser.focus();
            imageChooser.click();
        };

        function audioBtnCb(card) {
            var audioChooser = document.getElementById('audio-loader');

            audioChooser.addEventListener('change', function (event) {
                // Read file here.
                var reader = new FileReader();
                reader.onloadend = (function () {
                    card.sound = reader.result;
                    updatePairModel();
                });

                var file = audioChooser.files[0];
                if (file) {
                    reader.readAsDataURL(file);
                };
            }, false);

            audioChooser.focus();
            audioChooser.click();
        };

        function createEditionBtn(buttonSize, imageUrl, text) {
            var button = document.createElement("div");
            button.className = 'edit-button';
            var html = "<img style='height:" + buttonSize + "; width:" + buttonSize + ";'" +
                " src='"+ imageUrl + "'>";
            if (text != null) {
                html = html + "<br/>" + text;
            };
            button.innerHTML = html;
            return button;
        };

        function generateAddEditRemoveButton() {
            var btnPanel = document.createElement("div");
            var minSize = document.body.clientWidth;
            if (minSize > document.body.clientHeight) {
                minSize = document.body.clientHeight;
            }

            btnPanel.style.float = "left";
            btnPanel.style.height = parseInt(minSize / 3.5) + "px";
            btnPanel.style.marginLeft = "20px";
            btnPanel.style.marginTop = "7px";

            var buttonSize = parseInt((minSize / 3.5) / 5) + "px";

            var addButton = createEditionBtn(buttonSize, 'icons/pair-add.svg',
                                             MemorizeApp.strings.add);

            var updateButton = createEditionBtn(buttonSize, 'icons/pair-update.svg',
                                             MemorizeApp.strings.update);

            var deleteButton = createEditionBtn(buttonSize, 'icons/remove.svg',
                                             MemorizeApp.strings.remove);

            addButton.addEventListener("click", function () {
                var cards = [];
                if (MemorizeApp.editor.pairMode == MODE_EQUAL) {
                    cards[0] = MemorizeApp.editor.card1;
                    cards[1] = MemorizeApp.editor.card1;
                }
                if (MemorizeApp.editor.pairMode == MODE_NON_EQUAL) {
                    cards[0] = MemorizeApp.editor.card1;
                    cards[1] = MemorizeApp.editor.card2;
                }

                if (!cards[0].text && !cards[0].image && !cards[0].sound) {
                    return;
                }

                if (!cards[1].text && !cards[1].image && !cards[1].sound) {
                    return;
                }

                cards = JSON.parse(JSON.stringify(cards));
                MemorizeApp.editor.card1 = {};
                MemorizeApp.editor.card2 = {};
                MemorizeApp.game.template.cards.push(cards);
                MemorizeApp.editor.selectedPair = -1;
                saveGame();
                markGameModified();
                displayEditor();
                var listContainer = document.getElementById('card-list-container');
                listContainer.scrollLeft = listContainer.scrollWidth;
            });

            updateButton.addEventListener("click", updatePairModel);

            deleteButton.addEventListener("click", function () {
                if (MemorizeApp.editor.selectedPair > -1) {
                    MemorizeApp.game.template.cards.splice(MemorizeApp.editor.selectedPair, 1);
                }

                MemorizeApp.editor.selectedPair = -1;
                MemorizeApp.editor.card1 = {};
                MemorizeApp.editor.card2 = {};
                saveGame();
                markGameModified();
                displayEditor();
            });

            btnPanel.appendChild(addButton);
            btnPanel.appendChild(updateButton);
            btnPanel.appendChild(deleteButton);

            return btnPanel;
        }

        function updatePairModel() {
            var cards = [];
            if (MemorizeApp.editor.pairMode == MODE_EQUAL) {
                cards[0] = MemorizeApp.editor.card1;
                cards[1] = MemorizeApp.editor.card1;
            }
            if (MemorizeApp.editor.pairMode == MODE_NON_EQUAL) {
                cards[0] = MemorizeApp.editor.card1;
                cards[1] = MemorizeApp.editor.card2;
            }

            cards = JSON.parse(JSON.stringify(cards));

            if (MemorizeApp.editor.selectedPair > -1) {
                MemorizeApp.game.template.cards[MemorizeApp.editor.selectedPair] = cards
            }
            saveGame();
            displayEditor();
            markGameModified();
        };

        function markGameModified() {
            MemorizeApp.game.demo = false;
            MemorizeApp.ui.gameEditorSaveButton.disabled = MemorizeApp.game.demo;
        };

        function generateCardFromCardsList(pair, minSize, index) {
            var d = document.createElement("div");
            d.style.display = "inline-block";
            d.style.height = minSize + "px";
            d.style.marginLeft = "2px";
            d.style.borderRadius = "8px";

            if (index == MemorizeApp.editor.selectedPair) {
                d.style.border = "3px solid #00f"; // blue
            } else {
                d.style.border = "3px solid #fff";
            };

            var card1 = createCardForPairList(pair[0], minSize);
            var secondCard = (MemorizeApp.editor.pairMode == MODE_EQUAL) ? pair[0] : pair[1];
            if (secondCard == undefined) {
                // if the user changes to equals mode
                secondCard = card1;
            };
            var card2 = createCardForPairList(secondCard, minSize);
            d.appendChild(card1);
            d.appendChild(card2);

            return d;
        }

        function createCardForPairList(cardData, size) {
            var card = document.createElement("div");
            card.innerHTML = "&nbsp;";
            card.className = "card-list";

            if (cardData.text) {
                if (cardData.text.indexOf(INLINE_RES) == 0) {
                    cardData.text = SampleRessources[cardData.image.slice(INLINE_RES.length)]
                }
                card.innerHTML = cardData.text;
            }
            else if (cardData.image) {
                if (cardData.image.indexOf(INLINE_RES) == 0) {
                    cardData.image = SampleRessources[cardData.image.slice(INLINE_RES.length)]
                }
                card.style.backgroundImage = "url('" + cardData.image + "')";

            }
            var cardSize = (size - 10) / 2;
            card.style.width = cardSize + "px";
            card.style.height = cardSize + "px";
            card.style.lineHeight = cardSize + "px";
            card.style.fontSize = (cardSize * 0.8) + "px";
            return card;
        };

        function generateCardsList() {
            var div = document.createElement("div");
            var minSize = document.body.clientWidth;
            if (minSize > document.body.clientHeight) {
                minSize = document.body.clientHeight;
            }

            div.className = 'card-list-container';
            div.id = 'card-list-container';
            div.style.width = document.body.clientWidth + "px";
            var height = parseInt(minSize / 3);
            div.style.height = height + "px";
            div.tabIndex = -1;

            for (var i = 0; i < MemorizeApp.game.template.cards.length; i++) {
                var card = MemorizeApp.game.template.cards[i];
                var pair = generateCardFromCardsList(card, height, i);
                pair.cards = card;
                pair.index = i;
                pair.addEventListener("click", function() {
                    MemorizeApp.editor.selectedPair = this.index;
                    MemorizeApp.editor.card1 = this.cards[0];
                    MemorizeApp.editor.card2 = this.cards[1];
                    displayEditor();
                });
                div.appendChild(pair);
            }

            return div;
        }

        window.onkeydown = function(e) {
            // change the pair selected in edit mode with the keyboard

            // use onkeydown event in the window because
            // didn't find a way to catch the event in the div

            // if a input is focused, document.activeElement
            // returns the input, else returns body
            if (MemorizeApp.inEditMode &&
                    document.activeElement == document.body) {

                var newIndex = MemorizeApp.editor.selectedPair;
                e = e || event;
                if (e.keyCode == 37) { // left
                    newIndex = newIndex - 1;
                } else if (e.keyCode == 39) { // right
                    newIndex = newIndex + 1;
                } else {
                    return;
                };
                if (newIndex < 0 ||
                    newIndex == MemorizeApp.game.template.cards.length) {
                    return;
                }

                MemorizeApp.editor.selectedPair = newIndex;
                var card = MemorizeApp.game.template.cards[newIndex];
                MemorizeApp.editor.card1 = card[0];
                MemorizeApp.editor.card2 = card[1];
                displayEditor();
            };
        };


        function generateClearBoth() {
            var d = document.createElement("div");
            d.style.clear = "both";
            return d;
        }

        function displayEditor() {
            MemorizeApp.ui.gameEditor.innerHTML = "";

            var editor1 = generateEditorDiv(MemorizeApp.editor.card1);
            MemorizeApp.ui.gameEditor.appendChild(editor1);

            if (MemorizeApp.editor.pairMode == MODE_NON_EQUAL) {
                var editor2 = generateEditorDiv(MemorizeApp.editor.card2);
                MemorizeApp.ui.gameEditor.appendChild(editor2);
            }
            // calculate aprox width of previews more edition buttons
            var editionWidth = editor1.offsetWidth * 2.5;
            editor1.style.paddingLeft =
                ((document.body.clientWidth - editionWidth) / 2) + "px";

            MemorizeApp.ui.gameEditor.appendChild(generateAddEditRemoveButton());
            MemorizeApp.ui.gameEditor.appendChild(generateClearBoth());
            var cardList = generateCardsList();
            MemorizeApp.ui.gameEditor.appendChild(cardList);

            // scroll the cardlist if the selected pair is not visible
            var cardHeight = parseInt(cardList.style.height) / 2;
            if (MemorizeApp.editor.selectedPair * cardHeight >
                    document.body.clientWidth) {
                cardList.scrollLeft = MemorizeApp.editor.selectedPair *
                     cardHeight;
            };

            // resize the text
            resizeTextByClassName('edit-card');
            resizeTextByClassName('card-list');
        }

        function leaveEditMode() {
            MemorizeApp.editor.card1 = {};
            MemorizeApp.editor.card2 = {};
            MemorizeApp.inEditMode = false;
            MemorizeApp.ui.gameEditor.innerHTML = "";
            MemorizeApp.ui.gameEditor.style.display = "none";
            MemorizeApp.ui.gameGrid.style.display = "block";

            /* Enable game buttons */

            MemorizeApp.ui.gameTemplatesButton.disabled = false;
            MemorizeApp.ui.gameSizeButton.disabled = false;
            MemorizeApp.ui.gameResetButton.disabled = false;

            /* Disable editor buttons */

            MemorizeApp.ui.gameEditorInsertModeButton.disabled = true;
            MemorizeApp.ui.gameEditorPlayModeButton.disabled = true;
            MemorizeApp.ui.gameEditorClearButton.disabled = true;

            MemorizeApp.ui.gameEditorButton.style.backgroundImage = "url(icons/cog.svg)";

            MemorizeApp.drawGame();
        }

        function disableEditMode() {
            /* Disable All editor buttons */

            MemorizeApp.ui.gameEditorButton.disabled = true;
            MemorizeApp.ui.gameEditorButton.style.backgroundImage = "url(icons/cog.svg)";
            MemorizeApp.ui.gameEditorInsertModeButton.disabled = true;
            MemorizeApp.ui.gameEditorPlayModeButton.disabled = true;
            MemorizeApp.ui.gameEditorClearButton.disabled = true;
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
    }
);
