const {MirthEnvBuilder} = require('MirthEnvBuilder');
new MirthEnvBuilder(this).setMirthPath('/home/tony/mirth/release/3.7.1')
    .applyToLoggerBuilder(builder => builder
        .level('WARN') // defaults to 'INFO'
        .outFile('examples/enable-file-logging/logs/vscode.log')
        .append(false) // default is true
        .outFileLevel('DEBUG') // defaults to 'DEBUG'
    )
    .init();

// Import User API classes
importPackage(com.mirth.connect.server.userutil);
importPackage(com.mirth.connect.userutil);

