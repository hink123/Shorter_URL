var express = require('express');
var router = express.Router();
const indexCtrl = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { shortUrl: null, baseUrl:null, err: null });
});

router.post('/shorten', indexCtrl.shortenUrl);
router.get('/shorten', indexCtrl.lengthenUrl);

module.exports = router;