define(["sugar-web/graphics/palette"], function (palette) {

    'use strict';

    var sizepalette = {};

    sizepalette.SizePalette = function (invoker, primaryText) {
        palette.Palette.call(this, invoker, primaryText);

        this.sharedEvent = document.createEvent("CustomEvent");
        this.sharedEvent.initCustomEvent('size', true, true, {});

        var div = document.createElement('div');
        for (var i = 4; i <= 6; i++) {
            var button = document.createElement("button");
            button.style.borderRadius = "0";
            button.style.width = "100%";
            if (i != 4) {
                button.style.marginTop = "3px";
            }
            button.innerHTML = i.toString();
            div.appendChild(button);
        }
        this.setContent([div]);

        // Pop-down the palette when a item in the menu is clicked.

        this.buttons = div.querySelectorAll('button');
        var that = this;

        function popDownOnButtonClick(event) {
            console.log(event);
            that.popDown();
        }

        for (var i = 0; i < this.buttons.length; i++) {
            var t = this;
            var button = t.buttons[i];

            (function (button) {
                button.addEventListener("click", function () {
                    that.sharedEvent.detail.value = button.innerHTML;
                    that.getPalette().dispatchEvent(that.sharedEvent);
                    invoker.style.background = "url(icons/"+ button.innerHTML + "x" + button.innerHTML + ".svg)";
                    that.popDown();
                });
            })(button);
            button.addEventListener('size', popDownOnButtonClick);
        }
    };

    var addEventListener = function (type, listener, useCapture) {
        return this.getPalette().addEventListener(type, listener, useCapture);
    };

    sizepalette.SizePalette.prototype =
        Object.create(palette.Palette.prototype, {
            addEventListener: {
                value: addEventListener,
                enumerable: true,
                configurable: true,
                writable: true
            }
        });

    return sizepalette;
});
