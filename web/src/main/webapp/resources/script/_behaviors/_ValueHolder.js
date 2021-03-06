(function () {
    /**
     * Selectable Plugin
     *
     * we can use an ll parser here
     */
    var _RT = myfaces._impl.core._Runtime;

    _RT.extendClass("extras.apache._ValueHolder", extras.apache._Behavior, {
        constructor_: function(scope, selector) {
            this._callSuper("constructor_", scope, null, {selector: selector});
        },

        defineBehavior: function() {
            var finalSelector = this._tmpEventOverrides.selector || ".valueHolder";
            this.valueHolder = this.rootNode.querySelector(finalSelector);
            try {
                this._defineProperty("value", function() {
                    return this.valueHolder.toDomNode().value;
                }, function(val) {
                    this.valueHolder.toDomNode().value = val;
                });
            } catch(e) {

            }
        }
    })
})();
