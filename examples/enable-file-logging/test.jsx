// cwd is the project top level folder
load('examples/enable-file-logging/init_file_logger.js');

logger.info('this should only show up in the file')
logger.error('this should log to both file and console')