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
  time: {
    type:Sequelize.DATE
  }
});

// schema.drop();


schema.sync({ alter: true , force : true})
  .then((data) => {
    console.log('Events table created successfuly');
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = schema;