// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 3],
    ['Onions', 1],
    ['Olives', 1],
    ['Zucchini', 1],
    ['Pepperoni', 2]
  ]);
  var options = {
    pieHole: 0.4,
    legend: 'none'
  };
  var chart = new google.visualization.PieChart(document.getElementById('pie_div'));
  chart.draw(data, options);

  var data = google.visualization.arrayToDataTable([
    ['Country', 'Popularity'],
    ['Germany', 200],
    ['United States', 300],
    ['Brazil', 400],
    ['Canada', 500],
    ['France', 600],
    ['RU', 700]
  ]);
  var options = {};
  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
  chart.draw(data, options);

  var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Memory', 80]
  ]);
  var options = {
    redFrom: 90, redTo: 100,
    yellowFrom:75, yellowTo: 90,
    minorTicks: 5
  };
  var chart = new google.visualization.Gauge(document.getElementById('gauge_div'));
  chart.draw(data, options);

  var data = google.visualization.arrayToDataTable([
    ['Year', 'Sales', 'Expenses'],
    ['2013',  1000,      400],
    ['2014',  1170,      460],
    ['2015',  660,       1120],
    ['2016',  1030,      540]
  ]);
  var options = {
    legend: 'none',
  };
  var chart = new google.visualization.AreaChart(document.getElementById('area_div'));
  chart.draw(data, options);

  var data = google.visualization.arrayToDataTable([
    ['Generation', 'Descendants'],
    [0, 1], [1, 33], [2, 269], [3, 2013]
  ]);
  var options = {
    legend: { position: 'none' },
    hAxis: {title: 'Generation', minValue: 0, maxValue: 3},
    vAxis: {title: 'Descendants', minValue: 0, maxValue: 2100},
  };
  var chart = new google.visualization.ScatterChart(document.getElementById('scatter_div'));
  chart.draw(data, options);

  var data = google.visualization.arrayToDataTable([
    ['Year', 'Sales', 'Expenses', 'Profit'],
    ['2014', 1000, 400, 200],
    ['2015', 1170, 460, 250],
    ['2016', 660, 1120, 300],
    ['2017', 1030, 540, 350]
  ]);
  var options = {
    bars: 'horizontal',
    legend: { position: 'none' },
  };
  var chart = new google.charts.Bar(document.getElementById('barhor_div'));
  chart.draw(data, google.charts.Bar.convertOptions(options));

  var data = google.visualization.arrayToDataTable([
    ['Year', 'Sales', 'Expenses', 'Profit'],
    ['2014', 1000, 400, 200],
    ['2015', 1170, 460, 250],
    ['2016', 660, 1120, 300],
    ['2017', 1030, 540, 350]
  ]);
  var options = {
    legend: { position: 'none' },
  };
  var chart = new google.charts.Bar(document.getElementById('barver_div'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}
