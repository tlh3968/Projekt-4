// JavaScript for søgefunktion og gendannelsesfunktion

function searchAndFilter() {
    // Hent inputfeltet og søgeordet
    var input, filter, podcasts, podcastTitle, i;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    // Hent alle podcast-containere
    podcasts = document.querySelectorAll('.podcastContainer-alle');
  
    // Gennemgå hver podcast-container
    for (i = 0; i < podcasts.length; i++) {
        // Find podcast-titlen i den aktuelle container
        podcastTitle = podcasts[i].querySelector('.podcast-text');
        // Hvis podcast-titlen findes
        if (podcastTitle) {
            // Hent teksten i podcast-titlen
            var titleText = podcastTitle.innerText.toUpperCase();
            // Hvis søgeordet er en del af podcast-titlen, vis containeren, ellers skjul den
            if (titleText.indexOf(filter) > -1) {
                podcasts[i].style.display = '';
            } else {
                podcasts[i].style.display = 'none';
            }
        }
    }
}

function restorePodcastlist2() {
    // Find alle skjulte podcast-containere
    var hiddenPodcasts = document.querySelectorAll('.podcastContainer-alle');
    // Gennemgå hver skjult podcast-container og vis den
    hiddenPodcasts.forEach(function(podcast) {
        podcast.style.display = '';
    });

    document.getElementById('searchInput').value = '';
}

// Lyt efter tastetryk i søgefeltet
document.getElementById('searchInput').addEventListener('keyup', searchAndFilter);

// Lyt efter klik på gendannelsesknappen
document.getElementById('restoreButton').addEventListener('click', restorePodcastlist2);


