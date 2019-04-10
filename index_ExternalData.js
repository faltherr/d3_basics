// select svg container first

const svg = d3.select('svg')

// This is an asynchronous function so it returns a promise
d3.json('planets.json').then( data => {

    const circles = svg.selectAll('circle')
        .data(data);
    // Add attrs to circles already in dom
    // Update circles in DOM
    circles.attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d=> d.radius)
        .attr('fill', d=> d.fill);

    // Append the enter selection to the DOM
    circles.enter()
        .append('circle')
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d=> d.radius)
        .attr('fill', d=> d.fill);
    //End of the .then
})