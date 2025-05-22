document.addEventListener('DOMContentLoaded', function() {
    const cartSteps = document.querySelectorAll('.step');
    const cartStepContents = document.querySelectorAll('.cart-step');
    
    const proceedToCheckout = document.getElementById('proceed-to-checkout');
    const backToCart = document.getElementById('back-to-cart');
    const backToShipping = document.getElementById('back-to-shipping');
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    const paymentMethodOptions = document.querySelectorAll('.payment-method');
    const creditCardForm = document.getElementById('credit-card-form');
    const paypalForm = document.getElementById('paypal-form');
    
    if (proceedToCheckout) {
        proceedToCheckout.addEventListener('click', function() {
            navigateToStep('shipping');
        });
    }
    
    if (backToCart) {
        backToCart.addEventListener('click', function() {
            navigateToStep('cart');
        });
    }
    
    if (backToShipping) {
        backToShipping.addEventListener('click', function() {
            navigateToStep('shipping');
        });
    }
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const shippingInfo = {
                name: document.getElementById('shipping-name').value,
                email: document.getElementById('shipping-email').value,
                phone: document.getElementById('shipping-phone').value,
                address: document.getElementById('shipping-address').value,
                city: document.getElementById('shipping-city').value,
                state: document.getElementById('shipping-state').value,
                zip: document.getElementById('shipping-zip').value,
                method: document.getElementById('shipping-method').value
            };
            
            localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
            
            updateShippingCost(shippingInfo.method);
            
            navigateToStep('payment');
        });
    }
    
    if (paymentMethodOptions.length) {
        paymentMethodOptions.forEach(option => {
            option.addEventListener('click', function() {
                const paymentMethod = this.querySelector('input').value;
                
                paymentMethodOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                if (paymentMethod === 'credit-card') {
                    creditCardForm.classList.remove('hidden');
                    paypalForm.classList.add('hidden');
                } else if (paymentMethod === 'paypal') {
                    creditCardForm.classList.add('hidden');
                    paypalForm.classList.remove('hidden');
                }
                
                this.querySelector('input').checked = true;
            });
        });
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            if (paymentMethod === 'credit-card') {
                const cardNumber = document.getElementById('card-number').value;
                const cardExpiry = document.getElementById('card-expiry').value;
                const cardCVV = document.getElementById('card-cvv').value;
                
                if (!validateCreditCard(cardNumber, cardExpiry, cardCVV)) {
                    alert('Por favor ingresa información válida de la tarjeta de crédito.');
                    return;
                }
            }
            
            const paymentInfo = {
                method: paymentMethod,
                saveInfo: document.getElementById('save-payment-info').checked
            };
            
            localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
            
            processOrder();
        });
    }
    
    loadPaymentSummary();
    
    function navigateToStep(step) {
        cartSteps.forEach(s => {
            if (s.getAttribute('data-step') === step) {
                s.classList.add('active');
            } else if (s.classList.contains('active')) {
                if (getStepIndex(s.getAttribute('data-step')) < getStepIndex(step)) {
                    s.classList.add('completed');
                }
                s.classList.remove('active');
            }
        });
        
        cartStepContents.forEach(content => {
            if (content.id === `${step}-step`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    function getStepIndex(step) {
        const steps = ['cart', 'shipping', 'payment', 'confirmation'];
        return steps.indexOf(step);
    }
    
    function updateShippingCost(shippingMethod) {
        const cartSummary = JSON.parse(localStorage.getItem('cartSummary'));
        
        if (!cartSummary) return;
        
        let shippingCost = 0;
        
        switch (shippingMethod) {
            case 'express':
                shippingCost = 150;
                break;
            case 'sameday':
                shippingCost = 300;
                break;
            default:
                shippingCost = cartSummary.subtotal > 1500 ? 0 : 150;
        }
        
        cartSummary.shipping = shippingCost;
        cartSummary.total = cartSummary.subtotal + cartSummary.tax + shippingCost;
        
        localStorage.setItem('cartSummary', JSON.stringify(cartSummary));
        
        const cartShippingElement = document.getElementById('cart-shipping');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (cartShippingElement) {
            cartShippingElement.textContent = shippingCost === 0 ? 'Gratis' : `$${shippingCost.toFixed(2)}`;
        }
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${cartSummary.total.toFixed(2)}`;
        }
    }
    
    function loadPaymentSummary() {
        const paymentSubtotal = document.getElementById('payment-subtotal');
        const paymentTax = document.getElementById('payment-tax');
        const paymentShipping = document.getElementById('payment-shipping');
        const paymentTotal = document.getElementById('payment-total');
        
        if (!paymentSubtotal || !paymentTax || !paymentShipping || !paymentTotal) return;
        
        const cartSummary = JSON.parse(localStorage.getItem('cartSummary'));
        
        if (!cartSummary) return;
        
        paymentSubtotal.textContent = `$${cartSummary.subtotal.toFixed(2)}`;
        paymentTax.textContent = `$${cartSummary.tax.toFixed(2)}`;
        paymentShipping.textContent = cartSummary.shipping === 0 ? 'Gratis' : `$${cartSummary.shipping.toFixed(2)}`;
        paymentTotal.textContent = `$${cartSummary.total.toFixed(2)}`;
    }
    
    function validateCreditCard(cardNumber, cardExpiry, cardCVV) {
        return cardNumber.replace(/\s/g, '').length >= 16 && 
               cardExpiry.match(/^\d{2}\/\d{2}$/) && 
               cardCVV.length >= 3;
    }
    
    function processOrder() {
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        const orderDate = new Date().toLocaleDateString();
        
        const cartSummary = JSON.parse(localStorage.getItem('cartSummary'));
        
        const orderInfo = {
            number: orderNumber,
            date: orderDate,
            total: cartSummary.total,
            status: 'Procesando'
        };
        
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orderHistory.push(orderInfo);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        document.getElementById('order-number').textContent = orderNumber;
        document.getElementById('order-date').textContent = orderDate;
        document.getElementById('confirmation-total').textContent = `$${cartSummary.total.toFixed(2)}`;
        
        localStorage.removeItem('cart');
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = '0';
        }
        
        navigateToStep('confirmation');
    }
});