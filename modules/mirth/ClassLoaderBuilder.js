exports.ClassLoaderBuilder = (function() {
    const Thread = java.lang.Thread;
    const Paths = java.nio.file.Paths;
    const Files = java.nio.file.Files;
    const FileVisitResult = java.nio.file.FileVisitResult;
    const HashSet = java.util.HashSet;
    const URL = java.net.URL;
    const URLClassLoader = java.net.URLClassLoader;

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
        this.excludeJars = new HashSet();
        this.parentClassLoader = undefined;
    }

    ClassLoaderBuilder.prototype.setMirthPath = function setMirthPath(pathString) {
        this.mirthPath = Paths.get(pathString);
        return this;
    }

    ClassLoaderBuilder.prototype.addUrlPath = function addUrlPath(pathString) {
        this.additionalUrls.add(new URL(pathString));
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
                recursiveJarGetter(Paths.get(self.mirthPath, dir), URLs);
            });
            URLs.push(Paths.get(self.mirthPath, 'conf/mirth.properties').toUri().toURL());
        }
        for (var url in Iterator(self.additionalUrls)) {
            URLs.push(url);
        }
        
        var cl = (self.parentClassLoader !== undefined) ? new URLClassLoader(URLs, self.parentClassLoader) : new URLClassLoader(URLs);

        if (self.cx) {
            self.cx.Packages = self.cx.Packages(cl);
            ["java", "javax", "org", "com", "edu", "net"].forEach(function(pkg) {
                self.cx[pkg] = self.cx.Packages[pkg];
            });
        }

        return cl;

        function recursiveJarGetter(dirPath, URLs) {
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