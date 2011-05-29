/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * a basic node wrapper which capsules all needed
 * operations for our node handling. Due to the functional
 * builder approach we get a leaner code density than we would
 * have with a purely imperative one.
 *
 *
 * Note the query ops will return the node
 */
myfaces._impl.core._Runtime.extendClass("myfaces._impl._dom.Node", Object, {

    _NODE_UTILS: myfaces._impl._dom._NodeUtils,
    _QUERY: myfaces._impl._dom.Query,


    _Lang:  myfaces._impl._util._Lang,
    _RT:    myfaces._impl.core._Runtime,
    _NodeUtils: myfaces._impl._dom._NodeUtils,

    /** @namespace this._dummyPlaceHolder */
    _dummyPlaceHolder:null,


    _id:  null,
    _name: null,
     /** @namespace this._referencedNode */
    _referencedNode: null,
      /** @namespace this._tagName */
    _tagName: null,

    constructor_: function(elem) {
        this._referencedNode = this._NODE_UTILS.byIdOrName(elem);
    },


    isTag: function(name) {
        /*we lazily store the tagName for future references*/
        this._tagName = this._tagName || this._referencedNode.tagName;
        return this._referencedNode.tagName.toLowerCase() == name;
    },

    getId: function() {
        this._id = this._id || this._referencedNode.id;
        return this._id;
    },

    getName: function() {
        this._name = this._name || this._referencedNode.name;
        return this._name;
    },

    nodeIdOrName: function() {
        return this.getId() || this.getName();
    },

    /*purges the given node and all its subelements from the dom tree*/
    purge: function() {

        this._NodeUtils.deleteItem(this._referencedNode);

        this._referencedNode = null;
        this._id = null;
        this._name = null;

    },

    purgeChilds: function() {
        this.childNodes().purge();
    },

    detach: function(items) {
        if (!this._referencedNode.parentNode) {
            return this;
        }
        this._referencedNode = this._referencedNode.parentNode.removeChild(this._referencedNode);
        return this;
    },

    setStyle: function(key, val) {
        this._referencedNode.style[key] = val;
        return this;
    },

    getStyle: function(key, val) {
        return this._referencedNode.style[key];
    },

    setAttribute: function(attr, val) {
        this._NodeUtils.setAttribute(attr, val);
        return this;
    },

    getAttribute: function(attr) {
        return this._NodeUtils.getAttribute(this._referencedNode, attr);
    },

    outerHTML: function(markup) {
        var ret = this._NodeUtils.outerHTML(markup);
        if (ret.length == 0) return null;
        if (ret.length == 1) {
            return new Node(ret[0]);
        } else {
            return new NodeList(ret[0]);
        }
    },

    innerHTML: function(markup) {
        myfaces._impl._dom._NodeUtils.innerHTML(this._referencedNode, markup);
    },

    getInnerHTML: function() {
        return this._referencedNode.innerHTML;
    },

    childNodes: function() {
        return new NodeList(this._referencedNode.childNodes);
    },

    parentNode: function() {
        return new Node(this._referencedNode.parentNode);
    },

    sibling: function() {
        return new Node(this._referencedNode.sibling);
    },

    siblings: function() {
        return new NodeList(this._referencedNode.siblings);
    },

    isForm: function() {
        return !!document.forms[this._id];
    },

    runScripts: function() {
        this._NODE_UTILS.runScripts(this._referencedNode);
    },

    addClass: function(clazz) {
        this._NODE_UTILS.addClass(this._referencedNode, clazz);
    },

    removeClass: function(clazz) {
        this._NODE_UTILS.removeClass(this._referencedNode, clazz);
    },

    addEventListener: function(evt, listener, useCapture) {
        this._referencedNode.addEventListener(evt, listener, useCapture);
        return this;
    },

    removeEventListener: function(type, listener, useCapture) {
        if (listener) {
            this._referencedNode.removeEventListener(type, listener, useCapture);
        } else {
            this._referencedNode.removeEventListener(type);
        }
        return this;
    },

    querySelector: function(query) {
        return myfaces._impl._dom.Node.querySelector(query, this._referencedNode);
    },
    querySelectorAll: function(query) {
        return myfaces._impl._dom.Node.querySelectorAll(query, this._referencedNode);
    },

    toDomNode: function() {
        return this._referencedNode;
    },

    //causes an asynchronous delay for a certain period of time
    //until we can perform the subsequent operation,
    //this is a one time op after which we work again on another function
    delay: function(timeout) {
       return this._NODE_UTILS.getEngine().decorateDelay(this, timeout);
    },

    alert: function(msg) {
        alert(msg);
        return this;
    }
},
//static methods
{
    querySelectorAll: function(query, node) {
        if (!node) {
            node = document;
        }
        if (node instanceof myfaces._impl._dom.NodeList) {
            return node.querySelectorAll(query);
        } else if (node instanceof myfaces._impl._dom.Node) {
            return node.querySelectorAll(query);
        } else {
            var queryResult = (node.querySelectorAll) ? node.querySelectorAll(query) : myfaces._impl._dom._Query(query, node);
            return new myfaces._impl._dom.NodeList(queryResult);
        }
    },

    querySelector: function(query, node) {
        if (!node) {
            node = document;
        }
        if (node instanceof myfaces._impl._dom.NodeList) {
            return node.querySelector(query);
        } else if (node instanceof myfaces._impl._dom.Node) {
            return node.querySelector(query);
        } else {
            var queryResult = (node.querySelector) ? node.querySelector(query) : myfaces._impl._dom._Query(query, node);
            queryResult = (queryResult) ? queryResult : null;
            return ( (queryResult ) ? new myfaces._impl._dom.Node(queryResult) : null);
        }
    },

    byIdOrName: function(elem) {
        var ret = myfaces._impl._dom._NodeUtils.byIdOrName(elem);
       return (ret) ? new myfaces._impl._dom.Node(ret): null ;
    }
});


