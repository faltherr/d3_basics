//DOM Elements
const btns = document.querySelectorAll('button')
const form = document.querySelector('form')
const formActivity = document.querySelector('form span')
const input = document.querySelector('input')
const error = document.querySelector('.error')

let activity = 'cycling'

btns.forEach(btn => {
    btn.addEventListener('click', e => {
        // Get activity
        //Because we used data-activity in the index.html file we have access to the dataset
        activity = e.target.dataset.activity;

        //Remove the active class from previous and move to new
        btns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        //set the id of the input field
        input.setAttribute('id', activity);

        // set text of form span
        formActivity.textContent = activity
    })
})

//form submission
form.addEventListener('submit', e =>{
    //prevent default action
    e.preventDefault()
    const distance = parseInt(input.value);
    if(distance){
        db.collection('activities').add({
            distance,
            activity,
            date: new Date().toString()
        }).then(()=>{
            error.textContent = '';
            input.value = '';
        })
    } else {
        error.textContent = 'Please enter a valid distance'
    }
})