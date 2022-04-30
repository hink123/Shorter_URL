var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  baseUrl: String,
  shortUrl: String
});

module.exports = mongoose.model('Url', urlSchema);