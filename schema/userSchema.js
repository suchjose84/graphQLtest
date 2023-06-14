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
const db = require('../models');
const User = db.user;
const Inventory = db.inventory;
const inventorySchema = require('./inventorySchema');
const InventoryType = inventorySchema.InventoryType;
// const Joi = require('joi');
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
    // inventory: {
    //   type: new GraphQLList(InventoryType),
    //   resolve(parent, args) {
    //     return Inventory.find({ username: parent.username });
    //   }
    // }
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
      args: {
        id: {
          type: GraphQLID
        },
        username: {
          type: GraphQLString
        }, // Add this argument for querying by username
      },
      resolve(parent, args) {
        if (args.id) {
          // Querying by ID
          return User.findById(args.id);
        } else if (args.username) {
          // Querying by username
          return User.findOne({
            username: args.username
          });
        } else {
          // Handle error or default case
          throw new Error('Invalid arguments for user query.');
        }
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
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
          type: new GraphQLNonNull(GraphQLString)
        },
        lastName: {
          type: GraphQLString
        },
        email: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
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
      },
      async resolve(parent, args) {
        try {
          await usernameSchema.validateAsync(args.username);
          await emailSchema.validateAsync(args.email);
          await passwordSchema.validateAsync(args.password);

          const existingUser = await User.findOne({
            $or: [{
              username: args.username
            }, {
              email: args.email
            }],
          });

          if (existingUser) {
            throw new Error('Username or email already exists.');
          }

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
        } catch (error) {
          throw new GraphQLError(error.message);
        }
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        },
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
      },
      async resolve(parent, args) {
        try {
          const {
            id,
            ...updateData
          } = args;

          if (args.username) {
            await usernameSchema.validateAsync(args.username);
          }
          if (args.email) {
            await emailSchema.validateAsync(args.email);
          }
          if (args.password) {
            await passwordSchema.validateAsync(args.password);
          }

          const existingUser = await User.findOne({
            $or: [{
              username: args.username
            }, {
              email: args.email
            }],
          });

          if (existingUser) {
            throw new Error('Username or email already exists.');
          }

          const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true
          });

          return updatedUser;
        } catch (error) {
          throw new GraphQLError(error.message);
        }
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        id: {
          type: GraphQLID
        },
      },
      async resolve(parent, args) {
        try {
          if (args.id) {
            // If `id` is provided, delete user by ID
            const deletedUser = await User.findByIdAndDelete(args.id);
            if (!deletedUser) {
              throw new Error('User with the provided ID does not exist.');
            }
            return deletedUser;
          } else {
            // Delete user by username
            const deletedUser = await User.findOneAndDelete({
              username: args.username
            });
            if (!deletedUser) {
              throw new Error('User with the provided username does not exist.');
            }
            return deletedUser;
          }
        } catch (error) {
          throw new GraphQLError(error.message);
        }
      },
    },
    // deleteUsers: {
    //   type: GraphQLString,
    //   args: {
    //     usernames: {
    //       type: new GraphQLList(GraphQLString),
    //     },
    //   },
    //   async resolve(parent, { usernames }) {
    //     let deletedUsers = [];
    //     let failedDeletions = [];

    //     // Delete users based on usernames
    //     if (usernames && usernames.length > 0) {
    //       // Find the existing usernames in the database
    //       const existingUsernames = await User.find({ username: { $in: usernames } }).distinct('username');

    //       // Get the usernames that have a match in the database
    //       const usernamesToDelete = existingUsernames;

    //       // Get the invalid usernames that are not found in the database
    //       const invalidUsernames = usernames.filter(username => !existingUsernames.includes(username));

    //       // Delete the users with matching usernames
    //       const deleteResults = await User.deleteMany({ username: { $in: usernamesToDelete } });

    //       // Check if any users were successfully deleted
    //       if (deleteResults && deleteResults.deletedCount > 0) {
    //         deletedUsers.push(deleteResults.deletedCount);
    //       } else {
    //         failedDeletions = failedDeletions.concat(usernamesToDelete);
    //       }

    //       // Add the invalid usernames to the failedDeletions array
    //       failedDeletions = failedDeletions.concat(invalidUsernames);
    //     }        

    //     let responseMessage = "";

    //     if (deletedUsers.length > 0) {
    //       responseMessage = `Successfully deleted ${deletedUsers.reduce((a, b) => a + b, 0)} user(s).`;
    //     } else {
    //       responseMessage = "No users were deleted.";
    //     }

    //     if (failedDeletions.length > 0) {
    //       responseMessage += ` Failed to delete user(s) with the following usernames: ${failedDeletions.join(", ")}.`;
    //     } else {
    //       responseMessage += ` All usernames were deleted successfully.`;
    //     }

    //     console.log(failedDeletions);

    //     return responseMessage;
    //   },
    // },
    deleteUsers: {
      type: GraphQLString,
      args: {
        usernames: {
          type: new GraphQLList(GraphQLString),
        },
        ids: {
          type: new GraphQLList(GraphQLID)
        }
      },
      async resolve(parent, {
        usernames,
        ids
      }) {
        let deletedUsers = [];
        let failedDeletions = [];
        // Delete users based on usernames
        if (usernames && usernames.length > 0) {
          // Find the existing usernames in the database
          const existingUsernames = await User.find({
            username: {
              $in: usernames
            }
          }).distinct('username');
    
          // Get the usernames that have a match in the database
          const usernamesToDelete = existingUsernames;
    
          // Get the invalid usernames that are not found in the database
          const invalidUsernames = usernames.filter(username => !existingUsernames.includes(username));
    
          // Delete the users with matching usernames
          const deleteResults = await User.deleteMany({
            username: {
              $in: usernamesToDelete
            }
          });
    
          // Check if any users were successfully deleted
          if (deleteResults && deleteResults.deletedCount > 0) {
            deletedUsers.push(deleteResults.deletedCount);
          } else {
            failedDeletions = failedDeletions.concat(usernamesToDelete);
          }
    
          // Add the invalid usernames to the failedDeletions array
          failedDeletions = failedDeletions.concat(invalidUsernames);
        }
    
        // Delete users based on IDs
        if (ids && ids.length > 0) {
          // Find the existing IDs in the database
          const existingIds = await User.find({
            _id: {
              $in: ids
            }
          }).distinct('_id');
    
          // Get the IDs that have a match in the database
          const idsToDelete = existingIds.map(id => id.toString());
    
          // Get the invalid IDs that are not found in the database
          const invalidIds = ids.filter(id => !existingIds.includes(id));
    
          // Delete the users with matching IDs
          const deleteResults = await User.deleteMany({
            _id: {
              $in: idsToDelete
            }
          });
    
          // Check if any users were successfully deleted
          if (deleteResults && deleteResults.deletedCount > 0) {
            deletedUsers.push(deleteResults.deletedCount);
          }
    
          // Find the IDs that failed to be deleted
          const failedIds = ids.filter(id => !idsToDelete.includes(id.toString()));
    
          // Add the failed IDs to the failedDeletions array
          failedDeletions = failedDeletions.concat(failedIds);
        }
    
        let responseMessage = "";
    
        if (deletedUsers.length > 0) {
          responseMessage = `Successfully deleted ${deletedUsers.reduce((a, b) => a + b, 0)} user(s).`;
        } else {
          responseMessage = "No users were deleted.";
        }
    
        if (failedDeletions.length > 0) {
          responseMessage += ` Failed to delete user(s) with the following IDs: ${failedDeletions.join(", ")}.`;
        } else {
          responseMessage += ` All users were deleted successfully.`;
        }
    
        console.log(failedDeletions);
    
        return responseMessage;
      },
    },       
    deleteAllUsers: {
      type: GraphQLBoolean,
      resolve(parent, args) {
        return User.deleteMany({})
          .then(() => true)
          .catch(() => false);
      },
    },
  },
});


const schema = new GraphQLSchema({
  query: UserQuery,
  mutation: UserMutation
});

module.exports = schema;