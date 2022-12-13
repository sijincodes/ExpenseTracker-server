const express = require("express");
const router = express.Router();
const moment = require("moment");
const Transaction = require("../models/Transaction.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// Create Transaction
router.post("/transaction", isAuthenticated, async (req, res, next) => {
  const {
    transactionType,
    transactionDescription,
    transactionAmount,
    categoryId,
    TransactionCreatedDate,
  } = req.body;

  try {
    const transactions = await Transaction.create({
      transactionType: transactionType,
      transactionDescription: transactionDescription,
      transactionAmount: transactionAmount,
      categoryId: categoryId,
      userId: req.payload._id,
      TransactionCreatedDate: TransactionCreatedDate,
      TransactionCreatedMonth: new Date(TransactionCreatedDate).toLocaleString(
        "en-us",
        {
          month: "long",
        }
      ),
      TransactionCreatedYear: new Date(
        TransactionCreatedDate
      ).toLocaleDateString("en-US", { year: "numeric" }),
    });
    res.status(201).json(transactions);
  } catch (error) {
    next(error);
  }
});
// GET Transaction
router.get("/transaction", isAuthenticated, async (req, res, next) => {
  const fetchObjects = Object.entries(req.query).map((obj) => {
    return Object.fromEntries(new Map([obj]));
  });
  try {
    const transactions = await Transaction.find({
      $and: [{ userId: req.payload._id }, ...fetchObjects],
    });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
});

//Update Transaction

router.put(
  "/transaction/:transactionid",
  isAuthenticated,
  async (req, res, next) => {
    const { transactionid } = req.params;
    const {
      transactionType,
      transactionDescription,
      categoryId,
      transactionAmount,
    } = req.body;
    try {
      const transactions = await Transaction.findByIdAndUpdate(
        transactionid,
        {
          transactionType,
          transactionDescription,
          categoryId,
          transactionAmount,
        },
        { new: true }
      );
      transactions.save();
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
);

//Delete Transaction --> Need to test
router.delete(
  "/transaction/:transactionid",
  isAuthenticated,
  async (req, res) => {
    const { transactionid } = req.params;
    try {
      const transaction = await Transaction.findByIdAndRemove(transactionid);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
