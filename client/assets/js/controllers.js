app.controller('indexController',['$scope', 'dataFactory', '$location', function($scope, dF, $location) {
	
	$scope.authenticate = () => {
		dF.index( () => $location.url('/home') );
		return;
	}

}]);

app.controller('homeController',['$scope', 'dataFactory', function($scope, dF) {
	
	$scope.getActivities = () => {

		dF.getActivities( data => {
			$scope.activities = data;
			dF.setTable();
		})
	}
	$scope.getActivities();
	
}]);

app.controller('compareController', ['$scope', 'dataFactory', function($scope, dF) {
	
	$scope.averages  = []
	$scope.distance  = []
	$scope.elevation = []
	$scope.power     = []
	$scope.location  = []

	$scope.getAverages = () => {
		dF.averages( data => {
			$scope.averages = data;
		})
	}
	$scope.getAverages();

	$scope.showPower     = false
	$scope.showElevation = false
	$scope.showDistance  = false

	$scope.updatePower = () => {
		if ($scope.averages[0])
			$scope.showPower ? $scope.showPower = false : $scope.showPower = true
	}
	$scope.updateElevation = () => {
		if ($scope.averages[1])
			$scope.showElevation ? $scope.showElevation = false : $scope.showElevation = true 
	}
	$scope.updateDistance = () => {
		if ($scope.averages[2])
			$scope.showDistance  ? $scope.showDistance = false : $scope.showDistance = true 
	}

	$scope.getLocation = arg => {
		dF.getLocation( data => {
			dF.getSegments(data, payload => {
				$scope.distance  = payload.distance;
				$scope.elevation = payload.elevation;
				$scope.power     = payload.power;
			})
		});
	}
	
}]);