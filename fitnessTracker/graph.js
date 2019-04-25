const margin = {
  top: 40,
  right: 20,
  bottom: 50,
  left: 100
};

const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

const svg = d3
  .select("canvas")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphWidth + margin.top + margin.bottom);

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Setup a realtime listener to listen for data changes

const update = data => {
  console.log(data);
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
