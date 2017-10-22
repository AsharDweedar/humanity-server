var Sequelize = require('sequelize');
var sequelize = require('./../main.js');

var schema = sequelize.define('Events', {
  name: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  description: {
    type: Sequelize.STRING
  },
  location:{
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