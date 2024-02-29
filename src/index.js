// index.js

//clean up to dos:
//create consts in global scope that you use again and again
//create url const
//write out each step and what it accomplishes
//remove console.logs

//delete button 
let deleteBtn = document.createElement('button')
let line = document.createElement('br')
let ramenDetail = document.querySelector('#ramen-detail')

deleteBtn.textContent = 'Delete Ramen :('
deleteBtn.id = "delete-btn"


ramenDetail.appendChild(line)
ramenDetail.appendChild(deleteBtn)

// Callbacks
const handleClick = (ramen) => {
  // Add code
  let ramenDetail = document.getElementById('ramen-detail')
  
  ramenDetail.style.display = 'block'
  ramenDetail.querySelector('.detail-image').src = `${ramen.image}`
  ramenDetail.querySelector('.name').textContent = ramen.name 
  ramenDetail.querySelector('.name').id = ramen.id
  ramenDetail.querySelector('.restaurant').textContent = ramen.restaurant

  document.getElementById('rating-display').textContent = ramen.rating
  document.getElementById('comment-display').textContent = ramen.comment

};

const addSubmitListener = () => {
  // Add code
  let newRamen = document.querySelector('#new-ramen')

  newRamen.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/ramens', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
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

    let ramenMenu = document.getElementById('ramen-menu')

    newRamenImg.src = newImage
    newRamenImg.id = newRamenData.id

    console.log(newRamenImg.id)
    ramenMenu.appendChild(newRamenImg)
    
    newRamenImg.addEventListener('click', () => {
      let ramenDetail = document.getElementById('ramen-detail')
      //make this global please

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

const displayRamens = () => {
  // Add code
  fetch('http://localhost:3000/ramens')
  .then(res => {
    if(res.ok){
      return res.json()
    } else alert('Something went wrong...')
  })
  .then(data => {
    //display first ramen's details on load
    const firstRamen = data[0]
    let ramenDetail = document.getElementById('ramen-detail')
    
    ramenDetail.querySelector('.detail-image').src = firstRamen.image
    ramenDetail.querySelector('.name').textContent = firstRamen.name 
    ramenDetail.querySelector('.name').id = firstRamen.id 
    ramenDetail.querySelector('.restaurant').textContent = firstRamen.restaurant

    document.getElementById('rating-display').textContent = firstRamen.rating
    document.getElementById('comment-display').textContent = firstRamen.comment

    //create slider images for each ramen
    data.forEach((ramen) => {
    let ramenImg = document.createElement('img') 
    let ramenMenu = document.getElementById('ramen-menu')

    ramenImg.src = ramen.image
    ramenImg.id = ramen.id
    
    ramenMenu.appendChild(ramenImg);

    ramenImg.addEventListener('click', () => handleClick(ramen))

    })
  })
  .catch(error => alert(error))
};

//update ratings and comments via the form edit-ramen
const changeRamen = () => {
  let editRamen = document.querySelector('#edit-ramen')
  editRamen.addEventListener('submit', (e) => {
    e.preventDefault()
    let ramenID = document.querySelector(".name").id
    console.log(ramenID)
    fetch(`http://localhost:3000/ramens/${ramenID}`, {
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
    })
    .catch(error => alert(error))

  })
}

const deleteRamen = () => {
  deleteBtn.addEventListener('click', () => {
    let ramenDetail = document.querySelector('#ramen-detail')
    let ramenID = document.querySelector(".name").id
    let ramenMenu = document.querySelector("#ramen-menu")

  
    fetch(`http://localhost:3000/ramens/${ramenID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => {
      if(res.ok){
        return res.json()
      } else {
        return alert("Something went wrong")
      }
    })
    .then(response => {
      console.log(response)
      alert("Ramen successfully deleted!")
    })
    .catch(error => alert(error))
    
    //hide ramen-detail area
    ramenDetail.style.display = 'none'

    document.querySelector("#rating-display").textContent = "Insert rating here"
    document.querySelector("#comment-display").textContent = "Insert comment here"

    //delete picture in ramen-menu div
    //.escape the ID because it starts with a number to make it a string and, therefore, a valid selector
    let escapedRamenID = CSS.escape(ramenID);

    ramenMenu.querySelector(`#${escapedRamenID}`).remove()


  })

}

const main = () => {
  displayRamens()
  addSubmitListener()
  changeRamen()
  deleteRamen()
  // Invoke displayRamens here
  // Invoke addSubmitListener here
}

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
