document.addEventListener("DOMContentLoaded", function () {

    const darkModeToggle = document.getElementById("darkModeToggle");

    if (!darkModeToggle) return;

    const icon = darkModeToggle.querySelector("i");

    // Load saved theme
    const savedTheme = localStorage.getItem("yiuboiTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        icon.classList.replace("fa-moon", "fa-sun");
    }

    // Toggle theme
    darkModeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        const isDarkMode = document.body.classList.contains("dark-mode");

        if (isDarkMode) {

            localStorage.setItem("yiuboiTheme", "dark");

            icon.classList.replace("fa-moon", "fa-sun");

            darkModeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {

            localStorage.setItem("yiuboiTheme", "light");

            icon.classList.replace("fa-sun", "fa-moon");

            darkModeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

        }

    });

});