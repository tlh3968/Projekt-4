document.addEventListener('DOMContentLoaded', () => {
    // Carousel 1
    let carousel1 = document.querySelector('.carousel:first-of-type');
    let arrowBtns1 = carousel1.parentElement.querySelectorAll(".podcast-list i");

    setupCarousel(carousel1, arrowBtns1);

    // Carousel 2
    let carousel2 = document.querySelector('.carousel:last-of-type');
    let arrowBtns2 = carousel2.parentElement.querySelectorAll(".podcast-list i");

    setupCarousel(carousel2, arrowBtns2);

    function setupCarousel(carousel, arrowBtns) {
        let isDragging = false;
        let startX, startScrollLeft;
        let firstCardWidth = carousel.querySelector(".podcastContainer-show").offsetWidth;
        let carouselChildren = [...carousel.children];

        let podcastPerView = Math.round(carousel.offsetWidth / firstCardWidth);

        carouselChildren.slice(-podcastPerView).reverse().forEach(card => {
            carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
        });

        carouselChildren.slice(0, -podcastPerView).forEach(card => {
            carousel.insertAdjacentHTML("beforeend", card.outerHTML);
        });

        // add event listeners for the arrow buttons to scroll the carousel left and right
        arrowBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
            })
        });

        let dragStart = (e) => {
            isDragging = true;
            carousel.classList.add("dragging");
            startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
            startScrollLeft = carousel.scrollLeft;
            e.preventDefault(); // forhindrer standardbrowseradfærd for tekstvalg eller rulning
        };

        let dragging = (e) => {
            if (!isDragging) return;

            let delta = (e.type === 'mousemove' ? e.pageX : e.touches[0].pageX) - startX;
            let newScrollLeft = startScrollLeft - delta;

            // Continuously loop the carousel content
            if (newScrollLeft < 0) {
                newScrollLeft += carousel.scrollWidth * 2; // Loop to the end
            } else if (newScrollLeft > carousel.scrollWidth * 2) {
                newScrollLeft -= carousel.scrollWidth * 2; // Loop to the beginning
            }

            carousel.scrollLeft = newScrollLeft;
        };

        let dragStop = (e) => {
            if (isDragging) {
                e.preventDefault(); // forhindrer klik på kortene, hvis karusellen blev trukket
            }
            isDragging = false;
            carousel.classList.remove("dragging");
        };

        carousel.addEventListener('mousedown', dragStart);
        carousel.addEventListener('touchstart', dragStart);
        carousel.addEventListener('mousemove', dragging);
        carousel.addEventListener('touchmove', dragging);
        document.addEventListener('mouseup', (e) => dragStop(e));
        document.addEventListener('touchend', (e) => dragStop(e));

        //console.log("Carousel setup complete:", carousel);
        //console.log("Arrow buttons:", arrowBtns);
        //console.log("First card width:", firstCardWidth);
        //console.log("Podcast per view:", podcastPerView);
    }
});
