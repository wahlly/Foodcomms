const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
      userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      orderId: {
            type: String,
            required: true
      },
      cartId: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true
      },
      amountPaid: {
            type: Number,
            required: true
      }
}, { timestamps: true });

const Transaction = model('Transaction', transactionSchema, 'transactions');

module.exports = { Transaction };