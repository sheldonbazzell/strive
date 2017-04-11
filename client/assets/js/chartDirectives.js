app.directive('d3Chart', ['dataFactory', function(dF){
    var randomArray = function(length, max) {
        return Array.apply(null, Array(length)).map(function() {
            return Math.round(Math.random() * max);
        });
    }
    var vals = randomArray(10, 30)
	var chart = LineChart(vals);

    return {
        restrict: 'E',
        replace: true,
        scope: {
            height: '=height',
            width: '=width',
            data: '=values',
            // hovered: '&hovered'
        },
        link: function(scope, element, attrs) {
            var chartEl = d3.select(element[0]);

            chart.on('pointHover', function(d, i){
            	console.log(d)
                scope.hovered({args:d});
            });

            // scope.width = dS.options.width

            scope.$watch('data', function (newVal, oldVal) {
                chartEl.datum(newVal).call(chart);
            });
        }
    }
}])

app.directive('d3Table', ['dataFactory', function(dF){

    var vals = dF.getData();
    var table = dF.getTable();

    return {
        restrict: 'E',
        replace: true,
        scope: {
            height: '=height',
            width: '=width',
            data: '=values',
            // hovered: '&hovered'
        },
        link: function(scope, element, attrs) {
            var chartEl = d3.select(element[0]);

            scope.$watch('data', function (newVal, oldVal) {
                chartEl.datum(newVal).call(chart);
            });
        }
    }
}])