const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const Inventory = require('../models/inventory');
const InventoryType = require('./inventorySchema');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    phone: { type: GraphQLString },
    country: { type: GraphQLString },
    profileImg: { type: GraphQLString },
    inventory: {
      type: new GraphQLList(InventoryType),
      resolve(parent, args) {
        return Inventory.find({ username: parent.username });
      }
    }
  })
});

module.exports = UserType;
