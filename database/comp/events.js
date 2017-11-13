var sequelize = require("./../main.js").sequelize;
var Sequelize = require("./../main.js").Sequelize;

var schema = sequelize.define('Events', {
  name: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true
  },
  description: {
    type: Sequelize.TEXT,
  },
  location: {
  	type:Sequelize.TEXT,
  },
  time: {
    type:Sequelize.DATE,
  },
  duration: {
    type:Sequelize.TIME,
  },
  org_id: {
  	type:Sequelize.TEXT,
  },
  org_name: {
  	type:Sequelize.TEXT,
  },
  rate: {
    type:Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  volunteers: {
    type:Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  joined: {
    type:Sequelize.INTEGER,
    defaultValue: 0,
  },
  ageLimit: {
    type:Sequelize.INTEGER,
  }
});

// schema.drop();

 schema
   .sync({alter : true})
   .then((data) => {
     console.log("Events table updated successfuly");
   })
   .catch(({message}) => {
     console.log(message);
   })

module.exports = schema;
