import React, { createContext, useState, useContext } from 'react';

const INITIAL_CATEGORIES = [
  { id: 'Todas', icon: '🛒', name: 'Todas' },
  { id: 'Hortifrúti', icon: '🥦', name: 'Hortifrúti' },
  { id: 'Carnes', icon: '🥩', name: 'Carnes' },
  { id: 'Laticínios', icon: '🥛', name: 'Laticínios' },
  { id: 'Bebidas', icon: '🍺', name: 'Bebidas' },
  { id: 'Padaria', icon: '🍞', name: 'Padaria' },
  { id: 'Higiene', icon: '🧴', name: 'Higiene' },
  { id: 'Pet', icon: '🐾', name: 'Pet' },
  { id: 'Snacks', icon: '🍫', name: 'Snacks' }
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Tomate Carmem Selecionado 1kg", price: 6.99, oldPrice: 9.99, cat: "Hortifrúti", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80", rating: 5, isPromo: true, stock: 50 },
  { id: 2, name: "Arroz Branco Camil 5kg", price: 24.90, oldPrice: null, cat: "Todas", img: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=400&q=80", rating: 4, isPromo: false, stock: 120 },
  { id: 3, name: "Peito de Frango Sadia 1kg", price: 18.50, oldPrice: 22.90, cat: "Carnes", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80", rating: 4, isPromo: true, stock: 30 },
  { id: 4, name: "Leite Integral Piracanjuba 1L", price: 4.59, oldPrice: null, cat: "Laticínios", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80", rating: 5, isPromo: false, stock: 200 },
  { id: 5, name: "Pão de Forma Pullman 500g", price: 7.49, oldPrice: 8.99, cat: "Padaria", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", rating: 4, isPromo: true, stock: 15 },
  { id: 6, name: "Cerveja Heineken Long Neck", price: 6.29, oldPrice: null, cat: "Bebidas", img: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&w=400&q=80", rating: 5, isPromo: false, stock: 500 },
  { id: 7, name: "Sabonete Dove Original 90g", price: 3.19, oldPrice: null, cat: "Higiene", img: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=400&q=80", rating: 5, isPromo: false, stock: 100 },
  { id: 8, name: "Ração Pedigree Adultos 10kg", price: 119.90, oldPrice: 139.90, cat: "Pet", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80", rating: 4, isPromo: true, stock: 8 },
  { id: 9, name: "Chocolate Milka Ao Leite 100g", price: 12.99, oldPrice: 15.50, cat: "Snacks", img: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=400&q=80", rating: 5, isPromo: true, stock: 45 },
  { id: 10, name: "Banana Prata (Cacho 1kg)", price: 5.49, oldPrice: null, cat: "Hortifrúti", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", rating: 4, isPromo: false, stock: 25 },
  { id: 11, name: "Café Torrado Melitta 500g", price: 17.80, oldPrice: 19.90, cat: "Todas", img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=400&q=80", rating: 5, isPromo: true, stock: 60 },
  { id: 12, name: "Ovos Brancos Grandes 12un", price: 9.99, oldPrice: null, cat: "Laticínios", img: "https://images.unsplash.com/photo-1587486913049-53fc88980bfc?auto=format&fit=crop&w=400&q=80", rating: 4, isPromo: false, stock: 40 },
];

const INITIAL_FINANCES = {
  revenue: 15430.50,
  ordersCount: 142,
  activeUsers: 89
};

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [finances, setFinances] = useState(INITIAL_FINANCES);

  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <AppDataContext.Provider value={{
      products,
      categories,
      finances,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
