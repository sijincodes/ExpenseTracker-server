const { Schema, model } = require("mongoose");

const expenseSchema = new Schema({
  title: String,
  amount: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: Date,
});

const Expense = model("Expense", expenseSchema);

module.exports = Expense;
