const db = require('../models');
const User = db.user;
const Inventory = db.inventory;
const graphql = require('graphql');

const { 
  GraphQLObjectType, GraphQLString, 
  GraphQLID, GraphQLInt, GraphQLSchema, 
  GraphQLList, GraphQLNonNull 
} = graphql;

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
  })
});

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
          const item = await Inventory.findOne({ _id: args.id });
          if (!item) {
            throw new GraphQLError('Item not found', { statusCode: '404' });
          }
          return { ...item._doc, statusCode: '200' };
        } catch (err) {
          throw new GraphQLError('Error retrieving item', err);
        }
      },
    },
  },
});

// const InventoryMutation = new GraphQLObjectType({
//   name: 'InventoryMutation',
//   fields: {
//     addItem: {
//       type: InventoryType,
//       args: {
//         username: { type: new GraphQLNonNull(GraphQLString) },
//         itemName: { type: GraphQLString },
//         price: { type: GraphQLString },
//         classification: { type: GraphQLString },
//         remaining: { type: GraphQLString },
//         unit: { type: GraphQLString },
//       },
//       resolve(parent, args) {
//         let inventory = new Inventory({
//           username: args.username,
//           itemName: args.itemName,
//           price: args.price,
//           classification: args.classification,
//           remaining: args.remaining,
//           unit: args.unit,
//         });
//         return inventory.save();
//       },
//     },
//     editItem: {
//       type: InventoryType,
//       args: {
//         id: { type: new GraphQLNonNull(GraphQLID) },
//         username: { type: GraphQLString },
//         itemName: { type: GraphQLString },
//         price: { type: GraphQLString },
//         classification: { type: GraphQLString },
//         remaining: { type: GraphQLString },
//         unit: { type: GraphQLString },
//       },
//       resolve(parent, args) {
//         return Inventory.findByIdAndUpdate(args.id, args, { new: true });
//       },
//     },
//     deleteItem: {
//       type: InventoryType,
//       args: {
//         id: { type: new GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         return Inventory.findByIdAndRemove(args.id);
//       },
//     },
//     deleteAllItems: {
//       type: GraphQLString,
//       resolve(parent, args) {
//         return Inventory.deleteMany({});
//       },
//     },
//   },
// });

module.exports = new GraphQLSchema({
  query: InventoryQuery,
  // mutation: InventoryMutation
});
