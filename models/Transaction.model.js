const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type is required."],
    },
    transactionDescription: {
      type: String,
      trim: true,
    },
    transactionAmount: {
      type: Number,
      required: [true, "Amount is required."],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    TransactionCreatedDate: Date,
    TransactionCreatedMonth: String,
    TransactionCreatedMonthNum: Number,
    TransactionCreatedYear: Number,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
