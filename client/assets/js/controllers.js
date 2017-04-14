app.controller('indexController',['$scope', 'dataFactory', '$location', function($scope, dF, $location) {
	
	$scope.authenticate = function() {
		dF.index(function() {
			$location.url('/home')
		})
	}

}]);

app.controller('homeController',['$scope', 'dataFactory', function($scope, dF) {
	
	$scope.activities = []
	$scope.getActivities = function() {
		dF.getActivities(function(data) {
			$scope.activities = data;
			console.log($scope.activities);
			// dF.setTable();
		})
	}
	$scope.getActivities();
	
}]);

app.controller('compareController',['$scope', 'dataFactory', function($scope, dF) {
	
	$scope.averages  = []
	$scope.distance  = []
	$scope.elevation = []
	$scope.power     = []
	$scope.location  = []

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
			dF.getSegments(data, function(data) {
				$scope.distance  = data.distance;
				$scope.elevation = data.elevation;
				$scope.power     = data.power;
			})
		});
	}
	
}]);
