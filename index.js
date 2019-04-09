// d3 expects data in an array format
const data = [
    {width:200,height:100, fill:'purple'},
    // {width:100,height:60, fill:'pink'},
    // {width:50,height:30, fill:'red'}
]

// get a reference to the svg first almost always
const svg = d3.select('svg')

const rect = svg.select('rect')
    // join data to the element
    // on the rect's props there is a __data__ that is given the data we specified
    .data(data)
    .attr('width', (d, i, n)=>{ 
        console.log('d', d)
        // index of the element we are on in the selection
        console.log('i', i)
        console.log('n', n)
        console.log('n[i] is the same as "this"', n[i])
        return d.width
    })
    .attr('height', d => d.height)
    .attr('fill', function(d){
        return d.fill
    })

console.log(rect)