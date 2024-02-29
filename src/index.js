// index.js

//global variables
let url = 'http://localhost:3000'
let ramenDetail = document.querySelector('#ramen-detail')
let ramenMenu = document.getElementById('ramen-menu')

//create global delete button 
let deleteBtn = document.createElement('button')
let line = document.createElement('br')

deleteBtn.textContent = 'Delete Ramen :('
deleteBtn.id = 'delete-btn'

ramenDetail.appendChild(line)
ramenDetail.appendChild(deleteBtn)

// Callbacks

//display ramen details in ramen-details by changing image src and text content of nodes
const handleClick = (ramen) => {
  ramenDetail.style.display = 'block'
  ramenDetail.querySelector('.detail-image').src = `${ramen.image}`
  ramenDetail.querySelector('.name').textContent = ramen.name 
  ramenDetail.querySelector('.name').id = ramen.id
  ramenDetail.querySelector('.restaurant').textContent = ramen.restaurant

  document.getElementById('rating-display').textContent = ramen.rating
  document.getElementById('comment-display').textContent = ramen.comment

};

//create new ramen through form submission with POST fetch request
const addSubmitListener = () => {
  let newRamen = document.querySelector('#new-ramen')

  newRamen.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`${url}/ramens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.querySelector('#new-name').value,
        restaurant: e.target.querySelector('#new-restaurant').value,
        image: e.target.querySelector('#new-image').value,
        rating: e.target.querySelector('#new-rating').value,
        comment: e.target.querySelector('#new-comment').value,

      }),
    })
    .then(res => {
      if(res.ok){
        return res.json()
      } else alert('Something went wrong...')
  })
  .then(newRamenData => {
    let newRamenImg = document.createElement('img')

    let newRamenName = newRamenData.name
    let newRestaurant = newRamenData.restaurant
    let newImage = newRamenData.image
    let newRating = newRamenData.rating
    let newComment = newRamenData.comment
    let newRamenId = newRamenData.id

    //create new ramen image in ramen-menu
    newRamenImg.src = newImage
    newRamenImg.id = newRamenData.id

    ramenMenu.appendChild(newRamenImg)
    
    //display newly submitted ramen details on submit
    ramenDetail.style.display = 'block'
    ramenDetail.querySelector('.detail-image').src = newImage
    ramenDetail.querySelector('.name').textContent = newRamenName
    ramenDetail.querySelector('.name').id = newRamenId
    ramenDetail.querySelector('.restaurant').textContent = newRestaurant
  
    document.getElementById('rating-display').textContent = newRating
    document.getElementById('comment-display').textContent = newComment

    //clears submission fields upon submit  
    e.target.querySelector('#new-name').value = ''
    e.target.querySelector('#new-restaurant').value = ''
    e.target.querySelector('#new-image').value = ''
    e.target.querySelector('#new-rating').value = ''
    e.target.querySelector('#new-comment').value = ''

    newRamenImg.addEventListener('click', () => {
      //using handleClick here affects PATCH requests 
      ramenDetail.style.display = 'block'
      ramenDetail.querySelector('.detail-image').src = newImage
      ramenDetail.querySelector('.name').textContent = newRamenName
      ramenDetail.querySelector('.name').id = newRamenId
      ramenDetail.querySelector('.restaurant').textContent = newRestaurant
    
      document.getElementById('rating-display').textContent = newRating
      document.getElementById('comment-display').textContent = newComment
    
      })
    })
    .catch(error => alert(error))
  }
)}

// Get ramen details from server with fetch GET request
const displayRamens = () => {
  fetch(`${url}/ramens`)
  .then(res => {
    if(res.ok){
      return res.json()
    } else alert('Something went wrong...')
  })
  .then(data => {
    //display first ramen's details on load
    const firstRamen = data[0]
    
    ramenDetail.querySelector('.detail-image').src = firstRamen.image
    ramenDetail.querySelector('.name').textContent = firstRamen.name 
    ramenDetail.querySelector('.name').id = firstRamen.id 
    ramenDetail.querySelector('.restaurant').textContent = firstRamen.restaurant

    document.getElementById('rating-display').textContent = firstRamen.rating
    document.getElementById('comment-display').textContent = firstRamen.comment

    //create slider images for each ramen in ramen-menu
    data.forEach((ramen) => {
    let ramenImg = document.createElement('img') 

    ramenImg.src = ramen.image
    ramenImg.id = ramen.id
    
    ramenMenu.appendChild(ramenImg);

    ramenImg.addEventListener('click', () => handleClick(ramen))

    })
  })
  .catch(error => alert(error))
};

//update ratings and comments via edit-ramen form with PATCH fetch request
const changeRamen = () => {
  let editRamen = document.querySelector('#edit-ramen')
  editRamen.addEventListener('submit', (e) => {
    e.preventDefault()
    let ramenID = document.querySelector('.name').id

    fetch(`${url}/ramens/${ramenID}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: e.target.querySelector('#new-rating').value,
        comment: e.target.querySelector('#new-comment').value,

      }),
    })
    .then(res => {
      if(res.ok){
        return res.json();
      }else {
        alert('Something went wrong...')
      }
    })
    .then(updatedData => {
      let updatedRating = updatedData.rating
      let updatedComment = updatedData.comment

      document.querySelector('#rating-display').textContent = updatedRating
      document.querySelector('#comment-display').textContent = updatedComment

      //clearing of submission fields on submit
      e.target.querySelector('#new-rating').value = ''
      e.target.querySelector('#new-comment').value = ''

    })
    .catch(error => alert(error))

  })
}

//Delete button functionality with DELETE fetch request
const deleteRamen = () => {
  deleteBtn.addEventListener('click', () => {
    let ramenID = document.querySelector('.name').id
    let ramenMenu = document.querySelector('#ramen-menu')

    fetch(`${url}/ramens/${ramenID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      if(res.ok){
        return res.json()
      } else {
        return alert('Something went wrong')
      }
    })
    .then(response => {
      console.log(response)
      alert('Ramen successfully deleted!')
    })
    .catch(error => alert(error))
    
    //hide ramen-detail area
    ramenDetail.style.display = 'none'

    document.querySelector('#rating-display').textContent = 'Insert rating here'
    document.querySelector('#comment-display').textContent = 'Insert comment here'

    //.escape the ID because it starts with a number to make it a string and, therefore, a valid selector
    let escapedRamenID = CSS.escape(ramenID);

    //delete picture in ramen-menu div
    ramenMenu.querySelector(`#${escapedRamenID}`).remove()


  })

}

const main = () => {
  displayRamens()
  addSubmitListener()
  changeRamen()
  deleteRamen()
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
