var fs = require('fs');

var bootstraprcCustomLocation = '.bootstraprc';

var defaultBootstraprcFileExists;

try {
  fs.statSync('./.bootstraprc');
  defaultBootstraprcFileExists = true;
  
}catch(e) {
  defaultBootstraprcFileExists = false;
}
if (!bootstraprcCustomLocation && !defaultBootstraprcFileExists) {
  /* eslint no-console: 0 */
  console.log('You did not specify a \'bootstraprc-location\' ' +
              'arg or a ./.boostraprc file in the root.');
  console.log('Using the bootstrap-loader default configuration.');
}

var bootstrapDevEntryPoint;
if (bootstraprcCustomLocation) {
  bootstrapDevEntryPoint = 'bootstrap-loader/lib/bootstrap.loader?' +
                           'configFilePath='+__dirname + '/'+ bootstraprcCustomLocation +
                           '!bootstrap-loader/no-op.js';
} else {
  bootstrapDevEntryPoint = 'bootstrap-loader';
}

var bootstrapProdEntryPoint;
if (bootstraprcCustomLocation) {
  bootstrapProdEntryPoint = 'bootstrap-loader/lib/bootstrap.loader?extractStyles' +
                            '&configFilePath='+ __dirname+'/'+ bootstraprcCustomLocation +
                            '!bootstrap-loader/no-op.js';
} else {
  bootstrapProdEntryPoint = 'bootstrap-loader/extractStyles';
}

module.exports = {
  dev: bootstrapDevEntryPoint,
  prod: bootstrapProdEntryPoint,
};
