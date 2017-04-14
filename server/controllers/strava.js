var mongoose    = require('mongoose'),
        User    = mongoose.model('User'),
        strava  = require('strava-v3');
var querystring = require('querystring');

function stravaController() {

    var StravaStrategy = require('passport-strava').Strategy;

    var stravaClientId = process.env.stravaClientId || 17197;
    var stravaClientSecret = process.env.stravaClientSecret || 
        'a87cb9f889914798567026344d6c0feeb939e206';
    var TokenRequest = Parse.Object.extend("TokenRequest");
    var TokenStorage = Parse.Object.extend("TokenStorage");

    var restrictedAcl = new Parse.ACL();
    restrictedAcl.setPublicReadAccess(false);
    restrictedAcl.setPublicWriteAccess(false);

    this.authorize = function(req, res) {
        var tokenRequest = new TokenRequest();
        tokenRequest.setACL(restrictedAcl);
        var stravaRedirectEndpoint = 'https://www.strava.com/oauth/authorize?';
        res.redirect(
            stravaRedirectEndpoint + querystring.stringify({
                client_id: stravaClientId,
                response_type: 'code',
                redirect_uri: 'http://localhost:8000/index',
                scope: 'write'
            })
        );
    }

    this.index = function(req, res) {
        strava.oauth.getToken(req.query.code, function(err, payload) {
            if (err) {
                console.log(err)
            } else {
                req.session.token = payload.access_token;
                if (payload.athelete) {
                    req.session.id = payload.athlete.id;
                }
            }
        })
        res.render("main");
    }

    this.getActivities = function(req, res) {
        strava.athlete.listActivities({'access_token':req.session.token},
            function(err,payload) {
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
