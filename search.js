/* ==========================================
   YIUBOI GLOBAL LIVE SEARCH
========================================== */

(function () {

    document.addEventListener("DOMContentLoaded", function () {

        const searchForm = document.getElementById("yiuboiSearchForm");
        const searchInput = document.getElementById("yiuboiSearchInput");
        const searchResults = document.getElementById("searchResults");

        if (!searchForm || !searchInput || !searchResults) return;

        const products = [
            {
                name: "Sneakers",
                keywords: ["sneaker", "sneakers", "trainers"],
                link: "sneakers.html"
            },
            {
                name: "Casual Shoes",
                keywords: ["casual", "casual shoes"],
                link: "casual.html"
            },
            {
                name: "Formal Shoes",
                keywords: ["formal", "formal shoes", "office shoes"],
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
                keywords: ["watch", "watches", "wristwatch"],
                link: "watches.html"
            },
            {
                name: "Footwear Collection",
                keywords: ["footwear", "shoe", "shoes"],
                link: "footwear.html"
            }
        ];

        function showResults(value) {

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

                searchResults.innerHTML =
                    `<div class="search-no-result">No matching collection found.</div>`;

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
            showResults(this.value);
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

    });

})();