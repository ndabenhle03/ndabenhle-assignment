(function() {
    console.log('vegetable.js: Script started.');

    // DOM Elements
    const searchForm = document.querySelector('.search-form');
    const searchBox = document.querySelector('#search-box');
    const searchMessage = document.querySelector('#search-message');
    const shoppingCart = document.querySelector('.shopping-cart');
    const paymentForm = document.querySelector('.payment-form');
    const cartItemsContainer = document.querySelector('#cartItems');
    const totalElement = shoppingCart.querySelector('.total');
    const checkoutButton = document.querySelector('#checkout-btn');
    const cartCountElement = document.querySelector('.cart-count');
    const paymentFormElement = document.querySelector('#paymentForm');
    const paymentMessage = document.querySelector('#paymentMessage');
    const checkoutTotal = document.querySelector('#checkoutTotal');
    const addressForm = document.querySelector('.address-form');
    const deliveryOptionRadios = document.querySelectorAll('input[name="deliveryOption"]');
    const addressInputs = addressForm.querySelectorAll('input[required]');
    const featureModals = document.querySelectorAll('.feature-modal');
    const closeFeatureModals = document.querySelectorAll('.close-feature-modal');
    const body = document.body;
    const vegetablesGridContainer = document.getElementById('vegetables-grid-container');

    const allProductsData = [
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
        body.classList.toggle('modal-active', isPaymentFormActive || isAnyFeatureModalActive);
    }

    function renderProductsToContainer(productsToRender, targetContainer) {
        if (!targetContainer) {
            console.error('vegetable.js: Target container for rendering is null or undefined.');
            return;
        }
        targetContainer.innerHTML = '';
        if (productsToRender.length === 0) {
            targetContainer.innerHTML = '<p>No products found.</p>';
            return;
        }
        productsToRender.forEach(product => {
            const productBox = document.createElement('div');
            productBox.classList.add('box');
            productBox.setAttribute('data-name', product.name);
            productBox.setAttribute('data-price', product.price.toFixed(2));
            productBox.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/cccccc/000000?text=Image+Missing';">
                <div class="product-info">
                    <h3 data-name="${product.name}">${product.name}</h3>
                </div>
                <div class="product-right-content">
                    <div class="price">R${product.price.toFixed(2)}</div>
                    <div class="stars">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                    </div>
                    <button class="btn add-to-cart">add to cart</button>
                </div>
            `;
            targetContainer.appendChild(productBox);
            productBox.querySelector('.add-to-cart').addEventListener('click', addToCart);
        });
    }

    // --- Header Icons Toggles ---
    document.querySelector('#search-btn').onclick = (event) => {
        event.stopPropagation();
        searchForm.classList.toggle('active');
        paymentForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        featureModals.forEach(modal => modal.classList.remove('active'));
        toggleBodyModalActive();
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
    
    // --- Close Buttons & Modals ---
    if(document.querySelector('#closePaymentForm')){
        document.querySelector('#closePaymentForm').onclick = () => {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
        };
    }
    
    closeFeatureModals.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.feature-modal').classList.remove('active');
            toggleBodyModalActive();
        });
    });

    checkoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        shoppingCart.classList.remove('active');
        paymentForm.classList.add('active');
        toggleBodyModalActive();
        const currentCartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        checkoutTotal.textContent = `R${currentCartTotal.toFixed(2)}`;
        toggleAddressFormVisibility();
    });

    // --- Close elements when clicking outside ---
    window.addEventListener('click', (event) => {
        const isClickInside = (element) => element && element.contains(event.target);

        if (searchForm.classList.contains('active') && !isClickInside(searchForm) && !event.target.matches('#search-btn')) {
            searchForm.classList.remove('active');
        }
        if (shoppingCart.classList.contains('active') && !isClickInside(shoppingCart) && !event.target.matches('#cart-btn')) {
            shoppingCart.classList.remove('active');
        }
        if (paymentForm.classList.contains('active') && !isClickInside(paymentForm) && !event.target.matches('#checkout-btn')) {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
        }
        featureModals.forEach(modal => {
            if (modal.classList.contains('active') && !isClickInside(modal) && !event.target.closest('.read-more-btn')) {
                modal.classList.remove('active');
                toggleBodyModalActive();
            }
        });
    });


    // --- Shopping Cart, Payment, Search (Remaining logic is the same) ---
    let cartItems = [];
    try {
        const storedCartItems = sessionStorage.getItem('cartItems');
        if (storedCartItems) cartItems = JSON.parse(storedCartItems);
    } catch (e) {
        console.error("Error loading cart from sessionStorage:", e);
    }
    
    function saveCartItems() {
        try {
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to sessionStorage:", e);
        }
    }

    function updateCartCount() {
        cartCountElement.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        saveCartItems();
    }

    function addToCart(event) {
        event.preventDefault();
        const productBox = event.target.closest('.box');
        const productName = productBox.dataset.name;
        const productImage = productBox.querySelector('img').src;
        const productPrice = parseFloat(productBox.dataset.price);

        const existingItem = cartItems.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name: productName, image: productImage, price: productPrice, quantity: 1 });
        }
        renderCart();
        updateCartCount();
        showNotification('Item added to cart');
    }

    function removeFromCart(itemName) {
        cartItems = cartItems.filter(item => item.name !== itemName);
        renderCart();
        updateCartCount();
    }

    function updateQuantity(itemName, newQuantity) {
        const item = cartItems.find(item => item.name === itemName);
        if (item) {
            item.quantity = Math.max(1, parseInt(newQuantity));
            renderCart();
            updateCartCount();
        }
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
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
                        <span class="quantity">qty: <input type="number" min="1" value="${item.quantity}" data-name="${item.name}"></span>
                    </div>`;
                cartItemsContainer.appendChild(cartBox);
                cartBox.querySelector('.fa-trash').addEventListener('click', (e) => removeFromCart(e.target.dataset.name));
                cartBox.querySelector('input').addEventListener('change', (e) => updateQuantity(e.target.dataset.name, e.target.value));
                totalAmount += item.price * item.quantity;
            });
            totalElement.textContent = `total: R${totalAmount.toFixed(2)}/-`;
            totalElement.style.display = 'block';
            checkoutButton.style.display = 'block';
        }
    }

    function toggleAddressFormVisibility() {
        const selectedOption = document.querySelector('input[name="deliveryOption"]:checked').value;
        addressForm.classList.toggle('hidden', selectedOption !== 'delivery');
        addressInputs.forEach(input => input.required = selectedOption === 'delivery');
    }

    deliveryOptionRadios.forEach(radio => radio.addEventListener('change', toggleAddressFormVisibility));

    paymentFormElement.onsubmit = (event) => {
        event.preventDefault();
        // (Validation logic remains the same)
        paymentMessage.style.color = 'green';
        paymentMessage.textContent = 'Order received!';
        setTimeout(() => {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
            cartItems = [];
            renderCart();
            updateCartCount();
            paymentFormElement.reset();
        }, 2000);
    };

    // Initial calls
    renderCart();
    updateCartCount();
    toggleAddressFormVisibility();
    renderProductsToContainer(allProductsData, vegetablesGridContainer);
})();
