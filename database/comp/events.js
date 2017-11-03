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
  location: {
  	type:Sequelize.STRING
  },
  time: {
    type:Sequelize.DATE
  },
  duration: {
    type:Sequelize.TIME,
  },
  org_id: {
  	type:Sequelize.STRING
  },
  rate: {
    type:Sequelize.DECIMAL,
    allowNull: false,
    defaultValue: 0,
  },
  volunteers: {
    type:Sequelize.INTEGER,
  }
});

// schema.drop();

// schema.sync({ alter: true })
//   .then((data) => {
//     console.log('Events table created successfuly');
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports = schema;