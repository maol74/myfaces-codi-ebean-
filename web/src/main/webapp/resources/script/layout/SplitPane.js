(function () {
    /**
     * a pull component which pulls
     * a certain area periodically
     */
    var _RT = myfaces._impl.core._Runtime;
    var _Lang = myfaces._impl._util._Lang;
    var _AjaxQueue = extras.apache.ExtendedEventQueue;

    _RT.extendClass("extras.apache.SplitPane", extras.apache.ContentPane, {
        /**
         * the refresh interval
         */
        sliderPos: null,
        resizeVertical: true,

        _resizable: true,
        _moveable: true,

        _initialMouseMos: null,
        _currentMousePos: null,
        vertical: true,


        constructor_:function(args) {
            this._callSuper("constructor_", args);

            this._componentType = "at.irian.VerticalSplitPane";
        },

        _postInit: function() {
            this._callSuper("_postInit", arguments);
            this.valueHolder = this.rootNode.querySelector("input.valueHolder");

            this.slider = new myfaces._impl._dom.Node(document.querySelector("#" + this.rootNode.id + " > .slider"));
            this.firstPanel = new myfaces._impl._dom.Node(document.querySelector("#" + this.rootNode.id + "> .first"));
            this.secondPanel = new myfaces._impl._dom.Node(document.querySelector("#" + this.rootNode.id + "> .second"));

            //valueholder overrides slider pos
            this.sliderPos = this.valueHolder.value || this.sliderPos || 30;
            this.pack();
            //we now layout our container

            //TODO register sliding events on the slider
        },
        /*initial packing*/
        pack: function() {
            if (this.vertical) {
                this._packVertically();
            } else {
                this._packHorizontally();
            }
        },

        _packVertically: function() {
            var containerHeight = this.rootNode.offsetHeight();
            var dividerHeight = this.slider.offsetHeight();

            var firstHeight = parseInt(this.sliderPos);
            var secondHeight = Math.floor(containerHeight - dividerHeight - firstHeight);
            var secondTop = Math.floor(firstHeight + dividerHeight);

            this.slider.style({top: firstHeight + "px"});
            this.firstPanel.style({height: firstHeight + "px"});
            this.secondPanel.style({height: secondHeight + "px", top: secondTop + "px"});

            //we now add a mouse behavior so that we can move the slider up and down
            new extras.apache._Movable(this, this.slider);

            this._originRootNode = 0;
            var obj = this.rootNode;
            do {
                this._originRootNode += obj.offsetTop();
            } while (obj = obj.offsetParent);
        },

        _packHorizontally: function() {
            var containerWidth = this.rootNode.offsetWidth();
            var dividerWidth = this.slider.offsetWidth();

            var firstWidth = parseInt(this.sliderPos);
            var secondWidth = Math.floor(containerWidth - dividerWidth - firstWidth);
            var secondLeft = Math.floor(firstWidth + dividerWidth);

            this.slider.style({left: firstWidth + "px"});
            this.firstPanel.style({width: firstWidth + "px"});
            this.secondPanel.style({width: secondWidth + "px", left: secondLeft + "px"});

            //we now add a mouse behavior so that we can move the slider up and down
            new extras.apache._Movable(this, this.slider);

            this._originRootNode = 0;
            var obj = this.rootNode;
            do {
                this._originRootNode += obj.offsetLeft();
            } while (obj = obj.offsetParent);
        },

        /**
         * callback from the movable handler
         */
        onmove: function(positiondata) {
            if (this.vertical) {
                this._onMoveVertically();
            } else {
                this._onMoveHorizontally();
            }
        },

        _onMoveVertically: function(positiondata) {
            //posY is the relativ position with the scroller position removed, within the viewport
            //we have to add the window scroller to the mix to get the final result
            positiondata.top = Math.floor(parseInt(positiondata.posY - this.slider.offsetHeight() / 2 - this._originRootNode));
            positiondata.top = Math.max(positiondata.top + window.scrollY, 0);
            positiondata.top = Math.min(this.rootNode.offsetHeight() - this.slider.offsetHeight(), positiondata.top);
            this.sliderPos = positiondata.top;

            this.valueHolder.value = this.sliderPos;
            this.pack();
        },

        _onMoveHorizontally: function(positiondata) {
            //posY is the relativ position with the scroller position removed, within the viewport
            //we have to add the window scroller to the mix to get the final result
            positiondata.left = Math.floor(parseInt(positiondata.posX - this.slider.offsetWidth() / 2 - this._originRootNode));
            positiondata.left = Math.max(positiondata.left + window.scrollX, 0);
            positiondata.left = Math.min(this.rootNode.offsetWidth() - this.slider.offsetWidth(), positiondata.left);
            this.sliderPos = positiondata.left;

            this.valueHolder.value = this.sliderPos;
            this.pack();
        }

    });
})();