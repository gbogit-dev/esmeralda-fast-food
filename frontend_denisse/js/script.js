/* ---------- HEADER MODERNO - NAVEGACIÓN ---------- */
(function initHeaderModerno() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.header-modern__nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        if (menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });
})();

/* ---------- DATA: PRODUCTOS ---------- */
let PRODUCTS = {
    promos: { title: 'Promos Grupales', icon: 'fa-fire', items: [] },
    desayunos: { title: 'Desayunos', icon: 'fa-mug-hot', items: [] },
    almuerzos: { title: 'Almuerzos', icon: 'fa-bowl-food', items: [] },
    cenas: { title: 'Cenas', icon: 'fa-utensils', items: [] },
    bocaditos: { title: 'Bocaditos', icon: 'fa-drumstick-bite', items: [] }
};


/* ---------- HERO CAROUSEL ---------- */
async function initHero() {
    const track = document.getElementById('heroTrack');
    const dotsWrap = document.getElementById('heroDots');
    if (!track) return;

    try {
        const res = await fetch('http://127.0.0.1:8000/api/banners/');
        if (res.ok) {
            const banners = await res.json();
            if (banners && banners.length > 0) {
                // Render dynamic banners
                track.innerHTML = banners.map(b => 
                    `<article class="hero__slide" style="background-image: url('${b.image}')"></article>`
                ).join('');
            }
        }
    } catch (e) {
        console.error("Error loading banners from API, using fallback:", e);
    }

    const slides = track.children;
    const total = slides.length;
    let index = 0;
    let timer;

    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'hero__dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-testid', `hero-dot-${i}`);
            dot.addEventListener('click', () => go(i));
            dotsWrap.appendChild(dot);
        }
    }
    const dots = dotsWrap ? dotsWrap.children : [];

    function go(i) {
        if (total === 0) return;
        index = (i + total) % total;
        track.style.transform = `translateX(-${index * 100}%)`;
        for (let j = 0; j < total; j++) {
            if (dots[j]) dots[j].classList.toggle('active', j === index);
        }
        resetTimer();
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function resetTimer() {
        clearInterval(timer);
        if (total > 1) {
            timer = setInterval(next, 6000);
        }
    }
    
    const nextBtn = document.getElementById('heroNext');
    const prevBtn = document.getElementById('heroPrev');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    
    resetTimer();
}

initHero();


async function loadProductsAndRender() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/products/');
        if (res.ok) {
            const data = await res.json();
            for (const cat in data) {
                if (PRODUCTS[cat]) {
                    PRODUCTS[cat].items = data[cat];
                }
            }
        } else {
            console.error("Failed to load products");
        }
    } catch (e) {
        console.error(e);
    }
    renderSections();
}

function renderSections() {
    const root = document.getElementById('sections');
    const order = ['promos', 'desayunos', 'almuerzos', 'cenas', 'bocaditos'];
    const ids = { promos: 'promos', desayunos: 'desayunos', almuerzos: 'almuerzos', cenas: 'cenas', bocaditos: 'bocaditos' };

    order.forEach(key => {
        const data = PRODUCTS[key];
        const section = document.createElement('section');
        section.className = 'section fade-in';
        section.id = ids[key];
        section.setAttribute('data-testid', `section-${key}`);

        section.innerHTML = `
            <div class=\"section__head\">
                <h2 class=\"section__title\">
                    <i class=\"fa-solid ${data.icon} section__title-icon\" style=\"color: var(--cds-colors-brand-medium)\"></i>
                    ${data.title}
                </h2>
                <a href=\"#${ids[key]}\" class=\"section__see-all\" data-testid=\"see-all-${key}\">
                    Ver todos <i class=\"fa-solid fa-arrow-right\"></i>
                </a>
            </div>
            <div class=\"carousel\" data-carousel>
                <button class=\"carousel__nav carousel__nav--prev\" data-dir=\"-1\" aria-label=\"Anterior\" data-testid=\"carousel-prev-${key}\"><i class=\"fa-solid fa-chevron-left\"></i></button>
                <div class=\"carousel__track\" data-track>
                    ${data.items.map(p => cardHTML(p, key)).join('')}
                </div>
                <button class=\"carousel__nav carousel__nav--next\" data-dir=\"1\" aria-label=\"Siguiente\" data-testid=\"carousel-next-${key}\"><i class=\"fa-solid fa-chevron-right\"></i></button>
            </div>
        `;
        root.appendChild(section);
    });

    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const track = carousel.querySelector('[data-track]');
        carousel.querySelectorAll('.carousel__nav').forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = parseInt(btn.dataset.dir, 10);
                const card = track.querySelector('.card');
                const step = card ? card.offsetWidth + 16 : 240;
                track.scrollBy({ left: step * 2 * dir, behavior: 'smooth' });
            });
        });
    });

    document.querySelectorAll('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.add;
            const cat = btn.dataset.cat;
            const product = PRODUCTS[cat].items.find(p => p.id === id);
            if (product) addToCart(product);
        });
    });
}

