//lytter til hvorvidt knappen bliver trykket på (af en eller anden grund skal man trykke 2 gange den første gang)
document.getElementById("visKnap").addEventListener("click", function() {
    let ekstraBox = document.getElementById("ekstraBox01");
    let skjultItem = ekstraBox.querySelectorAll(".skjult");

    // Tjekker om nogle af de skjulte elementer er synlige, som de helst ikke skulle være til at starte med
    let nogleSynlige = false;
    skjultItem.forEach(function(item) {
        if (item.style.display !== "none") {
            nogleSynlige = true;
        }
    });

    // Hvis nogle elementer er synlige, skal de skjules, så knappen har en funktion
    if (nogleSynlige) {
        skjultItem.forEach(function(item) {
            item.style.display = "none";
        });
        this.textContent = "Vis 3 mere";
    } else { // Når der så bliver trykket og de skjulte elementer er skujlte skal de vises
        skjultItem.forEach(function(item) {
            item.style.display = "block";
        });
        this.textContent = "Vis mindre";
    }
});