
var Sequelize = require('sequelize');

const sequelize = new Sequelize("humanity", "jv184vjd1yqqck4d", "tqjnn4ga6ug78o4r" , {
  host: "hngomrlb3vfq3jcr.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
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