loadProductsAndRender();

function cardHTML(p, cat) {
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const badge = p.badge === 'HOT'
        ? '<span class=\"card__badge card__badge--hot\"><i class=\"fa-solid fa-fire\"></i> Hot</span>'
        : p.badge === 'NEW'
        ? '<span class=\"card__badge card__badge--new\">Nuevo</span>'
        : '';
    return `
        <article class=\"card\" data-testid=\"product-card-${p.id}\">
            ${badge}
            <div class=\"card__media\">
                <img src=\"${p.img}\" alt=\"${p.name}\" loading=\"lazy\" onerror=\"this.style.display='none'\">
                <span class=\"card__media-watermark\">Imágenes referenciales</span>
            </div>
            <div class=\"card__body\">
                <h3 class=\"card__title\">${p.name}</h3>
                <p class=\"card__desc\">${p.desc}</p>
                ${p.oldPrice ? `
                    <div class=\"card__pricing\">
                        <span class=\"card__discount\">-${discount}%</span>
                        <span class=\"card__strike\">S/ ${p.oldPrice.toFixed(2)}</span>
                    </div>` : '<div style=\"height:18px\"></div>'}
                <div class=\"card__bottom\">
                    <span class=\"card__price\">S/ ${p.price.toFixed(2)}</span>
                    <button class=\"card__add\" data-add=\"${p.id}\" data-cat=\"${cat}\" aria-label=\"Agregar ${p.name}\" data-testid=\"add-${p.id}\">
                        <i class=\"fa-solid fa-plus\"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

/* ---------- CART (in-memory) ---------- */
const cart = [];

function addToCart(product) {
    const existing = cart.find(c => c.id === product.id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    updateCartUI();
    showToast(`${product.name} agregado al carrito`);
    bumpCartIcon();
}

function removeFromCart(id) {
    const i = cart.findIndex(c => c.id === id);
    if (i >= 0) cart.splice(i, 1);
    updateCartUI();
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else updateCartUI();
}

function updateCartUI() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('cartBadge').textContent = totalQty;
    document.getElementById('cartTotal').textContent = `S/ ${totalPrice.toFixed(2)}`;
    document.getElementById('cartSubtotal').textContent = `S/ ${totalPrice.toFixed(2)}`;

    const body = document.getElementById('cartBody');
    if (cart.length === 0) {
        body.innerHTML = `
            <div class=\"cart-drawer__empty\">
                <i class=\"fa-solid fa-cart-shopping\"></i>
                <p>Tu carrito está vacío</p>
                <small>Agrega productos para verlos aquí</small>
            </div>`;
        return;
    }
    body.innerHTML = cart.map(item => `
        <div class=\"cart-item\" data-testid=\"cart-item-${item.id}\">
            <div class=\"cart-item__img\"><img src=\"${item.img}\" alt=\"${item.name}\"></div>
            <div class=\"cart-item__info\">
                <div class=\"cart-item__name\">${item.name}</div>
                <div class=\"cart-item__price\">S/ ${(item.price * item.qty).toFixed(2)}</div>
            </div>
            <div class=\"cart-item__qty\">
                <button data-qty=\"-1\" data-id=\"${item.id}\" aria-label=\"Quitar uno\"><i class=\"fa-solid fa-minus\"></i></button>
                <span>${item.qty}</span>
                <button data-qty=\"1\" data-id=\"${item.id}\" aria-label=\"Agregar uno\"><i class=\"fa-solid fa-plus\"></i></button>
            </div>
        </div>
    `).join('');

    body.querySelectorAll('[data-qty]').forEach(btn => {
        btn.addEventListener('click', () => updateQty(btn.dataset.id, parseInt(btn.dataset.qty, 10)));
    });
}

function bumpCartIcon() {
    const btn = document.getElementById('cartButton');
    btn.style.transform = 'scale(1.15)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 220);
}

let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = `<i class=\"fa-solid fa-check-circle\"></i> ${msg}`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

(function initDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const open = () => { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
    const close = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); };
    document.getElementById('cartButton').addEventListener('click', open);
    document.getElementById('cartClose').addEventListener('click', close);
    overlay.addEventListener('click', close);

    const checkoutBtn = document.getElementById('cartCheckoutWhatsApp');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast("Tu carrito está vacío");
                return;
            }
            
            let message = "Hola! Quiero confirmar mi pedido:\n\n";
            cart.forEach(item => {
                message += `- ${item.qty}x ${item.name} (S/ ${(item.price * item.qty).toFixed(2)})\n`;
            });
            
            const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
            message += `\n*Total a pagar: S/ ${totalPrice.toFixed(2)}*`;
            
            const phoneNumber = "51955616836"; // Phone number from the corporativo link
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
})();

