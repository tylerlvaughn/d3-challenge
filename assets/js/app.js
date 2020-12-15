// @TODO: YOUR CODE HERE!
// Size Graph
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 30,
  right: 50,
  bottom: 70,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv and use d3 to automatically cast all strings to numbers in one shot
d3.csv("assets/data/data.csv", d3.autoType).then(function(demographic) {
    
    console.log(demographic);
  
   // Create functions for Linear Scale
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(demographic, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(demographic, d => d.healthcare)])
      .range([height, 0]);

    // Create Function for Axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the Chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles for the Chart
    var circlesGroup = chartGroup
      .append("g")
      .selectAll(".circle")
      .data(demographic)
      .enter()
      .append("g")
      .classed('circle', true)
      .attr('transform', d => `translate(${xLinearScale(d.poverty)},${yLinearScale(d.healthcare)})`);


    circlesGroup
      .append("circle")
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("opacity", ".9");

    circlesGroup
      .append('text')
      .classed('circleText', true)
      .attr('dy', '0.35em')
      .attr('dx', -6)
      .text(d => d.abbr);

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>In Poverty %: ${d.poverty}<br>Lacks Healthcare %: ${d.healthcare}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create x and y axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

  });
