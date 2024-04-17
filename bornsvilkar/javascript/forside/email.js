// Array til at gemme tilmeldinger
let tilmeldinger = [];

document.getElementById("tilmeldKnap").addEventListener("click", function() {
    let fornavn = document.getElementById("fornavn").value;
    let efternavn = document.getElementById("efternavn").value;
    let email = document.getElementById("email").value;

    // Opret et objekt med brugeroplysninger
    let bruger = {
        fornavn: fornavn,
        efternavn: efternavn,
        email: email
    };

    // Tilføj brugeroplysninger til array
    tilmeldinger.push(bruger);

    // Nulstil inputfelter så nye bruger kan skrive deres info
    document.getElementById("fornavn").value = "";
    document.getElementById("efternavn").value = "";
    document.getElementById("email").value = "";

    // Vis besked om succesfuld tilmelding (kan tilpasses efter behov)
    alert("Du er nu tilmeldt nyhedsbrevet!");
});
