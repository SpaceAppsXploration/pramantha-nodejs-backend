var cluster   = require('cluster');
var os        = require('os');
var path      = require('path');
var stream    = require('stream');
var logrotate = require('logrotate-stream');
var fs        = require('fs');
var logging   = require('./logging');
var config    = require('./config');

if (cluster.isMaster) {

  var stderr = new stream.PassThrough();
  var stdout = new stream.PassThrough();
  var logger = logging.createLogger({name: 'cluster', stream: stdout});

  if (config.logToFile) {
    var fileerr = logrotate({ file: path.join(__dirname, 'logs', 'stderr.log'), size: '100k', keep: 3 });
    var fileout = logrotate({ file: path.join(__dirname, 'logs', 'stdout.log'), size: '100k', keep: 3 });
    stderr.pipe(fileerr);
    stdout.pipe(fileout);
  }

  if (config.logToConsole) {
    stderr.pipe(process.stderr);
    stdout.pipe(process.stdout);
  }

  cluster.setupMaster({ 
    silent: true, // prevents workers from grabbing the master's stdio
    exec : path.join(__dirname, 'start.js'),
    args : process.argv.slice(2)
  });

  cluster.on('exit', function onExit(worker) {
    logger.warn('worker %s (pid %s) has quit.', worker.id, worker.process.pid);
    cluster.fork();
  });

  cluster.on('disconnect', function onDisconnect(worker) {
    logger.warn('worker %s (pid %s) has disconnected.', worker.id, worker.process.pid);
    worker.process.stderr.unpipe(stderr);
    worker.process.stdout.unpipe(stdout);
  });

  cluster.on('fork', function onFork(worker) {
    worker.process.stderr.pipe(stderr);
    worker.process.stdout.pipe(stdout);
    logger.info('worker %s (pid %s) has started.', worker.id, worker.process.pid);
  });

  var workers = config.workers || os.cpus().length;

  logger.info('Starting %s workers.', workers);  

  for (var i = 0; i < workers; i++) {
    cluster.fork();
  }

  fs.writeFile(path.join(__dirname, '.pid'), process.pid, function(errWrite) {
    if (errWrite) {
      logger.error('could not write .pid file');
    }
  });

}