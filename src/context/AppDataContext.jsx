/* eslint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { getTenantCommission, summarizeOrders } from '../lib/finance';

const INITIAL_TENANTS = [
  {
    id: 't1', name: 'Mercado Aurora', subdomain: 'aurora', status: 'Active', repassedAmount: 0,
    login: 'admin@mercadoaurora.com', password: 'aurora123', commissionMode: 'product', commissionRate: 2, createdAt: '2026-01-15',
    settings: {
      logoText: 'Aurora', heroEyebrow: 'Seu mercado, do seu jeito',
      heroTitle: 'Frescor que chega até você.',
      heroDescription: 'Uma seleção cuidadosa para abastecer sua casa, com entrega rápida e atendimento de verdade.',
      accent: '#ff5a36', deliveryTime: '35–50 min', minimumOrder: 30,
      address: 'Av. Oceânica, 1840 · Salvador, BA', whatsapp: '(71) 99999-8877',
    },
  },
  {
    id: 't2', name: 'Empório Vila Nova', subdomain: 'vilanova', status: 'Active', repassedAmount: 0,
    login: 'gestao@vilanova.com', password: 'vila123', commissionMode: 'order', commissionRate: 1.5, createdAt: '2026-03-08',
    settings: {
      logoText: 'Vila Nova', heroEyebrow: 'Sabor perto de casa', heroTitle: 'A despensa cheia, sem perder tempo.',
      heroDescription: 'Tudo o que você precisa, separado com carinho e entregue na sua porta.',
      accent: '#26705f', deliveryTime: '45–60 min', minimumOrder: 25,
      address: 'Rua das Flores, 72 · Salvador, BA', whatsapp: '(71) 98888-2211',
    },
  },
  {
    id: 't3', name: 'Hortifruti Raiz', subdomain: 'raiz', status: 'Active', repassedAmount: 0,
    login: 'contato@raiz.com', password: 'raiz123', commissionMode: 'order', commissionRate: 2.5, createdAt: '2026-05-21',
    settings: {
      logoText: 'Raiz', heroEyebrow: 'Direto do produtor', heroTitle: 'Mais cor e saúde na sua mesa.',
      heroDescription: 'Frutas, legumes e folhas selecionados todos os dias.', accent: '#4c7b42',
      deliveryTime: '40–55 min', minimumOrder: 35, address: 'Rua da Mata, 330 · Lauro de Freitas, BA',
      whatsapp: '(71) 97777-3355',
    },
  },
];

const INITIAL_PLATFORM_SETTINGS = {
  pixKey: 'financeiro@cestaos.com.br',
  receiverName: 'Cesta Tecnologia Ltda.',
  supportEmail: 'suporte@cestaos.com.br',
  paymentInstructions: 'Use a chave Pix abaixo e envie o comprovante para liberar sua loja.',
};

const INITIAL_CATEGORIES = [
  { id: 'cat-fresh', name: 'Hortifruti', icon: 'Leaf', color: '#e8f3df', tenantId: 't1' },
  { id: 'cat-pantry', name: 'Mercearia', icon: 'Package', color: '#f4ead7', tenantId: 't1' },
  { id: 'cat-meat', name: 'Carnes', icon: 'Beef', color: '#f8dfdd', tenantId: 't1' },
  { id: 'cat-dairy', name: 'Laticínios', icon: 'Milk', color: '#e2eef8', tenantId: 't1' },
  { id: 'cat-bakery', name: 'Padaria', icon: 'Croissant', color: '#f6e5cb', tenantId: 't1' },
  { id: 'cat-drinks', name: 'Bebidas', icon: 'CupSoda', color: '#e9e5f8', tenantId: 't1' },
  { id: 'cat-vila-drinks', name: 'Bebidas', icon: 'CupSoda', color: '#e4f1ed', tenantId: 't2' },
  { id: 'cat-vila-snacks', name: 'Petiscos', icon: 'Cookie', color: '#f5ead5', tenantId: 't2' },
];

const INITIAL_PRODUCT_GROUPS = [
  { id: 'grp-rice', name: 'Arroz', categoryId: 'cat-pantry', tenantId: 't1', createdAt: '2026-09-26' },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Tomate italiano selecionado', unit: 'Bandeja 500g', price: 6.99, oldPrice: 8.49, categoryId: 'cat-fresh', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=85', featured: true, stock: 48, tenantId: 't1' },
  { id: 2, name: 'Arroz Camil tipo 1', groupId: 'grp-rice', groupName: 'Arroz', brand: 'Camil', unit: 'Pacote 5kg', price: 24.9, oldPrice: null, categoryId: 'cat-pantry', img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=800&q=85', featured: false, stock: 120, tenantId: 't1' },
  { id: 9, name: 'Arroz Tio João tipo 1', groupId: 'grp-rice', groupName: 'Arroz', brand: 'Tio João', unit: 'Pacote 5kg', price: 27.49, oldPrice: 29.9, categoryId: 'cat-pantry', img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=800&q=80', featured: false, stock: 76, tenantId: 't1' },
  { id: 10, name: 'Arroz Prato Fino tipo 1', groupId: 'grp-rice', groupName: 'Arroz', brand: 'Prato Fino', unit: 'Pacote 5kg', price: 22.99, oldPrice: null, categoryId: 'cat-pantry', img: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=800&q=75', featured: false, stock: 54, tenantId: 't1' },
  { id: 3, name: 'Filé de peito de frango', unit: 'Bandeja 1kg', price: 18.5, oldPrice: 22.9, categoryId: 'cat-meat', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=85', featured: true, stock: 30, tenantId: 't1' },
  { id: 4, name: 'Leite integral', unit: 'Caixa 1L', price: 4.59, oldPrice: null, categoryId: 'cat-dairy', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85', featured: false, stock: 200, tenantId: 't1' },
  { id: 5, name: 'Pão artesanal de fermentação natural', unit: 'Unidade 500g', price: 14.9, oldPrice: 17.9, categoryId: 'cat-bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85', featured: true, stock: 16, tenantId: 't1' },
  { id: 6, name: 'Suco de laranja integral', unit: 'Garrafa 1L', price: 12.79, oldPrice: null, categoryId: 'cat-drinks', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=85', featured: false, stock: 65, tenantId: 't1' },
  { id: 7, name: 'Banana prata madura', unit: 'Aprox. 1kg', price: 7.49, oldPrice: null, categoryId: 'cat-fresh', img: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=85', featured: false, stock: 42, tenantId: 't1' },
  { id: 8, name: 'Queijo minas frescal', unit: 'Peça 400g', price: 21.9, oldPrice: 25.9, categoryId: 'cat-dairy', img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=85', featured: true, stock: 19, tenantId: 't1' },
  { id: 101, name: 'Cerveja artesanal IPA', unit: 'Garrafa 500ml', price: 18.9, oldPrice: null, categoryId: 'cat-vila-drinks', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=85', featured: true, stock: 120, tenantId: 't2' },
  { id: 102, name: 'Mix de castanhas', unit: 'Pacote 300g', price: 22.5, oldPrice: 26, categoryId: 'cat-vila-snacks', img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=85', featured: false, stock: 30, tenantId: 't2' },
];

const INITIAL_ORDERS = [
  { id: 'PED-1048', tenantId: 't1', customer: 'Marina Costa', phone: '(71) 99121-3030', address: 'Rua Pará, 118 · Pituba', payment: 'Pix', status: 'new', createdAt: '2026-09-25T13:42:00', subtotal: 87.36, deliveryFee: 7.9, total: 95.26, items: [{ productId: 1, name: 'Tomate italiano selecionado', qty: 2, price: 6.99 }, { productId: 3, name: 'Filé de peito de frango', qty: 2, price: 18.5 }, { productId: 5, name: 'Pão artesanal', qty: 1, price: 14.9 }, { productId: 8, name: 'Queijo minas frescal', qty: 1, price: 21.48 }] },
  { id: 'PED-1047', tenantId: 't1', customer: 'Gabriel Lima', phone: '(71) 98820-1144', address: 'Al. das Espatódeas, 42 · Caminho das Árvores', payment: 'Cartão', status: 'preparing', createdAt: '2026-09-25T13:18:00', subtotal: 132.7, deliveryFee: 0, total: 132.7, items: [{ productId: 2, name: 'Arroz branco tipo 1', qty: 2, price: 24.9 }, { productId: 4, name: 'Leite integral', qty: 8, price: 4.59 }, { productId: 7, name: 'Banana prata madura', qty: 3, price: 7.49 }, { productId: 8, name: 'Queijo minas frescal', qty: 1, price: 23.76 }] },
  { id: 'PED-1046', tenantId: 't1', customer: 'Lívia Nascimento', phone: '(71) 99910-7788', address: 'Rua Amazonas, 901 · Barra', payment: 'Pix', status: 'route', createdAt: '2026-09-25T12:56:00', subtotal: 54.18, deliveryFee: 7.9, total: 62.08, items: [{ productId: 1, name: 'Tomate italiano selecionado', qty: 2, price: 6.99 }, { productId: 6, name: 'Suco de laranja integral', qty: 2, price: 12.79 }, { productId: 5, name: 'Pão artesanal', qty: 1, price: 14.62 }] },
  { id: 'PED-1045', tenantId: 't1', customer: 'Rafael Souza', phone: '(71) 98111-4250', address: 'Av. ACM, 221 · Itaigara', payment: 'Cartão', status: 'delivered', createdAt: '2026-09-25T11:37:00', subtotal: 198.4, deliveryFee: 0, total: 198.4, items: [{ productId: 3, name: 'Filé de peito de frango', qty: 4, price: 18.5 }, { productId: 2, name: 'Arroz branco tipo 1', qty: 3, price: 24.9 }, { productId: 8, name: 'Queijo minas frescal', qty: 2, price: 24.85 }] },
  { id: 'PED-1039', tenantId: 't1', customer: 'Beatriz Alves', phone: '(71) 99010-8888', address: 'Rua Chile, 16 · Centro', payment: 'Dinheiro', status: 'delivered', createdAt: '2026-09-24T18:20:00', subtotal: 146.55, deliveryFee: 0, total: 146.55, items: [{ productId: 4, name: 'Leite integral', qty: 10, price: 4.59 }, { productId: 5, name: 'Pão artesanal', qty: 3, price: 14.9 }, { productId: 1, name: 'Tomate italiano selecionado', qty: 8, price: 6.99 }] },
];

const AppDataContext = createContext(null);

function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  useEffect(() => {
    const syncAcrossTabs = (event) => {
      if (event.key !== key || !event.newValue) return;
      try { setValue(JSON.parse(event.newValue)); } catch { /* ignore invalid external state */ }
    };
    window.addEventListener('storage', syncAcrossTabs);
    return () => window.removeEventListener('storage', syncAcrossTabs);
  }, [key]);

  return [value, setValue];
}

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  return context;
};

