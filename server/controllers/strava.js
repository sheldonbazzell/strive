var mongoose   = require('mongoose'),
        User   = mongoose.model('User'),
        strava = require('strava-v3'),
        Client = require('node-rest-client').Client;

var client = new Client();
var token;
var id;
function stravaController() {

    this.main = function(req, res) {
        var code = req.query.code
        strava.oauth.getToken(code, function(err, payload) {
            if (err) {
                console.log(err)
            } else {
                token = payload.access_token;
                id    = payload.athlete.id;
            }
        })
        res.render("main");
    }

    this.getActivities = function(req, res) {
        strava.athlete.listActivities({},function(err,payload) {
            if (err) {
                console.log(err)
                res.json(err)
            } else {
                var ret = []
                for (var obj in payload) {
                    obj = payload[obj]
                    tmp = {}
                    if (obj.hasOwnProperty('name'))
                        tmp['name'] = obj.name
                    if (obj.hasOwnProperty('distance'))
                        tmp['distance'] = obj.distance
                    if (obj.hasOwnProperty('total_elevation_gain'))
                        tmp['elevation'] = obj.total_elevation_gain
                    if (obj.hasOwnProperty('average_watts'))
                        tmp['watts'] = obj.average_watts
                    ret.push(tmp)
                }
                res.json(ret)
            }
        });
    }

    this.getSegments = function(req, res) {
        var args = [];
        for (var coord in req.body) {
            args.push(req.body[coord].lat)
            args.push(req.body[coord].long)
        }
        args = args.concat(args.splice(0,2))
        args = args.join(", ")
        strava.segments.explore({bounds:args}, function(err, payload) {
            if (err) {
                console.log(err)
                res.json(err)
            } else {
                var segments  = payload.segments;
                var ret_distance = segments.sort(function(a, b) {
                    return a.distance - b.distance;
                })
                var ret_elevation = segments.sort(function(a, b) {
                    return a.avg_grade - b.avg_grade;
                })
                res.json(segments)
            }
        })
    }

}
module.exports = new stravaController()
