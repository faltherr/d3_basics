const margin = {
  top: 40,
  right: 20,
  bottom: 50,
  left: 100
};

const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphWidth + margin.top + margin.bottom);

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Setup our scales
const x = d3.scaleTime().range([0,graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

//axes groups
const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    // Translate the x axis by 0 in the x direction and graph height in the y direction to move to the bottom of the graph
    .attr('transform', `translate(0,${graphHeight})`)

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')

  // d3 line path generator
  const line = d3.line()
    .x(function(d){return x(new Date(d.date))})
    .y(function(d){return y(d.distance)})

// line path element
const path = graph.append('path');

const dottedLines = graph.append('g')
  .attr('class', 'lines')
  .style('opacity', 0)

const xDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4)

const yDottedLine = dottedLines.append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4)

// Setup a realtime listener to listen for data changes
// We need to update the domains and call the scales in response to real data values

const update = data => {
    data = data.filter(d => d.activity === activity)

    // sort data based on date object
    data.sort((a,b)=> new Date(a.date) - new Date(b.date))

    // console.log(data);
    // set scale domains
    // We are passing in a string as a date so we need to change it to a date
    x.domain(d3.extent(data, d => new Date(d.date)))
    y.domain([0, d3.max(data, d => d.distance)])

    // update path data
    // With d3 line we need to pass in an array within an array
    path.data([data])
      .attr('fill', 'none')
      .attr('stroke', '#00bfa5')
      .attr('stroke-width', 2)
      .attr('d', line)

    // create circles for data objects
    const circles = graph.selectAll('circle')
      .data(data)
    
    // EXIT
    // remove unwanted points
    circles.exit().remove()

    // UPDATE
    // update the current position of the current points
    circles.attr('cx', d => x(new Date(d.date)))
      .attr('cy', d=> y(d.distance))

      // ENTER
    // add new points witn enter()

    circles.enter()
      .append('circle')
        .attr('r', 4)
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d=> y(d.distance))
        .attr('fill', '#ccc')

    // On hover set size of circle to larger then on exit reduce size again

    graph.selectAll('circle')
      .on('mouseover', (d,i,n) => {
        d3.select(n[i])
          .transition().duration(100)
            .attr('r', 8)
            .attr('fill', '#fff')

        xDottedLine
          .attr('x1', x(new Date(d.date)))
          .attr('x2', x(new Date(d.date)))
          .attr('y1', graphHeight)
          .attr('y2', y(d.distance));

        yDottedLine
          .attr('x1', 0)
          .attr('x2', x(new Date(d.date)))
          .attr('y1', y(d.distance))
          .attr('y2', y(d.distance));
        
        dottedLines.style('opacity', 1)
      })
      .on('mouseleave', (d,i,n) => {
        d3.select(n[i])
        .transition().duration(100)
          .attr('r', 4)
          .attr('fill', '#ccc')

        dottedLines.style('opacity', 0)
      })
    
    // create our axes
    const xAxis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'));

    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + 'm');

    // We use the call() to generate the shapes and insert them into the groups
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Rotate axis text
    xAxisGroup.selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
};

// We modify the data array anytime the database is updated
let data = [];

db.collection("activities").onSnapshot(res => {
  res.docChanges().forEach(change => {
    // console.log('change', change)
    //Create a document to store each change
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
