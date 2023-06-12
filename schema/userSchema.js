const Inventory = require('../models/inventory');
const InventoryType = require('./inventorySchema');

const graphql = require('graphql');

const { 
  GraphQLObjectType, GraphQLString, 
  GraphQLID, GraphQLInt,GraphQLSchema, 
  GraphQLList,GraphQLNonNull 
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
    inventory: {
      type: new GraphQLList(InventoryType),
      resolve(parent, args) {
        return Inventory.find({ username: parent.username });
      }
    }
  })
});

const UserQuery = new GraphQLObjectType({
  name: 'UserQuery',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
  },
});

const UserMutation = new GraphQLObjectType({
    name: 'UserMutation',
    fields: {
      addUser: {
        type: UserType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString },
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
          birthDate: { type: GraphQLString },
          phone: { type: GraphQLString },
          country: { type: GraphQLString },
          profileImg: { type: GraphQLString },
        },
        resolve(parent, args) {
          let user = new User({
            username: args.username,
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            password: args.password,
            birthDate: args.birthDate,
            phone: args.phone,
            country: args.country,
            profileImg: args.profileImg,
          });
          return user.save();
        },
      },
      editUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          username: { type: GraphQLString },
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString },
          email: { type: GraphQLString },
          password: { type: GraphQLString },
          birthDate: { type: GraphQLString },
          phone: { type: GraphQLString },
          country: { type: GraphQLString },
          profileImg: { type: GraphQLString },
        },
        resolve(parent, args) {
          return User.findByIdAndUpdate(args.id, args, { new: true });
        },
      },
      deleteUser: {
        type: UserType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parent, args) {
          return User.findOne(args.username);
        },
      },
      deleteAllUsers: {
        type: GraphQLString,
        resolve(parent, args) {
          return User.deleteMany({});
        },
      },
    },
  });

module.exports = {
  UserType,
  UserQuery,
  UserMutation
};
