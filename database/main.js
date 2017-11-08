
var Sequelize = require('sequelize');

const sequelize = new Sequelize("sql11203735", "sql11203735", "CfR6YnSvYM" , {
  host: "sql11.freemysqlhosting.net",
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

