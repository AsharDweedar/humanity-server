var sequelize = require("./../main.js").sequelize;
var Sequelize = require("./../main.js").Sequelize;


var schema = sequelize.define('OrgsEvents', {
  event_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user_id:{
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  org_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  orgToUser: {
    type: Sequelize.INTEGER,
  },
  userToEvent: {
    type: Sequelize.INTEGER,
  },
});

// schema.drop();

// schema
//   .sync({ force : true})
//   .then((data) => {
//     console.log('Events table updated successfuly');
//   })
//   .catch((err) => {
//     console.log(err);
//   })

module.exports = schema;