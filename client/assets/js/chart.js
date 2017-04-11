function LineChart(data) {

    var listen = d3.dispatch('pointHover');

    function chart() {

    // Set the dimensions of the canvas / graph
    var m = [80, 80, 80, 80]; // margins
    var w = 1000 - m[1] - m[3]; // width
    var h = 400 - m[0] - m[2]; // height

    // create a simple data array that we'll plot with a line (this
    // array represents only the Y values, X will just be the index location)
    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
    // Y scale will fit values from 0-10 within pixels h-0 (Note
    // the inverted domain for the y-scale: bigger is up!)
    var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
        // automatically determining max range can work something like this
        // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
    // create a line function that can convert data[] into x and y points
    var coords = []
    var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) { 
            // verbose logging to show what's actually being done
            // return the X coordinate where we want to plot this datapoint

            return x(i); 
        })
        .y(function(d) { 
            // verbose logging to show what's actually being done
            // return the Y coordinate where we want to plot this datapoint
            return y(d); 
        })
        // Add an SVG element with the desired dimensions and margin.
        var svg = d3.select("#container").append("svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
        // Add the x-axis.
        svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + h + ")")
              .call(xAxis);
        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(-25,0)")
              .call(yAxisLeft)
        // Add the line by appending an svg:path element with 
        //the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        svg.append("path").attr("d", line(data));

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", 10)
            .attr("height", 10)
    }

    d3.rebind(chart, listen, 'on');
    return chart;
}