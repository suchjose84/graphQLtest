const User = require('../models/users');
const graphql = require('graphql');

const { 
  GraphQLObjectType, GraphQLString, 
  GraphQLID, GraphQLInt,GraphQLSchema, 
  GraphQLList,GraphQLNonNull 
} = graphql;

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

const InventoryQuery = new GraphQLObjectType({
  name: 'InventoryQuery',
  fields: {
    inventory: {
      type: new GraphQLList(InventoryType),
      resolve(parent, args) {
        return Inventory.find({});
      },
    },
    item: {
      type: InventoryType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        try {
          const item = await Inventory.findOne(args.id);
          if (!item) {
            throw new GraphQLError('Item not found', { statusCode: '404' });
          }
          return { ...item, statusCode: '200' };
        } catch (err) {
          throw new GraphQLError('Error retrieving item', err);
        }
      },
    },
  },
});

const InventoryMutation = new GraphQLObjectType({
    name: 'InventoryMutation',
    fields: {
      addItem: {
        type: InventoryType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          itemName: { type: GraphQLString },
          price: { type: GraphQLString },
          classification: { type: GraphQLString },
          remaining: { type: GraphQLString },
          unit: { type: GraphQLString },
        },
        resolve(parent, args) {
          let inventory = new Inventory({
            username: args.username,
            itemName: args.itemName,
            price: args.price,
            classification: args.classification,
            remaining: args.remaining,
            unit: args.unit,
          });
          return inventory.save();
        },
      },
      editItem: {
        type: InventoryType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          username: { type: GraphQLString },
          itemName: { type: GraphQLString },
          price: { type: GraphQLString },
          classification: { type: GraphQLString },
          remaining: { type: GraphQLString },
          unit: { type: GraphQLString },
        },
        resolve(parent, args) {
          return Inventory.findByIdAndUpdate(args.id, args, { new: true });
        },
      },
      deleteItem: {
        type: InventoryType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
          return Inventory.findByIdAndRemove(args.id);
        },
      },
      deleteAllItems: {
        type: GraphQLString,
        resolve(parent, args) {
          return Inventory.deleteMany({});
        },
      },
    },
  });



module.exports = {
  InventoryType,
  InventoryQuery,
  InventoryMutation
};
