const express = require("express");
const router = express.Router();
const moment = require("moment");
const Transaction = require("../models/Transaction.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");


// Create Transaction
router.post("/transaction", isAuthenticated, async (req, res, next) => {
  const { transactionType, transactionDescription,transactionAmount,categoryId,TransactionCreatedDate } = req.body;
  try {
    const transactions = await Transaction.create({
      transactionType: transactionType,
      transactionDescription: transactionDescription,
      transactionAmount:transactionAmount,
      categoryId:categoryId,
      userId:req.payload._id,
      TransactionCreatedDate:TransactionCreatedDate
    });
    res.status(201).json(transactions);
  } catch (error) {
    next(error);
  }
});
// GET Transaction
router.get("/transaction", isAuthenticated, async (req, res, next) => {
  const { TransactionCreatedDate} = req.query;
  try {
    const transactions = await Transaction.find({ $and : [{TransactionCreatedDate},{ userId: req.payload._id }]});
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
});

//Update Transaction

router.put("/transaction", isAuthenticated, async (req, res, next) => {
  const { _id } = req.query;
  const { transactionType,transactionDescription,categoryId, transactionAmount } = req.body;
 try {
  const transactions = await Transaction.findByIdAndUpdate( _id,{ transactionType,transactionDescription,categoryId, transactionAmount } , { new: true })
  transactions.save();
  res.status(200).json(transactions);
}
catch (error) {
  next(error);
}

});


//Delete Transaction --> Need to test
router.delete("/transaction", isAuthenticated, async (req, res) => {
  const { _id } = req.query;
  try {
    const transaction = await Transaction.findByIdAndRemove(_id)
    res.status(200).json(transaction)
  }
  catch (error) {
    next(error);
  }
 
});


module.exports = router;
