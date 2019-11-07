// cwd is the project top level folder
load('examples/replace-mirth-include/init_lang3_upgrade.js');

/*
    SystemUtils.getEnvironmentVariable was added in commons-lang3-3.9. The Mirth version
    I am using ships with commons-lang3-3.4.
*/
logger.info(org.apache.commons.lang3.SystemUtils.getEnvironmentVariable('HOME', null))
