const canvas = d3.select(".canvas");

const svg = canvas.append('svg')
    .attr('height', 600)
    .attr('width', 600);

//append shapes to svg container
svg.append('rect')
    .attr('width',200)
    .attr('height', 100)
    .attr('fill', 'blue')
    .attr('x', '20')
    .attr('y', 20);
svg.append('circle')
    .attr('r', 50)
    .attr('cx', 60)
    .attr('cy', 25)
    .attr('fill', 'red');
svg.append('line')
    .attr('x1', 370)
    .attr('x2', 400)
    .attr('y1', 20)
    .attr('y2', 120)
    .attr('stroke', 'red');