/**
 * base class of the EZComponent framework.
 *
 * WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
 *
 * Note since we do not rely on legacy technology
 * here anymore a W3C Dom Level3 compliant browser is a must
 * which has node.querySelectorAll and the dom level3 events implemented
 *
 *
 * Before you start crying, I want to have all this working in IE(name whatever
 * version you like), I wont be doing it for you if you want to use non
 * standard compliant browsers supported
 * roll it yourself I will be happy to merge the code in as long
 * as you dont stain the core code with fallbacks within the same class.
 *
 * Same goes for shoddy mobile browsers, roll it yourself I will only
 * support W3C compliant browsers in this code to keep the code
 * as lean as possible, for learning purposes. Support for non compliant
 * browsers is not part of this project and would taint the code.
 * I had to do it for jsf.js in myfaces which now is a pointles 40% more code
 * than needed bloat, but this is a sideproject which does not need it!
 */

(function() {

    var _RT = myfaces._impl.core._Runtime;

    _RT.reserveNamespace("extras.apache.ExtendedEventQueue");
    _RT.reserveNamespace("extras.apache.ExtendedErrorQueue");

    var _extras = extras.apache;
    var _util = myfaces._impl._util;

    _extras.ExtendedEventQueue = new _util._ListenerQueue();
    _extras.ExtendedErrorQueue = new _util._ListenerQueue();

    jsf.ajax.addOnEvent(function(eventData) {
        _extras.ExtendedEventQueue.broadcastEvent(eventData);
    });

    jsf.ajax.addOnError(function(eventData) {
        _extras.ExtendedErrorQueue.broadcastEvent(eventData);
    });

})();

