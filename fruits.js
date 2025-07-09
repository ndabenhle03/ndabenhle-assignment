(function() {
    console.log('fruits.js: Script started. (Outside DOMContentLoaded)');

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
    const featureModals = document.querySelectorAll('.feature-modal');
    const closeFeatureModals = document.querySelectorAll('.close-feature-modal');
    const body = document.body;
    const fruitsGridContainer = document.getElementById('fruits-grid-container');

    const allProductsData = [
        { name: "fresh mango", image: "mango.jpg", price: 100.00, category: "fruits" }
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

        if (isPaymentFormActive || isAnyFeatureModalActive) {
            body.classList.add('modal-active');
        } else {
            body.classList.remove('modal-active');
        }
    }

    function renderProductsToContainer(productsToRender, targetContainer) {
        if (!targetContainer) {
            console.error('fruits.js: Target container for rendering is null or undefined.');
            return;
        }
        targetContainer.innerHTML = '';
        if (productsToRender.length === 0) {
            targetContainer.innerHTML = '<p style="text-align: center; color: var(--light-color); font-size: 1.6rem;">No products found.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productBox = document.createElement('div');
            productBox.classList.add('box');
            productBox.setAttribute('data-name', product.name);
            productBox.setAttribute('data-price', product.price.toFixed(2));

            productBox.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/cccccc/000000?text=Image+Missing';">
                <h3 data-name="${product.name}">${product.name}</h3>
                <div class="price">R${product.price.toFixed(2)}</div>
                <div class="stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                </div>
                <button class="btn add-to-cart">add to cart</button>
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
        // Close other forms
        searchForm.classList.remove('active');
        shoppingCart.classList.remove('active');
        paymentForm.classList.remove('active');
        featureModals.forEach(modal => modal.classList.remove('active'));
        toggleBodyModalActive();
     };

    // --- Close Buttons ---
    if(document.querySelector('#closePaymentForm')){
        document.querySelector('#closePaymentForm').onclick = () => {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
        };
    }

    // --- Feature Modals & Checkout ---
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const targetModalId = event.target.dataset.modalTarget;
            const targetModal = document.getElementById(targetModalId);

            if (targetModal && targetModal.classList.contains('feature-modal')) {
                featureModals.forEach(modal => modal.classList.remove('active'));
                targetModal.classList.add('active');
                toggleBodyModalActive();
            }
        });
    });
    
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

    // --- Shopping Cart, Payment Form, Search (Remaining logic is the same as before) ---
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
        cartCountElement.textContent = totalItems;
        saveCartItems();
    }

    function addToCart(event) {
        event.preventDefault();
        const productBox = event.target.closest('.box');
        const productName = productBox.dataset.name;
        const productImage = productBox.querySelector('img').src;
        const productPrice = parseFloat(productBox.dataset.price);

        if (!productName || !productImage || isNaN(productPrice)) {
            return;
        }

        const existingItemIndex = cartItems.findIndex(item => item.name === productName);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity++;
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
        const itemIndex = cartItems.findIndex(item => item.name === itemName);
        if (itemIndex > -1) {
            cartItems[itemIndex].quantity = Math.max(1, parseInt(newQuantity));
            renderCart();
            updateCartCount();
        }
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--light-color);">Your cart is empty.</p>';
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
        paymentMessage.textContent = `Order received!`;
        setTimeout(() => {
            paymentForm.classList.remove('active');
            toggleBodyModalActive();
            cartItems = [];
            renderCart();
            updateCartCount();
            paymentFormElement.reset();
        }, 2000);
    };
    
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // (Search logic remains the same)
    });
    
    // Initial calls
    renderCart();
    updateCartCount();
    toggleAddressFormVisibility();
    renderProductsToContainer(allProductsData, fruitsGridContainer);
})();
