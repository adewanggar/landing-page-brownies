document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    const cartBtn = document.querySelector('.cart-btn');
    const cartPopup = document.querySelector('.cart-popup');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = [{
        id: 'brownies-original',
        name: 'Brownies Original',
        price: 55000,
        image: 'assets/img/product/produk1.png',
        quantity: 1
    }];

    // Update cart display saat halaman dimuat
    updateCartDisplay();

    // Cart functionality
    function toggleCart() {
        cartPopup.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    // Event listeners for cart
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Event listener untuk nav-overlay
    navOverlay.addEventListener('click', () => {
        if (cartPopup.classList.contains('active')) {
            toggleCart();
        }
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    function createCartItemElement(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                        <i class="fas fa-trash cart-item-remove"></i>
                    </div>
                </div>
            </div>
        `;
    }

    function updateCartDisplay() {
        cartItems.innerHTML = cart.map(item => createCartItemElement(item)).join('');
        updateCartCount();
        updateCartTotal();
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartDisplay();
    }

    cartItems.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;
        const item = cart.find(item => item.id === itemId);

        if (e.target.classList.contains('plus')) {
            item.quantity++;
        } else if (e.target.classList.contains('minus')) {
            if (item.quantity > 1) {
                item.quantity--;
            }
        } else if (e.target.classList.contains('cart-item-remove')) {
            cart = cart.filter(item => item.id !== itemId);
        }

        updateCartDisplay();
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang belanja masih kosong');
            return;
        }

        // Simpan data cart untuk diproses di halaman pembayaran
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Redirect ke halaman pembayaran
        window.location.href = 'pembayaran.html';
    });

    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');
    
    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        nav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    mobileMenu.addEventListener('click', toggleMenu);

    // Menutup menu saat link diklik
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Product Slider dengan efek melengkung
    const slider = document.querySelector('.product-slider');
    const slides = document.querySelectorAll('.product-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    const radius = 500; // Menambah radius untuk jarak yang lebih lebar
    const angleStep = 35; // Menambah sudut untuk jarak yang lebih lebar
    let autoplayInterval;
    let isAnimating = false;

    function positionSlides() {
        slides.forEach((slide, index) => {
            let relativeIndex = index - currentIndex;
            if (relativeIndex < -Math.floor(totalSlides / 2)) {
                relativeIndex += totalSlides;
            } else if (relativeIndex > Math.floor(totalSlides / 2)) {
                relativeIndex -= totalSlides;
            }

            const angle = relativeIndex * angleStep;
            const radian = (angle * Math.PI) / 180;

            // Menyesuaikan perhitungan posisi
            const x = Math.sin(radian) * radius;
            const y = -Math.cos(radian) * radius * 0.15;
            const scale = Math.cos(radian) * 0.3 + 0.7; // Memperbesar skala minimum
            const zIndex = Math.round(scale * 100);

            // Jika slide berada di posisi ekstrim (paling kiri/kanan), sembunyikan
            const isExtreme = Math.abs(relativeIndex) > 2;
            const opacity = isExtreme ? 0 : scale;

            gsap.to(slide, {
                duration: 0.5,
                x: x,
                y: y,
                scale: scale,
                zIndex: zIndex,
                opacity: opacity,
                ease: 'power1.out'
            });

            if (index === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function moveSlider(direction) {
        if (isAnimating) return;
        isAnimating = true;

        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % totalSlides;
        } else {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }

        positionSlides();

        // Reset isAnimating setelah animasi selesai
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Event listeners untuk tombol
    prevBtn.addEventListener('click', () => {
        clearInterval(autoplayInterval);
        moveSlider('prev');
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(autoplayInterval);
        moveSlider('next');
        startAutoplay();
    });

    // Touch/Drag functionality
    let startX;
    let isDragging = false;

    function touchStart(e) {
        if (isAnimating) return;
        startX = getPositionX(e);
        isDragging = true;
        clearInterval(autoplayInterval);
    }

    function touchMove(e) {
        if (!isDragging || isAnimating) return;
        
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                moveSlider('prev');
            } else {
                moveSlider('next');
            }
            isDragging = false;
            startAutoplay();
        }
    }

    function touchEnd() {
        isDragging = false;
        startAutoplay();
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    // Touch/Mouse event listeners
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchmove', touchMove);
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);

    // Autoplay
    function startAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => moveSlider('next'), 3000);
    }

    // Initialize slider
    positionSlides();
    startAutoplay();

    // Pause autoplay on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', startAutoplay);

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    // Testimonial Slider
    const testimonials = [
        {
            name: 'Sarah Wijaya',
            image: 'https://i.pravatar.cc/200?img=1',
            text: 'Brownies terenak yang pernah saya coba! Teksturnya lembut dan tidak terlalu manis. Cocok untuk menemani waktu santai.',
            rating: 5
        },
        {
            name: 'Budi Santoso',
            image: 'https://i.pravatar.cc/200?img=3',
            text: 'Perfect untuk hadiah! Packaging-nya cantik dan rasanya premium banget. Semua teman saya suka dengan brownies ini.',
            rating: 5
        },
        {
            name: 'Linda Kusuma',
            image: 'https://i.pravatar.cc/200?img=5',
            text: 'Choco Lava Drink-nya jadi favorit baru saya. Recommended banget! Brownies-nya juga selalu fresh dan lezat.',
            rating: 5
        }
    ];

    const testimonialSlider = document.querySelector('.testimonial-slider');
    let currentTestimonial = 0;

    function createTestimonialElement(testimonial) {
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        return `
            <div class="testimonial-item fade-in">
                <img src="${testimonial.image}" alt="${testimonial.name}">
                <div class="rating">${stars}</div>
                <h3>${testimonial.name}</h3>
                <p>${testimonial.text}</p>
            </div>
        `;
    }

    function showTestimonial() {
        testimonialSlider.innerHTML = createTestimonialElement(testimonials[currentTestimonial]);
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }

    showTestimonial();
    setInterval(showTestimonial, 5000);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (window.innerWidth <= 768) {
                    nav.style.display = 'none';
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menambahkan event listener untuk klik pada slide aktif
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (slide.classList.contains('active')) {
                // Mendapatkan nama produk
                const productName = slide.querySelector('.variant-name').textContent;
                // Mengubah nama produk menjadi slug untuk URL
                const productSlug = productName.toLowerCase().replace(/ /g, '-');
                // Mengarahkan ke halaman detail produk
                window.location.href = `detail-produk.html`;
            }
        });
    });

    // Menambahkan style cursor pointer untuk slide aktif
    const updateCursor = () => {
        slides.forEach(slide => {
            if (slide.classList.contains('active')) {
                slide.style.cursor = 'pointer';
            } else {
                slide.style.cursor = 'default';
            }
        });
    };

    // Update cursor saat slide berubah
    const updateSlidePositions = () => {
        // ... existing updateSlidePositions code ...
        updateCursor(); // Menambahkan pemanggilan updateCursor
    };

    // Product data
    const products = [
        {
            id: 'brownies-original',
            name: 'Brownies Original',
            price: 55000,
            image: 'assets/img/product/produk1.png'
        },
        {
            id: 'brownies-keju',
            name: 'Brownies Keju',
            price: 65000,
            image: 'assets/img/product/produk1.png'
        },
        {
            id: 'brownies-almond',
            name: 'Brownies Almond',
            price: 65000,
            image: 'assets/img/product/produk1.png'
        },
        {
            id: 'brownies-matcha',
            name: 'Brownies Matcha',
            price: 65000,
            image: 'assets/img/product/produk1.png'
        },
        {
            id: 'brownies-red-velvet',
            name: 'Brownies Red Velvet',
            price: 65000,
            image: 'assets/img/product/produk1.png'
        },
        {
            id: 'choco-lava-drink',
            name: 'Choco Lava Drink',
            price: 25000,
            image: 'assets/img/product/produk1.png'
        }
    ];

    // Detail Product Page
    if (document.querySelector('.product-detail')) {
        const quantityInput = document.getElementById('quantity');
        const minusBtn = document.querySelector('.quantity-btn.minus');
        const plusBtn = document.querySelector('.quantity-btn.plus');
        const addToCartBtn = document.querySelector('.add-to-cart-btn');

        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.id === productId) || products[0];

        // Update product details
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
        document.getElementById('product-image').src = product.image;
        document.title = `${product.name} - SweetBite Brownies`;

        // Quantity controls
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });

        // Add to cart
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            const productToAdd = {
                ...product,
                quantity: quantity
            };
            addToCart(productToAdd);
            
            // Show cart popup
            if (!cartPopup.classList.contains('active')) {
                toggleCart();
            }
        });

        // Related products navigation
        document.querySelectorAll('.view-product-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const relatedProduct = products[index + 1 >= products.length ? 0 : index + 1];
                window.location.href = `detail-produk.html?id=${relatedProduct.id}`;
            });
        });
    }

    // Event listener untuk tombol tambah ke keranjang pada menu minuman
    document.querySelectorAll('.drink-card .add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };
            
            addToCart(product);
            
            // Show cart popup
            if (!cartPopup.classList.contains('active')) {
                toggleCart();
            }
        });
    });
});