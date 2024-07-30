let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });

  // Function to render a toy card
  function renderToy(toy) {
    const toyCollection = document.getElementById('toy-collection');

    const toyCard = document.createElement('div');
    toyCard.className = 'card';

    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;

    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.className = 'toy-avatar';

    const toyLikes = document.createElement('p');
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.id = toy.id;
    likeButton.textContent = 'Like ❤️';

    // Event listener for like button
    likeButton.addEventListener('click', () => {
      toy.likes++;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ likes: toy.likes })
      })
      .then(response => response.json())
      .then(updatedToy => {
        toyLikes.textContent = `${updatedToy.likes} Likes`;
      });
    });

    toyCard.append(toyName, toyImage, toyLikes, likeButton);
    toyCollection.appendChild(toyCard);
  }

  // Adding a new toy
  const addToyForm = document.querySelector(".add-toy-form");
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      addToyForm.reset();
    });
  });
});



