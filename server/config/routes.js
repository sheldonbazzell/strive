var strava = require('../controllers/strava.js');
module.exports = function(app) {
  app.get('/authorize', strava.main);
  app.get('/get/activities', strava.getActivities);
  app.post('/segments', strava.getSegments);
} 
