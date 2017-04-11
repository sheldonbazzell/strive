app.factory('dataFactory', ['$http', function($http){

    function dataFactory() {

        var activities = [],
            segments   = [],
            location;

        this.getSegments = function(args) {
            console.log(args)
            $http.post('/segments', args).then(function(res) {
                console.log(res.data);
                segments = res.data;
            })
        }

        this.sendSegments = function() {
            return segments;
        }

        this.sendLocation = function() {
            return location;
        }

        function Point(lat, long) {
            return {
                lat: lat,
                long: long
            }
        }

        this.getLocation = function(callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function findCoordinates(pos) {
                        console.log('hello')
                        var lat   = pos.coords.latitude,
                            long  = pos.coords.longitude,
                            range = .2;
                        var numberOfPoints = 2;
                        var degreesPerPoint = 360 / numberOfPoints;
                        var currentAngle = 0;
                        var x2;
                        var y2;

                        var points = [];

                        for(var i=0; i < numberOfPoints; i++) {
                            x2 = Math.cos(currentAngle) * range;
                            y2 = Math.sin(currentAngle) * range;

                            p = new Point(lat+x2, long+y2);
                            points.push(p);
                            currentAngle += degreesPerPoint;
                        }
                        // if (callback && typeof callback == 'function')
                        console.log(callback)
                        callback(points);
                    }
                )
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        var location = this.getLocation();
        console.log(location)
        this.getData = function() {
            console.log(activities)
            return activities;
        }

        this.setTable = function() {
            var table = Table(activities);
        }

        this.getTable = function() {
            return table;
        }

        this.get_activities = function(callback) {
            $http.get('/get/activities').then(function(res) {
                if(callback && typeof callback == 'function') {
                    activities = res.data
                    callback(res.data);
                }
            })
        }

        this.averages = function(callback) {

            var out        = [],
                distance   = 0,
                elevation  = 0,
                watts      = 0;

            console.log(activities)

            for (activity in activities) 
                distance += activities[activity].distance
            for (activity in activities) 
                elevation += activities[activity].elevation
            for (activity in activities) 
                watts += activities[activity].watts

            var avgDistance  = distance   / activities.length,
                avgElevation = elevation / activities.length,
                avgWatts     = watts    / activities.length;

            out.push(Math.round((avgDistance + 0.00001 * 100 / 100)));
            out.push(Math.round((avgElevation + 0.00001 * 100 / 100)));
            out.push(Math.round((avgWatts + 0.00001 * 100 / 100)));

            console.log(out);
            callback(out);

        }
    }
    return new dataFactory();
}])
