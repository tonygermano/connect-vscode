exports.LoggerBuilder = (function() {

    function LoggerBuilder(cx) {
        this.cx = cx;
        this._level = 'INFO';
        this._outFile = null;
        this._outFileLevel = 'DEBUG';
        this._append = true;
    }

    LoggerBuilder.prototype.level = function level(levelString) {
        this._level = levelString;
        return this;
    }

    LoggerBuilder.prototype.outFile = function outFile(pathString) {
        this._outFile = pathString;
        return this;
    }

    LoggerBuilder.prototype.outFileLevel = function outFileLevel(levelString) {
        this._outFileLevel = levelString;
        return this;
    }

    LoggerBuilder.prototype.append = function append(isAppend) {
        this._append = isAppend;
        return this;
    }

    LoggerBuilder.prototype.build = function build() {
        const self = this;
        const log4j = self.cx ? self.cx.Packages.org.apache.log4j : org.apache.log4j;

        self._level = log4j.Level.toLevel(self._level);
        self._outFileLevel = log4j.Level.toLevel(self._outFileLevel);

        var configureConsoleLogger = function configureConsoleLogger(logger, minLevel) {
            logger.setLevel(minLevel);
            var appender = new log4j.ConsoleAppender(layout, log4j.ConsoleAppender.SYSTEM_OUT);
            if (self._level != minLevel) {
                filterAppender(appender, self._level);
            }
            logger.addAppender(appender);
        };

        var configureFileLogger = function configureFileLogger(logger, minLevel) {
            var appender = new log4j.FileAppender(layout, self._outFile, self._append);
            if (self._outFileLevel != minLevel) {
                filterAppender(appender, self._outFileLevel);
            }
            logger.addAppender(appender);
        }

        var filterAppender = function filterLogger(logger, levelMin) {
            var filter = new log4j.varia.LevelRangeFilter();
            filter.setLevelMin(levelMin);
            logger.addFilter(filter);
        }

        const layout = new log4j.PatternLayout('%d %-5p - %m%n');
        log4j.LogManager.resetConfiguration();
        var logger = log4j.LogManager.getRootLogger();
        if (self._outFile) {
            var minLevel = self._level.isGreaterOrEqual(self._outFileLevel) ? self._outFileLevel : self._level;
            configureConsoleLogger(logger, minLevel);
            logger = logger.getLogger('child');
            configureFileLogger(logger, minLevel);
        }
        else {
            configureConsoleLogger(logger, self._level);
        }

        if (self.cx) self.cx['logger'] = logger;

        return logger;
    }

    return LoggerBuilder;
})();