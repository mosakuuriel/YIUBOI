/* =====================================
   YIUBOI PAYMENT & ORDER SYSTEM
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "https://yiuboi.onrender.com/api/order";

    const cartContainer = document.getElementById("paymentCartItems");
    const subtotalElement = document.getElementById("paymentSubtotal");
    const totalElement = document.getElementById("paymentTotal");
    const deliveryElement = document.getElementById("paymentDelivery");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const deliveryForm = document.getElementById("deliveryForm");



    // BANK TRANSFER DETAILS

    const bankTransferDetails = document.getElementById("bankTransferDetails");

    document.querySelectorAll('input[name="paymentMethod"]').forEach(function (input) {

        input.addEventListener("change", function () {

            if (this.value === "transfer") {
                bankTransferDetails.style.display = "block";
            } else {
                bankTransferDetails.style.display = "none";
            }

        });

    });
    let cart = [];
    let subtotal = 0;


    // CURRENCY FORMAT

    function formatPrice(amount) {
        return "₦" + Number(amount).toLocaleString("en-NG");
    }


    // GET CUSTOMER CART

    function getCart() {

        const possibleCartKeys = [
            "yiuboiCart",
            "cart",
            "shoppingCart",
            "sneakersCart",
            "casualCart",
            "formalCart",
            "bootsCart",
            "sandalsCart",
            "slidesCart",
            "watchesCart"
        ];

        for (const key of possibleCartKeys) {

            const savedCart = localStorage.getItem(key);

            if (!savedCart) continue;

            try {

                const parsedCart = JSON.parse(savedCart);

                if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                    return parsedCart;
                }

            } catch (error) {
                console.error("Unable to read cart:", error);
            }

        }

        return [];
    }


    // PRODUCT DETAILS

    function getProductDetails(product) {

        const name =
            product.name ||
            product.title ||
            product.productName ||
            "YIUBOI Product";

        const price = Number(
            product.price ||
            product.productPrice ||
            product.amount ||
            0
        );

        const quantity = Math.max(
            1,
            Number(product.quantity || product.qty || 1)
        );

        const image =
            product.image ||
            product.img ||
            product.productImage ||
            "images/yiuboi-logo.png";

        return {
            name,
            price,
            quantity,
            image,
            total: price * quantity
        };
    }


    // DISPLAY CART

    function displayCart() {

        cart = getCart();

        cartContainer.innerHTML = "";
        subtotal = 0;

        if (cart.length === 0) {

            cartContainer.innerHTML = `
                <div class="payment-empty-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p>Your cart is empty.</p>
                    <a href="footwear.html">Continue Shopping</a>
                </div>
            `;

            updateSummary();
            return;
        }

        cart.forEach(function (product) {

            const item = getProductDetails(product);

            subtotal += item.total;

            const cartItem = document.createElement("div");

            cartItem.className = "payment-cart-item";

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}"
                     onerror="this.src='images/yiuboi-logo.png'">

                <div class="payment-cart-item-details">
                    <h4>${item.name}</h4>
                    <span>Quantity: ${item.quantity}</span>
                    <strong>${formatPrice(item.total)}</strong>
                </div>
            `;

            cartContainer.appendChild(cartItem);

        });

        updateSummary();
    }


    // UPDATE SUMMARY

    function updateSummary() {

        subtotalElement.textContent = formatPrice(subtotal);

        deliveryElement.textContent = "To be confirmed";

        totalElement.textContent = formatPrice(subtotal);
    }


    // GET CUSTOMER PROFILE

    function getCustomerProfile() {

        try {

            return JSON.parse(
                localStorage.getItem("yiuboiUser")
            );

        } catch (error) {

            return null;

        }
    }


    // NORMALIZE PAYMENT METHOD

    function getPaymentMethod(value) {

        const method = value.toLowerCase().trim();

        if (
            method.includes("transfer") ||
            method.includes("opay") ||
            method.includes("moniepoint")
        ) {
            return "transfer";
        }

        if (method.includes("card")) {
            return "card";
        }

        return null;
    }


    // PLACE ORDER

    placeOrderBtn.addEventListener("click", async function (event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert("Your shopping cart is empty.");
            return;
        }


        // CHECK CUSTOMER

        const customer = getCustomerProfile();

        const token = localStorage.getItem("yiuboiToken");

        if (!customer || !token) {

            localStorage.setItem("yiuboiCheckoutRequested", "true");

            alert("Please log in before placing your order.");

            window.location.href = "profile.html";

            return;
        }


        // CHECK DELIVERY FORM

        if (!deliveryForm.reportValidity()) {
            return;
        }


        // CHECK PAYMENT METHOD

        const selectedPayment = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        if (!selectedPayment) {

            alert("Please select a payment method.");

            return;
        }

        const paymentMethod = getPaymentMethod(selectedPayment.value);

        if (!paymentMethod) {

            alert("The selected payment method is not supported yet.");

            return;
        }


        // DELIVERY DETAILS

        const deliveryDetails = {

            fullName: document.getElementById("customerName").value.trim(),

            email: document.getElementById("customerEmail").value.trim(),

            phone: document.getElementById("customerPhone").value.trim(),

            state: document.getElementById("customerState").value.trim(),

            address: document.getElementById("customerAddress").value.trim(),

            landmark: document.getElementById("customerLandmark").value.trim()

        };


        // PREPARE ORDER ITEMS

        const orderItems = cart.map(function (product) {

            const item = getProductDetails(product);

            return {

                productId: product.productId || product._id || product.id || undefined,

                name: item.name,

                image: item.image,

                price: item.price,

                quantity: item.quantity

            };

        });


        // PREVENT DOUBLE SUBMISSION

        placeOrderBtn.disabled = true;

        const originalText = placeOrderBtn.textContent;

        placeOrderBtn.textContent = "Saving Your Order...";


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({

                    items: orderItems,

                    delivery: deliveryDetails,

                    paymentMethod: paymentMethod

                })

            });


            const result = await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message || "Unable to save your order."
                );

            }


            // SAVE ORDER REFERENCE LOCALLY

            localStorage.setItem(
                "yiuboiPendingOrder",
                JSON.stringify(result.order || result)
            );

            // CARD PAYMENT THROUGH PAYSTACK

            if (paymentMethod === "card") {

                const paystackResponse = await fetch(
                    `${API_URL}/paystack/initialize`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            orderId: result.order._id
                        })
                    }
                );

                const paystackData = await paystackResponse.json();

                if (!paystackResponse.ok) {
                    throw new Error(
                        paystackData.message || "Unable to start card payment."
                    );
                }

                window.location.href = paystackData.authorizationUrl;
                return;
            }

            // BANK TRANSFER
            alert(
                "Your order has been saved successfully!\n\n" +
                "Your order is PENDING PAYMENT.\n\n" +
                "Please transfer to the OPAY account displayed."
            );

            placeOrderBtn.textContent = "Order Saved";

        } catch (error) {

            console.error("Order submission error:", error);

            alert(error.message || "Something went wrong. Please try again.");

            placeOrderBtn.disabled = false;

            placeOrderBtn.textContent = originalText;

        }

    });

    // =====================================
    // VERIFY PAYSTACK PAYMENT ON RETURN
    // =====================================

    const paymentParams = new URLSearchParams(window.location.search);
    const paymentReference = paymentParams.get("reference");

    if (paymentReference) {
        (async function () {
            try {
                const token = localStorage.getItem("yiuboiToken");

                const response = await fetch(
                    `${API_URL}/paystack/verify/${encodeURIComponent(paymentReference)}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Payment verification failed.");
                }

                alert("Payment successful! Your YIUBOI order is now PAID.");

                localStorage.removeItem("yiuboiPendingOrder");

                window.history.replaceState({}, document.title, window.location.pathname);

            } catch (error) {
                alert(error.message || "Unable to verify your payment.");
            }
        })();
    }


    // INITIALIZE

    displayCart();

});