export function AppDataProvider({ children }) {
  const [activeTenantId, setActiveTenantId] = useStickyState('t1', 'cesta_v4_active_tenant');
  const [tenants, setTenants] = useStickyState(INITIAL_TENANTS, 'cesta_v4_tenants');
  const [products, setProducts] = useStickyState(INITIAL_PRODUCTS, 'cesta_v4_products');
  const [categories, setCategories] = useStickyState(INITIAL_CATEGORIES, 'cesta_v4_categories');
  const [productGroups, setProductGroups] = useStickyState(INITIAL_PRODUCT_GROUPS, 'cesta_v4_product_groups');
  const [orders, setOrders] = useStickyState(INITIAL_ORDERS, 'cesta_v4_orders');
  const [platformSettings, setPlatformSettings] = useStickyState(INITIAL_PLATFORM_SETTINGS, 'cesta_v4_platform');

  useEffect(() => {
    const migrationKey = 'cesta_v4_product_groups_migrated';
    if (window.localStorage.getItem(migrationKey)) return;
    setProducts((current) => {
      if (current.some((product) => product.groupName?.trim().toLocaleLowerCase('pt-BR') === 'arroz')) return current;
      const rice = current.find((product) => product.tenantId === 't1' && product.name.toLocaleLowerCase('pt-BR').includes('arroz'));
      if (!rice) return current;
      const grouped = current.map((product) => product.id === rice.id ? { ...product, name: 'Arroz Camil tipo 1', groupId: 'grp-rice', groupName: 'Arroz', brand: 'Camil' } : product);
      return [...grouped,
        { ...rice, id: 'demo-rice-tio-joao', name: 'Arroz Tio João tipo 1', groupId: 'grp-rice', groupName: 'Arroz', brand: 'Tio João', price: 27.49, oldPrice: 29.9, stock: 76 },
        { ...rice, id: 'demo-rice-prato-fino', name: 'Arroz Prato Fino tipo 1', groupId: 'grp-rice', groupName: 'Arroz', brand: 'Prato Fino', price: 22.99, oldPrice: null, stock: 54 },
      ];
    });
    window.localStorage.setItem(migrationKey, '1');
  }, [setProducts]);

  useEffect(() => {
    const migrationKey = 'cesta_v4_product_group_ids_migrated';
    if (window.localStorage.getItem(migrationKey)) return;
    setProducts((current) => current.map((product) => {
      if (product.groupId || !product.groupName) return product;
      const matchingGroup = productGroups.find((group) => group.tenantId === product.tenantId && group.name.trim().toLocaleLowerCase('pt-BR') === product.groupName.trim().toLocaleLowerCase('pt-BR'));
      return matchingGroup ? { ...product, groupId: matchingGroup.id } : product;
    }));
    window.localStorage.setItem(migrationKey, '1');
  }, [productGroups, setProducts]);

  const activeTenant = tenants.find((tenant) => tenant.id === activeTenantId) || tenants[0];
  const tenantProducts = products.filter((product) => product.tenantId === activeTenantId);
  const tenantCategories = categories.filter((category) => category.tenantId === activeTenantId);
  const tenantProductGroups = productGroups.filter((group) => group.tenantId === activeTenantId);
  const tenantOrders = orders.filter((order) => order.tenantId === activeTenantId);
  const commissionAgreement = getTenantCommission(activeTenant, platformSettings);

  const tenantSummary = summarizeOrders(tenantOrders, commissionAgreement);
  const repassedAmount = Math.min(Number(activeTenant?.repassedAmount || 0), tenantSummary.platformFee);
  const tenantFinances = {
    ...tenantSummary,
    grossRevenue: tenantSummary.customerProductRevenue,
    ordersCount: tenantOrders.length,
    repassedAmount,
    amountDue: Math.max(0, tenantSummary.platformFee - repassedAmount),
  };

  const addTenant = (tenant) => {
    const id = `t${Date.now()}`;
    const newTenant = {
      ...tenant, id, status: 'Active', repassedAmount: 0, createdAt: new Date().toISOString().slice(0, 10),
      settings: {
        logoText: tenant.name, heroEyebrow: 'Seu mercado, mais perto', heroTitle: 'Tudo o que você precisa, em poucos cliques.',
        heroDescription: 'Produtos selecionados e entrega rápida para facilitar a sua rotina.', accent: '#ff5a36',
        deliveryTime: '40–60 min', minimumOrder: 30, address: '', whatsapp: '',
      },
    };
    setTenants((current) => [...current, newTenant]);
    return id;
  };

  const updateTenant = (id, data) => setTenants((current) => current.map((tenant) => tenant.id === id ? { ...tenant, ...data } : tenant));
  const removeTenant = (id) => setTenants((current) => current.filter((tenant) => tenant.id !== id));
  const updateTenantSettings = (data) => setTenants((current) => current.map((tenant) => tenant.id === activeTenantId ? { ...tenant, settings: { ...tenant.settings, ...data } } : tenant));
  const updatePlatformSettings = (data) => setPlatformSettings((current) => ({ ...current, ...data }));

  const addProduct = (product) => setProducts((current) => [...current, { ...product, id: Date.now(), tenantId: activeTenantId, price: Number(product.price), oldPrice: product.oldPrice ? Number(product.oldPrice) : null, stock: Number(product.stock) }]);
  const updateProduct = (id, data) => setProducts((current) => current.map((product) => product.id === id ? { ...product, ...data } : product));
  const deleteProduct = (id) => setProducts((current) => current.filter((product) => product.id !== id));
  const addCategory = (category) => setCategories((current) => [...current, { ...category, id: `cat-${Date.now()}`, tenantId: activeTenantId }]);
  const updateCategory = (id, data) => setCategories((current) => current.map((category) => category.id === id ? { ...category, ...data } : category));
  const deleteCategory = (id) => setCategories((current) => current.filter((category) => category.id !== id));
  const addProductGroup = (group) => {
    const id = `grp-${Date.now()}`;
    setProductGroups((current) => [...current, { ...group, id, tenantId: activeTenantId, createdAt: new Date().toISOString().slice(0, 10) }]);
    return id;
  };
  const updateProductGroup = (id, data) => setProductGroups((current) => current.map((group) => group.id === id ? { ...group, ...data } : group));
  const deleteProductGroup = (id) => {
    const target = productGroups.find((group) => group.id === id);
    setProductGroups((current) => current.filter((group) => group.id !== id));
    setProducts((current) => current.map((product) => product.groupId === id || (!product.groupId && target && product.groupName?.trim().toLocaleLowerCase('pt-BR') === target.name.trim().toLocaleLowerCase('pt-BR')) ? { ...product, groupId: '', groupName: '' } : product));
  };

  const createOrder = (payload) => {
    const sequence = 1050 + orders.length;
    const order = {
      ...payload,
      id: `PED-${sequence}`,
      tenantId: activeTenantId,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    return order;
  };

  const updateOrderStatus = (id, status) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));

  const value = {
    tenants, orders, allProducts: products, allCategories: categories,
    platformSettings, activeTenantId, setActiveTenantId, activeTenant, commissionAgreement,
    products: tenantProducts, categories: tenantCategories, productGroups: tenantProductGroups, tenantOrders, finances: tenantFinances,
    addTenant, updateTenant, removeTenant, updateTenantSettings, updatePlatformSettings,
    addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory,
    addProductGroup, updateProductGroup, deleteProductGroup,
    createOrder, updateOrderStatus,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
