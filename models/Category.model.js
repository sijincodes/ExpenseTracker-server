const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    categoryType: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Category Type is required."],
    },
    categoryName: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Category = model("Category", CategorySchema);

module.exports = Category;
