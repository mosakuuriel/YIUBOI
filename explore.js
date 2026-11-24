document.addEventListener("DOMContentLoaded", function () {

    // INITIALIZE AOS ANIMATIONS
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80,
            easing: "ease-in-out"
        });
    }


    // CLOSE MOBILE NAVBAR AFTER CLICKING A LINK
    const navbar = document.getElementById("yiuboiNavbar");

    if (navbar) {
        const navLinks = navbar.querySelectorAll(".nav-link:not(.dropdown-toggle)");

        navLinks.forEach(link => {
            link.addEventListener("click", function () {

                if (window.innerWidth <= 850 && navbar.classList.contains("show")) {

                    const collapse = bootstrap.Collapse.getOrCreateInstance(navbar);
                    collapse.hide();

                }

            });
        });
    }


    // FOOTWEAR CATEGORY CARD ANIMATIONS
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach(card => {

        card.addEventListener("mouseenter", function () {
            card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
        });

    });


});