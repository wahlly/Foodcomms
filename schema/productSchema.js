const { Schema, model } = require('mongoose');

const productSchema = new Schema({
      name: {
            type: String,
            required: true
      },
      price: {
            type: Number,
            required: true
      },
      initialQuantity: {
            type: Number,
            required: true
      },
      soldQuantity: {
            type: Number,
            default: 0
      }
}, { timestamps: true });

const Product = model('Product', productSchema, 'products');

module.exports = { Product };