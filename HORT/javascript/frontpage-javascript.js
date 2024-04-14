const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const navContent = document.querySelector('#nav-content');
const cancelButton = document.querySelector('#cancel-button');

// Add click event listener to the search icon
searchIcon.addEventListener('click', function() {
    // Toggle the 'search-hidden' class on the search form
    searchForm.classList.toggle('search-hidden');

    // Toggle the visibility of the nav content
    if (navContent.style.display === 'none') {
        navContent.style.display = 'flex';
    } else {
        navContent.style.display = 'none';
    }
});

// Add click event listener to the cancel button
cancelButton.addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Hide the search form
    searchForm.classList.add('search-hidden');
    
    // Show the nav content
    navContent.style.display = 'flex';
});
