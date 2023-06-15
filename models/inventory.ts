// module.exports = (mongoose) => {
//     const inventorySchema = mongoose.Schema({
//       username: {
//         type: String
//       },
//       itemName: {
//         type: String
//       },
//       price: {
//         type: String
//       },
//       classification: {
//         type: String
//       },
//       remaining: {
//         type: String
//       },
//       unit: {
//         type: String
//       }
//     }, {
//       versionKey: false,
//       collection: 'inventory' // Specify the custom collection name here
//     }
//     );
//     return mongoose.model('inventory', inventorySchema);
//   };

import mongoose, { Schema, Model, Document } from 'mongoose';

interface Inventory extends Document {
  username: string;
  itemName: string;
  price: string;
  classification: string;
  remaining: string;
  unit: string;
}

const inventorySchema: Schema<Inventory> = new mongoose.Schema(
  {
    username: {
      type: String
    },
    itemName: {
      type: String
    },
    price: {
      type: String
    },
    classification: {
      type: String
    },
    remaining: {
      type: String
    },
    unit: {
      type: String
    }
  },
  {
    versionKey: false,
    collection: 'inventory' // Specify the custom collection name here
  }
);

const InventoryModel: Model<Inventory> = mongoose.model<Inventory>('inventory', inventorySchema);

export default InventoryModel;
