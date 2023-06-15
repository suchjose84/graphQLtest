// module.exports = (mongoose) => {
//   const userSchema = mongoose.Schema({
//     username: {
//       type: String
//     },
//     firstName: {
//       type: String
//     },
//     lastName: {
//       type: String
//     },
//     email: {
//       type: String
//     },
//     password: {
//       type: String
//     },
//     birthDate: {
//       type: String
//     },
//     phone: {
//       type: String
//     },
//     country: {
//       type: String
//     },
//     profileImg: {
//       type: String
//     }
//   }, {
//     versionKey: false,
//     collection: 'users' // Specify the custom collection name here
//   }
//   );
//   return mongoose.model('users', userSchema);
// };

import mongoose, { Schema, Model, Document } from 'mongoose';

interface User extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  phone: string;
  country: string;
  profileImg: string;
}

const userSchema: Schema<User> = new mongoose.Schema(
  {
    username: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    birthDate: {
      type: String
    },
    phone: {
      type: String
    },
    country: {
      type: String
    },
    profileImg: {
      type: String
    }
  },
  {
    versionKey: false,
    collection: 'users' // Specify the custom collection name here
  }
);

const UserModel: Model<User> = mongoose.model<User>('users', userSchema);

export default UserModel;



