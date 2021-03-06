/**
 * The accordion panel is a group of toggles
 * interconnected by
 */
(function () {
    /**
     * a light css only version of the image button control
     *
     * @namespace extras.apache.ImageButtonLight
     */
    var _RT = myfaces._impl.core._Runtime;

    _RT.extendClass("extras.apache.ImageButtonLight", extras.apache.ComponentBase, {

                _LANG: myfaces._impl._util._Lang,
                _label: null,
                _imageCommand: null,

                constructor_:function(args) {
                    this._callSuper("constructor", args);
                    this._onmousedown = this._LANG.hitch(this, this._onmousedown);
                    this._onMouseUp_ = this._LANG.hitch(this, this._onMouseUp_);

                    this._onkeydown = this._LANG.hitch(this, this._onkeydown);
                    this._onkeyup = this._LANG.hitch(this, this._onkeyup);
                    this._postInit = this._LANG.hitch(this, this._postInit);
                    this._onfocus = this._LANG.hitch(this, this._onfocus);

                    setTimeout(this._postInit, 0);
                },

                _postInit:function() {
                    this._callSuper("_postInit", arguments);

                    this._label = this.rootNode.querySelector(".label");
                    this._imageCommand = this.rootNode.querySelector(".imageCommand");
                    this.rootNode.setAttribute("draggable", "false");

                    //now we apply the event handlers via javascript behaviors
                    //click should make a short animation between the image changes
                    //mousedown should apply the click styleclass
                    //mouseup on a global scale should remove the image styleclass
                    (new extras.apache._KeyboardAware(this));
                    (new extras.apache._MouseAware(this, this._imageCommand));
                    (new extras.apache._Focusable(this, this._imageCommand));
                },

                _onfocus: function(evt) {
                    this._imageCommand.toDomNode().focus();
                },

                _onmousedown: function(evt) {
                    this._imageCommand.addClass("clicked");
                    window.addEventListener("mouseup", this._onMouseUp_, false);
                    this._imageCommand.addEventListener("onmouseout", this._onMouseUp_, false);
                },

                _onMouseUp_: function(evt) {
                    this._imageCommand.removeClass("clicked");
                    window.removeEventListener("mouseup", this._onMouseUp_, false);
                    this._imageCommand.removeEventListener("onmouseout", this._onMouseUp_, false);
                },

                _onkeydown: function(evt) {

                    var keyCode = evt.keyCode;
                    if (evt.keyCode == this.KEY_ENTER || evt.keyCode == this.KEY_SPACE) {
                        this._imageCommand.addClass("clicked");
                    }
                },

                _onkeyup: function(evt) {
                    var keyCode = evt.keyCode;
                    if (evt.keyCode == this.KEY_ENTER || evt.keyCode == this.KEY_SPACE) {
                        this._imageCommand.removeClass("clicked");

                    }
                }

            });
})
        ();