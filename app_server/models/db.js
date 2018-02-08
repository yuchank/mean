var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);

if (process.platform === 'win32') {
  var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', _ => process.emit('SIGINT'));
}

process.once('SIGUSR2', _ => shutdown('nodemon restart', _ => process.kill(process.pid, 'SIGUSR2')));
process.on('SIGINT', _ => shutdown('app termination', _ => process.exit(0)));
process.on('SIGTERM', _ => shutdown('Heroku app shutdown', _ => process.exit(0)));

mongoose.connection.on('connected', _ => console.log('Mongoose connected to ' + dbURI));
mongoose.connection.on('error', err => console.log('Mongoose connection error: ' + err));
mongoose.connection.on('disconnected', _ => console.log('Mongoose disconnected'));

var shutdown = (msg, callback) => {
  mongoose.connection.close(_ => {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
