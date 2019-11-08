// cwd is the project top level folder
load('init/init_3.7.1.js');

const {ClassLoaderBuilder} = require('mirth/ClassLoaderBuilder');

var isolatedClassLoader = new ClassLoaderBuilder() // no context passed
    .setMirthPath('') // Don't reload Mirth includes. Already the default value
    .setParentClassLoader(null) // Don't inherit rhino context classloader
    .addJarDirPath('examples/isolated-classloader-pdfbox2/lib')
    .build();

// create separate package root
var iso = Packages(isolatedClassLoader);
var PDDocument_1_8 = org.apache.pdfbox.pdmodel.PDDocument;
var PDDocument_2_0 = iso.org.apache.pdfbox.pdmodel.PDDocument;

// pdfbox 1.8 loaded by the mirth Document Writer extension
logger.info(<>default package root: {com.mirth.connect.server.Mirth}</>); // should find the class
logger.info(<>default load methods: {PDDocument_1_8.load}</>);

// now try the isolated classloader
logger.info(<>iso package root: {iso.com.mirth.connect.server.Mirth}</>); // should be package since we set parent loader to null
logger.info(<>default load methods: {PDDocument_2_0.load}</>);