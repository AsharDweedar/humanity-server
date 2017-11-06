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
  age: {
    type:Sequelize.INTEGER,
  },
  rate:{
    type:Sequelize.FLOAT,
  }
});

// schema.drop();

// schema
//   .sync({alter : true})
//   .then((data) => {
//     console.log('users table created successfuly');
//   })
//   .catch(({message}) => {
//     console.log(message);
//   })



module.exports = schema;