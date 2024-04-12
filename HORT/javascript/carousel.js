document.addEventListener('DOMContentLoaded', () => {
    let isDragging = false;
    let startX, startScrollLeft;
    let carousel = document.querySelector('.carousel');
    let carouselWidth = carousel.scrollWidth;
    let originalContent = carousel.innerHTML;

    // Clone the carousel content and append it before and after the original content
    carousel.innerHTML += originalContent + originalContent;

    let dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    };

    let dragging = (e) => {
        if (!isDragging) return;

        let delta = e.pageX - startX;
        let newScrollLeft = startScrollLeft - delta;

        // Continuously loop the carousel content
        if (newScrollLeft < 0) {
            newScrollLeft += carouselWidth * 2; // Loop to the end
        } else if (newScrollLeft > carouselWidth * 2) {
            newScrollLeft -= carouselWidth * 2; // Loop to the beginning
        }

        carousel.scrollLeft = newScrollLeft;
    };

    let dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
    };

    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
});
