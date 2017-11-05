var sequelize = require("./../main.js").sequelize;
var Sequelize = require("./../main.js").Sequelize;

var schema = sequelize.define('Orgs', {
  name: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  description: {
    type: Sequelize.TEXT
  },
  password:{
  	type:Sequelize.TEXT,
    allowNull:false
  },
  email:{
  	type:Sequelize.TEXT,
    allowNull: false
  },
  rate:{
    type:Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  } 
});

// schema.drop();

schema
  .sync({
          alter: true
        })
  .then((data) => {
    console.log("Orgs table updated successfuly");
  })
  .catch(({message}) => {
    console.log(message);
  })

module.exports = schema;