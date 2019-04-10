// d3 expects data in an array format
const data = [
    {width:200,height:100, fill:'purple'},
    {width:100,height:60, fill:'pink'},
    {width:50,height:30, fill:'red'}
]

// get a reference to the svg first almost always
const svg = d3.select('svg')

// Join data to rects
const rects = svg.selectAll('rect')
    // join data to the element
    // on the rect's props there is a __data__ that is given the data we specified
    .data(data)

// Add attrs to rects ALREADY in the dom
rects.attr('width', (d, i, n) => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);


//d3 sees we have virtual elements that need to be rendered
//This updates the stuff that has yet to enter the DOM
// append the enter selection to the dom
rects.enter()
    .append('rect')
    .attr('width', (d, i, n) => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);