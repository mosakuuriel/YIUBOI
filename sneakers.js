// AOS ANIMATION

if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: "ease-in-out"
    });
}


// SHOPPING CART

let cart = JSON.parse(localStorage.getItem("yiuboiCart")) || [];

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


// ADD TO CART

document.querySelectorAll(".add-cart-btn").forEach(button => {

    button.addEventListener("click", function () {

        const productName = this.dataset.name;
        const productPrice = Number(this.dataset.price);
        const sizeInput = document.getElementById(this.dataset.size);

        const selectedSize = sizeInput.value;

        if (!selectedSize) {
            alert("Please select a size before adding this sneaker to your cart.");
            return;
        }

        cart.push({
            name: productName,
            price: productPrice,
            size: selectedSize
        });

        localStorage.setItem("yiuboiCart", JSON.stringify(cart));

        displayCart();

        alert(productName + " has been added to your cart.");

    });

});


// DISPLAY CART

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size}</p>
                    <p>₦${item.price.toLocaleString("en-NG")}</p>
                </div>

                <button class="remove-item" onclick="removeItem(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>

            </div>
        `;

    });


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">Your cart is currently empty.</p>
        `;

    }

    cartCount.textContent = cart.length;

    cartTotal.textContent = "₦" + total.toLocaleString("en-NG");

}


// REMOVE ITEM

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("yiuboiCart", JSON.stringify(cart));

    displayCart();

}


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

// FOOTER YEAR

document.getElementById("footerYear").textContent = new Date().getFullYear();


// INITIAL DISPLAY

displayCart();