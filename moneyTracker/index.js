// for creating the form and sending data to Firebase

const form = document.querySelector('form');
const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

// Add event listener to form
form.addEventListener('submit', (e)=>{
    console.log('submitted')
    e.preventDefault();
    if(name.value && cost.value){
        const item = {
            name: name.value,
            cost: +cost.value
        };
    // add an item to the database
    db.collection('expenses').add(item).then(res => {
        error.textContent = "";
        name.value = "";
        cost.value = "";
    })
    } else {
        error.textContent = 'Please enter a value for both fields before submitting'
    }
})