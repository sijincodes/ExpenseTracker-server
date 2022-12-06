const { Schema, model } = require("mongoose");

const incomeSchema = new Schema({
  title: String,
  amount: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: Date,
});

const Income = model("Income", incomeSchema);

module.exports = Income;
