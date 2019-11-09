/*
 * The functions in this module are Copyright (c) Mirth Corporation and are
 * published under the terms of the MPL.
 * 
 * Original source available here:
 * https://github.com/nextgenhealthcare/connect/blob/3.8.x/server/src/com/mirth/connect/server/builders/JavaScriptBuilder.java
 */ 

exports.MirthJavaScriptIncludes = (function() {
    function MirthJavaScriptIncludes(cx) {
        this.cx = cx;
        this.mapVars = true;
        this.helperFuncs = true;
    }

    MirthJavaScriptIncludes.prototype.includeMapVariables = function includeMapVariables(bool) {
        this.mapVars = bool;
        return this;
    };

    MirthJavaScriptIncludes.prototype.includeHelperFunctions = function includeHelperFunctions(bool) {
        this.helperFuncs = bool;
        return this;
    };

    MirthJavaScriptIncludes.prototype.init = function init() {
        var self = this;
        if (self.mapVars) addMapVariables();
        if (self.helperFuncs) addHelperFunctions();

        function addMapVariables() {
            var cx = self.cx;
            cx.connectorMap = new java.util.HashMap();
            cx.channelMap = new java.util.HashMap();
            cx.sourceMap = new java.util.HashMap();
            cx.configurationMap = new java.util.HashMap();
            cx.responseMap = new java.util.HashMap();
            cx.globalMap = cx.com.mirth.connect.server.util.GlobalVariableStore.getInstance();
            cx.globalChannelMap = new cx.com.mirth.connect.server.util.GlobalChannelVariableStore();
    
            cx.$co = function $co(key, value) { if (arguments.length == 1) { return cx.connectorMap.get(key); } else { return cx.connectorMap.put(key, value); } }
            cx.$c = function $c(key, value) { if (arguments.length == 1) { return cx.channelMap.get(key); } else { return cx.channelMap.put(key, value); } }
            cx.$s = function $s(key, value) { if (arguments.length == 1) { return cx.sourceMap.get(key); } else { return cx.sourceMap.put(key, value); } }
            cx.$gc = function $gc(key, value) { if (arguments.length == 1) { return cx.globalChannelMap.get(key); } else { return cx.globalChannelMap.put(key, value); } }
            cx.$g = function $g(key, value) { if (arguments.length == 1) { return cx.globalMap.get(key); } else { return cx.globalMap.put(key, value); } }
            cx.$cfg = function $cfg(key, value) { if (arguments.length == 1) { return cx.configurationMap.get(key); } else { return cx.configurationMap.put(key, value); } }
            cx.$r = function $r(key, value) { if (arguments.length == 1) { return cx.responseMap.get(key); } else { return cx.responseMap.put(key, value); } }
    
            cx.$ = function $(string) {
                try { if(cx.responseMap.containsKey(string)) { return cx.$r(string); } } catch(e){}
                try { if(cx.connectorMap.containsKey(string)) { return cx.$co(string); } } catch(e){}
                try { if(cx.channelMap.containsKey(string)) { return cx.$c(string); } } catch(e){}
                try { if(cx.sourceMap.containsKey(string)) { return cx.$s(string); } } catch(e){}
                try { if(cx.globalChannelMap.containsKey(string)) { return cx.$gc(string); } } catch(e){}
                try { if(cx.globalMap.containsKey(string)) { return cx.$g(string); } } catch(e){}
                try { if(cx.configurationMap.containsKey(string)) { return cx.$cfg(string); } } catch(e){}
                return '';
            }
        }
    
        function addHelperFunctions() {
            var cx = self.cx;
            cx.validate = function validate(mapping, defaultValue, replacement) {
                var result = mapping;
                if ((result == undefined) || (result.toString().length == 0)) {
                    if (defaultValue == undefined) {
                        defaultValue = '';
                    }
                    result = defaultValue;
                }
                if ('string' === typeof result || result instanceof java.lang.String || 'xml' === typeof result) {
                    result = new java.lang.String(result.toString());
                    if (replacement != undefined) {
                        for (var i = 0; i < replacement.length; i++) { 
                            var entry = replacement[i];
                            result = result.replaceAll(entry[0], entry[1]);
                        }
                    }
                }
                return result;
            }
            
            // Helper function to create segments
            cx.createSegment = function createSegment(name, msgObj, index) {
                if (arguments.length == 1) { return new XML('<' + name + '></' + name + '>'); };
                if (arguments.length == 2) { index = 0; };
                msgObj[name][index] = new XML('<' + name + '></' + name + '>');
                return msgObj[name][index];
            }
            
            // Helper function to create segments after specified field
            cx.createSegmentAfter = function createSegmentAfter(name, segment) {
                var msgObj = segment;
                while (msgObj.parent() != undefined) { msgObj = msgObj.parent(); }
                msgObj.insertChildAfter(segment[0], new XML('<' + name + '></' + name + '>'));
                return msgObj.child(segment[0].childIndex() + 1);
            }
            
            // Helper function to get the length of an XMLList or array
            cx.getArrayOrXmlLength = function getArrayOrXmlLength(obj) {
                if (typeof obj == 'xml' || obj instanceof java.lang.String) {
                    return obj.length();
                } else if (typeof obj != 'undefined' && obj != null) {
                    return obj.length || 0;
                }
                return 0;
            }
        }    
    };


    return MirthJavaScriptIncludes;
})();