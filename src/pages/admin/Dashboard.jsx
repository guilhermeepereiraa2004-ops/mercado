import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, ArrowUpRight
} from 'lucide-react';

export default function Dashboard() {
  const { finances, products } = useAppData();

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.stock > 0).length;

  const statCards = [
    { 
      title: 'Faturamento Total', 
      value: `R$ ${finances.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: <DollarSign size={24} className="text-[#1DB954]" />,
      trend: '+12.5%',
      isPositive: true
    },
    { 
      title: 'Pedidos Realizados', 
      value: finances.ordersCount.toString(), 
      icon: <ShoppingBag size={24} className="text-blue-500" />,
      trend: '+5.2%',
      isPositive: true
    },
    { 
      title: 'Clientes Ativos', 
      value: finances.activeUsers.toString(), 
      icon: <Users size={24} className="text-purple-500" />,
      trend: '-2.1%',
      isPositive: false
    },
    { 
      title: 'Produtos Cadastrados', 
      value: totalProducts.toString(), 
      icon: <TrendingUp size={24} className="text-[#FF6B35]" />,
      trend: `${activeProducts} em estoque`,
      isPositive: true
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[#1A1A2E]">Visão Geral</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe os principais indicadores da sua loja.</p>
        </div>
        <button className="bg-white border border-gray-200 text-[#1A1A2E] hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
          <span>Baixar Relatório</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.title.includes('Faturamento') ? 'bg-green-50' : stat.title.includes('Pedidos') ? 'bg-blue-50' : stat.title.includes('Clientes') ? 'bg-purple-50' : 'bg-orange-50'}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{stat.trend}</span>
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-poppins font-bold text-[#1A1A2E] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1A1A2E]">Desempenho de Vendas</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {/* Simple CSS Bar Chart Mockup */}
            {[40, 60, 35, 80, 55, 90, 70].map((height, i) => (
              <div key={i} className="w-full bg-gray-100 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 w-full bg-[#1DB954] rounded-t-lg transition-all duration-500 group-hover:bg-[#169c46]" 
                  style={{ height: `${height}%` }}
                ></div>
                <div className="absolute -bottom-6 w-full text-center text-xs text-gray-400">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#1A1A2E] mb-6">Pedidos Recentes</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-sm">
                    {`#${1020 + i}`}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">Cliente {i}</p>
                    <p className="text-xs text-gray-400">Há {i * 15} min</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#1DB954]">
                  R$ {(35.50 * i).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-[#1DB954] font-medium hover:bg-green-50 rounded-lg transition-colors">
            Ver todos os pedidos
          </button>
        </div>
      </div>
    </div>
  );
}
