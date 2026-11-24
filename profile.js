document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "https://yiuboi.onrender.com/api/auth";

    // ELEMENTS
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");


    // FORM SWITCHING

    function openLogin() {

        loginForm.hidden = false;
        signupForm.hidden = true;

        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        document.querySelector(".profile-heading h2").textContent =
            "Welcome Back";

        document.querySelector(".profile-heading p").textContent =
            "Access your YIUBOI account below.";

    }


    function openSignup() {

        loginForm.hidden = true;
        signupForm.hidden = false;

        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        document.querySelector(".profile-heading h2").textContent =
            "Create Your Account";

        document.querySelector(".profile-heading p").textContent =
            "Join YIUBOI and enjoy a better shopping experience.";

    }


    loginTab.addEventListener("click", openLogin);
    signupTab.addEventListener("click", openSignup);

    showSignup.addEventListener("click", openSignup);
    showLogin.addEventListener("click", openLogin);


    // PASSWORD VISIBILITY

    document.querySelectorAll(".password-toggle").forEach(button => {

        button.addEventListener("click", function () {

            const passwordInput =
                document.getElementById(this.dataset.target);

            const icon = this.querySelector("i");

            if (passwordInput.type === "password") {

                passwordInput.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");

            } else {

                passwordInput.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");

            }

        });

    });


    // CHECKOUT REDIRECT

    function continueAfterLogin() {

        const checkoutRequested =
            localStorage.getItem("yiuboiCheckoutRequested");

        if (checkoutRequested === "true") {

            localStorage.removeItem("yiuboiCheckoutRequested");

            window.location.href = "payment.html";

        } else {

            window.location.href = "index.html";

        }

    }


    // SAVE CUSTOMER LOGIN DETAILS

    function saveCustomer(data) {

        localStorage.setItem("yiuboiToken", data.token);

        localStorage.setItem(
            "yiuboiUser",
            JSON.stringify(data.user)
        );

    }


    // CUSTOMER SIGNUP

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim().toLowerCase();

        const phone =
            document.getElementById("signupPhone").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const agreeTerms =
            document.getElementById("agreeTerms").checked;


        if (fullName.length < 3) {
            alert("Please enter your full name.");
            return;
        }

        if (!email || !phone) {
            alert("Please complete all your details.");
            return;
        }

        if (password.length < 8) {
            alert("Your password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Your passwords do not match.");
            return;
        }

        if (!agreeTerms) {
            alert("Please agree to the terms and conditions.");
            return;
        }


        try {

            const response = await fetch(`${API_URL}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password
                })

            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Registration failed.");
                return;
            }


            // LOG IN THE NEW CUSTOMER

            const loginResponse = await fetch(`${API_URL}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const loginResult = await loginResponse.json();

            if (!loginResponse.ok) {

                alert(
                    "Account created successfully! Please log in to continue."
                );

                openLogin();
                return;

            }


            saveCustomer(loginResult);

            alert("Your YIUBOI account has been created successfully!");

            continueAfterLogin();

        } catch (error) {

            console.error("Signup error:", error);

            alert("Unable to connect to YIUBOI. Please try again.");

        }

    });


    // CUSTOMER LOGIN

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("loginPassword").value;


        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }


        try {

            const response = await fetch(`${API_URL}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Login failed.");
                return;
            }


            saveCustomer(result);

            alert("Welcome back to YIUBOI!");

            continueAfterLogin();

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to YIUBOI. Please try again.");

        }

    });


    // FORGOT PASSWORD

    const forgotPassword = document.getElementById("forgotPassword");

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        if (!email) {
            alert("Please enter your email address first.");
            return;
        }

        alert("Password recovery will be connected later.");

    });


    // AOS

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 900,
            once: true,
            offset: 80
        });

    }

});