(function navHighlight() {
    const links = document.querySelectorAll('.subheader__link');
    links.forEach(l => l.addEventListener('click', () => {
        links.forEach(x => x.classList.remove('active'));
        l.classList.add('active');
    }));
})();

(function smoothFx() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.animationDelay = '0s';
                e.target.classList.add('fade-in');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section').forEach(s => obs.observe(s));
})();

/* ---------- LIVE SEARCH ---------- */
(function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        let allProducts = [];
        for (const cat in PRODUCTS) {
            if (PRODUCTS[cat].items) {
                PRODUCTS[cat].items.forEach(item => {
                    allProducts.push({ ...item, category: cat });
                });
            }
        }

        const filtered = allProducts.filter(p => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchDesc = p.desc && p.desc.toLowerCase().includes(query);
            const matchCatTitle = PRODUCTS[p.category] && PRODUCTS[p.category].title.toLowerCase().includes(query);
            const matchCatKey = p.category.toLowerCase().includes(query);

            return matchName || matchDesc || matchCatTitle || matchCatKey;
        });

        if (filtered.length === 0) {
            searchResults.innerHTML = '<div class="search-result-empty">No se encontraron productos.</div>';
            searchResults.style.display = 'block';
            return;
        }

        const grouped = {};
        filtered.forEach(p => {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category].push(p);
        });

        let html = '';
        for (const cat in grouped) {
            const catTitle = PRODUCTS[cat].title;
            const catItems = grouped[cat];
            const visibleItems = catItems.slice(0, 5);
            
            html += `<div class="search-result-category">`;
            html += `<h4 class="search-result-category-title">${catTitle}</h4>`;
            
            html += visibleItems.map(p => {
                const priceHtml = p.oldPrice 
                    ? `<span class="search-result-price-old">S/ ${p.oldPrice.toFixed(2)}</span> <span class="search-result-price-new">S/ ${p.price.toFixed(2)}</span>`
                    : `<span class="search-result-price">S/ ${p.price.toFixed(2)}</span>`;
                    
                return `
                    <div class="search-result-item" data-cat="${p.category}">
                        <img src="${p.img}" alt="${p.name}" class="search-result-img" onerror="this.style.display='none'">
                        <div class="search-result-info">
                            <div class="search-result-name">${p.name}</div>
                            <div class="search-result-pricing">${priceHtml}</div>
                        </div>
                        <button class="search-result-add" data-add="${p.id}" data-cat="${p.category}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                `;
            }).join('');
            
            if (catItems.length > 5) {
                html += `<div class="search-result-more" data-cat="${cat}">Ver más (${catItems.length - 5}) <i class="fa-solid fa-arrow-down"></i></div>`;
            }
            
            html += `</div>`;
        }

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';

        // Add to cart event
        searchResults.querySelectorAll('.search-result-add').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                ev.stopPropagation(); // prevent triggering item click
                const id = btn.dataset.add;
                const cat = btn.dataset.cat;
                const product = PRODUCTS[cat].items.find(x => x.id === id);
                if (product) addToCart(product);
            });
        });

        // Scroll to category section
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const cat = item.dataset.cat;
                const section = document.getElementById(cat);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
                searchResults.style.display = 'none';
                searchInput.value = ''; // clear search
            });
        });

        // Ver más event
        searchResults.querySelectorAll('.search-result-more').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.cat;
                const section = document.getElementById(cat);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
                searchResults.style.display = 'none';
                searchInput.value = ''; // clear search
            });
        });
    });

    // Hide search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-modern__search')) {
            searchResults.style.display = 'none';
        }
    });
})();