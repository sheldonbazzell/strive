app.controller('homeController',['$scope', 'dataFactory', function($scope, dF) {
	
	$scope.activities = []
	$scope.get_activities = function() {
		dF.get_activities(function(data) {
			$scope.activities = data
			console.log($scope.activities)
			dF.setTable();
		})
	}
	$scope.get_activities();
	
}]);

app.controller('compareController',['$scope', 'dataFactory', function($scope, dF) {
	
	$scope.averages = []
	$scope.segments = []
	$scope.location = []
	$scope.getAverages = function() {
		dF.averages(function(data) {
			$scope.averages = data;
		})
	}
	$scope.getAverages();

	$scope.showPower     = false
	$scope.showElevation = false
	$scope.showDistance  = false

	$scope.updatePower = function() {
		if ($scope.averages[0])
			$scope.showPower ? $scope.showPower = false : $scope.showPower = true
	}
	$scope.updateElevation = function() {
		if ($scope.averages[1])
			$scope.showElevation ? $scope.showElevation = false : $scope.showElevation = true 
	}
	$scope.updateDistance = function() {
		if ($scope.averages[2])
			$scope.showDistance  ? $scope.showDistance = false : $scope.showDistance = true 
	}

	$scope.getLocation = function(arg) {
		dF.getLocation(function(data) {
			$scope.location = data;
			console.log($scope.location)
		});
	}

	console.log($scope.location)
	if ($scope.location.length > 0) {
		if ($scope.location[0].hasOwnProperty('lat')) {
			console.log('hello')
			dF.getSegments(function(data) {
				$scope.segments = data;
			});
		}
	}
	
}]);

app.controller('indexController',['$scope', 'dataFactory', '$location', function($scope, dF, $location) {
	
	$scope.authenticate = function() {
		dF.index(function() {
			$location.url('/home')
		})
	}

}]);

app.controller('authController',['$scope', 'dataFactory', '$location', function($scope, dF, $location) {

	$scope.authenticate = function() {
		dF.index(function() {
			$location.url('/home')
		})
	}
	// $scope.authenticate()

}]);
