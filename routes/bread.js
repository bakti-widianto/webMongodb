var express = require('express');
var router = express.Router();


/* GET users listing. */
module.exports = (db) => {
  
  router.get('/', function (req, res, next) {
    
    let coll = 'bread'
    db.collection(coll).find().toArray()
      .then((result) => {
        res.status(200).json({
          error: false,
          data: result
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
