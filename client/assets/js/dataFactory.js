app.factory('dataFactory', ['$http', function($http){

    function dataFactory() {

        this.getSegments = (args, callback) => {

            $http.post('/segments', args).then((res) => {
                let sortableDistance = res.data
                    .map( res => [res, res.distance] )
                    .sort((a, b) => a[1] - b[1] )

                let sortableElevation = res.data
                    .map( res => [res, res.avg_grade] )
                    .sort((a, b) => a[1] - b[1] )

                sortableDistance.reverse();
                sortableDistance.length = 3;
                sortableElevation.reverse();

                let start = (Math.floor(sortableElevation.length / 2)) - 1,
                    end = (Math.floor(sortableElevation.length / 2)) + 2;
                let power = sortableElevation.slice(start, end);

                sortableElevation.length = 3;

                callback({'distance':sortableDistance, 'elevation':sortableElevation, 'power':power});
            })
        }

        this.sendSegments = () => segments;

        this.sendLocation = () => location;

        function Point(lat, long) {
            return {
                lat: lat,
                long: long
            }
        }

        this.getLocation = (callback) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function findCoordinates(pos) {
                        let lat   = pos.coords.latitude,
                            long  = pos.coords.longitude,
                            range = .1;
                        let numberOfPoints = 2;
                        let degreesPerPoint = 360 / numberOfPoints;
                        let currentAngle = 0;
                        let x2;
                        let y2;

                        let points = [];

                        for(let i=0; i < numberOfPoints; i++) {
                            x2 = Math.cos(currentAngle) * range;
                            y2 = Math.sin(currentAngle) * range;

                            p = new Point(lat+x2, long+y2);

                            points.push(p);
                            currentAngle += degreesPerPoint;
                        }
                        if (callback && typeof callback == 'function')
                            callback(points);
                    }
                )
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        let location = this.getLocation();

        this.getData = () => activities;

        this.setTable = function() {
            let table = Table(activities);
        }

        this.getTable = () => table;

        this.getActivities = (callback) => {
            $http.get('/get/activities').then(function(res) {
                if(callback && typeof callback == 'function') {
                    activities = res.data
                    callback(res.data);
                }
            })
        }

        this.averages = (callback) => {

            let distance = activities.reduce( (total, a) => total + a.distance, 0 )
                elevation = activities.reduce( (total, a) => total + a.elevation, 0 ),
                watts = activities.reduce( (total, a) => total + a.watts, 0 );

            let pretty = 0.00001 * 100 / 100;
            let avgDistance  = Math.round((distance / activities.length) + pretty),
                avgElevation  = Math.round((elevation / activities.length) + pretty),
                avgWatts  = Math.round((watts / activities.length) + pretty);

            callback([avgDistance, avgElevation, avgWatts]);

        }
    }
    return new dataFactory();
}])
