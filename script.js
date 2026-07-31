const cart = JSON.parse(localStorage.getItem('tryInkCart') || '[]');

function saveCart() { localStorage.setItem('tryInkCart', JSON.stringify(cart)); }
const cartEl = document.querySelector('#cart');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cartItems');
const cartCount = document.querySelector('#cartCount');
const cartHeadingCount = document.querySelector('#cartHeadingCount');
const cartTotal = document.querySelector('#cartTotal');
const cartShipping = document.querySelector('#cartShipping');
const toast = document.querySelector('#toast');
const orderModal = document.querySelector('#orderModal');
const orderSummary = document.querySelector('#orderSummary');
const orderForm = document.querySelector('#orderForm');
const instagram = document.querySelector('#instagram');
const orderItemsInput = document.querySelector('#orderItemsInput');
const orderTotalInput = document.querySelector('#orderTotalInput');
const productsEl = document.querySelector('.products');

const designs = Array.from({ length: 31 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return { name: `Design ${number}`, number, price: 0 };
});

productsEl.innerHTML = designs.map(({ name, number, price }) => `
  <article class="product-card product-placeholder">
    <div class="product-image product-number" aria-label="${name}" style="display:grid;place-items:center;background:#d9d6ce;color:#111;font:500 clamp(72px,10vw,140px)/1 'Playfair Display', serif;letter-spacing:-.08em;">${number}<span class="available">NOVO</span></div>
    <div class="product-info"><div><h3>${name}</h3><p>tattoo temporária</p></div><button class="add-button" type="button" data-name="${name}" data-price="${price}">Adicionar <span>+</span></button></div>
    <p class="price">€— <small>preço a definir</small></p>
  </article>`).join('');

function showToast(message = 'Adicionado à tua bag.') {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = quantity;
  cartHeadingCount.textContent = quantity;
  cartTotal.textContent = `€${total}`;
  cartShipping.textContent = total >= 25 ? '✓ Portes grátis incluídos.' : `Faltam €${25 - total} para teres portes grátis.`;
  cartItems.innerHTML = cart.length ? cart.map((item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><small>Design exclusivo</small></div><div class="cart-item-actions"><div class="quantity-control"><button type="button" aria-label="Diminuir ${item.name}" data-change="-1" data-index="${index}">−</button><span>${item.quantity}</span><button type="button" aria-label="Aumentar ${item.name}" data-change="1" data-index="${index}">+</button></div><button class="remove-item" type="button" aria-label="Remover ${item.name}" data-remove="${index}">×</button></div></div>`).join('') : '<p class="empty-cart">A tua seleção está vazia.</p>';
}

function openCart() {
  cartEl.classList.add('open');
  overlay.classList.add('show');
  cartEl.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartEl.classList.remove('open');
  overlay.classList.remove('show');
  cartEl.setAttribute('aria-hidden', 'true');
}

function cartTotalValue() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function openOrderModal() {
  if (!cart.length) {
    showToast('Adiciona primeiro uma tattoo à tua bag.');
    return;
  }
  const items = cart.map(item => `<li>${item.name} × ${item.quantity} <span>€${item.price * item.quantity}</span></li>`).join('');
  orderSummary.innerHTML = `<p>O teu pedido</p><ul>${items}</ul><strong>Total: €${cartTotalValue()}</strong>`;
  closeCart();
  orderModal.classList.add('open');
  orderModal.setAttribute('aria-hidden', 'false');
  instagram.focus();
}

function closeOrderModal() {
  orderModal.classList.remove('open');
  orderModal.setAttribute('aria-hidden', 'true');
}

productsEl.addEventListener('click', event => {
  const button = event.target.closest('.add-button');
  if (!button) return;
  const existing = cart.find(item => item.name === button.dataset.name);
  if (existing) existing.quantity += 1;
  else cart.push({ name: button.dataset.name, price: Number(button.dataset.price), quantity: 1 });
  saveCart();
  renderCart();
  openCart();
  showToast();
});

cartItems.addEventListener('click', event => {
  const change = event.target.closest('[data-change]');
  const remove = event.target.closest('[data-remove]');
  if (change) {
    const item = cart[Number(change.dataset.index)];
    item.quantity += Number(change.dataset.change);
    if (item.quantity < 1) cart.splice(Number(change.dataset.index), 1);
  } else if (remove) cart.splice(Number(remove.dataset.remove), 1);
  else return;
  saveCart();
  renderCart();
});

document.querySelector('#cartButton').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.querySelector('#checkoutButton').addEventListener('click', openOrderModal);
document.querySelector('#closeOrderModal').addEventListener('click', closeOrderModal);
orderModal.addEventListener('click', event => { if (event.target === orderModal) closeOrderModal(); });
orderForm.addEventListener('submit', event => {
  if (!cart.length) {
    event.preventDefault();
    closeOrderModal();
    return;
  }
  orderItemsInput.value = cart.map(item => `${item.name} × ${item.quantity} (€${item.price * item.quantity})`).join(', ');
  orderTotalInput.value = `€${cartTotalValue()}`;
  saveCart();
});
renderCart();

document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filters .active').classList.remove('active');
  button.classList.add('active');
}));


const visualStyles = document.createElement('style');
visualStyles.textContent = `
  .product-card { animation: card-in .45s both; }
  .product-card:nth-child(3n+2) { animation-delay: .06s; }
  .product-card:nth-child(3n) { animation-delay: .12s; }
  .add-button, .button, .icon-button { transition: transform .2s ease, opacity .2s ease; }
  .add-button:hover, .button:hover { transform: translateY(-2px); }
  .cart-item-actions { display:flex; align-items:center; gap:12px; }
  .quantity-control { display:inline-flex; align-items:center; gap:8px; border:1px solid #c9c6bd; padding:2px 6px; }
  .quantity-control button, .remove-item { min-width:26px; min-height:26px; }
  @keyframes card-in { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
  @media (max-width: 750px) { .hero h1 { font-size: clamp(54px, 16vw, 72px); } .hero-actions { flex-wrap:wrap; } .product-info { gap:10px; } .add-button { padding:10px 0; white-space:nowrap; } .cart { padding:22px; } .cart-item { gap:10px; align-items:center; } .cart-item-actions { gap:7px; } .quantity-control { gap:5px; } .toast { width:calc(100% - 32px); text-align:center; } }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }
`;
document.head.append(visualStyles);
