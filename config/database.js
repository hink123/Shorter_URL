let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/urls',
  { useNewUrlParser: true }
);

// shortcut to mongoose.connection object
let db = mongoose.connection;

db.on('connected', function () {
  console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});