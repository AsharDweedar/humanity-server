var sequelize = require("./../main.js").sequelize;
var Sequelize = require("./../main.js").Sequelize;


var schema = sequelize.define('OrgsEvents', {
  event_id: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  user_id:{
    type: Sequelize.TEXT,
    allowNull: false,
  },
  user_name:{
    type: Sequelize.TEXT,
    allowNull: false,
  },
  org_id: {
    type: Sequelize.TEXT,
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
 
schema
   .sync({
      alter: true
   })
   .then((data) => {
     console.log('Events table updated successfuly');
   })
//   .catch(({message}) => {
//     console.log(message);
//   })

module.exports = schema;
