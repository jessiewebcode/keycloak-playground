const fs = require('fs');

const logLocation = './logs/main.log';

function log(data) {
  fs.appendFile(logLocation, data + '\n', (err) => err && console.error(err));
}

module.exports = {
  log
};
