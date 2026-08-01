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

const productImages = ['IMG_1609','IMG_1610','IMG_1611','IMG_1612','IMG_1613','IMG_1614','IMG_1615','IMG_1616','IMG_1617','IMG_1618','IMG_1619','IMG_1620','IMG_1621','IMG_1622','IMG_1623','IMG_1624','IMG_1625','IMG_1626','IMG_1628','IMG_1629','IMG_1630','IMG_1631','IMG_1632','IMG_1633','IMG_1634','IMG_1635','IMG_1636','IMG_1637','IMG_1638','IMG_1639','IMG_1640'];

// Espaços extra: substituir nome e preço quando estiverem definidos.
const extraProducts = Array.from({ length: 28 }, (_, index) => {
  const number = String(index + 4).padStart(2, '0');
  const image = productImages[index + 3];
  return `<article class="product-card product-placeholder product-real">
    <div class="product-image image-placeholder" style="background-image:url('assets/tattoos/products/${image}.jpg')"><span class="available">NOVO</span></div>
    <div class="product-info"><div><h3>Novo design</h3><p>tattoo temporária</p></div><button class="add-button" data-name="Novo design ${number}" data-price="0">Adicionar <span>+</span></button></div>
    <p class="price">€— <small>preço a definir</small></p>
  </article>`;
}).join('');
document.querySelector('.products').insertAdjacentHTML('beforeend', extraProducts);

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;
  cartHeadingCount.textContent = cart.length;
  cartTotal.textContent = `€${total}`;
  cartShipping.textContent = total >= 25 ? '✓ Portes grátis incluídos.' : `Faltam €${25 - total} para teres portes grátis.`;
  cartItems.innerHTML = cart.length ? cart.map((item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><small>Design exclusivo</small></div><div>€${item.price} <button aria-label="Remover ${item.name}" data-remove="${index}">×</button></div></div>`).join('') : '<p class="empty-cart">A tua seleção está vazia.</p>';
  document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}
function openCart() { cartEl.classList.add('open'); overlay.classList.add('show'); cartEl.setAttribute('aria-hidden', 'false'); }
function closeCart() { cartEl.classList.remove('open'); overlay.classList.remove('show'); cartEl.setAttribute('aria-hidden', 'true'); }
function cartTotalValue() { return cart.reduce((sum, item) => sum + item.price, 0); }
function openOrderModal() {
  if (!cart.length) {
    toast.textContent = 'Adiciona primeiro uma tattoo à tua bag.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
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
document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => {
  cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
  renderCart(); openCart(); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200);
}));
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
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => { document.querySelector('.filters .active').classList.remove('active'); button.classList.add('active'); }));
