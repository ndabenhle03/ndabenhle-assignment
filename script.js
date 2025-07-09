document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchForm = document.querySelector('.search-form');
    const searchBox = document.querySelector('#search-box');
    const searchMessage = document.querySelector('#search-message');
    const shoppingCart = document.querySelector('.shopping-cart');
    const paymentForm = document.querySelector('.payment-form');
    const cartItemsContainer = document.querySelector('#cartItems');
    const totalElement = shoppingCart.querySelector('.total');
    const checkoutButton = shoppingCart.querySelector('#checkout-btn');
    const cartCountElement = document.querySelector('.cart-count');
    const paymentFormElement = document.querySelector('#paymentForm');
    const paymentMessage = document.querySelector('#paymentMessage');
    const checkoutTotal = document.querySelector('#checkoutTotal');
    const addressForm = document.querySelector('.address-form');
    const deliveryOptionRadios = document.querySelectorAll('input[name="deliveryOption"]'); 
    const addressInputs = addressForm.querySelectorAll('input[required]'); 
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const featureModals = document.querySelectorAll('.feature-modal');
    const closeFeatureModals = document.querySelectorAll('.close-feature-modal');
    const body = document.body;
    const editProfileBtn = document.querySelector('#edit-profile-btn');
    const editProfileForm = document.querySelector('#editProfileForm');
    const editProfileModal = document.querySelector('#edit-profile-modal');
    const editProfileMessage = document.querySelector('#edit-profile-message');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    const orderDetailsModal = document.querySelector('#order-details-modal');
    const orderDetailsContent = document.querySelector('#order-details-content');
    const logoutBtn = document.querySelector('#logout-btn');
    
    // --- Map Tracking Elements ---
    const trackOrderBtn = document.querySelector('#track-order-btn');
    const orderTrackingModal = document.querySelector('#order-tracking-modal');
    const etaTimeElement = document.querySelector('#eta-time');
    const etaDisplay = document.querySelector('#eta-display');
    
    let productSwiperInstance;
    let reviewSwiperInstance;
    
    // --- Map Tracking Variables ---
    let trackingInterval;
    let map;

    // All product data
    const allProductsData = [
        { name: "fresh mango", image: "mango.jpg", price: 100.00, category: "fruits" },
        { name: "fresh onion", image: "onions.jpg", price: 10.00, category: "vegetables" },
        { name: "fresh green beans", image: "green beans.jpg", price: 150.00, category: "vegetables" },
        { name: "fresh cabbage", image: "cabbage.jpg", price: 20.00, category: "vegetables" },
        { name: "fresh butternut", image: "butternut.jpg", price: 25.00, category: "vegetables" },
        { name: "fresh carrots", image: "carrots.png", price: 10.00, category: "vegetables" },
        { name: "fresh potato", image: "potato.png", price: 9.00, category: "vegetables" },
        { name: "fresh corn", image: "corn.png", price: 5.00, category: "vegetables" },
        { name: "fresh broccoli", image: "broccoli.jpg", price: 10.00, category: "vegetables" },
        { name: "fresh spinach", image: "spinach.jpg", price: 10.00, category: "vegetables" },
        { name: "fresh beetroot", image: "beetroot.jpg", price: 13.00, category: "vegetables" },
        { name: "fresh greenpepper", image: "greenpepper.jpg", price: 150.00, category: "vegetables" }
    ];

    // Mock order data for "View Details"
    const orderData = {
        "GNT-12301": {
            orderNumber: "GNT-12301",
            status: "Delivered",
            date: "2025-06-20",
            items: [
                { name: "Fresh Onion", quantity: 5, price: 50.00, image: "onions.jpg" },
                { name: "Fresh Potato", quantity: 3, price: 27.00, image: "potato.png" }
            ],
            total: 77.00,
            deliveryOption: "Delivery",
            address: "123 UMP Campus, Mbombela, Mpumalanga, 1200",
            paymentMethod: "Credit Card"
        },
        "GNT-12290": {
            orderNumber: "GNT-12290",
            status: "Collected",
            date: "2025-06-15",
            items: [
                { name: "Fresh Carrots", quantity: 2, price: 20.00, image: "carrots.png" }
            ],
            total: 20.00,
            deliveryOption: "Collection",
            address: "UMP Agriculture Department, Main Campus, Mbombela",
            paymentMethod: "Credit Card"
        },
        "GNT-12258": {
            orderNumber: "GNT-12258",
            status: "Delivered",
            date: "2025-06-10",
            items: [
                { name: "Fresh Spinach", quantity: 2, price: 20.00, image: "spinach.jpg" }
            ],
            total: 20.00,
            deliveryOption: "Delivery",
            address: "456 UMP Campus, Mbombela, Mpumalanga, 1200",
            paymentMethod: "EFT"
        }
    };

    // Notification function for adding to cart
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '80px'; // Below header
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.background = 'rgba(40, 167, 69, 0.9)'; // Green background
        notification.style.color = '#fff';
        notification.style.fontFamily = 'Poppins, sans-serif';
        notification.style.fontSize = '1rem';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-in-out';

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);

        // Fade out and remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }

    function toggleBodyModalActive() {
        const isPaymentFormActive = paymentForm.classList.contains('active');
        const isAnyFeatureModalActive = Array.from(featureModals).some(modal => modal.classList.contains('active'));

        if (isPaymentFormActive || isAnyFeatureModalActive) {
            body.classList.add('modal-active');
        } else {
            body.classList.remove('modal-active');
        }
    }

    const showAllProductsInSlider = () => {
        document.querySelectorAll('.products .product-slider .box').forEach(box => {
            box.style.display = 'block';
            box.style.border = ''; 
            box.style.boxShadow = '';
        });
        if (productSwiperInstance) {
            productSwiperInstance.params.loop = true; 
            productSwiperInstance.update(); 
            productSwiperInstance.slideTo(0, 0); 
        }
        document.getElementById('products').classList.remove('hidden');
    };

    // --- Header Icons Toggles ---
    document.querySelector('#search-btn').onclick = (event) => {
        event.stopPropagation(); 
        searchForm.classList.toggle('active');
        paymentForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        featureModals.forEach(modal => modal.classList.remove('active'));
        toggleBodyModalActive(); 
        
        searchMessage.textContent = '';
        searchBox.value = '';
        showAllProductsInSlider(); 
    };

    document.querySelector('#cart-btn').onclick = (event) => {
        event.stopPropagation(); 
        shoppingCart.classList.toggle('active');
        searchForm.classList.remove('active');
        paymentForm.classList.remove('active');
        featureModals.forEach(modal => modal.classList.remove('active')); 
        toggleBodyModalActive(); 
        renderCart();
    };

    document.querySelector('#menu-btn').onclick = (event) => {
        event.stopPropagation();
        document.querySelector('.navbar').classList.toggle('active');
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        paymentForm.classList.remove('active');
        featureModals.forEach(modal => modal.classList.remove('active'));
        toggleBodyModalActive();
    };

    // --- Close Buttons ---
    if(document.querySelector('#closePaymentForm')) {
        document.querySelector('#closePaymentForm').onclick = () => {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
            paymentMessage.textContent = '';
            checkoutTotal.textContent = 'R0.00';
        };
    }

    // --- Feature Modals Logic ---
    readMoreBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const targetModalId = event.target.dataset.modalTarget;
            const targetModal = document.getElementById(targetModalId);

            if (targetModal) {
                searchForm.classList.remove('active');
                shoppingCart.classList.remove('active');
                paymentForm.classList.remove('active');

                if (targetModal.classList.contains('feature-modal')) {
                    featureModals.forEach(modal => modal.classList.remove('active'));
                    targetModal.classList.add('active');
                    toggleBodyModalActive();
                }
            }
        });
    });

    closeFeatureModals.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.feature-modal');
            modal.classList.remove('active');
            toggleBodyModalActive();
            
            // If closing the tracking modal, clean up the map
            if (modal.id === 'order-tracking-modal') {
                if (trackingInterval) clearInterval(trackingInterval);
                if (map) {
                    map.remove();
                    map = null;
                }
            }
        });
    });

    // --- Edit Profile Button ---
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            searchForm.classList.remove('active');
            shoppingCart.classList.remove('active');
            paymentForm.classList.remove('active');
            featureModals.forEach(modal => modal.classList.remove('active'));
            editProfileModal.classList.add('active');
            toggleBodyModalActive();

            // Populate form with current profile data
            document.querySelector('#edit-username').value = document.querySelector('#profile-username').textContent;
            document.querySelector('#edit-phone').value = document.querySelector('#profile-phone').textContent;
            document.querySelector('#edit-email').value = document.querySelector('#profile-email').textContent;
        });
    }

    // --- Edit Profile Form Submission ---
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.querySelector('#edit-username').value.trim();
            const phone = document.querySelector('#edit-phone').value.trim();
            const email = document.querySelector('#edit-email').value.trim();

            // Basic validation
            if (!username) {
                editProfileMessage.style.color = 'red';
                editProfileMessage.textContent = 'Please enter a username.';
                return;
            }
            if (!/^\+?\d{10,12}$/.test(phone)) {
                editProfileMessage.style.color = 'red';
                editProfileMessage.textContent = 'Please enter a valid phone number.';
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                editProfileMessage.style.color = 'red';
                editProfileMessage.textContent = 'Please enter a valid email address.';
                return;
            }

            // Update profile information
            document.querySelector('#profile-username').textContent = username;
            document.querySelector('#profile-phone').textContent = phone;
            document.querySelector('#profile-email').textContent = email;

            // Clear user details from localStorage to require re-entry on next login
            localStorage.removeItem('userDetails');

            editProfileMessage.style.color = 'green';
            editProfileMessage.textContent = 'Profile updated successfully! Please log in again.';
            setTimeout(() => {
                editProfileModal.classList.remove('active');
                toggleBodyModalActive();
                editProfileForm.reset();
                editProfileMessage.textContent = '';
                window.location.href = 'cover.html';
            }, 2000);
        });
    }

    // --- Logout Button ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            // Clear cart items but preserve userDetails in localStorage
            sessionStorage.removeItem('cartItems');
            window.location.href = 'cover.html';
        });
    }

    // --- View Details Buttons ---
    viewDetailsBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const orderId = button.dataset.orderId;
            const order = orderData[orderId];

            if (order) {
                orderDetailsContent.innerHTML = `
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <h4>Items:</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <p>${item.name} (x${item.quantity})</p>
                            <p>R${item.price.toFixed(2)}</p>
                        </div>
                    `).join('')}
                    <p><strong>Total:</strong> R${order.total.toFixed(2)}</p>
                    <p><strong>Delivery Option:</strong> ${order.deliveryOption}</p>
                    <p><strong>Address:</strong> ${order.address}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                `;
                searchForm.classList.remove('active');
                shoppingCart.classList.remove('active');
                paymentForm.classList.remove('active');
                featureModals.forEach(modal => modal.classList.remove('active'));
                orderDetailsModal.classList.add('active');
                toggleBodyModalActive();
            }
        });
    });

    // --- Real Map API Order Tracking Logic ---
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            featureModals.forEach(modal => modal.classList.remove('active'));
            orderTrackingModal.classList.add('active');
            toggleBodyModalActive();
            
            // Delay map initialization slightly to ensure the modal is visible
            setTimeout(startTrackingSimulation, 100);
        });
    }

    function startTrackingSimulation() {
        if (trackingInterval) clearInterval(trackingInterval);
        if (map) {
            map.remove();
            map = null;
        }

        // Coordinates for the route (Start -> University of Mpumalanga)
        const startCoords = [-25.47, 30.96];
        const endCoords = [-25.4757, 30.9835]; 

        // Initialize the map
        map = L.map('map-container').setView(startCoords, 15);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create a custom icon for the driver
        const driverLeafletIcon = L.divIcon({
            className: 'driver-leaflet-icon',
            html: '<i class="fas fa-truck"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        // Add markers for start, end, and driver
        const driverMarker = L.marker(startCoords, { icon: driverLeafletIcon }).addTo(map);
        L.marker(endCoords).addTo(map).bindPopup("Your Destination").openPopup();

        // Draw the route line
        const route = L.polyline([startCoords, endCoords], {color: 'var(--orange)'}).addTo(map);
        map.fitBounds(route.getBounds().pad(0.1));

        let totalMinutes = 15;
        let journeyDuration = 30; // 30 seconds for the simulation
        let step = 0;

        etaTimeElement.textContent = totalMinutes;
        etaDisplay.innerHTML = `<p>Your driver is on the way!</p><p>Estimated Arrival: <span id="eta-time">${totalMinutes}</span> minutes</p>`;

        trackingInterval = setInterval(() => {
            step++;
            const progress = step / journeyDuration;

            if (progress <= 1) {
                // Interpolate position
                const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
                const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;
                driverMarker.setLatLng([lat, lng]);

                // Update ETA
                const remainingMinutes = Math.round(totalMinutes * (1 - progress));
                etaTimeElement.textContent = Math.max(0, remainingMinutes);
            } else {
                clearInterval(trackingInterval);
                etaDisplay.innerHTML = `<p style="color: green; font-weight: bold;">Your order has arrived!</p>`;
                driverMarker.setLatLng(endCoords);
            }
        }, 1000); // Update every second
    }


    // --- Checkout Button Event Listener ---
    if(checkoutButton) {
        checkoutButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation(); 
    
            shoppingCart.classList.remove('active');
            searchForm.classList.remove('active');
            featureModals.forEach(modal => modal.classList.remove('active'));
    
            paymentForm.classList.add('active');
            toggleBodyModalActive();
            
            const currentCartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            checkoutTotal.textContent = `R${currentCartTotal.toFixed(2)}`;
    
            toggleAddressFormVisibility();
        });
    }

    // --- Close elements when clicking outside ---
    window.addEventListener('click', (event) => {
        const isClickInside = (element) => element && element.contains(event.target);

        if (searchForm.classList.contains('active') && !isClickInside(searchForm) && !event.target.matches('#search-btn')) {
            searchForm.classList.remove('active');
            searchMessage.textContent = '';
            searchBox.value = '';
            showAllProductsInSlider();
            toggleBodyModalActive();
        }
        if (shoppingCart.classList.contains('active') && !isClickInside(shoppingCart) && !event.target.matches('#cart-btn')) {
            shoppingCart.classList.remove('active');
            toggleBodyModalActive();
        }
        if (paymentForm.classList.contains('active') && !isClickInside(paymentForm) && !event.target.matches('#checkout-btn')) {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
            paymentMessage.textContent = '';
            checkoutTotal.textContent = 'R0.00';
        }
        featureModals.forEach(modal => {
             if (modal.classList.contains('active') && !isClickInside(modal) && !event.target.closest('.read-more-btn') && !event.target.matches('#edit-profile-btn') && !event.target.closest('.view-details-btn') && !event.target.matches('#track-order-btn')) {
                modal.classList.remove('active');
                toggleBodyModalActive();
                if (modal.id === 'order-tracking-modal') {
                    if (trackingInterval) clearInterval(trackingInterval);
                    if (map) {
                        map.remove();
                        map = null;
                    }
                }
            }
        });
    });

    // --- Shopping Cart Functionality ---
    let cartItems = [];

    try {
        const storedCartItems = sessionStorage.getItem('cartItems');
        if (storedCartItems) {
            cartItems = JSON.parse(storedCartItems);
        }
    } catch (e) {
        console.error("Error loading cart from sessionStorage:", e);
        cartItems = []; 
    }

    function saveCartItems() {
        try {
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to sessionStorage:", e);
        }
    }

    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
        saveCartItems();
    }

    function addToCart(event) {
        event.preventDefault();
        const productBox = event.target.closest('.box');
        const productName = productBox.dataset.name;
        const productImage = productBox.querySelector('img').src;
        const productPrice = parseFloat(productBox.dataset.price);

        if (!productName || !productImage || isNaN(productPrice)) {
            console.error('Invalid product data for:', productBox);
            return;
        }

        const existingItemIndex = cartItems.findIndex(item => item.name === productName);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity++;
        } else {
            cartItems.push({
                name: productName,
                image: productImage,
                price: productPrice,
                quantity: 1
            });
        }
        renderCart();
        updateCartCount();
        showNotification('Item added to cart');
    }

    function removeFromCart(itemName) {
        const itemIndex = cartItems.findIndex(item => item.name === itemName);
        if (itemIndex > -1) {
            cartItems.splice(itemIndex, 1);
        }
        renderCart();
        updateCartCount();
    }

    function updateQuantity(itemName, newQuantity) {
        const itemIndex = cartItems.findIndex(item => item.name === itemName);
        if (itemIndex > -1) {
            const quantity = Math.max(1, Math.min(100, parseInt(newQuantity)));
            cartItems[itemIndex].quantity = quantity;
            renderCart();
            updateCartCount();
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--light-color); font-size: 1.6rem;">Your cart is empty.</p>';
            totalElement.style.display = 'none';
            checkoutButton.style.display = 'none';
        } else {
            cartItems.forEach(item => {
                const cartBox = document.createElement('div');
                cartBox.classList.add('box');
                cartBox.innerHTML = `
                    <i class="fas fa-trash" data-name="${item.name}"></i>
                    <img src="${item.image}" alt="${item.name}">
                    <div class="content">
                        <h3>${item.name}</h3>
                        <span class="price">R${(item.price * item.quantity).toFixed(2)}/-</span>
                        <span class="quantity">qty:
                            <input type="number" min="1" max="100" value="${item.quantity}" data-name="${item.name}">
                        </span>
                    </div>
                `;
                cartItemsContainer.appendChild(cartBox);
                cartBox.querySelector('.fa-trash').addEventListener('click', (event) => {
                    event.stopPropagation();
                    removeFromCart(event.target.dataset.name);
                });
                cartBox.querySelector('input[type="number"]').addEventListener('change', (event) => {
                    event.stopPropagation();
                    updateQuantity(event.target.dataset.name, event.target.value);
                });
                totalAmount += item.price * item.quantity;
            });
            totalElement.textContent = `total: R${totalAmount.toFixed(2)}/-`;
            totalElement.style.display = 'block';
            checkoutButton.style.display = 'block';
        }
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function toggleAddressFormVisibility() {
        if (!addressForm) return;
        const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;
        if (selectedOption === 'delivery') {
            addressForm.classList.remove('hidden');
            addressInputs.forEach(input => input.setAttribute('required', ''));
        } else {
            addressForm.classList.add('hidden');
            addressInputs.forEach(input => input.removeAttribute('required'));
            addressInputs.forEach(input => input.value = '');
        }
    }

    if (deliveryOptionRadios.length > 0) {
        deliveryOptionRadios.forEach(radio => {
            radio.addEventListener('change', toggleAddressFormVisibility);
        });
    }

    if (paymentFormElement) {
        paymentFormElement.onsubmit = (event) => {
            event.preventDefault();
            const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
            const cardholderName = paymentFormElement.querySelector('input[placeholder="Cardholder Name"]').value.trim();
            const cardNumber = paymentFormElement.querySelector('.card-number').value.trim();
            const expiry = paymentFormElement.querySelector('.card-details input:nth-child(1)').value.trim();
            const cvv = paymentFormElement.querySelector('.card-details input:nth-child(2)').value.trim();
            const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            if (!cardholderName) {
                paymentMessage.style.color = 'red';
                paymentMessage.textContent = 'Please enter cardholder name.';
                return;
            }

            if (deliveryOption === 'delivery') {
                for (let input of addressInputs) {
                    if (!input.value.trim()) {
                        paymentMessage.style.color = 'red';
                        paymentMessage.textContent = `Please fill in all address fields for delivery. Missing: ${input.placeholder}`;
                        return;
                    }
                }
            }

            if (cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
                paymentMessage.style.color = 'red';
                paymentMessage.textContent = 'Invalid card number. Must be 16 digits.';
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiry) || !isValidExpiryDate(expiry)) {
                paymentMessage.style.color = 'red';
                paymentMessage.textContent = 'Invalid expiry date. Use MM/YY format and a future date.';
                return;
            }

            if (!/^\d{3}$/.test(cvv)) {
                paymentMessage.style.color = 'red';
                paymentMessage.textContent = 'Invalid CVV. Must be 3 digits.';
                return;
            }

            // Paystack Integration
            const user = auth.currentUser;
            const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            let handler = PaystackPop.setup({
                key: 'YOUR_TEST_PUBLIC_KEY', // Replace with your key
                email: user.email, // Get the logged-in user's email
                amount: cartTotal * 100, // Amount in kobo (cents)
                ref: 'GNT' + Math.floor((Math.random() * 1000000000) + 1), // Generate a unique reference
                onClose: function(){
                    alert('Payment window closed. Payment not completed.');
                },
                callback: function(response){
                    // This function is called after a successful payment
                    let message = 'Payment complete! Reference: ' + response.reference;
                    alert(message);
                    // NOW, you create the order in your Firestore database!
                    createOrderInDatabase();

                    paymentMessage.style.color = 'green';
                    paymentMessage.textContent = `Order has been received! Total paid: R${totalAmount.toFixed(2)}`;
                    setTimeout(() => {
                        paymentForm.classList.remove('active');
                        toggleBodyModalActive(); 
                        cartItems = [];
                        renderCart();
                        updateCartCount();
                        paymentFormElement.reset();
                        paymentMessage.textContent = '';
                        checkoutTotal.textContent = 'R0.00';
                        document.querySelector('input[name="deliveryOption"][value="delivery"]').checked = true;
                        toggleAddressFormVisibility();
                    }, 2000);
                }
            });
            handler.openIframe();
        };
    }

    function isValidExpiryDate(expiry) {
        const [month, year] = expiry.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100; 
        const currentMonth = new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            return false;
        }

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }
        return true;
    }

    if(searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const searchTerm = searchBox.value.toLowerCase().trim();
            const productBoxes = document.querySelectorAll('.products .product-slider .box');
            let productFound = false;
            let firstMatch = null;
    
            searchMessage.textContent = '';
    
            if (searchTerm === '') {
                searchMessage.style.color = 'orange';
                searchMessage.textContent = 'Please enter a product name to search.';
                showAllProductsInSlider(); 
                return;
            }
    
            productBoxes.forEach(box => {
                const productName = box.dataset.name ? box.dataset.name.toLowerCase() : '';
                if (productName.includes(searchTerm)) {
                    box.style.display = 'block'; 
                    productFound = true;
                    if (!firstMatch) {
                        firstMatch = box;
                    }
                } else {
                    box.style.display = 'none'; 
                }
            });
    
            if (productSwiperInstance) {
                productSwiperInstance.params.loop = false;
                productSwiperInstance.update(); 
            }
    
            if (productFound) {
                if (firstMatch) {
                    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
                    firstMatch.style.border = '2px solid var(--orange)';
                    firstMatch.style.boxShadow = '0 0 15px rgba(255, 120, 0, 0.5)';
                    setTimeout(() => {
                        firstMatch.style.border = '';
                        firstMatch.style.boxShadow = '';
                    }, 3000); 
                }
            } else {
                searchMessage.style.color = 'red';
                searchMessage.textContent = 'Item not found!';
            }
    
            searchBox.value = '';
        });
    }

    // Star rating interaction for review form on profile page
    const reviewStars = document.querySelectorAll('.review-submission-section .review-stars i');
    if (reviewStars.length > 0) {
        reviewStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const value = this.dataset.value;
                reviewStars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
                for (let i = 0; i < value; i++) {
                    reviewStars[i].classList.remove('far');
                    reviewStars[i].classList.add('fas');
                }
            });
        });
    }

    // Handle Review Form Submission
    const reviewForm = document.querySelector('#reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const reviewText = this.querySelector('textarea').value;
            if (reviewText.trim().length > 0) {
                this.innerHTML = `<p style="font-size: 1.6rem; color: green; text-align: center;">Thank you for your review!</p>`;
            }
        });
    }

    setTimeout(() => {
        if (typeof Swiper !== 'undefined') {
            if(document.querySelector(".product-slider")){
                productSwiperInstance = new Swiper(".product-slider", {
                    loop: true,
                    spaceBetween: 20,
                    autoplay: {
                        delay: 7500,
                        disableOnInteraction: false,
                    },
                    centeredSlides: true,
                    breakpoints: {
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1020: { slidesPerView: 3 },
                    },
                });
            }

            if(document.querySelector(".review-slider")){
                reviewSwiperInstance = new Swiper(".review-slider", {
                    loop: true,
                    spaceBetween: 20,
                    autoplay: {
                        delay: 7500,
                        disableOnInteraction: false,
                    },
                    centeredSlides: true,
                    breakpoints: {
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1020: { slidesPerView: 3 },
                    },
                });
            }
        }
    }, 0); 

    // Initial function calls on page load
    renderCart();
    updateCartCount();
    if(deliveryOptionRadios.length > 0){
        toggleAddressFormVisibility();
    }
});

// In script.js - Example for handling login on the cover page
const welcomeForm = document.querySelector('#welcome-form');
if (welcomeForm) {
    welcomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#welcome-email').value;
        const password = "a_default_or_generated_password"; // For a full app, you'd have a password field

        // This is a simplified example. We'll try to sign the user in.
        // If they don't exist, we'll create an account for them.
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // User logged in
            window.location.href = 'index.html';
          })
          .catch((error) => {
            if (error.code === 'auth/user-not-found') {
              // Create a new account
              auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                   // New user created. Now save their info to Firestore.
                   const user = userCredential.user;
                   db.collection('users').doc(user.uid).set({
                       name: document.querySelector('#welcome-username').value,
                       phone: document.querySelector('#welcome-phone').value,
                       email: user.email
                   }).then(() => {
                       window.location.href = 'index.html';
                   });
                })
                .catch((createError) => {
                   console.error("Error creating user:", createError);
                });
            }
          });
    });
}

// To check if a user is logged in on any page
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    // You can now fetch their data from Firestore and update the profile page.
    console.log("User is logged in:", user.uid);
  } else {
    // User is signed out.
    // If they are not on the cover page, redirect them there.
    if (window.location.pathname !== '/cover.html') {
      // window.location.href = 'cover.html'; // This line is commented out in the original, keeping it that way
    }
  }
});

// Example of what to do after a successful payment
function createOrderInDatabase() {
  const user = auth.currentUser;
  if (user) {
    db.collection('orders').add({
      userId: user.uid,
      items: cartItems, // Your existing cartItems array
      total: parseFloat(totalElement.textContent.replace('total: R', '')),
      status: 'Processing',
      deliveryOption: document.querySelector('input[name="deliveryOption"]:checked').value,
      address: '123 Main St...', // Get this from the form (this would need to be updated with actual form values)
      orderDate: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      console.log("Order saved successfully!");
      // Clear the cart, show success message, etc.
    });
  }
}

// Logic for displaying order history on profile.html
// This assumes 'user' and 'db' (Firestore instance) are available globally or passed correctly.
// This block appears to be a separate, self-contained snippet, not within a DOMContentLoaded.
// It should ideally be part of the DOMContentLoaded for profile.html specific elements.
// Re-integrating it within a check for profile.html path:
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...

    if (auth.currentUser && window.location.pathname.includes('profile.html')) {
        const orderHistoryContainer = document.querySelector('.order-section:nth-of-type(2)'); // The "Order History" container
        if (orderHistoryContainer) { // Check if the container exists
            orderHistoryContainer.innerHTML = '<h2>Order History</h2>'; // Clear static content

            db.collection('orders').where('userId', '==', auth.currentUser.uid).orderBy('orderDate', 'desc').get().then(snapshot => {
                if (snapshot.empty) {
                    orderHistoryContainer.innerHTML += '<p>You have no past orders.</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const order = doc.data();
                    let trackButtonHTML = '';
                    // The condition for showing track button is based on delivery and 'Processing' status
                    if (order.deliveryOption === 'delivery' && order.status === 'Processing') {
                        trackButtonHTML = `<button class="btn track-order-btn" data-order-id="${doc.id}">Track Order</button>`;
                    }
                    
                    const orderCardHTML = `
                        <div class="order-card">
                            <p><strong>Order Number:</strong> ${doc.id}</p>
                            <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                            <p><strong>Date:</strong> ${order.orderDate ? new Date(order.orderDate.toDate()).toLocaleDateString() : 'N/A'}</p>
                            <h4>Items:</h4>
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" alt="${item.name}">
                                    <p>${item.name} (x${item.quantity})</p>
                                    <p>R${item.price.toFixed(2)}</p>
                                </div>
                            `).join('')}
                            <div class="order-footer">
                                <p>Total: R${order.total.toFixed(2)}</p>
                                ${trackButtonHTML}
                            </div>
                        </div>
                    `;
                    orderHistoryContainer.innerHTML += orderCardHTML;
                });

                // Add event listeners for dynamically created track order buttons
                document.querySelectorAll('.track-order-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const orderId = event.target.dataset.orderId;
                        // Assuming you have your order tracking modal and map setup
                        // This will trigger the map tracking simulation or real-time update
                        // For real-time updates, you'd listen to the Firestore document.
                        // For this example, we'll just open the modal.
                        featureModals.forEach(modal => modal.classList.remove('active'));
                        orderTrackingModal.classList.add('active');
                        toggleBodyModalActive();
                        setTimeout(() => startRealTimeTracking(orderId), 100);
                    });
                });
            }).catch(error => {
                console.error("Error fetching order history:", error);
                orderHistoryContainer.innerHTML += '<p>Error loading order history.</p>';
            });
        }
    }

    // Real-time tracking function (would replace or augment startTrackingSimulation for real data)
    function startRealTimeTracking(orderId) {
        if (trackingInterval) clearInterval(trackingInterval);
        if (map) {
            map.remove();
            map = null;
        }

        const orderDocRef = db.collection('orders').doc(orderId);
        
        // Coordinates for the route (Start -> University of Mpumalanga, mock destination)
        const startCoords = [-25.47, 30.96]; // Mock driver start
        const endCoords = [-25.4757, 30.9835]; // Mock delivery destination (UMP)

        map = L.map('map-container').setView(startCoords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const driverLeafletIcon = L.divIcon({
            className: 'driver-leaflet-icon',
            html: '<i class="fas fa-truck"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        let driverMarker = L.marker(startCoords, { icon: driverLeafletIcon }).addTo(map);
        L.marker(endCoords).addTo(map).bindPopup("Your Destination").openPopup();
        L.polyline([startCoords, endCoords], {color: 'var(--orange)'}).addTo(map);

        // This onSnapshot function is real-time!
        orderDocRef.onSnapshot(doc => {
            const orderData = doc.data();
            const driverLocation = orderData.driverLocation; // e.g., { lat: -25.47, lng: 30.96 }

            if (driverLocation && driverMarker) {
                driverMarker.setLatLng([driverLocation.lat, driverLocation.lng]);
            }

            // You can also update ETA here if your backend provides it
            // For now, let's just use a simplified mock ETA based on a pre-defined time
            if (orderData.status === 'Delivered') {
                etaDisplay.innerHTML = `<p style="color: green; font-weight: bold;">Your order has arrived!</p>`;
                if (trackingInterval) clearInterval(trackingInterval);
            } else {
                // Mock ETA based on how far the driver *would* be if real updates were happening
                // This is a placeholder. A real system would calculate ETA based on actual speed/distance.
                const mockDistanceRemaining = L.latLng(driverMarker.getLatLng()).distanceTo(L.latLng(endCoords));
                const mockSpeedMetersPerSecond = 5; // e.g., 18 km/h
                const mockTimeRemainingSeconds = mockDistanceRemaining / mockSpeedMetersPerSecond;
                const mockTimeRemainingMinutes = Math.round(mockTimeRemainingSeconds / 60);

                etaTimeElement.textContent = Math.max(0, mockTimeRemainingMinutes);
                etaDisplay.innerHTML = `<p>Your driver is on the way!</p><p>Estimated Arrival: <span id="eta-time">${Math.max(0, mockTimeRemainingMinutes)}</span> minutes</p>`;
            }
        }, error => {
            console.error("Error real-time tracking order:", error);
            etaDisplay.innerHTML = `<p style="color: red;">Error tracking order.</p>`;
        });
    }
});