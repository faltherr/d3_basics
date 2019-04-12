// select svg container first
// slect the canvas then append a svg
const svg = d3.select('.canvas')
    .append('svg')
    .attr('height', 600)
    .attr('width', 600);

// Create margins and dimensions
// Axis are on bottom and left so need more space
const margin = {top:20, right: 20, bottom: 100, left: 100}
// graphWidth is the same as the height of the canvas
// Determines with of graph that contains rectangels
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

//The actual graph inside the svg container
// Add it to the svg container
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    // Translate takes an x translation and a y translation value
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

graph.append('rect');
graph.append('rect');
graph.append('rect');
graph.append('rect');
graph.append('rect');
graph.append('rect');
graph.append('rect');

// We want the axis to be within the graph
const xAxisGroup = graph.append('g')
//translate 0 means we don't want to shift the graph in the x direction
// translate by graph height in the y direction should flip the axis from y=0 (The top of the graph) to the bottom
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// Update function
const update = (data) => {
    // Update scale domains if they rely on our data
    
}


db.collection('dishes').get().then(res => {
    // console.log(res);
    let data = [];
    res.docs.forEach(doc => {
        // the data method returns the data
        data.push(doc.data());
    });
    // console.log(data);

    // height of bar should be the height of the graph minus the total value
    const y = d3.scaleLinear()
    // max is dynamically calculated
        .domain([0, d3.max(data, d => d.orders)])
        //Flip the range from graphHeight to 0 to make the scale go in opposite direction
        .range([graphHeight,0])

        // console.log(y(400))
        // console.log(y(0))
        // console.log(y(900))

    // // Min takes in the 2 parameters (Data and a function)
    // const min = d3.min(data, d => d.orders)
    // console.log("min", min)
    // const max = d3.max(data, d => d.orders)
    // console.log('max', max)
    // // Extent finds the min and the maz
    // // Returns an array
    // const extent = d3.extent(data, d=> d.orders)
    // console.log('extent', extent)
    
    const x = d3.scaleBand()
        // Array of names for domain from the data object
        .domain(data.map(item => item.name))
        // The graph is 500 pixels in width
        .range([0,500])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    // This will give us the location of where the bar should start on the x axis
    // console.log(x('veg curry'))
    // Get the width of the bar from the bandwidth
    // console.log(x.bandwidth())

    // We need the rectangles to be on the graph (Because the graph is in the svg)
    const rects = graph.selectAll('rect')
        .data(data)

    console.log(rects)
    // // RECTS.ATTR updates the rectangles ALREADY in the DOM
    // Width is standard, height depends on data
    // rects.attr('width', x.bandwidth)
    //     // This calculates the correct height
    //     // The bar should start at the value and then extend to the bottom of the chart
    //     .attr('height', d => graphHeight - y(d.orders))
    //     .attr('fill', 'orange')
    //     // Offset the bars calculated by the d3.scaleBand function
    //     .attr('x', d => x(d.name))
    //     .attr('y', d => y(d.orders));

    // // VIRTUAL ELEMENTS
    // // Append the enter selection to the dom
    // rects.enter()
    //     .append('rect')
    //     .attr('width', x.bandwidth)
    //     .attr('height', d => graphHeight - y(d.orders))
    //     .attr('fill', 'orange')
    //     .attr('x', d => x(d.name))
    //     .attr('y', d => y(d.orders));
    
    // // create and call axis
    // const xAxis = d3.axisBottom(x);
    // const yAxis = d3.axisLeft(y)
    //     .ticks(3)
    //     .tickFormat(d => d + ' orders');

    // xAxisGroup.call(xAxis);
    // yAxisGroup.call(yAxis);

    // // rotate text to -40 degrees
    // xAxisGroup.selectAll('text')
    //     //When we rotate we are rotating around the text anchor
    //     // So we need to make the rotation poitn the end of the text
    //     .attr('transform', 'rotate(-40)')
    //     .attr('text-anchor', 'end')
    //     .attr('fill', 'orange');

    });
