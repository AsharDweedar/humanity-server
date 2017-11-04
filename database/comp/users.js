var sequelize = require("./../main.js").sequelize;
var Sequelize = require("./../main.js").Sequelize;

var schema = sequelize.define('Users', {
  username: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull:false
  },
  email:{
    type:Sequelize.TEXT,
    allowNull:false
  },
  rate:{
    type:Sequelize.FLOAT,
  }
});

// schema.drop();

// schema
//   .sync({force : true})
//   .then((data) => {
//     console.log('users table created successfuly');
//   })
//   .catch((err) => {
//     console.log(err)
//   })



module.exports = schema;