( function() {
    /**
     * Base class for all widgets
     */
    var _RT = myfaces._impl.core._Runtime;
    var _Lang = myfaces._impl._util._Lang;
    var _AjaxQueue = extras.apache.ExtendedEventQueue;
    var _ErrorQueue = extras.apache.ExtendedErrorQueue;

    /**
     * Base class for all components which adds certain behavior
     * to our widgets, we dont use a dojo like templating system
     * because our jsf facelet templates are enough,
     * for subtemplating we can move over but for now
     * what we have suffices.
     *
     * @namespace extras.apache.ComponentBase
     */
    _RT.extendClass("extras.apache.ComponentBase", Object, {
        rootNode: null,
        clientId: null,
        id: null,

        NODE: myfaces._impl._dom.Node,
        /**
         * constants, since we only deal with html5+ we do not
         * cover the entire huge quirksmode.org section
         * but concentrate ourselves on the raw codes
         * only supported by newer browsers
         */
        KEY_ARROW_UP:   38,
        KEY_ARROW_DOWN: 40,
        KEY_TAB:         9,
        KEY_ESCAPE:     27,
        KEY_ENTER:      13,


        EVT_FOCUS:      "focus",
        EVT_BLUR:       "blur",
        EVT_KEY_DOWN:   "keydown",
        EVT_KEY_PRESS:  "keypress",
        EVT_KEY_UP:     "keyup",
        EVT_ENTER:      "keyenter",


        EVT_CLICK:      "click",

        P_VIEWBODY: "javax.faces.ViewBody",
        P_VIEWROOT: "javax.faces.ViewRoot",

        valueHolderAppendix: "_valueHolder",
        valueHolderId: null,

        ajaxAware: true,
        unloadAware: true,

        constructor_: function(argsMap) {
            _Lang.applyArgs(this, argsMap);
            /*internal postinit*/
            this.addOnLoad(window, _Lang.hitch(this, this._postInit));
            /*external postinit*/
            this.addOnLoad(window, _Lang.hitch(this, this.postInit_));

            //we enforce the scope for the onAjaxEvent
            this.onAjaxEvent = _Lang.hitch(this, this.onAjaxEvent);
            this.onAjaxError = _Lang.hitch(this, this.onAjaxError);

            this.id = this.id || this.clientId +":"+ this.clientId;

            this.valueHolderId = this.valueHolderId || this.id + this.valueHolderAppendix;
        },

        addOnLoad: function(target, func) {
            var oldonload = (target) ? target.onload : null;
            target.onload = (!oldonload) ? func : function() {
                try {
                    oldonload();
                    console.debug(oldonload.toString());
                } catch (e) {
                    console.error(e);
                    throw e;
                } finally {
                    func();
                    console.debug(func.toString())
                }
            };
        },

        _postInit: function() {

            this.rootNode = this.NODE.querySelector("#" + this.id.replace(/:/g, "\\:"));
            if(this.ajaxAware) {
                _AjaxQueue.enqueue(this.onAjaxEvent);
                _ErrorQueue.enqueue(this.onAjaxError);
            }
        },

        querySelectorAll: function(queryStr) {
            return this.rootNode.querySelectorAll(queryStr);
        },

        /**
         * add class helper which adds
         * a style class to a given node
         * @param node
         * @param styleClass
         */
        addClass: function(node, styleClass) {
            var classes = node.getAttribute("class");
            if (!classes) {
                node.setAttribute("class", styleClass);
                return;
            }
            classes = classes.split(/\s+/g);
            var alreadyIn = false;
            for (var cnt = classes.length - 1; cnt >= 0; cnt--) {
                alreadyIn = alreadyIn || (classes[cnt] == styleClass)
            }
            if (alreadyIn) return;
            classes.push(styleClass);

            node.setAttribute("class", classes.join(" "));
        },

        /**
         * remove class helper which removes a styleclass from a given node
         *
         * @param node
         * @param styleClass
         */
        removeClass: function(node, styleClass) {
            var res = [];
            var classes = node.getAttribute("class");
            if (!classes) return;
            classes = classes.split(/\s+/g);
            for (var cnt = classes.length - 1; cnt >= 0; cnt--) {
                if (classes[cnt] != styleClass) res.push(classes[cnt]);
            }
            node.setAttribute("class", res.join(" "));
        },

        onAjaxError: function(evt) {

        },

        onAjaxBegin: function(evt) {

        },
        onAjaxComplete: function(evt) {

        },
        onAjaxSuccess: function(evt) {

        },

        onAjaxEvent: function(evt) {
            try {
                if (evt.status == "begin") {
                    this.onAjaxBegin(evt);
                }
                else if (evt.status == "success") {
                    this.onAjaxSuccess(evt);
                }
                else if (evt.status == "complete") {
                    this.onAjaxComplete(evt);
                }
            } finally {
                this._onAjaxEvent(evt);
            }
        },

        //TODO we need a replacement handler which notifies the control that it is about to be replaced
        //so that the control can unload eventual event hooks or ajax listeners
        _onAjaxEvent: function(evt) {
            if (evt.status == "complete" && this.unloadAware) {

                var responseXML = evt.responseXML;
                //we now parse the response xml for ids which
                //are root of alterations and then
                //send the unook event if our identifier is found
                //being one of the ids or a subchild of them
                //note this is way more performant then to hook
                //onto the dom change events
                var updates = responseXML.querySelectorAll("changes update");
                var deletes = responseXML.querySelectorAll("changes delete");

                //inserts are not needed because we can deal with
                for (var cnt = updates.length - 1; cnt >= 0; cnt--) {
                    var updateId = updates[cnt].getAttribute("id");
                    if (updateId && (updateId == this.P_VIEWBODY || updateId == "java.faces.ViewRoot" || this.id == updateId || this.clientId == updateId || document.querySelectorAll("#" + updateId.replace(/:/g, "\\:") + " #" + this.id.replace(/:/g, "\\:")).length > 0)) {
                        this._onAjaxDomUnload(evt);
                    }
                }
                for (var cnt = deletes.length - 1; cnt >= 0; cnt--) {
                    var deleteId = deletes[cnt].getAttribute("id");
                    if (deleteId && (deleteId == this.P_VIEWBODY || deleteId == this.P_VIEWROOT || this.id == deleteId || document.querySelectorAll("#" + deleteId.replace(/:/g, "\\:") + " #" + this.id.replace(/:/g, "\\:")).length > 0)) {
                        this._onAjaxDomUnload(evt);
                    }
                }
            }
        },
        //TODO we might move our jsf event triggered handler
        //To the Dom Level 3 event DOMNodeRemoved
        _onAjaxDomUnload: function(evt) {
            _AjaxQueue.dequeue(this.onAjaxEvent);
            _ErrorQueue.dequeue(this.onAjaxError);
            this.onAjaxDomUnload(evt);
        },

        _onAjaxDomInsert: function(evt) {
            _AjaxQueue.dequeue(this.onAjaxEvent);
            this.onAjaxDomLoad(evt);
        },

        /**
         * note this is the most important callback handler
         * it is triggered whenever the current component is unloaded
         * from the dom via an ajax update or replace of itself
         * or one of its parent components
         *
         * this callback should or better must be used to deregister
         * event listeners or other data which might leak into memory
         *
         * sidenote we currently do this event over the ajax api
         * which should suffice but we may add another event hook
         * which is triggered in manual cases, because from
         * time to time we trigger node deletes in non ajax cases
         * (going over the official api is way too slow, because
         * it literally triggers on any node)
         *
         * @param evt
         */
        onAjaxDomUnload: function(evt) {
        },

        onAjaxDomLoad: function(evt) {
        },

        getWindowParam: function(name) {
            var s = window.location.search.substring(1).split('&');
            if (!s.length) return;
            var c = {};
            for (var i = 0; i < s.length; i++) {
                var parts = s[i].split('=');
                c[unescape(parts[0])] = unescape(parts[1]);
            }
            return name ? c[name] : c;
        },

        postInit_: function() {

        }


    });
})();