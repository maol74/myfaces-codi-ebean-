(function () {
    /**
     * a pull component which pulls
     * a certain area periodically
     */
    var _RT = myfaces._impl.core._Runtime;

    _RT.extendClass("extras.apache.StdInput", extras.apache.ComponentBase, {
                _LANG: myfaces._impl._util._Lang,

                valueHolder: null,
                _validationMask: null,
                _validationRegExp: null,



                constructor_:function(args) {
                    this._callSuper("constructor", args);

                    this.onKeyDown = this._LANG.hitch(this, this.onKeyDown);
                    this.onKeyUp = this._LANG.hitch(this, this.onKeyUp);
                    this.onKeyUp = this._LANG.hitch(this, this.onkeyPress);
                },

                _postInit: function() {
                    this._callSuper("_postInit", arguments);
                    /*we plug in the selection routine behavior*/
                    new extras.apache._Selectable(this);
                    /*the componetn can deal with values*/
                    new extras.apache._ValueHolder(this);
                    /*we now add one of the two behaviors dynamically*/
                    /*both expose a method match which is called from the outside*/
                    if (this._validationMask) {
                        new extras.apache._MaskMatcher(this);
                    } else {
                        new extras.apache._RegexpMatcher(this);
                    }

                    new extras.apache._KeyboardAware(this);
                },

                onkeyPress: function(evt) {

                },
                onkeyUp: function(evt) {

                },
                onKeyDown: function(evt) {

                }
            })
})();
