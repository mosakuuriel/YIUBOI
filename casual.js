document.addEventListener("DOMContentLoaded", function () {

    // ================= AOS ANIMATION =================

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80,
            easing: "ease-in-out"
        });
    }


    // ================= CART VARIABLES =================

    let cart = JSON.parse(localStorage.getItem("yiuboiCasualCart")) || [];

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    const checkoutBtn = document.getElementById("checkoutBtn");


    // ================= PRICE FORMAT =================

    function formatPrice(price) {
        return "₦" + Number(price).toLocaleString("en-NG");
    }


    // ================= SAVE CART =================

    function saveCart() {
        localStorage.setItem("yiuboiCasualCart", JSON.stringify(cart));
    }


    // ================= ADD TO CART =================

    document.querySelectorAll(".add-cart-btn").forEach(button => {

        button.addEventListener("click", function () {

            const name = this.dataset.name;
            const price = Number(this.dataset.price);
            const sizeId = this.dataset.size;

            const sizeSelect = document.getElementById(sizeId);
            const selectedSize = sizeSelect.value;

            if (!selectedSize) {
                alert("Please select your shoe size first.");
                sizeSelect.focus();
                return;
            }

            const existingProduct = cart.find(item =>
                item.name === name && item.size === selectedSize
            );

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    size: selectedSize,
                    quantity: 1
                });
            }

            saveCart();
            renderCart();

            alert(name + " has been added to your cart.");

        });

    });


    // ================= DISPLAY CART =================

    function renderCart() {

        cartItems.innerHTML = "";

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <h3>Your Cart Is Empty</h3>

                    <p>
                        You haven't added any products to your cart yet.
                    </p>

                    <a href="#casual-collection">
                        Continue Shopping
                    </a>

                </div>
            `;

        } else {

            cart.forEach((item, index) => {

                const cartProduct = document.createElement("div");

                cartProduct.className = "cart-product";

                cartProduct.innerHTML = `

                    <div class="cart-product-details">

                        <h4>${item.name}</h4>

                        <p>Size: ${item.size}</p>

                        <strong>${formatPrice(item.price)}</strong>

                    </div>

                    <div class="cart-quantity">

                        <button class="quantity-btn decrease"
                            data-index="${index}">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button class="quantity-btn increase"
                            data-index="${index}">
                            +
                        </button>

                    </div>

                    <div class="cart-product-total">

                        <strong>
                            ${formatPrice(item.price * item.quantity)}
                        </strong>

                        <button class="remove-cart-btn"
                            data-index="${index}">

                            <i class="fa-solid fa-trash"></i>
                            Remove

                        </button>

                    </div>

                `;

                cartItems.appendChild(cartProduct);

            });

        }


        // ================= CART TOTAL =================

        const total = cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);


        // ================= CART COUNT =================

        const count = cart.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);


        cartTotal.textContent = formatPrice(total);
        cartCount.textContent = count;


        saveCart();

    }


    // ================= CART BUTTON ACTIONS =================

    cartItems.addEventListener("click", function (event) {

        const increaseButton = event.target.closest(".increase");
        const decreaseButton = event.target.closest(".decrease");
        const removeButton = event.target.closest(".remove-cart-btn");


        // INCREASE QUANTITY

        if (increaseButton) {

            const index = Number(increaseButton.dataset.index);

            cart[index].quantity++;

            renderCart();

        }


        // DECREASE QUANTITY

        if (decreaseButton) {

            const index = Number(decreaseButton.dataset.index);

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            renderCart();

        }


        // REMOVE PRODUCT

        if (removeButton) {

            const index = Number(removeButton.dataset.index);

            cart.splice(index, 1);

            renderCart();

        }

    });


    // =========================
    // CHECKOUT
    // =========================

    checkoutBtn.addEventListener("click", function () {

        if (cart.length === 0) {
            alert("Your cart is empty. Please add a product first.");
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


    // ================= INITIAL CART DISPLAY =================

    renderCart();

});