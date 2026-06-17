export const getMrpSavings = (items = []) => {
  let totalMrp = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    const variant = item?.product?.variants?.find(
      (v) => v?.sku === item?.variantSku
    );
    if (!variant) return;

    totalMrp += variant.mrp * item.quantity;
    totalPrice += variant.price * item.quantity;
  });

  return {
    totalMrp,
    totalPrice,
    mrpDiscount: totalMrp - totalPrice,
  };
};
