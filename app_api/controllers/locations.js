var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

var theEarth = (_ => {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = rads => {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = distance => {
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
  var maxDistance = parseFloat(req.query.maxDistance);

  if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance) {
    sendJsonResponse(res, 404, {
      'message': 'lng, lat and maxDistance query parameters are all required'
    });
    return;
  }

  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  // callback type
  Loc.aggregate([
    {
        $geoNear: {
            near: point,
            distanceField: 'dist',
            spherical: true,
            maxDistance: theEarth.getRadsFromDistance(maxDistance),
            num: 10         
        }
    }
  ], (err, results) => {
    var locations = [];
    if (err) {
      sendJsonResponse(res, 404, err);
    }
    else {
      results.forEach(doc => {
        locations.push({
          distance: theEarth.getDistanceFromRads(doc.dist),
          name: doc.name,
          address: doc.address,
          rating: doc.rating,
          facilities: doc.facilities,
          _id: doc._id
        });
      });
      sendJsonResponse(res, 200, locations);
    }
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
  // ]).then(res => console.log(res))
  // .catch(err => console.log(err));
};

module.exports.locationsCreate = function(req, res, next) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  }, (err, location) => {
    if (err) {
      sendJsonResponse(res, 400, err);
    }
    else {
      sendJsonResponse(res, 201, location);
    }
  });
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
  if (!req.params.locationid) {
    sendJsonResponse(res, 404, {
      'message': 'Not found, locationid is required'
    });
    return;
  }
  Loc.findById(req.params.locationid).select('-reviews -rating').exec((err, location) => {
    if (!location) {
      sendJsonResponse(res, 404, {
        'message': 'locationid not found'
      });
      return;
    }
    else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    location.name = req.body.name;
    location.address = req.body.address;
    location.facilities = req.body.facilities.split(',');
    location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
    location.openingTimes[{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }];
    location.save((err, location) => {
      if (err) {
        sendJsonResponse(res, 404, err);
      }
      else {
        sendJsonResponse(res, 200, location);
      }
    });
  });
};

module.exports.locationsDeleteOne = function(req, res, next) {
  var locationid = req.params.locationid;
  if (locationid) {
    Loc.findByIdAndRemove(locationid).exec((err, location) => {
      if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 204, null);
    });
  } 
  else {
    sendJsonResponse(res, 404, {
      'message': 'No locationid'
    });
  }
};
