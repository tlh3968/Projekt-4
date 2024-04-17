// DOM elements
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const navContent = document.querySelector('#nav-content');
const cancelButton = document.querySelector('#cancel-button');
const nav = document.querySelector('nav'); // Select the <nav> element

// Variables and types
let isSearchOpen = false;

// Functions
function toggleSearchForm() {
    if (isSearchOpen) {
        searchForm.style.display = 'none'; // Hide search form
        navContent.style.display = 'flex'; // Show nav content
        nav.style.justifyContent = ''; // Reset justify-content
    } else {
        searchForm.style.display = 'flex'; // Show search form
        navContent.style.display = 'none'; // Hide nav content
        nav.style.justifyContent = 'center'; // Center align nav content
    }
    isSearchOpen = !isSearchOpen; // Toggle search state
}

// Events
searchIcon.addEventListener('click', toggleSearchForm);

cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    toggleSearchForm();
});


// Autocomplete code
const searchInput = document.querySelector('.search-input');
const suggestionsContainer = document.querySelector('.suggestions-container');

const suggestions = [
    { title: 'Bliv hørt', url: 'https://hort.dk/bliv-hoert' },
    { title: 'Podcast', url: 'podcast.html' },
    { title: 'Hør andre', url: 'https://hort.dk/hoer-andre' },
    { title: 'Om hørt', url: 'https://hort.dk/om-hoert/' }
];

searchInput.addEventListener('input', function(event) {
    const userInput = event.target.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(userInput)
    );

    displaySuggestions(filteredSuggestions);
});

function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion.title;
        suggestionElement.addEventListener('click', function() {
            window.location.href = suggestion.url;
        });
        suggestionsContainer.appendChild(suggestionElement);
    });
}