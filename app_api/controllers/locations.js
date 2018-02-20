var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

var theEarth = (_ => {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = (rads) => {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = (distance) => {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

module.exports.locationsListByDistance = function(req, res, next) {
  
  // Loc.find({ rating: 3 }).then(res => {
  //   console.log(res);
  // });
  
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);

  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  // callback type
  Loc.aggregate([
    {
        $geoNear: {
            near: point,
            distanceField: "dist.calculated",
            spherical: true,
            maxDistance: theEarth.getRadsFromDistance(20),
            num: 10         
        }
    }
  ], (err, results) => {
    console.log(results);
  });

  // Promise type
  // Loc.aggregate([
  //   {
  //       $geoNear: {
  //           near: point,
  //           distanceField: "dist.calculated",
  //           spherical: true,
  //           maxDistance: theEarth.getRadsFromDistance(20),
  //           num: 10         
  //       }
  //   }
  // ]).then((res) => {
  //   console.log(res);
  // });
  
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsCreate = function(req, res, next) {
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsReadOne = function(req, res, next) {
  if (req.params && req.params.locationid) {
    Loc.findById(req.params.locationid).exec((err, location) => {
      if (!location) {
        sendJsonResponse(res, 404, {
          "message": "locationid not found"
        });
        return;
      } 
      else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, location);
    });  
  } 
  else {
    sendJsonResponse(res, 404, {
      "message": "No locationid in request"
    });
  }
};

module.exports.locationsUpdateOne = function(req, res, next) {
  sendJsonResponse(res, 200, {"status": "success"});
};

module.exports.locationsDeleteOne = function(req, res, next) {
  sendJsonResponse(res, 200, {"status": "success"});
};
