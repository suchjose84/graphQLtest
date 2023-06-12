const graphql = require('graphql');
const User = require('../models/users');
const UserType = require('../schema/userSchema');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLError,
  } = graphql;
  
  const ErrorType = new GraphQLObjectType({
    name: 'Error',
    fields: {
      message: { type: GraphQLString },
      statusCode: { type: GraphQLString },
    },
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
    userQuery: UserQuery,
    userMutation: UserMutation
};