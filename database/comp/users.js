var Sequelize = require('sequelize');
var sequelize = require('./../main.js');

var schema = sequelize.define('Users', {
  username: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  password: {
    type: Sequelize.STRING,
    allowNull:false
  },
  email:{
    type:Sequelize.STRING,
    allowNull:false
  },
  rate:{
    type:Sequelize.DECIMAL
  }
});

//schema.drop();

// schema.sync({ alter: true })
//           .then((data) => {
//             console.log('users table created successfuly');
//           })
//           .catch((err) => {
//             console.log(err)
//           })



module.exports = schema;