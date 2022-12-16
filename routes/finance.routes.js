const express = require("express");
const router = express.Router();
const moment = require("moment");
const mongoose = require("mongoose");
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
      TransactionCreatedMonthNum: new Date(
        TransactionCreatedDate
      ).toLocaleString("en-us", {
        month: "numeric",
      }),
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
    }).populate("categoryId");
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
  async (req, res, next) => {
    const { transactionid } = req.params;
    try {
      const transaction = await Transaction.findByIdAndRemove(transactionid);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }
);

//Fetch grouped by transactions
router.get(
  "/analysis/overview/:overviewType",
  isAuthenticated,
  async (req, res, next) => {
    const { overviewType } = req.params;
    const { TransactionCreatedMonth, TransactionCreatedYear } = req.query;

    try {
      const transactions = await Transaction.aggregate([
        {
          $match: {
            transactionType: overviewType,
            userId: mongoose.Types.ObjectId(req.payload._id),
            TransactionCreatedMonth: TransactionCreatedMonth,
            TransactionCreatedYear: Number(TransactionCreatedYear),
          },
        },
        {
          $project: {
            TransactionCreatedDate: 1,
            transactionAmount: 1,
            _id: 0,
          },
        },
        {
          $group: {
            _id: "$TransactionCreatedDate",
            total: {
              $sum: "$transactionAmount",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
);

//Fetch grouped by categories
router.get(
  "/analysis/categories/:timespan",
  isAuthenticated,
  async (req, res, next) => {
    const { TransactionCreatedMonth, TransactionCreatedYear } = req.query;
    const { timespan } = req.params;
    let fetchObjects;
    if (timespan === "month") {
      fetchObjects = {
        TransactionCreatedMonth: TransactionCreatedMonth,
        TransactionCreatedYear: Number(TransactionCreatedYear),
      };
    } else {
      fetchObjects = {
        TransactionCreatedYear: Number(TransactionCreatedYear),
      };
    }
    try {
      const transactions = await Transaction.aggregate([
        {
          $match: {
            transactionType: "expense",
            userId: mongoose.Types.ObjectId(req.payload._id),
            ...fetchObjects,
          },
        },
        {
          $project: {
            categoryId: 1,
            transactionAmount: 1,
            _id: 0,
          },
        },
        {
          $group: {
            _id: "$categoryId",
            total: {
              $sum: "$transactionAmount",
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
);

//Fetch totalExpense
router.get(
  "/analysis/totalExpense/:transactionType",
  isAuthenticated,
  async (req, res, next) => {
    const { TransactionCreatedYear } = req.query;
    const { transactionType } = req.params;

    try {
      let transactions = await Transaction.aggregate([
        {
          $match: {
            TransactionCreatedYear: Number(TransactionCreatedYear),
            transactionType: transactionType,
            userId: mongoose.Types.ObjectId(req.payload._id),
          },
        },
        {
          $project: {
            TransactionCreatedMonth: 1,
            transactionAmount: 1,
            TransactionCreatedMonthNum: 1,
            _id: 0,
          },
        },
        {
          $group: {
            _id: "$TransactionCreatedMonthNum",
            total: {
              $sum: "$transactionAmount",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
      transactions = transactions.map((transaction) => {
        let month;
        switch (transaction._id) {
          case 1:
            month = "January";
            break;
          case 2:
            month = "February";
            break;
          case 3:
            month = "March";
            break;
          case 4:
            month = "April";
            break;
          case 5:
            month = "May";
            break;
          case 6:
            month = "June";
            break;
          case 7:
            month = "July";
            break;
          case 8:
            month = "August";
            break;
          case 9:
            month = "September";
            break;
          case 10:
            month = "October";
            break;
          case 11:
            month = "November";
            break;
          case 12:
            month = "December";
            break;
          default:
            month = "January";
        }
        return { ...transaction, _id: month };
      });
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
