import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { 
  Search, Plus, Edit2, Trash2, Filter, MoreVertical, Image as ImageIcon
} from 'lucide-react';

export default function ProductsManager() {
  const { products, categories, deleteProduct } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'Todas' || p.cat === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[#1A1A2E]">Mercadorias</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os produtos, preços e estoque da loja.</p>
        </div>
        <button className="bg-[#1DB954] hover:bg-[#169c46] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 shadow-lg shadow-green-500/20">
          <Plus size={18} />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar mercadoria..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 focus:border-[#1DB954] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter size={16} />
              <span>Filtrar:</span>
            </div>
            <select 
              className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#1DB954]/50 flex-1 sm:flex-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      {product.img ? (
                        <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-[#1A1A2E]">{product.name}</div>
                        {product.isPromo && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-[#FF6B35]/10 text-[#FF6B35]">
                            Em Promoção
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                      {product.cat}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#1A1A2E] font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                    {product.oldPrice && (
                      <div className="text-xs text-gray-400 line-through">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">{product.stock} un.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-[#1DB954] hover:bg-green-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2">📦</div>
                    <p className="text-gray-500 font-medium text-sm">Nenhum produto encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Mostrando {filteredProducts.length} de {products.length} produtos</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50">Próxima</button>
          </div>
        </div>

      </div>
    </div>
  );
}
