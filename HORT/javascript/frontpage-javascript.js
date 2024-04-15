const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const navContent = document.querySelector('#nav-content');
const cancelButton = document.querySelector('#cancel-button');
const nav = document.querySelector('nav'); // Vælger nav elementet

// Tilføj eventlistener til søgeikonet
searchIcon.addEventListener('click', function() {
    // Skift 'search-hidden' klassen på søgeformularen
    searchForm.style.display = 'flex'; // Vis search form
    navContent.style.display = 'none'; // Skjul nav content

    // Tilføj justify-content: end til nav elementet
    nav.style.justifyContent = 'center';
});

// Tilføj en eventlistener til cancel knappen
cancelButton.addEventListener('click', function(event) {
    // Fjern normal funktion på formularindsendelsen (reloader normalt siden)
    event.preventDefault();

    // Skjuler hele søgefeltet (hiddencontent har display: none)
    searchForm.style.display = 'none'; // Skjul search form
    navContent.style.display = 'flex'; // Vis nav content

    // Fjerner justify-content: end fra nav elementet igen
    nav.style.justifyContent = '';
});
