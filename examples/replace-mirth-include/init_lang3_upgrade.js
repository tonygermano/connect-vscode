const {MirthEnvBuilder} = require('MirthEnvBuilder');
new MirthEnvBuilder(this).setMirthPath('/home/tony/mirth/release/3.7.1')
    //.applyToClassLoaderBuilder(builder => builder.excludeJar('commons-lang3-3.4.jar'))

    // Just an example to show that http paths can be used. I wouldn't recommend with external servers as it will redownload every time.
    // .applyToClassLoaderBuilder(builder => builder.addUrlPath('https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.9/commons-lang3-3.9.jar'))

    // Better to load locally.
    // .applyToClassLoaderBuilder(builder => builder.addUrlPath('file:///home/tony/mirth/resources/commons-lang3-3.9.jar'))

    /*
        Could also chain these within the same apply command. This is written as if we don't have ES6
        mode (languageVersion 200) appied or available to support older mirth and rhino versions.
    */
    .applyToClassLoaderBuilder(function(builder) {
        builder.addUrlPath('file:///home/tony/mirth/resources/commons-lang3-3.9.jar')
            .excludeJar('commons-lang3-3.4.jar')
    })

    .init();

// Import User API classes
importPackage(com.mirth.connect.server.userutil);
importPackage(com.mirth.connect.userutil);

