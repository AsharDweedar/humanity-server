
var Sequelize = require('sequelize');
var config = require('../config.js');

const sequelize = new Sequelize('humanity', 'ashar', config.localpsqlPassword , {
  host: 'localhost',
  dialect: 'postgres'
});
/*
const sequelize = new Sequelize('d2i4b7nf4saf7', 'sczoygkgjzlpcd', config.psqlPassword , {
  host: 'ec2-54-225-112-61.compute-1.amazonaws.com',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
*/

/*
const sequelize = new Sequelize('sql12201289', 'sql12201289', 'RImDWfyQF6' , {
  host: 'sql12.freemysqlhosting.net',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
*/
//Checking connection status
sequelize.authenticate()
	.then(function(err) {
		console.log('Connection to database has been established successfully');
	})
	.catch(function (err) {
	    console.log('There is connection in ERROR', err);
	})
module.exports = sequelize ;

