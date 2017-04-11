var mongoose   = require('mongoose'),
        User   = mongoose.model('User'),
        strava = require('strava-v3');

function stravaController() {
    
    this.index = function(req,res) {
        User.find({}, function(err,users) {
            if(err) { res.json(err); }
            else { res.json(users); }
        })
    }

    this.main = function(req, res) {
        res.render("main")
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
                console.log(ret)
                res.json(ret)
            }
        });
    }

    this.getSegments = function(req, res) {
        res.json("main")
    }

}
module.exports = new stravaController()
