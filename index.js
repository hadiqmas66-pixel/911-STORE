// index.js – BlueBrown Store functionality

// ── Product Data ──
const products = [
  {
    id: 1,
    name: "Elegant Blue Shirt",
    price: 29.99,
    img: "https://picsum.photos/seed/blueshirt1/400/300",
  },
  {
    id: 2,
    name: "Brown Leather Wallet",
    price: 45.50,
    img: "https://picsum.photos/seed/brownwallet1/400/300",
  },
  {
    id: 3,
    name: "Classic Blue Jeans",
    price: 59.00,
    img: "https://picsum.photos/seed/bluejeans2/400/300",
  },
  {
    id: 4,
    name: "Cocoa Brown Boots",
    price: 85.75,
    img: "https://picsum.photos/seed/brownboots2/400/300",
  },
  {
    id: 5,
    name: "Navy Denim Jacket",
    price: 120.00,
    img: "https://picsum.photos/seed/navyjacket/400/300",
  },
  {
    id: 6,
    name: "Caramel Crossbody Bag",
    price: 68.00,
    img: "https://picsum.photos/seed/carambag/400/300",
  },
];

let cart = [];

// ── Helpers ──
const fmt = (n) => `$${n.toFixed(2)}`;

function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

// ── Render Products ──
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${fmt(p.price)}</p>
        <button data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach click listeners
  grid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
  });

  // Intersection observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".product-card, .pillar-card, .about-visual-card, .badge-item").forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.6s ease ${index % 4 * 0.08}s, transform 0.6s ease ${index % 4 * 0.08}s`;
    observer.observe(el);
  });
}

// ── Cart Logic ──
function addToCart(productId) {
  const prod = products.find((p) => p.id === productId);
  if (!prod) return;

  const existing = cart.find((c) => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  updateCartCount();
  showToast(`✓ ${prod.name} added to cart`);
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = totalQty;

  // Pulse animation
  countEl.style.transform = "scale(1.3)";
  setTimeout(() => (countEl.style.transform = "scale(1)"), 200);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function openCart() {
  const drawer = document.getElementById("cartModal");
  const overlay = document.getElementById("cartOverlay");
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = `<li style="color: var(--text-muted); text-align: center; padding: 40px 0;">Your cart is empty.</li>`;
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.name}</strong><br/>${item.qty} × ${fmt(item.price)} = ${fmt(item.price * item.qty)}`;
      list.appendChild(li);
    });
  }

  totalEl.textContent = fmt(getCartTotal());

  drawer.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

// ── Header Scroll Effect & Active Nav Highlight ──
function handleScroll() {
  const header = document.getElementById("siteHeader");
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Update active nav link
  const sections = ["hero", "shop", "about", "contact"];
  const scrollPos = window.scrollY + 120;

  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i]);
    if (el && el.offsetTop <= scrollPos) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        const href = link.getAttribute("href");
        const isMatch = (sections[i] === "hero" && href === "#") || href === `#${sections[i]}`;
        link.classList.toggle("active", isMatch);
      });
      break;
    }
  }
}

// ── Mobile Menu Toggle ──
function toggleMobile() {
  const nav = document.getElementById("navMenu");
  nav.classList.toggle("open");
}

// ── Initialisation ──
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  // Cart events
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  // Scroll
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Mobile toggle
  const toggleBtn = document.getElementById("mobileToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleMobile);
  }

  // Close mobile nav on link click
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("navMenu").classList.remove("open");
    });
  });

  // Keyboard: Escape closes cart
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  // Contact form submit
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✓ Message sent! We'll get back to you soon.");
      contactForm.reset();
    });
  }
});
