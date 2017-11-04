
var Sequelize = require('sequelize');
// var config = require('../config.js');

// const sequelize = new Sequelize("sql12201289", "sql12201289", "RImDWfyQF6" , {
//   host: "sql12.freemysqlhosting.net",
//   dialect: 'mysql',
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   }
// });

const sequelize = new Sequelize("humanity", "root", "AS-har1passms" , {
  host: "localhost",
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

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

