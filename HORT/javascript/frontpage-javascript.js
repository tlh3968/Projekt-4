// DOM elementer
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const navContent = document.querySelector('#nav-content');
const cancelButton = document.querySelector('#cancel-button');
const nav = document.querySelector('nav');
const searchInput = document.querySelector('.search-input');
const suggestionsContainer = document.querySelector('.suggestions-container');

// Variabel der holder øje med om search er åben eller lukket
let isSearchOpen = false;

// Funktion som viser eller skjuler search
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

// Event der lytter efter klik på søgeikonet og krydset
// Den aktiverer ovenstående funktion
searchIcon.addEventListener('click', toggleSearchForm);

cancelButton.addEventListener('click', function(event) {
    event.preventDefault();
    toggleSearchForm();
});


// Søgeforslag sektion

// Tilføjer event listener til søgeikonet
searchIcon.addEventListener('click', function() {
    showSuggestions(); // Viser søgeforslag når formlen bliver åbnet
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
    
    // Filter der ignorerer store eller små bogstaver
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