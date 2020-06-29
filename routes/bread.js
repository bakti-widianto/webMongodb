var express = require('express');
var router = express.Router();
var moment = require('moment');


/* GET users listing. */
module.exports = (db) => {

  //Show DATA
  let coll = 'bread'
  router.get('/', function (req, res, next) {

    let query = {};
    const page = parseInt(req.query.page) || 1
    let reg = new RegExp(req.query.string)

    if (req.query.checkId && req.query.id) {
      query._id = req.query.id;
    }

    if (req.query.checkString && req.query.string) {
      query.string = reg;
    }

    if (req.query.checkInteger && req.query.integer) {
      query.integer = parseInt(req.query.integer);
    }

    if (req.query.checkFloat && req.query.float) {
      query.float = parseFloat(req.query.float);
    }

    if (req.query.checkDate && req.query.startDate && req.query.endDate) {
      query.date = { $gte: req.query.startDate, $lte: req.query.endDate }
    }

    if (req.query.checkBoolean && req.query.boolean) {
      query.boolean = JSON.parse(req.query.boolean);
    }


    // console.log('INI REQ DATA =====>', query)

    const limit = 10;
    const offset = (page - 1) * limit;


    db.collection(coll).find(query).count()
      .then((total) => {
        const pages = Math.ceil(total / limit)

        db.collection(coll).find(query).limit(limit).skip(offset).toArray()
          .then((result) => {
            res.status(200).json({
              moment,
              result,
              pages,
              page
            })
          })
          .catch((err) => {
            res.status(500).json({
              error: true,
              mesagge: err
            })
          })

      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          mesagge: err
        })
      })
  });

  //ADD DATA







  return router;
}
