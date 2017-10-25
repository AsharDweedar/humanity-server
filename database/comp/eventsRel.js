var Sequelize = require('sequelize');
var sequelize = require('./../main.js');


// eventUser.js
var sequelize  = require('../main.js');
var Users      = require('./users.js');
var Events     = require('./events.js');
var Orgs       = require('./orgs.js');


var schema = sequelize.define('EventsUsers', {
  event_id: {
    type: Sequelize.INTEGER ,
    references: {
		model: Events,
		key: 'id',
    }
  },
  user_id: {
  	type:Sequelize.INTEGER ,
  	references: {
		model: Users,
		key: 'id',
    }
  },
  Org_id: {
  	type:Sequelize.INTEGER ,
  	references: {
		model: Orgs,
		key: 'id',
    }
  }
});

//events-users
Users.belongsToMany(Events, { through: schema } );
Users.belongsToMany(Events, { through: schema } );

//events-orgs
Orgs.belongsToMany(Events, { through: schema } );



//schema.drop();

schema.sync({ alter: true, force : true })
  .then((data) => {
    console.log('Events table created successfuly');
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = schema;