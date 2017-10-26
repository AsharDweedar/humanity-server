
var Sequelize = require('sequelize');
var config = require('../config.js');

const sequelize = new Sequelize(config.mai.db, config.mai.user, config.mai.password , {
  host: config.mai.server,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// const sequelize = new Sequelize("humanity", "root", "****" , {
//   host: "localhost",
//   dialect: 'mysql',
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   }
// });

//Checking connection status
sequelize.authenticate()
	.then(function(err) {
		console.log('Connection to database has been established successfully');
	})
	.catch(function (err) {
	    console.log('There is connection ERROR', err);
	})
module.exports = sequelize ;

