const express = require("express");
const router = express.Router();
const moment = require("moment");
const Income = require("../models/Income.model")

router.post("/income/create",  (req, res, next) => {
  const { title, amount, date } = req.body;

  Income.create({
    title,
    amount,
    date: new Date(moment(date).format("YYYY-MM-DD")),
   // owner: req.session.User._id,
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
  Income.find({
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
