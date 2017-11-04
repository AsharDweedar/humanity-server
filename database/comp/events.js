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
  rate: {
    type:Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  volunteers: {
    type:Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
});

// schema.drop();

// schema
//   .sync({force : true})
//   .then((data) => {
//     console.log("Events table updated successfuly");
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports = schema;