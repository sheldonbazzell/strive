var app = angular.module('app', ['ngRoute'])
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'assets/partials/home.html',
      controller: 'homeController'
    })
    .when('/get/comparisons', {
      templateUrl: 'assets/partials/compare.html',
      controller: 'compareController'
    })
     .otherwise('/');
 });
