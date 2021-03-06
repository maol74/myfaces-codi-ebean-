(function () {
    /**
     * a pull component which pulls
     * a certain area periodically
     *
     * @namespace extras.apache.StdInput
     */
    var _RT = myfaces._impl.core._Runtime;

    _RT.extendClass("extras.apache.StdInput", extras.apache.ComponentBase, {
                _LANG: myfaces._impl._util._Lang,

                valueHolder: null,
                _validationMask: null,
                _validationRegExp: null,



                constructor_:function(args) {
                    this._callSuper("constructor_", args);

                    this.onkeydown = this._LANG.hitch(this, this.onKeyDown);
                    this.onkeyup = this._LANG.hitch(this, this.onkeyup);
                    this.onkeypress = this._LANG.hitch(this, this.onkeypress);
                },

                _postInit: function() {
                    this._callSuper("_postInit", arguments);
                    this._initComponentBehavior();
                },
                _initComponentBehavior: function() {
                    /*we plug in the selection routine behavior*/
                    new extras.apache._Selectable(this);
                    /*the componetn can deal with values*/
                    new extras.apache._ValueHolder(this,".inputTextValueHolder");
                    /*we now add one of the two behaviors dynamically*/
                    /*both expose a method match which is called from the outside*/
                    if (this._validationMask) {
                        new extras.apache._MaskValidating(this);
                        this._validationMask = this._validationMask;
                    } else {
                        new extras.apache._RegexpValidating(this);
                        this._validationRegExp = this._validationRegExp;

                    }
                    new extras.apache._KeyboardAware(this);
                },

                onkeypress: function(evt) {

                },
                onkeup: function(evt) {

                },
                onkeydown: function(evt) {

                }
            })
})();
