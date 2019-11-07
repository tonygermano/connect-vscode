const {MirthEnvBuilder} = require('MirthEnvBuilder');
new MirthEnvBuilder(this).setMirthPath('/home/tony/mirth/release/3.7.1').init();

// Import User API classes. Many of them don't work without a running instance of Mirth server.
importPackage(com.mirth.connect.server.userutil);
importPackage(com.mirth.connect.userutil);
