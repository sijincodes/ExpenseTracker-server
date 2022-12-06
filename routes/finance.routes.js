const express = require("express");
const router = express.Router();
const moment = require("moment");
const Transaction = require("../models/Transaction.model")

router.post("/income/create",  (req, res, next) => {
  const { title, amount,category, date } = req.body;

  Transaction.create({
    title,
    amount,
    category,
    date: new Date(moment(date).format("YYYY-MM-DD")),
    owner: req.session.User._id,
    
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      next(error);
    });
});


/* GET income Monthly */
router.get("/income/:month",  (req, res) => {
  const { month } = req.params;
  Transaction.find({
    date: new Date(moment(2020-11-30).format("YYYY-MM-DD")).getMonth(),
   // owner: req.session.User._id,
  })
    .then((incomefromDB) => {
     res.json({key:"heelo"})

    })
    .catch((error) => {
      console.error("Error while retrieving income details: ", error);
    });
});

module.exports = router;
