// const db = require('../models');
// const User = db.user;
// const Inventory = db.inventory;
// const graphql = require('graphql');
// // const UserType = require('./userSchema').UserType;

// const { 
//   GraphQLObjectType, GraphQLString, 
//   GraphQLID, GraphQLInt, GraphQLSchema, 
//   GraphQLList, GraphQLNonNull, GraphQLError 
// } = graphql;

// const InventoryType = new GraphQLObjectType({
//   name: 'Inventory',
//   fields: () => ({
//     username: { type: GraphQLString },
//     itemName: { type: GraphQLString },
//     price: { type: GraphQLString },
//     classification: { type: GraphQLString },
//     remaining: { type: GraphQLString },
//     unit: { type: GraphQLString },
//     userInfo: {
//       type: require('./userSchema').UserType,
//       resolve(parent, args) {
//         return User.findOne({ username: parent.username });
//       }
//     }
//   })
// });

// const InventoryQuery = new GraphQLObjectType({
//   name: 'InventoryQuery',
//   fields: {
//     inventory: {
//       type: new GraphQLList(InventoryType),
//       resolve(parent, args) {
//         return Inventory.find({});
//       },
//     },
//     itemById: {
//       type: InventoryType,
//       args: { id: { type: GraphQLID } },
//       async resolve(parent, args) {
//         try {
//           const item = await Inventory.findOne({ _id: args.id });
//           if (!item) {
//             throw new GraphQLError('Item not found', { statusCode: '404' });
//           }
//           return { ...item._doc, statusCode: '200' };
//         } catch (err) {
//           throw new GraphQLError('Error retrieving item', err);
//         }
//       },
//     },
//     searchItems: {
//       type: new GraphQLList(InventoryType),
//       args: {
//         usernames: { type: new GraphQLList(GraphQLString) },
//         classifications: { type: new GraphQLList(GraphQLString) },
//       },
//       resolve(parent, args) {
//         let query = {};

//         if (args.usernames && args.usernames.length > 0) {
//           query.username = { $in: args.usernames };
//         }

//         if (args.classifications && args.classifications.length > 0) {
//           query.classification = { $in: args.classifications };
//         }

//         // Sort by classification in ascending order
//         return Inventory.find(query)
//           .sort({ username: 1 })
//           .then((items) => {
//             if (items.length === 0) {
//               throw new GraphQLError('No items found for the provided criteria', { statusCode: '404' });
//             }
//             return items;
//           })
//           .catch((error) => {
//             throw new GraphQLError(`Error retrieving items: ${error.message}`);
//           });
//       },
//     },
//   },
// });

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
//       async resolve(parent, args) {
//         try {
//           // Check if the provided username exists in the database
//           const user = await User.findOne({ username: args.username });
//           if (!user) {
//             throw new Error('User not found');
//           }
    
//           const inventory = new Inventory({
//             username: args.username,
//             itemName: args.itemName,
//             price: args.price,
//             classification: args.classification,
//             remaining: args.remaining,
//             unit: args.unit,
//           });
    
//           const newItem = await inventory.save();
//           return newItem;
//         } catch (error) {
//           throw new Error(`Failed to add item: ${error.message}`);
//         }
//       },
//     },       
//     editItem: {
//       type: InventoryType,
//       args: {
//         id: { type: new GraphQLNonNull(GraphQLID) },
//         itemName: { type: GraphQLString },
//         price: { type: GraphQLString },
//         classification: { type: GraphQLString },
//         remaining: { type: GraphQLString },
//         unit: { type: GraphQLString },
//       },
//       async resolve(parent, args) {
//         const updateFields = {
//           itemName: args.itemName,
//           price: args.price,
//           classification: args.classification,
//           remaining: args.remaining,
//           unit: args.unit,
//         };
    
//         try {
//           const updatedItem = await Inventory.findByIdAndUpdate(args.id, updateFields, { new: true });
//           if (!updatedItem) {
//             throw new Error('Item not found');
//           }
//           return updatedItem;
//         } catch (error) {
//           throw new Error(`Failed to update item: ${error.message}`);
//         }
//       },
//     },
//     deleteItem: {
//       type: InventoryType,
//       args: {
//         id: { type: new GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         return Inventory.findById(args.id)
//           .then((item) => {
//             if (!item) {
//               throw new Error('Item with the provided ID does not exist.');
//             }
//             return Inventory.findByIdAndRemove(args.id)
//               .then(() => item)
//               .catch((err) => {
//                 throw new Error('Failed to delete item');
//               });
//           })
//           .catch((err) => {
//             throw new Error('Failed to retrieve item');
//           });
//       },
//     },    
//     deleteAllItems: {
//       type: GraphQLString,
//       resolve(parent, args) {
//         return Inventory.deleteMany({})
//           .then(() => 'All items deleted successfully')
//           .catch(err => {
//             throw new Error('Failed to delete all items');
//           });
//       },
//     },
//   },
// });

// // module.exports = new GraphQLSchema({
// //   query: InventoryQuery,
// //   mutation: InventoryMutation
// // });
// module.exports = {
//   InventoryType,
//   InventoryQuery,
//   InventoryMutation
// }
