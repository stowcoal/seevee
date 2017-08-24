var mongoose = require('mongoose');

var connectionString = "mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;

var mongoOptions = {
  useMongoClient: true
};

mongoose.Promise=global.Promise;

mongoose.connect(connectionString, mongoOptions, function(err, res){
  if(err){
    console.log('ERROR connecting to database: ' + err);
  }else{
    console.log('Successfully connected to database.');
  }
});

module.exports = mongoose;
