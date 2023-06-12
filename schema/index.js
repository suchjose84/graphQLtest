const { UserQuery, UserMutation, UserType } = require('./userSchema');
const { InventoryQuery, InventoryMutation, InventoryType } = require('./inventorySchema');
const graphql = require('graphql');

const { 
  GraphQLObjectType, GraphQLString, 
  GraphQLID, GraphQLInt,GraphQLSchema, 
  GraphQLList,GraphQLNonNull 
} = graphql;

const combinedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...UserQuery.fields,
      ...InventoryQuery.fields,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...UserMutation.fields,
      ...InventoryMutation.fields,
    },
  }),
});

module.exports = combinedSchema;
