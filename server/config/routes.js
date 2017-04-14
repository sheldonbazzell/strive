var strava = require('../controllers/strava.js');

module.exports = function(app) {
	app.get('/authorize', strava.authorize);
	app.get('/index', strava.index);
	app.get('/get/activities', strava.getActivities);
	app.post('/segments', strava.getSegments);
} 
