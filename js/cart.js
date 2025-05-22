document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
    
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElement.textContent = totalItems;
    }
    
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartContainer = document.getElementById('empty-cart');
        const cartSummary = document.getElementById('cart-summary');
        
        if (!cartItemsContainer || !emptyCartContainer || !cartSummary) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCartContainer.classList.remove('hidden');
            cartSummary.classList.add('hidden');
            return;
        }
        
        emptyCartContainer.classList.add('hidden');
        cartSummary.classList.remove('hidden');
        
        let cartHTML = '';
        cart.forEach(item => {
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="decrement-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increment-quantity" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">Eliminar</button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        updateCartSummary();
        
        setupCartItemButtons();
    }
    
    function setupCartItemButtons() {
        const incrementButtons = document.querySelectorAll('.increment-quantity');
        incrementButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateCartItemQuantity(productId, 1);
            });
        });
        
        const decrementButtons = document.querySelectorAll('.decrement-quantity');
        decrementButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateCartItemQuantity(productId, -1);
            });
        });
        
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeCartItem(productId);
            });
        });
    }
    
    function updateCartItemQuantity(productId, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex === -1) return;
        
        cart[productIndex].quantity += change;
        
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        loadCartItems();
        
        updateCartCount();
    }
    
    function removeCartItem(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const updatedCart = cart.filter(item => item.id !== productId);
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        loadCartItems();
        
        updateCartCount();
    }
    
    function updateCartSummary() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const shippingElement = document.getElementById('cart-shipping');
        const totalElement = document.getElementById('cart-total');
        
        if (!subtotalElement || !taxElement || !shippingElement || !totalElement) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const taxRate = 0.16;
        const tax = subtotal * taxRate;
        
        const shipping = subtotal > 1500 ? 0 : 150;
        
        const total = subtotal + tax + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        localStorage.setItem('cartSummary', JSON.stringify({
            subtotal,
            tax,
            shipping,
            total
        }));
    }
});