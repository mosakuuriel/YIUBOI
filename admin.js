/* =====================================
   YIUBOI ADMIN PANEL JAVASCRIPT
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "https://yiuboi.onrender.com/api";

    // ELEMENTS

    const adminLogin = document.getElementById("adminLogin");
    const adminDashboard = document.getElementById("adminDashboard");

    const loginForm = document.getElementById("adminLoginForm");
    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");

    const loginButton = document.getElementById("loginButton");
    const loginMessage = document.getElementById("loginMessage");

    const togglePassword = document.getElementById("togglePassword");
    const logoutButton = document.getElementById("logoutButton");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const adminSidebar = document.getElementById("adminSidebar");

    const adminName = document.getElementById("adminName");
    const settingsAdminName = document.getElementById("settingsAdminName");
    const settingsAdminEmail = document.getElementById("settingsAdminEmail");

    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    const dashboardSections = document.querySelectorAll(".dashboard-section");


    // STORAGE

    const TOKEN_KEY = "yiuboiAdminToken";
    const ADMIN_KEY = "yiuboiAdmin";


    // HELPERS

    function formatPrice(amount) {
        return "₦" + Number(amount || 0).toLocaleString("en-NG");
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function formatDate(date) {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    // SHOW LOGIN

    function showLogin(message = "") {

        adminLogin.hidden = false;
        adminDashboard.hidden = true;

        adminSidebar?.classList.remove("show");

        if (loginMessage) {
            loginMessage.textContent = message;
        }
    }


    // SHOW DASHBOARD

    function showDashboard(admin) {

        adminLogin.hidden = true;
        adminDashboard.hidden = false;

        const name = admin?.name || admin?.fullName || "Administrator";
        const email = admin?.email || "";

        if (adminName) adminName.textContent = name;
        if (settingsAdminName) settingsAdminName.textContent = name;
        if (settingsAdminEmail) settingsAdminEmail.textContent = email;

        openSection("overview");

        loadOrders();
    }


    // LOGIN MESSAGE

    function displayLoginMessage(message) {
        if (loginMessage) loginMessage.textContent = message;
    }


    // BUTTON LOADING

    function setLoginLoading(loading) {

        if (!loginButton) return;

        loginButton.disabled = loading;

        loginButton.innerHTML = loading
            ? 'Signing in <i class="fas fa-spinner fa-spin"></i>'
            : 'Login to Dashboard <i class="fas fa-arrow-right"></i>';
    }


    // ADMIN LOGIN

    loginForm?.addEventListener("submit", async event => {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            displayLoginMessage("Please enter your email and password.");
            return;
        }

        setLoginLoading(true);
        displayLoginMessage("");

        try {

            const response = await fetch(
                `${API_BASE}/auth/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            if (!data.token || !data.admin) {
                throw new Error("Invalid server response.");
            }

            localStorage.setItem(TOKEN_KEY, data.token);

            localStorage.setItem(
                ADMIN_KEY,
                JSON.stringify(data.admin)
            );

            showDashboard(data.admin);

            loginForm.reset();

        } catch (error) {

            displayLoginMessage(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Make sure the backend is running."
                    : error.message
            );

        } finally {
            setLoginLoading(false);
        }

    });


    // VERIFY ADMIN SESSION

    async function verifyAdminSession() {

        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            showLogin();
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE}/admin/dashboard`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Session expired.");
            }

            localStorage.setItem(
                ADMIN_KEY,
                JSON.stringify(data.admin)
            );

            showDashboard(data.admin);

        } catch (error) {

            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(ADMIN_KEY);

            showLogin(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server."
                    : ""
            );
        }
    }


    // PASSWORD VISIBILITY

    togglePassword?.addEventListener("click", () => {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        togglePassword.innerHTML = isPassword
            ? '<i class="fas fa-eye-slash"></i>'
            : '<i class="fas fa-eye"></i>';

    });


    // DASHBOARD NAVIGATION

    function openSection(sectionName) {

        dashboardSections.forEach(section => {
            section.classList.remove("active");
        });

        const selectedSection = document.getElementById(
            `${sectionName}Section`
        );

        if (selectedSection) {
            selectedSection.classList.add("active");
        }

        sidebarLinks.forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.section === sectionName
            );

        });

        const sectionTitles = {
            overview: "Dashboard Overview",
            products: "Products Management",
            orders: "Orders Management",
            customers: "Customers Management",
            payments: "Payments Management",
            settings: "Admin Settings"
        };

        const title = document.getElementById("dashboardTitle");

        if (title) {
            title.textContent =
                sectionTitles[sectionName] || "YIUBOI Admin";
        }

        adminSidebar?.classList.remove("show");

        if (sectionName === "orders" ||
            sectionName === "payments" ||
            sectionName === "overview") {
            loadOrders();
        }
    }


    // SIDEBAR LINKS

    sidebarLinks.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const section = link.dataset.section;

            if (section) openSection(section);

        });

    });


    // VIEW ALL LINKS

    document.querySelectorAll("[data-section]").forEach(link => {

        link.addEventListener("click", event => {

            if (link.classList.contains("sidebar-link")) return;

            event.preventDefault();

            openSection(link.dataset.section);

        });

    });


    // MOBILE SIDEBAR

    sidebarToggle?.addEventListener("click", () => {
        adminSidebar?.classList.toggle("show");
    });


    // LOGOUT

    logoutButton?.addEventListener("click", () => {

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_KEY);

        showLogin("You have logged out successfully.");

    });


    // =====================================
    // LOAD CUSTOMER ORDERS
    // =====================================

    async function loadOrders() {

        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) return;

        const ordersTable = document.getElementById("ordersTable");
        const recentOrders = document.getElementById("recentOrders");
        const paymentsTable = document.getElementById("paymentsTable");

        try {

            const response = await fetch(
                `${API_BASE}/order/admin/all`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to load orders.");
            }

            const orders = Array.isArray(result)
                ? result
                : result.orders || result.data || [];

            displayOrders(orders);

        } catch (error) {

            console.error("Order loading error:", error);

            const message = escapeHTML(error.message);

            if (ordersTable) {
                ordersTable.innerHTML =
                    `<tr><td colspan="6">${message}</td></tr>`;
            }

            if (recentOrders) {
                recentOrders.innerHTML =
                    `<tr><td colspan="5">${message}</td></tr>`;
            }

            if (paymentsTable) {
                paymentsTable.innerHTML =
                    `<tr><td colspan="6">${message}</td></tr>`;
            }

        }

    }


    // =====================================
    // DISPLAY ORDERS
    // =====================================

    function displayOrders(orders) {

        const ordersTable = document.getElementById("ordersTable");
        const recentOrders = document.getElementById("recentOrders");
        const paymentsTable = document.getElementById("paymentsTable");

        if (!ordersTable || !recentOrders || !paymentsTable) return;

        // SORT NEWEST FIRST

        orders.sort((a, b) =>
            new Date(b.createdAt || b.orderDate || 0) -
            new Date(a.createdAt || a.orderDate || 0)
        );


        // EMPTY ORDERS

        if (orders.length === 0) {

            ordersTable.innerHTML =
                '<tr><td colspan="6">No customer orders yet.</td></tr>';

            recentOrders.innerHTML =
                '<tr><td colspan="5">No recent orders.</td></tr>';

            paymentsTable.innerHTML =
                '<tr><td colspan="6">No payment records yet.</td></tr>';

            updateStatistics([]);
            return;
        }


        // ORDERS TABLE

        ordersTable.innerHTML = orders.map(order => {

            const customerName =
                order.delivery?.fullName ||
                order.user?.fullName ||
                "Customer";

            const orderNumber =
                order.orderNumber || order._id || "—";

            const paymentStatus =
                order.paymentStatus || "pending";

            const orderStatus =
                order.orderStatus || "pending";

            const products = (order.items || []).map(item =>
                `${escapeHTML(item.name)} × ${item.quantity}`
            ).join("<br>");

            return `
                <tr>
                    <td>
                        <strong>${escapeHTML(orderNumber)}</strong>
                        <small class="d-block">${products || "No products listed"}</small>
                    </td>

                    <td>
                        ${escapeHTML(customerName)}
                        <small class="d-block">${escapeHTML(order.delivery?.email || order.user?.email || "")}</small>
                        <small class="d-block">${escapeHTML(order.delivery?.phone || "")}</small>
                    </td>

                    <td>${formatDate(order.createdAt)}</td>

                    <td>${formatPrice(order.total)}</td>

                    <td>
                        <span class="badge ${paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}">
                            ${escapeHTML(paymentStatus.toUpperCase())}
                        </span>
                    </td>

                    <td>${escapeHTML(orderStatus.toUpperCase())}</td>
                </tr>
            `;

        }).join("");


        // RECENT ORDERS

        recentOrders.innerHTML = orders.slice(0, 5).map(order => {

            const customerName =
                order.delivery?.fullName ||
                order.user?.fullName ||
                "Customer";

            return `
                <tr>
                    <td>${escapeHTML(order.orderNumber || order._id)}</td>
                    <td>${escapeHTML(customerName)}</td>
                    <td>${formatDate(order.createdAt)}</td>
                    <td>${formatPrice(order.total)}</td>
                    <td>
                        <span class="badge ${order.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}">
                            ${escapeHTML((order.paymentStatus || "pending").toUpperCase())}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");


        // PAYMENT RECORDS

        paymentsTable.innerHTML = orders.map(order => {

            return `
                <tr>
                    <td>${escapeHTML(order.paymentReference || "Not provided")}</td>
                    <td>${escapeHTML(order.orderNumber || order._id)}</td>
                    <td>${formatPrice(order.total)}</td>
                    <td>${escapeHTML(order.paymentMethod || "—")}</td>
                    <td>
                        <span class="badge ${order.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}">
                            ${escapeHTML((order.paymentStatus || "pending").toUpperCase())}
                        </span>
                    </td>
                    <td>${formatDate(order.createdAt)}</td>
                </tr>
            `;

        }).join("");


        updateStatistics(orders);

    }


    // =====================================
    // DASHBOARD STATISTICS
    // =====================================

    function updateStatistics(orders) {

        const totalOrders = document.getElementById("totalOrders");
        const totalCustomers = document.getElementById("totalCustomers");
        const totalRevenue = document.getElementById("totalRevenue");

        if (totalOrders) {
            totalOrders.textContent = orders.length;
        }

        const customerEmails = new Set(
            orders.map(order =>
                order.user?.email ||
                order.delivery?.email
            ).filter(Boolean)
        );

        if (totalCustomers) {
            totalCustomers.textContent = customerEmails.size;
        }

        const revenue = orders
            .filter(order => order.paymentStatus === "paid")
            .reduce((total, order) => total + Number(order.total || 0), 0);

        if (totalRevenue) {
            totalRevenue.textContent = formatPrice(revenue);
        }

    }


    // INITIALIZE

    verifyAdminSession();

});