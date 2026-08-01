const cart = [];
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
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;
  cartHeadingCount.textContent = cart.length;
  cartTotal.textContent = `€${total}`;
  cartShipping.textContent = total >= 25 ? '✓ Portes grátis incluídos.' : `Faltam €${25 - total} para teres portes grátis.`;
  cartItems.innerHTML = cart.length
    ? cart.map((item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><small>Design exclusivo</small></div><div>€${item.price} <button type="button" aria-label="Remover ${item.name}" data-remove="${index}">×</button></div></div>`).join('')
    : '<p class="empty-cart">A tua seleção está vazia.</p>';
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
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function openOrderModal() {
  if (!cart.length) {
    showToast('Adiciona primeiro uma tattoo à tua bag.');
    return;
  }
  const items = cart.map(item => `<li>${item.name} <span>€${item.price}</span></li>`).join('');
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
  cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
  renderCart();
  openCart();
  showToast();
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  cart.splice(Number(button.dataset.remove), 1);
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
  orderItemsInput.value = cart.map(item => `${item.name} (€${item.price})`).join(', ');
  orderTotalInput.value = `€${cartTotalValue()}`;
});
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filters .active').classList.remove('active');
  button.classList.add('active');
}));
