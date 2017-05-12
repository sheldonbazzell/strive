const mongoose = require('mongoose'),
        User = mongoose.model('User'),
        strava = require('strava-v3');
const querystring = require('querystring');

function stravaController() {

    const StravaStrategy = require('passport-strava').Strategy;
    const stravaClientId = process.env.stravaClientId || 17197;
    const stravaClientSecret = process.env.stravaClientSecret || 
        'a87cb9f889914798567026344d6c0feeb939e206';
    const TokenRequest = Parse.Object.extend("TokenRequest");
    const TokenStorage = Parse.Object.extend("TokenStorage");

    const restrictedAcl = new Parse.ACL();
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

    this.getActivities = function(req, res) {

        strava.athlete.listActivities({'access_token':req.session.token}, (err,payload) => {
            if (err) {
                console.log(err)
                res.json(err)
            } else {
                let ret = payload.map( ride => ({
                        name: ride.name ? ride.name : null,
                        distance: ride.distance ? ride.distance : null,
                        elevation: ride.total_elevation_gain ? ride.total_elevation_gain : null,
                        watts: ride.average_watts ? ride.average_watts : null 
                }))
                res.json(ret)
            }
        });
    }

    this.getSegments = function(req, res) {

        let coords = req.body.map( c => { return [c.lat, c.long] } )
        coords = coords.concat.apply([], coords)
        coords = coords.concat(coords.splice(0,2)).join(", ");

        strava.segments.explore({bounds:coords}, (err, payload) => {
            if (err) {
                console.log('LINE 83: ', err)
                res.json(err)
            } else {
                let segments  = payload.segments;
                let ret_distance = segments.sort( (a, b) => a.distance - b.distance )
                let ret_elevation = segments.sort( (a, b) => a.avg_grade - b.avg_grade )
                res.json(segments)
            }
        })
    }

}
module.exports = new stravaController()
