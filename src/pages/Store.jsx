import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Search, Star, Trash2, X, Plus, Minus, 
  MapPin, Truck, Box, ChevronRight, Menu, CheckCircle2, Instagram, Facebook, MessageCircle, ShieldCheck
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { Link } from 'react-router-dom';

// --- STYLES INJECTADOS ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&family=Syne:wght@700;800&display=swap');

  :root {
    --color-main: #1DB954;
    --color-dark: #0A3D1F;
    --color-light: #F8FFF9;
    --color-accent: #FF6B35;
    --color-text: #1A1A2E;
  }

  body {
    font-family: 'Inter', sans-serif;
    color: var(--color-text);
    background-color: var(--color-light);
    overflow-x: hidden;
  }

  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-syne { font-family: 'Syne', sans-serif; }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: var(--color-main); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #169c46; }

  /* Animations */
  @keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-bounce-soft { animation: bounce-soft 2s infinite ease-in-out; }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 107, 53, 0); }
    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
  }
  .animate-pulse-ring { animation: pulse-ring 2s infinite; }

  /* Slide in for Intersection Observer */
  .slide-in-hidden {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .slide-in-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* 3D Card Transition */
  .card-3d-wrapper {
    perspective: 1000px;
  }
  .card-3d-element {
    transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
    transform-style: preserve-3d;
  }
  .card-3d-element.leaving {
    transition: transform 0.5s ease-out, box-shadow 0.5s ease-out;
  }

  /* Hide scrollbar for categories */
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const TESTIMONIALS = [
  { id: 1, name: "Mariana Silva", city: "São Paulo, SP", text: "Incrível! Pedi os ingredientes para o almoço e chegaram em 40 minutos. Os legumes super frescos. Salvaram meu dia!", rating: 5, img: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Carlos Eduardo", city: "Rio de Janeiro, RJ", text: "O app é super rápido e os preços são ótimos. Acompanhar a entrega em tempo real me dá muita segurança.", rating: 5, img: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Fernanda Costa", city: "Curitiba, PR", text: "As promoções da semana valem muito a pena. O entregador foi super educado e os itens chegaram bem embalados.", rating: 4, img: "https://i.pravatar.cc/150?u=3" },
];

const ProductCard = ({ product, onAdd }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; 
    const rotateY = ((x - centerX) / centerX) * 12;

    card.classList.remove('leaving');
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.1)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.classList.add('leaving');
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.boxShadow = `0 4px 6px -1px rgba(0,0,0,0.05)`;
  };

  return (
    <div className="card-3d-wrapper w-full h-full">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card-3d-element bg-white rounded-2xl p-4 h-full flex flex-col relative border border-gray-100 cursor-pointer"
      >
        {product.isPromo && (
          <div className="absolute top-4 left-4 z-10 bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse-ring">
            PROMOÇÃO
          </div>
        )}
        
        <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
          <img src={product.img} alt={product.name} className="object-cover w-full h-full mix-blend-multiply" loading="lazy" />
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1 line-clamp-2">{product.name}</h3>
          
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
            ))}
          </div>

          <div className="mt-auto pt-3 flex items-end justify-between">
            <div>
              {product.oldPrice && (
                <p className="text-xs text-gray-400 line-through">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</p>
              )}
              <p className="text-lg font-bold text-[#1DB954]">R$ {product.price.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <button 
              onClick={(e) => onAdd(product, e)}
              className="bg-[#1DB954] hover:bg-[#0A3D1F] text-white p-2 rounded-full transition-colors flex-shrink-0"
              aria-label="Adicionar ao carrinho"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Store() {
  const { products, categories } = useAppData();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-in-hidden').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else { s = 59; if (m > 0) m--; else { m = 59; if (h > 0) h--; } }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const flyToCartAnimation = (e, imgUrl) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const cartIcon = document.getElementById('navbar-cart-icon');
    if (!cartIcon) return;
    const targetRect = cartIcon.getBoundingClientRect();

    const flyingEl = document.createElement('img');
    flyingEl.src = imgUrl;
    flyingEl.style.position = 'fixed';
    flyingEl.style.zIndex = '9999';
    flyingEl.style.left = `${rect.left}px`;
    flyingEl.style.top = `${rect.top}px`;
    flyingEl.style.width = '40px';
    flyingEl.style.height = '40px';
    flyingEl.style.borderRadius = '50%';
    flyingEl.style.objectFit = 'cover';
    flyingEl.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    flyingEl.style.transition = 'all 0.7s cubic-bezier(0.2, 1, 0.3, 1)';
    
    document.body.appendChild(flyingEl);

    void flyingEl.offsetWidth;

    flyingEl.style.left = `${targetRect.left + 10}px`;
    flyingEl.style.top = `${targetRect.top + 10}px`;
    flyingEl.style.transform = 'scale(0.1)';
    flyingEl.style.opacity = '0.3';

    setTimeout(() => {
      cartIcon.classList.add('scale-125', 'text-[#1DB954]');
      setTimeout(() => cartIcon.classList.remove('scale-125', 'text-[#1DB954]'), 200);
    }, 600);

    setTimeout(() => {
      if(document.body.contains(flyingEl)) document.body.removeChild(flyingEl);
    }, 700);
  };

  const handleAddToCart = (product, e) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    
    flyToCartAnimation(e, product.img);
    showToast(`✅ ${product.name} adicionado!`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'Todas' || p.cat === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="relative min-h-screen">
      <style>{globalStyles}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0A3D1F]/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          
          <div className="flex items-center space-x-2 text-white cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="relative animate-bounce-soft text-[#1DB954]">
              <ShoppingCart size={32} strokeWidth={2.5} />
            </div>
            <span className="font-syne font-extrabold text-2xl tracking-tight">Carrinho</span>
          </div>

          <div className="hidden md:flex space-x-8 text-white/90 font-medium text-sm font-inter">
            <a href="#produtos" className="hover:text-[#1DB954] transition-colors">Produtos</a>
            <a href="#como-funciona" className="hover:text-[#1DB954] transition-colors">Como Funciona</a>
            <a href="#promocoes" className="hover:text-[#1DB954] transition-colors">Promoções</a>
            <Link to="/admin" className="hover:text-[#FF6B35] transition-colors font-bold">Acesso Admin</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-[#1DB954] hover:bg-[#169c46] text-white font-syne font-bold px-6 py-2 rounded-full transition-transform hover:scale-105">
              Fazer Pedido
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white transition-all duration-300"
              id="navbar-cart-icon"
            >
              <ShoppingCart size={28} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse-ring">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button className="md:hidden text-white"><Menu size={28} /></button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0A3D1F] overflow-hidden flex items-center">
        <div className="container mx-auto px-4 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 text-white">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20 slide-in-hidden">
              <Truck size={18} className="text-[#1DB954]" />
              <span className="text-sm font-medium">Frete grátis acima de R$150</span>
            </div>
            <h1 className="font-poppins text-5xl md:text-7xl font-bold leading-tight mb-6 slide-in-hidden" style={{transitionDelay: '100ms'}}>
              Compras de mercado <br/><span className="text-[#1DB954]">sem sair de casa.</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-gray-300 mb-8 max-w-lg slide-in-hidden" style={{transitionDelay: '200ms'}}>
              Mais de 3.000 produtos selecionados e entregues na sua porta em até 60 minutos. Frescor e qualidade garantidos.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 slide-in-hidden" style={{transitionDelay: '300ms'}}>
              <a href="#produtos" className="bg-[#1DB954] hover:bg-[#169c46] text-white font-syne font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 w-full sm:w-auto text-center shadow-[0_0_20px_rgba(29,185,84,0.4)]">
                Ver Produtos
              </a>
              <a href="#como-funciona" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-syne font-bold text-lg px-8 py-4 rounded-full transition-all w-full sm:w-auto text-center border border-white/20">
                Como funciona
              </a>
            </div>
          </div>
          <div className="md:w-2/5 mt-16 md:mt-0 relative slide-in-hidden hidden md:block" style={{transitionDelay: '400ms'}}>
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 bg-[#1DB954] rounded-full filter blur-[100px] opacity-30 animate-pulse"></div>
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" alt="Groceries" className="relative z-10 w-full h-full object-cover rounded-full border-8 border-[#0A3D1F] shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </header>

      {/* --- SEARCH & CATEGORY FILTERS --- */}
      <section id="produtos" className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 flex flex-col space-y-6 border border-gray-100">
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Buscar arroz, frango, leite..." 
              className="w-full bg-gray-50 border border-gray-200 text-[#1A1A2E] rounded-full py-4 pl-12 pr-6 font-inter focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto hide-scrollbar space-x-3 pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-full whitespace-nowrap transition-all font-medium text-sm
                  ${selectedCategory === cat.id 
                    ? 'bg-[#1DB954] text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-poppins font-bold text-[#1A1A2E]">
            {selectedCategory === 'Todas' ? 'Destaques da Semana' : selectedCategory}
          </h2>
          <span className="text-gray-500 font-inter text-sm">{filteredProducts.length} produtos</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#1A1A2E]">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mt-2">Tente buscar por outro termo ou categoria.</p>
          </div>
        )}
      </section>

      {/* --- PROMO BANNER --- */}
      <section id="promocoes" className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#1DB954] to-[#0A3D1F] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="md:w-2/3 relative z-10 text-center md:text-left mb-8 md:mb-0">
            <span className="bg-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Oferta Relâmpago</span>
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">Semana do Mercado <br/>🔥 30% OFF em Hortifrúti</h2>
            <p className="text-lg opacity-90 max-w-md mx-auto md:mx-0">Abasteça sua geladeira com os produtos mais frescos da cidade pelo menor preço.</p>
          </div>
          
          <div className="md:w-1/3 relative z-10 flex flex-col items-center">
            <p className="font-syne text-sm uppercase tracking-widest mb-3 opacity-80">A oferta termina em</p>
            <div className="flex space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 w-16 text-center border border-white/30">
                <span className="block text-2xl font-bold font-poppins">{String(timeLeft.h).padStart(2, '0')}</span>
                <span className="text-xs">Horas</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 w-16 text-center border border-white/30">
                <span className="block text-2xl font-bold font-poppins">{String(timeLeft.m).padStart(2, '0')}</span>
                <span className="text-xs">Min</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 w-16 text-center border border-white/30">
                <span className="block text-2xl font-bold font-poppins">{String(timeLeft.s).padStart(2, '0')}</span>
                <span className="text-xs">Seg</span>
              </div>
            </div>
            <button className="bg-white text-[#0A3D1F] hover:bg-gray-100 font-syne font-bold px-8 py-3 rounded-full transition-transform hover:scale-105 w-full max-w-[250px]">
              Aproveitar Agora
            </button>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-[#1A1A2E] mb-16 slide-in-hidden">
            Como funciona o Carrinho?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10"></div>

            <div className="flex flex-col items-center slide-in-hidden">
              <div className="w-24 h-24 bg-[#F8FFF9] rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform">
                <span className="text-5xl drop-shadow-md">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2 font-poppins">1. Escolha seus produtos</h3>
              <p className="text-gray-500 font-inter">Navegue pelo nosso catálogo com mais de 3.000 itens frescos e selecione o que precisa.</p>
            </div>

            <div className="flex flex-col items-center slide-in-hidden" style={{transitionDelay: '200ms'}}>
              <div className="w-24 h-24 bg-[#F8FFF9] rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-100 transform -rotate-3 hover:rotate-0 transition-transform">
                <span className="text-5xl drop-shadow-md">📦</span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2 font-poppins">2. Confirme seu pedido</h3>
              <p className="text-gray-500 font-inter">Revise o carrinho, aplique cupons e escolha a forma de pagamento segura.</p>
            </div>

            <div className="flex flex-col items-center slide-in-hidden" style={{transitionDelay: '400ms'}}>
              <div className="w-24 h-24 bg-[#F8FFF9] rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform">
                <span className="text-5xl drop-shadow-md">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2 font-poppins">3. Receba em casa</h3>
              <p className="text-gray-500 font-inter">Acompanhe o trajeto e receba suas compras na porta de casa em até 60 minutos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="bg-[#F8FFF9] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 slide-in-hidden">
            <h2 className="text-3xl font-poppins font-bold text-[#1A1A2E]">Quem usa, recomenda</h2>
            <p className="text-gray-500 mt-2">Veja o que nossos clientes estão dizendo.</p>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar space-x-6 pb-8 snap-x snap-mandatory">
            {TESTIMONIALS.map((test, index) => (
              <div key={test.id} className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-3xl shadow-sm border border-gray-100 snap-center slide-in-hidden" style={{transitionDelay: `${index * 150}ms`}}>
                <div className="flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < test.rating ? "fill-[#FF6B35] text-[#FF6B35]" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600 font-inter italic mb-6">"{test.text}"</p>
                <div className="flex items-center space-x-4">
                  <img src={test.img} alt={test.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-[#1A1A2E] text-sm">{test.name}</h4>
                    <p className="text-xs text-gray-500">{test.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0A3D1F] text-white pt-16 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart size={28} className="text-[#1DB954]" />
              <span className="font-syne font-bold text-2xl">Carrinho</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">Seu mercado, na sua porta. Entregas rápidas, produtos frescos e preço justo.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1DB954] transition-colors"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1DB954] transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1DB954] transition-colors"><MessageCircle size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold font-poppins mb-4">Departamentos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Hortifrúti</a></li>
              <li><a href="#" className="hover:text-white transition">Carnes e Peixes</a></li>
              <li><a href="#" className="hover:text-white transition">Padaria e Laticínios</a></li>
              <li><a href="#" className="hover:text-white transition">Bebidas</a></li>
              <li><a href="#" className="hover:text-white transition">Limpeza</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-poppins mb-4">Institucional</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-poppins mb-4">Atendimento</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Central de Ajuda (FAQ)</a></li>
              <li><a href="#" className="hover:text-white transition">Rastrear Pedido</a></li>
              <li><a href="#" className="hover:text-white transition">Devoluções</a></li>
              <li className="mt-4 flex items-center space-x-2">
                <ShieldCheck size={20} className="text-[#1DB954]" />
                <span>Site 100% Seguro</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-center text-gray-500 text-xs font-inter">
          © 2026 Carrinho. Todos os direitos reservados. Feito com 💚.
        </div>
      </footer>

      {/* --- CART DRAWER (SIDEBAR) --- */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={24} className="text-[#1DB954]" />
            <h2 className="font-poppins font-bold text-xl text-[#1A1A2E]">Meu Carrinho</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{cartItemCount}</span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <Box size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">Seu carrinho está vazio.</p>
              <p className="text-sm mt-2 mb-6">Que tal adicionar alguns produtos frescos?</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="bg-[#1DB954] text-white px-6 py-2 rounded-full font-bold text-sm"
              >
                Voltar às compras
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center space-x-4 bg-white">
                <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50 border border-gray-100" />
                
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-[#1A1A2E] line-clamp-1">{item.name}</h4>
                  <p className="text-[#1DB954] font-bold text-sm mt-1">R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 px-3 text-gray-500 hover:text-[#1DB954]"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 px-3 text-gray-500 hover:text-[#1DB954]"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            
            <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-gray-200 mb-4">
              <MapPin size={18} className="text-gray-400" />
              <input type="text" placeholder="CEP p/ entrega" className="bg-transparent border-none outline-none text-sm w-full font-inter" />
              <button className="text-[#1DB954] font-bold text-sm whitespace-nowrap">Calcular</button>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Taxa de Entrega</span>
                <span className={cartTotal > 150 ? "text-[#1DB954] font-bold" : ""}>
                  {cartTotal > 150 ? "Grátis" : "R$ 9,90"}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                <span className="font-poppins font-bold text-[#1A1A2E]">Total</span>
                <div className="text-right">
                  <span className="font-poppins font-bold text-2xl text-[#1A1A2E]">
                    R$ {(cartTotal + (cartTotal > 150 ? 0 : 9.9)).toFixed(2).replace('.', ',')}
                  </span>
                  {cartTotal <= 150 && (
                    <p className="text-[10px] text-gray-400">Faltam R$ {(150 - cartTotal).toFixed(2).replace('.', ',')} para frete grátis</p>
                  )}
                </div>
              </div>
            </div>

            <button className="w-full bg-[#1DB954] hover:bg-[#169c46] text-white font-syne font-bold text-lg py-4 rounded-xl flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/30">
              <span>Finalizar Pedido</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#1A1A2E] text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <CheckCircle2 size={18} className="text-[#1DB954]" />
        <span className="font-inter text-sm font-medium">{toast.message}</span>
      </div>

    </div>
  );
}
