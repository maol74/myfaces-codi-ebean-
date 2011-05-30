( function() {

    var _RT = myfaces._impl.core._Runtime;
    var _Lang = myfaces._impl._util._Lang;

    /**
     * a variable selection list
     * which can be any type of list (table, ul, list of
     * subsequent div combinations)
     *
     * this class adds the needed callback listeners
     * and mouse and keyboard event handlers to enable
     * it
     *
     * TODO onclick element selection handler and multi selection
     *
     * @namespace extras.apache.SelectionList
     */

    _RT.extendClass("extras.apache.SelectionList", extras.apache.ComponentBase, {
        /**
         * currently selected line
         */
        focusLine: 0,

        selectedLines: null,

        /**
         * placeholder for the ajax enabled replacement area
         * aka list holder
         */
        placeHolder: null,
        /**
         * value holder input hidden for the final receiving holder
         */
        valueHolder: null,

        /**
         * the selector identifier which can identify single lines
         */
        selectorIdentifier: "table tr",

        /**
         * style class for the selected line
         */
        selectionSelected:  "selected",

        /**
         * the identifier appendix for the placeHolder
         */
        placeHolderAppendix: "_placeHolder",

        /**
         * the idenitifer applendix for the value holder
         */
        valueHolderAppendix: "_valueHolder",

        /**
         * override for the value holder
         */
        valueHolderId: null,
        /**
         * override for the place holder
         */
        placeHolderId: null,

        /**
         * tabindex for the outer component
         */
        tabIndex: 1,

        /**
         * if set to true we have a multi select
         */
        multiSelect: false,

        /*custom data-* html5 attibute for keeping the key for instance data-key */
        keyAttribute: null,

        _onKeyDownHandler:  null,
        _onKeyUpHandler: null,
        _numberOfItems:     0,
        _metaDown: false,



        constructor_: function(argsMap) {
            this._callSuper("constructor", argsMap);

            this.selectedLines = {};

            this.onfocus    = _Lang.hitch(this, this.onfocus);
            this.onblur     = _Lang.hitch(this, this.onblur);
            this.onclick    = _Lang.hitch(this, this.onclick);
            this.onkeydown  = _Lang.hitch(this, this.onkeydown);
            this.onkeyup    = _Lang.hitch(this, this.onkeyup);

            this.valueHolderId = this.valueHolderId || this.id + this.valueHolderAppendix;
            this.placeHolderId = this.placeHolderId || this.id + this.placeHolderAppendix;
        },

        /**
         * resets the selector to its original state
         */
        reset: function() {
            this.focusLine   = -1;
            this._numberOfItems = 0;
            this._refresh();
        },

        /**
         * keyUp action
         */
        keyUp: function() {
            this.focusLine = Math.max(0, this.focusLine - 1);
            this.selectedLines = {};
            this.selectedLines[this.focusLine] = true;
            this._refresh();
        },

        /**
         * keyDown action
         */
        keyDown: function() {

            this.focusLine = Math.min(this._numberOfItems - 1, this.focusLine + 1);
            this.selectedLines = {};
            this.selectedLines[this.focusLine] = true;

            this._refresh();
        },

        keyEnter: function() {

        },

        /**
         * callback for the onfocus event
         * @param evt
         */
        onfocus: function(evt) {
            this._onKeyDownHandler  = this._onKeyDownHandler || this.onkeydown;
            this._onKeyUpHandler    = this._onKeyUpHandler || this.onkeyup;
            this.placeHolder.addEventListener(this.EVT_KEY_DOWN, this._onKeyDownHandler, true);
        },
        /**
         * callback for the onblur event
         * @param evt
         */
        onblur: function(evt) {
            this.placeHolder.removeEventListener(this.EVT_KEY_DOWN, this._onKeyDownHandler, true);

        },

        /**
         * callback for the onclick event
         * @param evt
         */
        onclick: function(evt) {
            var target = evt.target;
            var meta = evt.metaKey;
            //find out which element in the row of elements was clicked
            var pos = 0;
            this.rootNode.querySelectorAll(this.selectorIdentifier).forEach(_Lang.hitch(this, function(elem) {
                if (elem.toDomNode() == evt.target) {
                    this.focusLine = pos;
                    if(this.multiSelect && meta) {
                        this.selectedLines[pos] =  !this.selectedLines[pos];
                    } else {
                        this.selectedLines = {};
                        this.selectedLines[pos] = true;
                    }
                    var selectionChangeEvent = {};
                    selectionChangeEvent.target = this.rootNode.querySelectorAll(this.selectorIdentifier)[this.focusLine];
                    this.onSelectionChange(selectionChangeEvent);

                    return false;

                }
                pos++;
            }));

            this._refresh();
            this.onSelectionChange(evt);
            this.onFinalSelection(evt);
        },



        /**
         * onKeyDown which triggers
         * on up down and escape
         * tab is handled by the onblur event
         *
         * @param evt
         */
        onkeydown: function(evt) {
            this._focused = false;

            var target = evt.target;
            var keyCode = evt.keyCode;
            var oldScroll = window.scrollY;
            try {


                switch (keyCode) {
                    case this.KEY_ARROW_UP:

                        this.keyUp();

                        evt.stopPropagation();
                        var selectionChangeEvent = {};
                        selectionChangeEvent.target = this.rootNode.querySelectorAll(this.selectorIdentifier).get(this.focusLine);
                        this.onSelectionChange(selectionChangeEvent);
                        return false;
                    case this.KEY_ARROW_DOWN:

                        this.keyDown();
                        evt.stopPropagation();
                        var selectionChangeEvent = {};
                        selectionChangeEvent.target = this.rootNode.querySelectorAll(this.selectorIdentifier).get(this.focusLine);
                        this.onSelectionChange(selectionChangeEvent);

                        return false;

                    case this.KEY_ENTER:
                        this.keyEnter();
                        evt.stopPropagation();
                        var selectionChangeEvent = {};
                        selectionChangeEvent.target = this.rootNode.querySelectorAll(this.selectorIdentifier).get(this.focusLine);
                        this.onFinalSelection(selectionChangeEvent);

                    case this.KEY_ESCAPE:
                        this.onblur();
                        return false;




                    default: return true;
                }
            } finally {
                window.scrollY = oldScroll;
            }

        },

        /**
         * callback for a selection change on the control
         *
         * @param evt a javascript event object with target
         * being set to the currently selected item
         */
        onSelectionChange: function(evt) {
            if(this.multiSelect) {
                var res = [];
                var nodes = this.rootNode.querySelectorAll(this.selectorIdentifier);
                for(var key in this.selectedLines) {
                    if(this.selectedLines[key]) {
                        //if we have a custom data attribute set we now can use the html5 mechanisms of custom
                        //data attributes to achieve the final result
                        var finalKey = (this.keyAttribute) ? nodes.get(key).getAttribute(this.keyAttribute): key;
                        res.push(finalKey)
                    }
                }
                this.valueHolder.setAttribute("value", res.join(","));
            } else {
                this.valueHolder.setAttribute("value", this.focusLine);
            }
        },

        onFinalSelection: function(evt) {
            //enter or click
        },

        /**
         * postInit called after onLoad
         */
        _postInit: function() {
            this._callSuper("_postInit", arguments);

            this.placeHolder = this.rootNode.querySelector("#" + this.placeHolderId.replace(/:/g, "\\:"));
            this.valueHolder = this.rootNode.querySelector("#" + this.valueHolderId.replace(/:/g, "\\:"));

            this.placeHolder.setAttribute("tabindex", this.tabIndex);

            this.placeHolder.addEventListener(this.EVT_FOCUS, this.onfocus, true);
            this.placeHolder.addEventListener(this.EVT_BLUR, this.onblur, true);

            this.rootNode.querySelectorAll(this.selectorIdentifier).addEventListener(this.EVT_CLICK, this.onclick, false);

            this._refresh();
        },

        onAjaxDomUnload: function() {
            this.placeHolder.removeEventListener(this.EVT_FOCUS, this.onfocus, true);
            this.placeHolder.removeEventListener(this.EVT_BLUR, this.onblur, true);

            //we unload all event listeners
            this.rootNode.querySelectorAll(this.selectorIdentifier).removeEventListener(this.EVT_CLICK, this.onclick, false);
        },

        _refresh: function() {
            var cnt = 0;
            var selectors = this.rootNode.querySelectorAll(this.selectorIdentifier);
            this._numberOfItems = selectors.length;
            selectors.forEach(_Lang.hitch(this, function (elem) {
                 (!this.selectedLines[cnt]) ? elem.removeClass(this.selectionSelected) :
                        elem.addClass(this.selectionSelected);
                 cnt ++;
            }));
        }

    });
})();