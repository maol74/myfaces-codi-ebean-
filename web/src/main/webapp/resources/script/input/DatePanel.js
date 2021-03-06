(function () {

    /**
     * a pull component which pulls
     * a certain area periodically
     *
     * @namespace extras.apache.StdInput
     */
    var _RT = myfaces._impl.core._Runtime;

    _RT.extendClass("extras.apache.DatePanel", extras.apache.BaseDateSelector, {

        _animationFrame: null,
        _NODE: myfaces._impl._dom.Node,

        constructor_:function(args) {
            this._callSuper("constructor", args);
        },

        _postInit: function() {
            this._callSuper("_postInit", arguments);
            this._animationFrame = this.rootNode.querySelector(".flipContainer");

        },

        onPreviousYear: function(evt) {
            this._animationFrame.removeClass("animateNoTransition").addClass("animateRotate360");
            var _t = this;
            setTimeout(function() {
                _t._animationFrame.addClass("animateNoTransition");
                this._NODE.requestAnimFrame(function() {
                    _t._animationFrame.removeClass("animateRotate360");
                });
            }, 200);

            this._callSuper("onPreviousYear", evt);
        },
        onNextYear: function(evt) {
            this._animationFrame.removeClass("animateNoTransition").addClass("animateRotate360");
            var _t = this;
            setTimeout(function() {
                _t._animationFrame.addClass("animateNoTransition");
                _t._NODE.requestAnimFrame(function() {
                    _t._animationFrame.removeClass("animateRotate360");
                });
            }, 200);

            this._callSuper("onPreviousYear", evt);
        },

        onPreviousMonth: function(evt) {

        },
        onNextMont: function(evt) {

        },
        onDateSelect: function(date) {
            this._callSuper("onDateSelect", date);
        }


    })
})();
