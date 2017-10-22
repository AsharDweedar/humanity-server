var Sequelize = require('sequelize');
var sequelize = require('./../main.js');

var schema = sequelize.define('OrgsEvents', {
  event_id: {
    type: Sequelize.STRING
  },
  user_id:{
  	type:Sequelize.STRING
  },
  org_id:{
  	type:Sequelize.STRING
  }
});

// schema.sync({ alter: true })
//   .then((data) => {
//     console.log('Events table created successfuly');
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports = schema;