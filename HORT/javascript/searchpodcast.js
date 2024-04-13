// Function to filter content based on keywords
function filterContent() {
    const searchInput = document.getElementById("searchInput");
    const searchValue = searchInput.value.toLowerCase();
    const contentSections = document.querySelectorAll(".podcastContainer-alle");

    contentSections.forEach((section) => {
        const sectionText = section.textContent.toLowerCase();
        const containsKeyword = sectionText.includes(searchValue);

        if (!containsKeyword) {
            section.classList.add("hidden");
        } else {
            section.classList.remove("hidden");
        }
    });
}

// Function to restore original content
function restoreContent() {
    const contentSections = document.querySelectorAll(".podcastContainer-alle");
    contentSections.forEach((section) => {
        section.classList.remove("hidden");
    });
}

// Add event listeners to search input and button for filtering and restoring content
document.getElementById("searchInput").addEventListener("input", filterContent);
document.getElementById("searchInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        filterContent();
    }
});
document.getElementById("restoreButton").addEventListener("click", restoreContent);
