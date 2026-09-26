export const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const getTenantCommission = (tenant, legacyPlatformSettings = {}) => ({
  commissionMode: tenant?.commissionMode || legacyPlatformSettings.commissionMode || 'order',
  commissionRate: Number(tenant?.commissionRate ?? legacyPlatformSettings.commissionRate ?? 0),
});

export const getOrderBaseSubtotal = (order) => Number(order.baseSubtotal ?? order.subtotal ?? 0);

export const getOrderPlatformFee = (order, platformSettings) => {
  if (order.platformFee !== undefined && order.platformFee !== null) return Number(order.platformFee);
  return roundMoney(getOrderBaseSubtotal(order) * (Number(platformSettings.commissionRate || 0) / 100));
};

export const summarizeOrders = (orders, platformSettings, deliveredOnly = true) => {
  const selected = deliveredOnly ? orders.filter((order) => order.status === 'delivered') : orders;
  const customerProductRevenue = selected.reduce((sum, order) => sum + Number(order.subtotal || 0), 0);
  const baseProductRevenue = selected.reduce((sum, order) => sum + getOrderBaseSubtotal(order), 0);
  const deliveryRevenue = selected.reduce((sum, order) => sum + Number(order.deliveryFee || 0), 0);
  const platformFee = selected.reduce((sum, order) => sum + getOrderPlatformFee(order, platformSettings), 0);
  const totalCollected = customerProductRevenue + deliveryRevenue;

  return {
    customerProductRevenue: roundMoney(customerProductRevenue),
    baseProductRevenue: roundMoney(baseProductRevenue),
    deliveryRevenue: roundMoney(deliveryRevenue),
    platformFee: roundMoney(platformFee),
    totalCollected: roundMoney(totalCollected),
    netRevenue: roundMoney(totalCollected - platformFee),
    completedCount: selected.length,
    averageTicket: selected.length ? roundMoney(totalCollected / selected.length) : 0,
  };
};
