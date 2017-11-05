
var Sequelize = require('sequelize');
// var config = require('../config.js');

const sequelize = new Sequelize("sql12203209", "sql12203209", "DjkTqyk9Bz" , {
  host: "sql12.freemysqlhosting.net",
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// const sequelize = new Sequelize("humanity", "root", "" , {
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
  
module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;

