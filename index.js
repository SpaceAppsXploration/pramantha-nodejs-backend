
var pkg = require('./package.json');
var os  = require('os');

console.log('');
console.log('');
console.log('    PRAMANTHA CHRONOS APIs');
console.log('    ======================');
console.log('');
console.log('');
console.log('    Version: ' + pkg.version);
console.log('    Motto: Per data ad astra');
console.log('    Random: ' + Math.random());
console.log('    Platform: ' + os.type());
console.log('    CPUs: ' + os.cpus().length);
console.log('');
console.log('');
console.log('    Please use one of the following: ');
console.log('    $ node scripts/start.js');
console.log('    $ node scripts/cluster.js');
console.log('');
console.log('');
console.log('    Remember to maintain your local configuration:');
console.log('    $ cp config/defaults.json config/config.json');
console.log('    $ nano config/config.json');
console.log('');
console.log('');