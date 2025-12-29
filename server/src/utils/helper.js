export const calculateCartSummary = (cart) => {
  // Initialize totals
  let totalAmount = 0;
  let totalActual = 0;

  // Calculate totals from cart products
  cart?.products?.forEach(({ productDetail, quantity }) => {
    if (!productDetail) return;

    const actualPrice = Number(productDetail.actualPrice) || 0;

    // Calculate discounted price depending on your discount field format
    let discountedPrice = actualPrice;
    discountedPrice = Number(productDetail.discountedPrice);

    totalActual += actualPrice * quantity;
    totalAmount += productDetail.price * quantity;
  });

  cart.totalAmount = totalAmount.toFixed(2);
  cart.totalActual = totalActual.toFixed(2);
  cart.savedAmount = (totalActual - totalAmount).toFixed(2);

  return cart;
};

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });