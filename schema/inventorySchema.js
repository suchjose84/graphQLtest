const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const User = require('../models/users');

const InventoryType = new GraphQLObjectType({
  name: 'Inventory',
  fields: () => ({
    username: { type: GraphQLString },
    itemName: { type: GraphQLString },
    price: { type: GraphQLString },
    classification: { type: GraphQLString },
    remaining: { type: GraphQLString },
    unit: { type: GraphQLString },
    userInfo: {
      type: UserType,
      resolve(parent, args) {
        return User.findOne({ username: parent.username });
      }
    }
  })
});

module.exports = InventoryType;
