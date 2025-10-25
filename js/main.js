document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });

    document.querySelectorAll('form:not(#check-form):not(#cart-form):not(#order-form):not(#robux-form)').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pesan berhasil dikirim! Kami akan hubungi segera.');
            this.reset();
        });
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    const btnHelp = document.getElementById('btn-help');
    const panduanModal = document.getElementById('panduan-modal');
    const closeModalPanduan = document.querySelector('.panduan-modal .close-modal');
    if (btnHelp && panduanModal) {
        btnHelp.addEventListener('click', (e) => {
            e.preventDefault();
            panduanModal.style.display = 'flex';
        });
        if (closeModalPanduan) {
            closeModalPanduan.addEventListener('click', () => {
                panduanModal.style.display = 'none';
            });
        }
        window.addEventListener('click', (e) => {
            if (e.target === panduanModal) {
                panduanModal.style.display = 'none';
            }
        });
    }

    window.openOrderModal = function(element) {
        const name = element.querySelector('h3').textContent;
        const priceText = element.querySelector('p').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        document.getElementById('product-name').textContent = name;
        document.getElementById('product-price').textContent = priceText;
        document.getElementById('total-amount').textContent = priceText;

        const orderModal = document.getElementById('order-modal');
        orderModal.style.display = 'flex';

        const orderForm = document.getElementById('order-form');
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const closeModalOrder = document.querySelector('.order-modal .close-modal');

        closeModalOrder.addEventListener('click', () => {
            orderModal.style.display = 'none';
        });

        addToCartBtn.onclick = function(e) {
            e.preventDefault();
            addToCart(name, price, orderForm);
            orderModal.style.display = 'none';
        };

        orderForm.onsubmit = function(e) {
            e.preventDefault();
            addToCart(name, price, orderForm);
            orderModal.style.display = 'none';
            window.location.href = 'cart.html';
        };
    };

    function addToCart(name, price, form) {
        const username = form.querySelector('#roblox-username').value;
        const wa = form.querySelector('#wa-number').value;
        const email = form.querySelector('#email-notif').value;

        if (!username) {
            alert('Username Roblox wajib diisi!');
            return;
        }

        const item = { name, price, username, wa: wa || null, email: email || null };
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        form.reset();
        alert('Item berhasil ditambahkan ke keranjang!');
    }

    window.addEventListener('click', (e) => {
        const orderModal = document.getElementById('order-modal');
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    // Robux Modal Handling
    window.openRobuxModal = function(type) {
        document.getElementById('robux-type').textContent = type;
        const robuxModal = document.getElementById('robux-modal');
        robuxModal.style.display = 'flex';

        const robuxForm = document.getElementById('robux-form');
        const robuxAmountInput = document.getElementById('robux-amount');
        const robuxTotalEl = document.getElementById('robux-total');
        const closeModalRobux = document.querySelector('#robux-modal .close-modal');

        // Rate per Robux (contoh: Rp 100 per Robux, sesuaikan sesuai kebutuhan)
        const ratePerRobux = 100; // Ganti sesuai harga real

        function updateTotal() {
            const amount = parseInt(robuxAmountInput.value) || 0;
            const total = amount * ratePerRobux;
            robuxTotalEl.textContent = `Rp ${total.toLocaleString()}`;
        }

        robuxAmountInput.addEventListener('input', updateTotal);
        updateTotal(); // Initial

        closeModalRobux.addEventListener('click', () => {
            robuxModal.style.display = 'none';
        });

        robuxForm.onsubmit = function(e) {
            e.preventDefault();
            const username = document.getElementById('robux-username').value;
            const amount = robuxAmountInput.value;
            const wa = document.getElementById('robux-wa').value;
            const email = document.getElementById('robux-email').value;
            const payment = document.getElementById('robux-payment').value;

            if (!username || !amount || !payment) {
                alert('Username, jumlah Robux, dan metode pembayaran wajib diisi!');
                return;
            }

            // Simpan ke localStorage atau proses (langsung buy)
            const orderData = { type, username, amount, wa: wa || null, email: email || null, payment, total: parseInt(robuxTotalEl.textContent.replace(/[^\d]/g, '')) };
            localStorage.setItem('robux-order', JSON.stringify(orderData));
            robuxForm.reset();
            robuxModal.style.display = 'none';
            alert('Pesanan Robux berhasil diproses! Cek cart atau hubungi CS untuk konfirmasi.');
            window.location.href = 'cart.html'; // Redirect ke cart
        };
    };

    window.addEventListener('click', (e) => {
        const robuxModal = document.getElementById('robux-modal');
        if (e.target === robuxModal) {
            robuxModal.style.display = 'none';
        }
    });

    if (document.getElementById('cart-items')) {
        const cartItems = document.getElementById('cart-items');
        const totalPriceEl = document.getElementById('total-price');
        const adminFeeEl = document.getElementById('admin-fee');
        const totalFinalEl = document.getElementById('total-final');
        const btnBuyNow = document.getElementById('btn-buy-now');
        const clearCartBtn = document.getElementById('clear-cart');
        const adminFee = 2000;

        function loadAndUpdateCart() {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

            if (cart.length === 0) {
                cartItems.innerHTML = '<p>Belum ada item di Keranjang</p>';
                clearCartBtn.style.display = 'none';
                btnBuyNow.style.pointerEvents = 'none';
                btnBuyNow.style.opacity = '0.5';
            } else {
                cartItems.innerHTML = cart.map((item, index) => `
                    <div class="cart-item">
                        <div>
                            <strong>${item.name}</strong><br>
                            <small>Username: ${item.username}</small><br>
                            ${item.wa ? `<small>WA: ${item.wa}</small><br>` : ''}
                            ${item.email ? `<small>Email: ${item.email}</small>` : ''}
                        </div>
                        <span>Rp ${item.price.toLocaleString()}</span>
                        <button onclick="removeFromCart(${index})">Hapus</button>
                    </div>
                `).join('');
                clearCartBtn.style.display = 'block';
            }
            totalFinalEl.textContent = `Rp ${(totalPrice + adminFee).toLocaleString()}`;
            totalPriceEl.textContent = `Rp ${totalPrice.toLocaleString()}`;
            adminFeeEl.textContent = `Rp ${adminFee.toLocaleString()}`;
        }

        window.removeFromCart = function(index) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadAndUpdateCart();
        };

        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                localStorage.removeItem('cart');
                loadAndUpdateCart();
            });
        }

        btnBuyNow.addEventListener('click', (e) => {
            if (JSON.parse(localStorage.getItem('cart') || '[]').length === 0) {
                e.preventDefault();
                alert('Keranjang kosong!');
            }
        });

        loadAndUpdateCart();
    }

    if (document.getElementById('check-form')) {
        const checkForm = document.getElementById('check-form');
        const checkInput = document.getElementById('check-input');
        const checkResult = document.getElementById('check-result');
        const radioButtons = document.querySelectorAll('input[name="check-type"]');

        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                checkInput.placeholder = radio.value === 'username' ? 'Masukkan username Roblox' : 'Masukkan Invoice Pembayaran';
            });
        });

        checkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const value = checkInput.value.trim();
            const type = document.querySelector('input[name="check-type"]:checked').value;
            if (value) {
                checkResult.style.display = 'block';
                checkResult.innerHTML = `<p>Status untuk ${type}: <strong>${value}</strong> - Sedang diproses. Cek Discord/Telegram untuk detail!</p>`;
            } else {
                alert('Masukkan username atau invoice ID!');
            }
        });
    }
});