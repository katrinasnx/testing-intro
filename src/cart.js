function addToCart(cart, product, quantity = 1) {
  if (quantity <= 0) {
    throw new RangeError('Количество должно быть больше нуля');
  }

  const existingItem = cart.find(item => item.id === product.id);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  
  if (currentQuantity + quantity > product.stock) {
    throw new RangeError('Превышен остаток на складе');
  }

  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...cart, { ...product, quantity }];
}

function changeQuantity(cart, productId, quantity) {
  if (quantity <= 0) {
    throw new RangeError('Количество должно быть больше нуля');
  }

  const itemToChange = cart.find(item => item.id === productId);
  if (!itemToChange) {
    return cart;
  }

  if (quantity > itemToChange.stock) {
    throw new RangeError('Превышен остаток на складе');
  }

  return cart.map(item =>
    item.id === productId ? { ...item, quantity } : item
  );
}

function removeFromCart(cart, productId) {
  return cart.filter(item => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode = '') {
  const subtotal = calculateCartSubtotal(cart);
  let discount = 0;

  if (promoCode === 'SAVE10' && subtotal >= 20000) {
    discount = Math.round(subtotal * 0.1);
  }

  const discountedSubtotal = subtotal - discount;
  const delivery = discountedSubtotal >= 50000 || discountedSubtotal === 0 ? 0 : 30000;
  const total = discountedSubtotal + delivery;

  return {
    subtotal,
    discount,
    delivery,
    total,
  };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;