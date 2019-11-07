var {ClassLoaderBuilder} = require('mirth/ClassLoaderBuilder');
var {LoggerBuilder} = require('mirth/LoggerBuilder');

exports.MirthEnvBuilder = (function() {
    function MirthEnvBuilder(cx) {
        this.cx = cx;
        this.clb = new ClassLoaderBuilder(cx);
        this.lb = new LoggerBuilder(cx);
    }

    MirthEnvBuilder.prototype.classLoaderBuilder = function classLoaderBuilder(builder) {
        this.clb = builder;
        return this;
    }

    MirthEnvBuilder.prototype.loggerBuilder = function loggerBuilder(builder) {
        this.lb = builder;
        return this;
    }

    MirthEnvBuilder.prototype.setMirthPath = function setMirthPath(pathString) {
        this.clb = this.clb.setMirthPath(pathString);
        return this;
    }

    MirthEnvBuilder.prototype.applyToClassLoaderBuilder = function applyToClassLoaderBuilder(consumer) {
        consumer(this.clb);
        return this;
    }

    MirthEnvBuilder.prototype.init = function init() {
        this.clb.build();
        this.lb.build();
    }

    return MirthEnvBuilder;
})();