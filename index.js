// 1. Steup the graph
// ** Start Block **

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

// We want the axis to be within the graph
const xAxisGroup = graph.append('g')
//translate 0 means we don't want to shift the graph in the x direction
// translate by graph height in the y direction should flip the axis from y=0 (The top of the graph) to the bottom
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// Scales
const x = d3.scaleBand()
    .range([0,500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

const y = d3.scaleLinear()
    .range([graphHeight,0])

// create  axis
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + ' orders');

// rotate text to -40 degrees
    xAxisGroup.selectAll('text')
        //When we rotate we are rotating around the text anchor
        // So we need to make the rotation poitn the end of the text
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', 'orange');

// ** End Block **

// 2. Draw the stuff on the graph which depends on the data

// ** Start Block **

const t = d3.transition().duration(1500)

// UPDATE function
const update = (data) => {
    // UPDATE scale domains (Only part of scale that depends on data)
    // Take the scale and 
    x.domain(data.map(item => item.name))
    y.domain([0, d3.max(data, d => d.orders)])

    //Here we join data to the rectangles
    const rects = graph.selectAll('rect')
        .data(data)

    // Remove the virtual element in the exit selection
    rects.exit().remove()

    // Update the current shapes in the DOM
    rects.attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    // .transition(t)
    //     .attr('height', d => graphHeight - y(d.orders))
    //     .attr('y', d => y(d.orders));
    
    // VIRTUAL ELEMENTS
    // Append the enter selection to the dom
    rects.enter()
        .append('rect')
        // The tween determines the starting position
        // .attr('width', x.bandwidth)
        // starting height is 0
        .attr('height', 0)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        // this gives us the bottom of the chart
        .attr('y', graphHeight)
        // transition to the values below
        // t is defined above so that there is a single location for transition
        
        // Anything below applies to the current shapes in the dom (update) and the enter 
        .merge(rects)
        .transition(t)
            .attrTween('width', widthTween)
            .attr('y', d => y(d.orders))
            .attr('height', d => graphHeight - y(d.orders));

    // call axis
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
}

// ** End Block **

// 3. Get data and run the update for the first time

// Decalre data so that we don't need to adapt to the change
data = []

//Snapshot looks for changes to the collection 
db.collection('dishes').onSnapshot(res =>{
    res.docChanges().forEach(change => {
        // Grab the data off of the doc reference
        console.log(change.doc.data())
        const doc = {...change.doc.data(), id:change.doc.id}

        // Update data based on the change that has occured
        switch(change.type){
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item=> item.id === doc.id)
                data[index] = doc
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id)
                break;
            default:
                break;

        }
    });
    update(data)
})

const widthTween = (d) => {
    // Define an interpolation that returns a function we call i
    let i = d3.interpolate(0, x.bandwidth());
    // return a function that takes in a time ticker represented by duration of the transition
    // t represents the different states that the transition is in
    // t = d3.transition().duration(500)
    // An interpolation is calculated for each different time point in the transition
    return function(t){
        // this function returns a number between 0 and x.bandwidth
        return i(t);
    }
}