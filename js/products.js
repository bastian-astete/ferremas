document.addEventListener('DOMContentLoaded', function() {
    const sampleProducts = [
        {
            id: 1,
            name: 'Martillo Profesional',
            price: 249.99,
            image: 'img/product1.jpg',
            category: 'herramientas',
            description: 'Martillo profesional de alta resistencia con mango ergonómico.'
        },
        {
            id: 2,
            name: 'Juego de Destornilladores',
            price: 349.99,
            image: 'img/product2.jpg',
            category: 'herramientas',
            description: 'Set de 10 destornilladores de precisión para todo tipo de trabajos.'
        },
        {
            id: 3,
            name: 'Taladro Inalámbrico 20V',
            price: 1299.99,
            image: 'img/product3.jpg',
            category: 'herramientas',
            description: 'Taladro inalámbrico potente con batería de larga duración.'
        },
        {
            id: 4,
            name: 'Pintura Vinílica Blanca 19L',
            price: 899.99,
            image: 'img/product4.jpg',
            category: 'materiales',
            description: 'Pintura de alta calidad para interiores y exteriores.'
        },
        {
            id: 5,
            name: 'Tubo PVC 4" 3m',
            price: 129.99,
            image: 'img/product5.jpg',
            category: 'fontaneria',
            description: 'Tubo de PVC resistente para instalaciones de drenaje.'
        },
        {
            id: 6,
            name: 'Cable Eléctrico Calibre 12 100m',
            price: 599.99,
            image: 'img/product6.jpg',
            category: 'electricidad',
            description: 'Cable de cobre con aislamiento para instalaciones eléctricas.'
        },
        {
            id: 7,
            name: 'Sierra Circular 7¼"',
            price: 1599.99,
            image: 'img/product7.jpg',
            category: 'herramientas',
            description: 'Sierra circular potente para cortes precisos en madera y otros materiales.'
        },
        {
            id: 8,
            name: 'Cemento Gris 50kg',
            price: 189.99,
            image: 'img/product8.jpg',
            category: 'materiales',
            description: 'Cemento de alta resistencia para construcción y acabados.'
        }
    ];
    
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    function renderProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-category">${capitalizeFirstLetter(product.category)}</div>
                </div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        const featuredProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
        
        let productHTML = '';
        featuredProducts.forEach(product => {
            productHTML += renderProductCard(product);
        });
        
        featuredProductsContainer.innerHTML = productHTML;
        
        setupAddToCartButtons();
    }
    
    const productsListContainer = document.getElementById('products-list');
    if (productsListContainer) {
        let productHTML = '';
        products.forEach(product => {
            productHTML += renderProductCard(product);
        });
        
        productsListContainer.innerHTML = productHTML;
        
        setupPagination(products.length, 8);
        
        setupAddToCartButtons();
        
        setupFilters();
    }
    
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        
        if (searchQuery) {
            searchInput.value = searchQuery;
            filterProducts(products, { search: searchQuery });
        }
        
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterProducts(products, { search: searchTerm });
        });
    }
    
    function setupAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        
        alert(`${product.name} ha sido agregado al carrito.`);
    }
    
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) return;
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElement.textContent = totalItems;
    }
    
    updateCartCount();
    
    function setupPagination(totalItems, itemsPerPage) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHTML = '';
        
        if (totalPages > 1) {
            paginationHTML += '<div class="pagination-prev pagination-item">Anterior</div>';
            
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `<div class="pagination-item ${i === 1 ? 'active' : ''}" data-page="${i}">${i}</div>`;
            }
            
            paginationHTML += '<div class="pagination-next pagination-item">Siguiente</div>';
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    function setupFilters() {
        const categoryFilters = document.querySelectorAll('input[name="category"]');
        const priceRange = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        const applyFiltersBtn = document.getElementById('apply-filters');
        const clearFiltersBtn = document.getElementById('clear-filters');
        const sortBySelect = document.getElementById('sort-by');
        
        if (!categoryFilters.length || !priceRange || !priceValue || !applyFiltersBtn || !clearFiltersBtn || !sortBySelect) return;
        
        priceRange.addEventListener('input', function() {
            priceValue.textContent = `$${this.value}`;
        });
        
        applyFiltersBtn.addEventListener('click', function() {
            const selectedCategories = Array.from(categoryFilters)
                .filter(input => input.checked)
                .map(input => input.value);
            
            const maxPrice = parseInt(priceRange.value);
            const sortBy = sortBySelect.value;
            
            filterProducts(products, {
                categories: selectedCategories,
                maxPrice,
                sortBy
            });
        });
        
        clearFiltersBtn.addEventListener('click', function() {
            categoryFilters.forEach(input => input.checked = false);
            priceRange.value = 1000;
            priceValue.textContent = '$1000';
            sortBySelect.value = 'name-asc';
            
            filterProducts(products, {});
        });
        
        sortBySelect.addEventListener('change', function() {
            const selectedCategories = Array.from(categoryFilters)
                .filter(input => input.checked)
                .map(input => input.value);
            
            const maxPrice = parseInt(priceRange.value);
            const sortBy = this.value;
            
            filterProducts(products, {
                categories: selectedCategories,
                maxPrice,
                sortBy
            });
        });
    }
    
    function filterProducts(products, filters) {
        let filteredProducts = [...products];
        
        if (filters.categories && filters.categories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                filters.categories.includes(product.category)
            );
        }
        
        if (filters.maxPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price <= filters.maxPrice
            );
        }
        
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) || 
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'name-asc':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
            }
        }
        
        const productsListContainer = document.getElementById('products-list');
        if (!productsListContainer) return;
        
        if (filteredProducts.length === 0) {
            productsListContainer.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                    <button id="clear-search" class="btn">Limpiar búsqueda</button>
                </div>
            `;
            
            const clearSearchBtn = document.getElementById('clear-search');
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', function() {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.value = '';
                    
                    filterProducts(products, {});
                });
            }
        } else {
            let productHTML = '';
            filteredProducts.forEach(product => {
                productHTML += renderProductCard(product);
            });
            
            productsListContainer.innerHTML = productHTML;
            
            setupAddToCartButtons();
        }
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});