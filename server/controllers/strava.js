var mongoose    = require('mongoose'),
        User    = mongoose.model('User'),
        strava  = require('strava-v3');
var querystring = require('querystring');

function stravaController() {

    var StravaStrategy = require('passport-strava').Strategy;
    var stravaClientId = process.env.stravaClientId || 17197;
    var stravaClientSecret = process.env.stravaClientSecret || 
        '';
    var TokenRequest = Parse.Object.extend("TokenRequest");
    var TokenStorage = Parse.Object.extend("TokenStorage");

    var restrictedAcl = new Parse.ACL();
    restrictedAcl.setPublicReadAccess(false);
    restrictedAcl.setPublicWriteAccess(false);

    this.authorize = (req, res) => {
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

    this.index = (req, res) => {

        strava.oauth.getToken(req.query.code, (err, payload) => {
            if (err) {
                res.json(err);
            } else {
                req.session.token = payload.access_token;
                if (payload.athelete) {
                    req.session.id = payload.athlete.id;
                }
            }
        })
        res.render("main");

    }

    this.getActivities = (req, res) => {

        strava.athlete.listActivities({'access_token':req.session.token}, (err,payload) => {
            if (err) {
                console.log(err)
                res.json(err)
            } else {
                let ret = payload.map((ride) => {
                    return {
                        name: ride.name ? ride.name : null,
                        distance: ride.distance ? ride.distance : null,
                        elevation: ride.total_elevation_gain ? ride.total_elevation_gain : null,
                        watts: ride.average_watts ? ride.average_watts : null
                    }
                })
                res.json(ret)
            }
        });
    }

    this.getSegments = (req, res) => {

        let coords = req.body.map( c => { return [c.lat, c.long] } )
        coords = coords.concat.apply([], coords)
        coords = coords.concat(coords.splice(0,2)).join(", ");

        strava.segments.explore({bounds:coords}, function(err, payload) {
            if (err) {
                console.log('LINE 83: ', err)
                res.json(err)
            } else {
                console.log(payload)
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
