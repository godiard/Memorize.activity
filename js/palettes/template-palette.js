define(["sugar-web/graphics/palette"], function (palette) {

    'use strict';

    var templatepalette = {};

    templatepalette.TemplatePalette = function (invoker, primaryText, templates) {
        palette.Palette.call(this, invoker, primaryText);

        this.sharedEvent = document.createEvent("CustomEvent");
        this.sharedEvent.initCustomEvent('template', true, true, {});

        var div = document.createElement('div');
        for (var i = 0; i < templates.length; i++) {
            var button = document.createElement("button");
            button.style.borderRadius = "0";
            button.style.width = "100%";
            if (i != 0) {
                button.style.marginTop = "3px";
            }
            button.innerHTML = templates[i].name;
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
            var template = templates[i];

            (function (button, template) {
                button.addEventListener("click", function () {
                    that.sharedEvent.detail.value = template;
                    that.getPalette().dispatchEvent(that.sharedEvent);
                    that.popDown();
                });
            })(button, template);
            button.addEventListener('template', popDownOnButtonClick);
        }
    };

    var addEventListener = function (type, listener, useCapture) {
        return this.getPalette().addEventListener(type, listener, useCapture);
    };

    templatepalette.TemplatePalette.prototype =
        Object.create(palette.Palette.prototype, {
            addEventListener: {
                value: addEventListener,
                enumerable: true,
                configurable: true,
                writable: true
            }
        });

    return templatepalette;
});
