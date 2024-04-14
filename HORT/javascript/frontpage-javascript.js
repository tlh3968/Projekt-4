const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const navContent = document.querySelector('#nav-content');
const cancelButton = document.querySelector('#cancel-button');
const nav = document.querySelector('nav'); // Vælger nav elementet

// Tilføj eventlistener til søgeikonet
searchIcon.addEventListener('click', function() {
    // Skift 'search-hidden' klassen på søgeformularen
    searchForm.classList.toggle('hiddencontent');

    // Skift synligheden på nav indholdet
    if (navContent.style.display === 'none') {
        navContent.style.display = 'flex';
    } else {
        navContent.style.display = 'none';
    }

    // Tilføj justify-content: end til nav elementet
    nav.style.justifyContent = 'end';
});

// Tilføj en eventlistener til cancel knappen
cancelButton.addEventListener('click', function(event) {
    // Fjern normal funktion på formularindsendelsen (reloader normalt siden)
    event.preventDefault();

    // Skjuler hele søgefeltet (hiddencontent har display: none)
    searchForm.classList.add('hiddencontent');
    
    // Viser nav indholdet igen
    navContent.style.display = 'flex';

    // Fjerner justify-content: end fra nav elementet igen
    nav.style.justifyContent = '';
});
