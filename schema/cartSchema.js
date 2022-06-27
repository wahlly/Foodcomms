const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
      userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      orderId: {
            type: String,
            required: true
      },
      items: [{
            productId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Product',
                  required: true
            },
            quantity: {
                  type: Number,
                  required: true
            },
            amount: {
                  type: Number,
                  required: true
            }
      }],
      total: {
            type: Number,
            default: 0
      },
      status: {
            type: String,
            enum: ['pending', 'awaiting_checkout', 'completed', 'cancelled'],
            default: 'pending'
      }
})

const Cart = model('Cart', cartSchema, 'carts');

module.exports = { Cart };