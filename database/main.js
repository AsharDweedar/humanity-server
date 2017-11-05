
var Sequelize = require('sequelize');
var psql = require("../config").psql2;
var sequelize;
if (process.env.HEROKU_POSTGRESQL_CRIMSON_URL) {
  sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_CRIMSON_URL, {
    dialect: "postgres",
    protocol: "postgres",
    port: match[4],
    host: match[3],
    logging: true //false
  });
} else {
  sequelize = new Sequelize(psql.db, psql.user, psql.password, {
    host: psql.server,
    dialect: "postgres"
  });
}
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

