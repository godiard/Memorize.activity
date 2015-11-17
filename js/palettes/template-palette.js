define(["sugar-web/graphics/palette"], function (palette) {

    'use strict';

    var templatepalette = {};

    templatepalette.TemplatePalette = function (invoker, primaryText, templates) {
        palette.Palette.call(this, invoker, primaryText);

        this.sharedEvent = document.createEvent("CustomEvent");
        this.sharedEvent.initCustomEvent('template', true, true, {});

        this.buttons = [];

        var content = document.createElement('div');
        var columns = 1;
        var buttonsHeight = 50;
        var canvasHaight =  window.innerHeight - 75; // aprox toolbar height
        while (buttonsHeight * templates.length / columns > canvasHaight) {
            columns++;
        };
        var elementWidth = 180;
        content.style.width = (columns * elementWidth) + "px";
        var col = document.createElement('div');
        col.style.display= 'inline-block';
        content.appendChild(col);
        for (var i = 0; i < templates.length; i++) {
            var template = templates[i];
            var button = document.createElement("div");
            button.value = template;
            button.onmouseover = function() {
                this.style.background = "#ccc";
            };

            button.onmouseout = function() {
                this.style.background = "#000";
            };
            button.style.borderRadius = "0";
            button.style.width = elementWidth + "px";
            if (i != 0) {
                button.style.marginTop = "3px";
            }
            button.innerHTML = "<img style='vertical-align: middle; margin:3px;' " +
                "src='icons/" + template.icon + "'> " + template.name;
            col.appendChild(button);
            if (((i + 1) % Math.floor(templates.length / columns)) == 0) {
                var col = document.createElement('div');
                col.style.display= 'inline-block';
                content.appendChild(col);
            };
            this.buttons.push(button);
        }
        this.setContent([content]);
        // overwrite max-width defined in sugar.css for wrapper div
        this.getPalette().children[1].style.maxWidth =
            (columns * elementWidth) + "px";

        // Pop-down the palette when a item in the menu is clicked.

        var that = this;

        that.getPalette().firstChild.style.backgroundColor = "transparent";
        that.getPalette().firstChild.style.backgroundImage = "";

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
