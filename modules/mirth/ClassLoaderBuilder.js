exports.ClassLoaderBuilder = (function() {
    const Thread = java.lang.Thread;
    const Paths = java.nio.file.Paths;
    const Files = java.nio.file.Files;
    const FileVisitResult = java.nio.file.FileVisitResult;
    const HashSet = java.util.HashSet;
    const URL = java.net.URL;
    const URLClassLoader = java.net.URLClassLoader;
    const Context = org.mozilla.javascript.Context;

    const includeDirs = [
        'server-launcher-lib',
        'server-lib',
        'extensions',
        'client-lib'
    ];

    function ClassLoaderBuilder(cx) {
        this.cx = cx;
        this.mirthPath = null;
        this.additionalUrls = new HashSet();
        this.additionalJarDirs = new HashSet();
        this.excludeJars = new HashSet();
        this.parentClassLoader = undefined;
    }

    ClassLoaderBuilder.prototype.setMirthPath = function setMirthPath(pathString) {
        this.mirthPath = pathString ? Paths.get(pathString) : null;
        return this;
    }

    ClassLoaderBuilder.prototype.addUrlString = function addUrlString(pathString) {
        this.additionalUrls.add(new URL(pathString));
        return this;
    }

    ClassLoaderBuilder.prototype.addJarDirPath = function addJarDirPath(pathString) {
        this.additionalJarDirs.add(Paths.get(pathString));
        return this;
    }

    ClassLoaderBuilder.prototype.excludeJar = function excludeJarNamed(jarString) {
        this.excludeJars.add(jarString);
        return this;
    }

    ClassLoaderBuilder.prototype.setParentClassLoader = function (cl) {
        this.parentClassLoader = cl;
        return this;
    }

    ClassLoaderBuilder.prototype.build = function build() {
        var self = this;
        var URLs = [];

        if (self.mirthPath) {
            includeDirs.forEach(function(dir) {
                recursiveJarAdder(Paths.get(self.mirthPath, dir), URLs);
            });
            URLs.push(Paths.get(self.mirthPath, 'conf/mirth.properties').toUri().toURL());
        }

        for (var url in Iterator(self.additionalUrls)) {
            URLs.push(url);
        }

        for (var path in Iterator(self.additionalJarDirs)) {
            jarDirAdder(path, URLs);
        }

        var rhinoContext = Context.getCurrentContext();
        var currentAppClassLoader = rhinoContext.getApplicationClassLoader();
        
        var cl;
        if (self.parentClassLoader === undefined) {
            cl = new URLClassLoader(URLs, currentAppClassLoader);
        }
        else {
            cl = new URLClassLoader(URLs, self.parentClassLoader);
        }
        if (self.cx) {
            rhinoContext.setApplicationClassLoader(cl);
            org.mozilla.javascript.NativeJavaTopPackage.init(rhinoContext, self.cx, true);
            if (!currentAppClassLoader.loadClass('org.mozilla.javascript.commonjs.module.ModuleScope').isInstance(self.cx)) {
                rhinoContext.setApplicationClassLoader(currentAppClassLoader);
            }
        }

        return cl;

        function jarDirAdder(dirPath, URLs) {
            Files.list(dirPath).forEach({accept: function(path) {
                const name = path.getFileName().toString();
                if (Files.isRegularFile(path) && Files.isReadable(path)
                        && name.endsWith('.jar') && !self.excludeJars.contains(name)) {
                    URLs.push(path.toUri().toURL());
                }
            }});
        }

        function recursiveJarAdder(dirPath, URLs) {
            Files.walkFileTree(dirPath, new JavaAdapter(java.nio.file.SimpleFileVisitor, {
                visitFile: function visitFile(path, attrs) {
                    const name = path.getFileName().toString();
                    if (attrs.isRegularFile() && Files.isReadable(path)
                            && name.endsWith('.jar') && !self.excludeJars.contains(name)) {
                        URLs.push(path.toUri().toURL());
                    }
                    return FileVisitResult.CONTINUE;
                }
            }));
        }
    }

    return ClassLoaderBuilder;
})();