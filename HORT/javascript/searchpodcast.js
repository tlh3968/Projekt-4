// Define an array of keywords you want to prioritize
const keywords = ["venskab", "uddannelsesvalg", "relationer"];

// Function to filter content based on keywords
function filterContent() {
    const allSections = document.querySelectorAll(".podcastContent");
    const showFiltered = document.getElementById("showFiltered").checked;

    allSections.forEach((section) => {
        const sectionText = section.textContent.toLowerCase();
        const containsKeyword = keywords.some((keyword) => sectionText.includes(keyword));

        if (showFiltered) {
            section.style.display = containsKeyword ? "block" : "none";
        } else {
            section.style.display = "block";
        }
    });
}

// Add a button to toggle filtered/unfiltered view
const toggleButton = document.createElement("button");
toggleButton.textContent = "Toggle Filtered View";
toggleButton.addEventListener("click", filterContent);
document.body.appendChild(toggleButton);

// Add a checkbox to restore original content
const restoreCheckbox = document.createElement("input");
restoreCheckbox.type = "checkbox";
restoreCheckbox.id = "showFiltered";
restoreCheckbox.addEventListener("change", filterContent);
document.body.appendChild(restoreCheckbox);

// Example content sections (customize as needed)
const contentSections = [
    "This is a friendship section. Lorem ipsum...",
    "Here's an apple section. Lorem ipsum...",
    "And now, an orange section. Lorem ipsum...",
    "Other irrelevant content. Lorem ipsum...",
];

// Create and append content sections to the page
contentSections.forEach((content, index) => {
    const section = document.createElement("div");
    section.className = "content-section";
    section.textContent = content;
    document.body.appendChild(section);
});
