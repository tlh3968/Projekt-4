// Funktionen der udfører søgningen
function search() {
    let query = document.getElementById("sogefelt").value.toLowerCase();

    // Hvis brugeren søger "frivillig"
    if (query === "frivillig") {
        window.location.href = "frivillig.html";
    }
    // Hvis brugeren søger "hørt"
    else if (query === "hørt") {
        window.location.href = "../HORT/index.html";
    }
    // Hvis brugeren søger noget andet end "frivillig" eller "hørt"
    else {
        alert("Kunne ikke finde siden");
    }
}
