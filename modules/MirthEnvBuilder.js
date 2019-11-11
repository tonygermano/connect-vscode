var {ClassLoaderBuilder} = require('mirth/ClassLoaderBuilder');
var {LoggerBuilder} = require('mirth/LoggerBuilder');
var {MirthJavaScriptIncludes} = require('mirth/MirthJavaScriptIncludes');
var {SerializerFactory} = require('mirth/SerializerFactory');

exports.MirthEnvBuilder = (function() {
    function MirthEnvBuilder(cx) {
        this.cx = cx;
        this.classLoaderBuilder = new ClassLoaderBuilder(cx);
        this.loggerBuilder = new LoggerBuilder(cx);
        this.mirthJavaScriptIncludes = new MirthJavaScriptIncludes(cx);
        this.excludeSerializerFactory = false;
    }

    MirthEnvBuilder.prototype.classLoaderBuilder = function classLoaderBuilder(builder) {
        this.classLoaderBuilder = builder;
        return this;
    }

    MirthEnvBuilder.prototype.loggerBuilder = function loggerBuilder(builder) {
        this.loggerBuilder = builder;
        return this;
    }

    MirthEnvBuilder.prototype.excludeSerializerFactory = function excludeSerializerFactory(bool) {
        this.excludeSerializerFactory = Boolean(bool);
        return this;
    }

    MirthEnvBuilder.prototype.setMirthPath = function setMirthPath(pathString) {
        this.classLoaderBuilder = this.classLoaderBuilder.setMirthPath(pathString);
        return this;
    }

    MirthEnvBuilder.prototype.applyToClassLoaderBuilder = function applyToClassLoaderBuilder(consumer) {
        consumer(this.classLoaderBuilder);
        return this;
    }

    MirthEnvBuilder.prototype.applyToLoggerBuilder = function applyToLoggerBuilder(consumer) {
        consumer(this.loggerBuilder);
        return this;
    }

    MirthEnvBuilder.prototype.applyToMirthJavaScriptIncludes = function applyToMirthJavaScriptIncludes(consumer) {
        consumer(this.mirthJavaScriptIncludes);
        return this;
    }

    MirthEnvBuilder.prototype.init = function init() {
        this.classLoaderBuilder.build();
        this.loggerBuilder.build();
        this.mirthJavaScriptIncludes.init();
        if (!this.excludeSerializerFactory) this.cx.SerializerFactory = new SerializerFactory(this.cx);
    }

    return MirthEnvBuilder;
})();