var express = require('express');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();
var url = 'mongodb://user:password@ds113455.mlab.com:13455/testyfood'; // replace the username and password with right one to use properly




function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }
    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    // Create an ObjectId with that hex timestamp
    var constructedObjectId = require('mongodb').ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId
}





/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("index.html")
});
router.get('/getfood', function(req, res, next) {
	  MongoClient.connect(url,function(err,db){
		assert.equal(err,null);
		var collection = db.collection('food');
		collection.find({}).toArray(function(err,docs){
		assert.equal(err,null);
		//console.log(docs);
		res.json(docs);
	    db.close();
		});	
	});
});

router.post('/getfoodByDate', function(req, res, next) {

		MongoClient.connect(url,function(err,db){
		assert.equal(err,null);
		var collcetion = db.collection('food');
	 	collcetion.aggregate([{ $match:{_id: {$lte: objectIdWithTimestamp(req.body.todate), $gt: objectIdWithTimestamp(req.body.fromdate) }}}]).toArray(function(err,docss){
        assert.equal(err,null);
        console.log(docss)
          res.json(docss)
          db.close();
          });
	});
/*{ $match:{_id: { $gt: objectIdWithTimestamp(req.body.fromdate) ,$lt: objectIdWithTimestamp(req.body.todate)}}}
*/
//console.log(req.body)
});


router.post('/getChartData', function(req, res, next) {

		MongoClient.connect(url,function(err,db){
		assert.equal(err,null);
		var collcetion = db.collection('food');
	 	collcetion.aggregate([
				{ $match:{_id: {$lte: objectIdWithTimestamp(req.body.todate), $gt: objectIdWithTimestamp(req.body.fromdate) }}},
				{
				    $group:{
				        _id:"$f",
				         y:{$sum:1}
				        }
				}


	 		]).toArray(function(err,docss){
        assert.equal(err,null);
        console.log(docss)
          res.json(docss)
          db.close();
          });
	});
/*{ $match:{_id: { $gt: objectIdWithTimestamp(req.body.fromdate) ,$lt: objectIdWithTimestamp(req.body.todate)}}}
*/
//console.log(req.body)
});






router.post('/insertfood', function(req, res, next) {
	MongoClient.connect(url,function(err,db){
		assert.equal(err,null);
		var collcetion = db.collection('food');
		collcetion.insertOne({"f":req.body.foodname},function(err,res){
			assert.equal(err,null);
				
				db.close();
		});
	});
  res.redirect("index.html?success=true")
});

module.exports = router;
