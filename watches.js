
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // AOS ANIMATION
    // =========================

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80,
            easing: "ease-in-out"
        });
    }


    // =========================
    // NAVBAR
    // =========================

    const navbar = document.getElementById("yiuboiNavbar");

    if (navbar && typeof bootstrap !== "undefined") {

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


    // =========================
    // WATCH SHOPPING CART
    // =========================

    let watchCart = JSON.parse(localStorage.getItem("yiuboiWatchesCart")) || [];

    const cartContainer = document.getElementById("watchCartItems");
    const cartTotal = document.getElementById("watchCartTotal");
    const checkoutBtn = document.getElementById("watchCheckoutBtn");


    // FORMAT PRICE

    function formatPrice(price) {

        return "₦" + Number(price).toLocaleString("en-NG");

    }


    // SAVE CART

    function saveCart() {

        localStorage.setItem("yiuboiWatchesCart", JSON.stringify(watchCart));

    }


    // UPDATE CART DISPLAY

    function displayCart() {

        if (!cartContainer || !cartTotal) return;

        cartContainer.innerHTML = "";

        if (watchCart.length === 0) {

            cartContainer.innerHTML = `
                <div class="empty-cart">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <h3>Your cart is empty</h3>

                    <p>
                        Explore our watch collection and add something
                        you love.
                    </p>

                </div>
            `;

            cartTotal.textContent = formatPrice(0);

            return;

        }


        let total = 0;


        watchCart.forEach((item, index) => {

            total += item.price * item.quantity;

            const cartItem = document.createElement("div");

            cartItem.className = "watch-cart-item";

            cartItem.innerHTML = `

                <div class="cart-item-image">

                    <img src="${item.image || ""}" alt="${item.name}">

                </div>


                <div class="cart-item-details">

                    <h4>${item.name}</h4>

                    <p>${formatPrice(item.price)}</p>

                    <div class="cart-quantity">

                        <button class="quantity-btn decrease-btn"
                            data-index="${index}" aria-label="Decrease quantity">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button class="quantity-btn increase-btn"
                            data-index="${index}" aria-label="Increase quantity">
                            +
                        </button>

                    </div>

                </div>


                <div class="cart-item-actions">

                    <strong>
                        ${formatPrice(item.price * item.quantity)}
                    </strong>

                    <button class="remove-watch-btn"
                        data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                        Remove
                    </button>

                </div>

            `;

            cartContainer.appendChild(cartItem);

        });


        cartTotal.textContent = formatPrice(total);

        saveCart();

    }


    // =========================
    // ADD WATCH TO CART
    // =========================

    const addButtons = document.querySelectorAll(".add-watch-btn");

    addButtons.forEach(button => {

        button.addEventListener("click", function () {

            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = Number(this.dataset.price);
            const image = this.dataset.image;

            if (!id || !name || !price) {

                alert("Sorry, this watch cannot be added right now.");

                return;

            }


            const existingItem = watchCart.find(item => item.id === id);


            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                watchCart.push({

                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1

                });

            }


            saveCart();

            displayCart();


            this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';

            const buttonElement = this;

            setTimeout(function () {

                buttonElement.innerHTML =
                    '<i class="fa-solid fa-cart-plus"></i> Add To Cart';

            }, 1200);


            alert(name + " has been added to your cart.");

        });

    });


    // =========================
    // CART BUTTON ACTIONS
    // =========================

    if (cartContainer) {

        cartContainer.addEventListener("click", function (event) {

            const increaseBtn = event.target.closest(".increase-btn");

            const decreaseBtn = event.target.closest(".decrease-btn");

            const removeBtn = event.target.closest(".remove-watch-btn");


            // INCREASE QUANTITY

            if (increaseBtn) {

                const index = Number(increaseBtn.dataset.index);

                watchCart[index].quantity += 1;

                displayCart();

            }


            // DECREASE QUANTITY

            if (decreaseBtn) {

                const index = Number(decreaseBtn.dataset.index);

                watchCart[index].quantity -= 1;

                if (watchCart[index].quantity <= 0) {

                    watchCart.splice(index, 1);

                }

                displayCart();

            }


            // REMOVE WATCH

            if (removeBtn) {

                const index = Number(removeBtn.dataset.index);

                watchCart.splice(index, 1);

                displayCart();

            }

        });

    }
    // =========================
    // CHECKOUT BUTTON
    // =========================

    if (checkoutBtn) {

        checkoutBtn.addEventListener("click", function () {

            if (watchCart.length === 0) {
                alert("Your shopping cart is empty.");
                return;
            }

            localStorage.setItem("yiuboiCart", JSON.stringify(cart));
            localStorage.setItem("yiuboiCheckoutCart", JSON.stringify(cart));

            const loggedInUser = localStorage.getItem("yiuboiUser");

            if (loggedInUser) {
                window.location.href = "payment.html";
            } else {
                localStorage.setItem("yiuboiCheckoutRequested", "true");
                window.location.href = "profile.html";
            }

        });

    }


    // =========================
    // INITIAL CART DISPLAY
    // =========================

    displayCart();

});
