const express = require("express");
const router = express.Router();
const Category = require("./../models/Category.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// Get category
router.get("/category", isAuthenticated, async (req, res, next) => {
  const { type } = req.query;
  try {
    const categories = await Category.find(
      type
        ? {
            $and: [
              { categoryType: type },
              { $or: [{ userId: null }, { userId: req.payload._id }] },
            ],
          }
        : { $or: [{ userId: null }, { userId: req.payload._id }] }
    );
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// Get category by id
router.get("/category/:categoryId", isAuthenticated, async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const categories = await Category.findById(categoryId);
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// Post category
router.post("/category", isAuthenticated, async (req, res, next) => {
  const { categoryType, categoryName } = req.body;
  try {
    const categories = await Category.create({
      categoryType: categoryType,
      categoryName: categoryName,
      userId: req.payload._id,
    });
    res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
});

// Post admin to add static category
router.post("/admin/category", async (req, res, next) => {
  const { categoryType, categoryName } = req.body;
  try {
    const categories = await Category.create({
      categoryType: categoryType,
      categoryName: categoryName,
    });
    res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
