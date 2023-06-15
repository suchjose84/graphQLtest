// const dbConfig = require('../config/db.config.js');
// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// const db = {};
// db.mongoose = mongoose;
// db.url = dbConfig.url;
// db.user = require('./users.js')(mongoose);
// db.inventory = require('./inventory.js')(mongoose);

// module.exports = db;

import dbConfig from '../config/db.config';
import mongoose from 'mongoose';
import { UserModel } from './users';
import { InventoryModel } from './inventory';

mongoose.Promise = global.Promise;

const db: {
  mongoose: typeof mongoose;
  url: string;
  user: UserModel;
  inventory: InventoryModel;
} = {} as any;

db.mongoose = mongoose;
db.url = dbConfig.url;
db.user = require('./users')(mongoose);
db.inventory = require('./inventory')(mongoose);

export default db;

