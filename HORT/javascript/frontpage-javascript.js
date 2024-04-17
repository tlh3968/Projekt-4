// DOM elementer
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const navContent = document.querySelector('#nav-content');
const cancelButton = document.querySelector('#cancel-button');
const nav = document.querySelector('nav');
const searchInput = document.querySelector('.search-input');
const suggestionsContainer = document.querySelector('.suggestions-container');

// Variabel
let isSearchOpen = false;

// Funktion
function toggleSearchForm() {
    if (isSearchOpen) {
        searchForm.style.display = 'none'; // Skjuler søgeformlen
        navContent.style.display = 'flex'; // Viser søgeformlen
        nav.style.justifyContent = ''; // Nulstiller nav justify-content
    } else {
        searchForm.style.display = 'flex'; // Vis søgeformlen
        navContent.style.display = 'none'; // Skjul nav indhold
        nav.style.justifyContent = 'center'; // Justify-content center på nav
    }
    isSearchOpen = !isSearchOpen; // Skifter mellem vis/skjul søgeformlen
}

// Event
searchIcon.addEventListener('click', toggleSearchForm);

cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    toggleSearchForm();
});


// Autocomplete sektion

// Tilføjer event listener til søgeikonet
searchIcon.addEventListener('click', function() {
    searchForm.style.display = 'flex';
    navContent.style.display = 'none';
    nav.style.justifyContent = 'center';
    showSuggestions(); // Viser søgeforslag når formlen bliver åbnet
});

// Tilføjer event listener til cancel knappen
cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    searchForm.style.display = 'none';
    navContent.style.display = 'flex';
    nav.style.justifyContent = '';
});

// Tilføjer event listener når input feltet er aktivt
searchInput.addEventListener('focus', function() {
    showSuggestions();
});

// Tilføjer event listener til når tastaturknapper ikke længere bliver trykket
searchInput.addEventListener('keyup', function() {
    showSuggestions();
});

// Funktion til at vise søgeforslag
function showSuggestions() {
    // Fjerner eksisterende søgeforslag
    suggestionsContainer.innerHTML = '';
    
    // Array med søgeforslag
    const suggestions = ['Børns Vilkår', 'Frivillig', 'Podcast', 'HØRT forside'];
    
    // Filtrerer søgeforslag baseret på input fra bruger
    const userInput = searchInput.value.toLowerCase(); // Gør input case-insensitive
    const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().startsWith(userInput));
    
    // Loop der kommer hvert søgeforslag ind som et link 
    filteredSuggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('a');
        suggestionElement.href = getSuggestionLink(suggestion); // Henter link til hvert søgeforslag
        suggestionElement.textContent = suggestion;
        suggestionsContainer.appendChild(suggestionElement);
    });
}

// Funktion til links af hvert søgeforslag
function getSuggestionLink(suggestion) {
    // Definerer links til hvert søgeforslag
    const suggestionLinks = {
        'Børns Vilkår': '../bornsvilkar/index.html',
        'Frivillig': '../bornsvilkar/frivillig.html',
        'Podcast': 'podcast.html',
        'HØRT forside': 'index.html'
    };
    return suggestionLinks[suggestion];
}