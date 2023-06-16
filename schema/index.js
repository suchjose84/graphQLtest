const db = require('../models');
const User = db.user;
const Inventory = db.inventory;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError,
  GraphQLBoolean
} = require('graphql');

// require Joi Validation;
const {
  usernameSchema,
  emailSchema,
  passwordSchema
} = require('../util/validation_schema');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    birthDate: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    },
    profileImg: {
      type: GraphQLString
    },
    inventory: {
      type: new GraphQLList(InventoryType),
      resolve(parent, args) {
        return Inventory.find({ username: parent.username });
      }
    }
  })
});
