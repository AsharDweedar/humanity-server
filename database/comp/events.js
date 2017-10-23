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
  },
  org_id:{
  	type:Sequelize.STRING
  }
});

// schema.build({name:"test"})
//         .save()
//         .then((ev) => {
//           var m = `recieved event and saved`;
//           console.log(m);
//           cb(true , m);
//         })
//         .catch((err) => {
//           var m = `error saving event - sign up coz : ${err}`;
//           console.log(m);
//           //edit the events table to accept name of org instead of id ..
//           cb(false , m);
//         })

// schema.drop();

// schema.sync({ alter: true })
//   .then((data) => {
//     console.log('Events table created successfuly');
//   })
//   .catch((err) => {
//     console.log(err)
//   })

module.exports = schema;