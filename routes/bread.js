var express = require('express');
var router = express.Router();
var moment = require('moment');
const objectId = require('mongodb').ObjectId;




/* GET users listing. */
module.exports = (db) => {

  //Show DATA
  const coll = 'bread'
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
      .catch((err) => {
        res.status(500).json({
          error: true,
          mesagge: err
        })
      })
      .then((total) => {
        const pages = Math.ceil(total / limit)

        db.collection(coll).find(query).limit(limit).skip(offset).toArray()
          .catch((err) => {
            res.status(500).json({
              error: true,
              mesagge: err
            })
          })
          .then((result) => {
            res.status(200).json({
              moment,
              result,
              pages,
              page
            })
          })
      })
  });

  //ADD DATA
  router.post('/', (req, res) => {
    const add = {
      'string': req.body.string,
      'integer': parseInt(req.body.integer),
      'float': parseFloat(req.body.float),
      'date': req.body.date,
      'boolean': JSON.parse(req.body.boolean)
    }
    db.collection(coll).insertOne(add)
      .catch((err) => {
        res.status(500).json({
          error: true,
          mesagge: err
        })
      })
      .then(() => res.status(200).json({
        error: false,
        mesagge: 'add complete'
      }))
  })

  //delete data
  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    db.collection(coll).deleteOne({})
      .then(() => {
        res.status(201).json({
          error: false,
          message: 'data berhasil dihapus'
        })
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err
        })
      })
  });





  return router;
}
