const dims = { height: 300, width: 300, radius: 150}

const cent = { x: (dims.width / 2 + 5), y:(dims.height/2 +5)}

const svg = d3.select('.canvas')
    .append('svg')
    // Add 150 pixels for the legend
    .attr('width', dims.width + 150)
    .attr('height', dims.height + 150)

// Create a group with all graph elements

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`)

const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)

const angles = pie([
    { name: 'rent', cost: 500 },
    { name: 'bills', cost: 300 },
    { name: 'gaming', cost: 200 }
])

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(50)

const color = d3.scaleOrdinal(d3['schemeSet3'])

//Legend setup
// The legend is data dependent
const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width+40}, 10)`)

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(10)
    //The legend uses the scale to map names to colors
    .scale(color)

//Setup tooltip
const tip =d3.tip()
    .attr('class', 'tip card')
    .html(d => {
        let content = `<div class='name'>${d.data.name}</div>`
        content += `<div class='cost'>${d.data.cost}</div>`
        content += `<div class='delete'>Click slice to delete</div>`
        return content
    })

//The tip needs to be added to the graph
graph.call(tip)

const update = (data) => {
    //Update color scale domain
    color.domain(data.map(element =>{
        return element.name
    }))

    // update and call legend
    legendGroup.call(legend);
    legendGroup.selectAll('text')
        .attr('fill', 'white')


    // Join enhanced pie data to path elements
    const paths = graph.selectAll('path')
        .data(pie(data))
    
    console.log(pie(data))

    // console.log(paths.enter())
    paths.enter()
        .append('path')
            .attr('class', 'arc')
            // THis will automatically pass the data object into the arcPath
            // We can comment out the start value because it is taken care of by the Tween defined below
            // .attr('d', arcPath)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('fill', d => color(d.data.name))
            // .each() allows us to perform a function on each element  
            .each(function(d){
                //"This" refers to the current path
                // this_current allows us to refernce the data as it enters the dom
                // First view of the data in the dom
                // We want to access the current state of the data so that we can update to the new state
                return this._current = d
            })
            .transition().duration(750)
            // Pass the data to the tween generator to update the path over time
                .attrTween("d", arcTweenEnter);

    graph.selectAll('path')
            .on('mouseover', (d,i,n)=>{
                handleMouseOver(d,i,n)
                // tip.show(d,this) In this context n[i] is the same as "this"
                tip.show(d,n[i])
            })
            .on('mouseout', (d,i,n)=>{
                handleMouseOut(d,i,n)
                tip.hide()
            })
            .on('click', handleClick);

    // Handle UPDATES
    paths.attr('d', arcPath)
        .transition().duration(750)
        .attrTween('d', arcTweenUpdate);

    // Handle deletions
    // This gives us the selection of elemets that need to be removed from the DOM
    paths.exit()
        .transition().duration(750)
        .attrTween('d', arcTweenExit)
        .remove()
        
}

// Data array and firstore
let data = [];

db.collection('expenses').onSnapshot( res => {
    res.docChanges().forEach(change => {
        const doc = {...change.doc.data(), id: change.doc.id}

        switch (change.type) {
            case 'added':
            data.push(doc);
            break;
            case 'modified':
            const index = data.findIndex(item => item.id == doc.id);
            data[index] = doc;
            break;
            case 'removed':
            data = data.filter(item => item.id !== doc.id);
            break;
            default:
            break;
    }
    });
    update(data)
})

// Over time we are going to call the interpolation that will generate a new start angle each moment of time
const arcTweenEnter = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle)
    // update the start angle over time
    return function (t){
        d.startAngle = i(t);
        // Everytime the ticker changes we get a new path
        return arcPath(d);
    }
}

// Roll it back on delete
const arcTweenExit = (d) => {
    var i = d3.interpolate( d.startAngle, d.endAngle)
    // update the start angle over time
    return function (t){
        d.startAngle = i(t);
        // Everytime the ticker changes we get a new path
        return arcPath(d);
    }
}

// use function keyword so that we can use the 'this' keyword inside of the function block
// d refers to the updated data in the DOM
// this._current is the current data in the dom d is the updated data
function arcTweenUpdate(d){
    // console.log(this._current, d)
    // Interpolate between current and updated data (old position to new position)
    var i = d3.interpolate(this._current, d)
    //update the current prop with new data
    // We want the data to update so that each transition is based off of a new current value
    this._current = i(1);

    //Redraw paths witht the arc generator with the data we are interpolating
    return function(t){
        return arcPath(i(t))
    }
}

// event handlers
// Name the transitions so that they do not interfer with other transition arcs
const handleMouseOver = (d, i, n) => {
    // console.log(n[i])
    // Select the element and wrap it with d3
    // Gives us access to data and transition methods
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
        .attr('fill', '#fff')
}

const handleMouseOut = (d,i,n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
            .attr('fill', color(d.data.name))
}

//Delete the slice that is clicked
const handleClick = (d) => {
    const id = d.data.id
    db.collection('expenses').doc(id).delete()
}