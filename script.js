/* ==========================================
   YIUBOI HOMEPAGE JAVASCRIPT
========================================== */


/* ==========================================
   1. AOS ANIMATION INITIALIZATION
========================================== */

if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 900,
        once: true,
        offset: 80,
        easing: "ease-out-cubic"
    });
}


/* ==========================================
   2. CHANGING HERO WORDS
========================================== */

const changingWord = document.querySelector(".changing-word");

if (changingWord) {

    const words = [
        "Step",
        "Style",
        "Detail",
        "Elegance"
    ];

    let currentWord = 0;

    setInterval(() => {

        changingWord.classList.add("word-out");

        setTimeout(() => {

            currentWord = (currentWord + 1) % words.length;

            changingWord.textContent = words[currentWord];

            changingWord.classList.remove("word-out");

            changingWord.classList.add("word-in");

        }, 350);

    }, 2000);
}


/* ==========================================
   3. HERO IMAGE SCROLL MOVEMENT
========================================== */

const heroImage = document.querySelector(".hero-image");
const heroSection = document.querySelector(".yiuboi-hero");

if (heroImage && heroSection) {

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let ticking = false;

    function moveHeroImage() {

        if (reduceMotion.matches) return;

        const heroPosition = heroSection.getBoundingClientRect();

        if (
            heroPosition.bottom > 0 &&
            heroPosition.top < window.innerHeight
        ) {

            const movement = Math.max(
                -15,
                Math.min(15, -heroPosition.top * 0.035)
            );

            heroImage.style.transform = `translateY(${movement}px)`;
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {

        if (!ticking) {

            window.requestAnimationFrame(moveHeroImage);

            ticking = true;
        }

    }, { passive: true });

}


/* ==========================================
   4. AUTOMATIC FOOTER YEAR
========================================== */

const footerYear = document.getElementById("footerYear");

if (footerYear) {

    footerYear.textContent = new Date().getFullYear();

}


/* ==========================================
   5. NAVBAR SCROLL EFFECT
========================================== */

const navbar = document.querySelector(".yiuboi-header");

if (navbar) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    });

}


/* ==========================================
   6. CONTACT FORM - OPEN EMAIL
========================================== */

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value;

        const emailBody = `
Name: ${name}
Email: ${email}

Message:
${message}
`;

        const mailtoLink =
            `mailto:mosakuuriel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        window.location.href = mailtoLink;

    });

}

/* ==========================================
   8. YIUBOI LIVE PRODUCT SEARCH
========================================== */

const searchForm = document.getElementById("yiuboiSearchForm");
const searchInput = document.getElementById("yiuboiSearchInput");
const searchResults = document.getElementById("searchResults");

if (searchForm && searchInput && searchResults) {

    const products = [
        {
            name: "Sneakers",
            keywords: ["sneaker", "sneakers", "trainers", "sports shoes"],
            link: "sneakers.html"
        },
        {
            name: "Casual Shoes",
            keywords: ["casual", "casual shoes", "everyday shoes"],
            link: "casual.html"
        },
        {
            name: "Formal Shoes",
            keywords: ["formal", "office shoes", "corporate shoes"],
            link: "formal.html"
        },
        {
            name: "Sandals",
            keywords: ["sandal", "sandals"],
            link: "sandal.html"
        },
        {
            name: "Boots",
            keywords: ["boot", "boots"],
            link: "boots.html"
        },
        {
            name: "Slides",
            keywords: ["slide", "slides", "slippers"],
            link: "slides.html"
        },
        {
            name: "Watches",
            keywords: ["watch", "watches", "wristwatch", "timepiece"],
            link: "watches.html"
        },
        {
            name: "Footwear Collection",
            keywords: ["footwear", "shoes", "shoe"],
            link: "footwear.html"
        }
    ];

    function displaySearchResults(value) {

        const searchTerm = value.trim().toLowerCase();

        searchResults.innerHTML = "";

        if (!searchTerm) {
            searchResults.style.display = "none";
            return;
        }

        const matches = products.filter(product =>
            product.keywords.some(keyword =>
                keyword.includes(searchTerm) ||
                searchTerm.includes(keyword)
            )
        );

        if (matches.length === 0) {

            searchResults.innerHTML = `
                <div class="search-no-result">
                    No matching collection found.
                </div>
            `;

        } else {

            matches.forEach(product => {

                const result = document.createElement("a");

                result.href = product.link;
                result.className = "search-result-item";
                result.textContent = product.name;

                searchResults.appendChild(result);

            });

        }

        searchResults.style.display = "block";
    }

    searchInput.addEventListener("input", function () {
        displaySearchResults(this.value);
    });

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const firstResult = searchResults.querySelector("a");

        if (firstResult) {
            window.location.href = firstResult.href;
        }

    });

    document.addEventListener("click", function (event) {

        if (!searchForm.contains(event.target)) {
            searchResults.style.display = "none";
        }

    });

}

/* ==========================================
   7. NEWSLETTER FRONTEND PLACEHOLDER
========================================== */

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Thank you for your interest in YIUBOI!");

        newsletterForm.reset();

    });

}


/* ==========================================
   END OF YIUBOI HOMEPAGE JAVASCRIPT
========================================== */



document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".counter");
    const statsSection = document.querySelector(".yiuboi-stats");

    if (!statsSection || !counters.length) return;

    let started = false;

    const startCounting = () => {
        if (started) return;
        started = true;

        counters.forEach(counter => {
            const target = Number(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);

                counter.textContent = Math.floor(target * easedProgress);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);

});


// CONTACT FORM - OPEN EMAIL



if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value;

        const emailBody = `
Name: ${name}
Email: ${email}

Message:
${message}
`;

        const mailtoLink =
            `mailto:mosakuuriel @gmail.com?subject = ${encodeURIComponent(subject)}& body=${encodeURIComponent(emailBody)} `;

        window.location.href = mailtoLink;

    });

}




