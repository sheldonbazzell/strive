function Table(values) {

	function drawTable() {
		console.log('setting')
		var table = d3.select('#container').append('table');
		table.append('thead').append('tr')
		.selectAll('th')
		.data(values).enter()
		.append('th')
	}

    return drawTable
}