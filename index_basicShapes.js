const canvas = d3.select(".canvas");

const svg = canvas.append('svg')
    .attr('height', 600)
    .attr('width', 600);

//Setup a group
const group = svg.append('g')
// apply a transform to all of the group elements at once
    .attr('transform', 'translate(50,100)')

//append shapes to the group

group.append('rect')
    .attr('width',200)
    .attr('height', 100)
    .attr('fill', 'blue')
    .attr('x', 20)
    .attr('y', 20);
group.append('circle')
    .attr('r', 50)
    .attr('cx', 60)
    .attr('cy', 25)
    .attr('fill', 'red');
group.append('line')
    .attr('x1', 370)
    .attr('x2', 400)
    .attr('y1', 20)
    .attr('y2', 120)
    .attr('stroke', 'red');


// append text to the group container

svg.append('text')
    .attr('x', 20)
    .attr('y', 200)
    .attr('fill', 'grey')
    .text('hello this is svg text')
    .style('font-family', 'arial');
