'use client';
import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Search, Download } from 'lucide-react';

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
  text: "#4B5563"
};

export default function ViewTableEscenario({
  escenarios = [],
  loading = false
}) {
  const [sortField, setSortField] = useState('RESULTADO');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = useMemo(() => {
    if (!escenarios.length) return [];
    
    const allKeys = new Set();
    escenarios.forEach(escenario => {
      Object.keys(escenario).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys);
  }, [escenarios]);

  const processedData = useMemo(() => {
    if (!escenarios.length) return [];

    let filtered = escenarios.filter(escenario => 
      Object.values(escenario).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField] || 0;
        const bVal = b[sortField] || 0;
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [escenarios, searchTerm, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const downloadCSV = () => {
    if (!escenarios.length) return;

    const headers = columns.join(',');
    const csvContent = escenarios.map(escenario => 
      columns.map(col => escenario[col] || '').join(',')
    ).join('\n');

    const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'escenarios_simulacion.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!escenarios.length) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-dashed border-gray-200">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>
          No hay datos de escenarios
        </h3>
        <p className="text-gray-600">
          Ejecuta una simulación para ver los resultados
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold" style={{ color: colors.primary }}>
              Escenarios de Simulación
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {escenarios.length} escenarios generados
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar escenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
            
            <button
              onClick={downloadCSV}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary
              }}
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {column}
                    {sortField === column && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((escenario, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                {columns.map((column) => (
                  <td 
                    key={column} 
                    className={`px-6 py-4 text-sm ${
                      column === 'RESULTADO' 
                        ? 'font-semibold text-green-600' 
                        : 'text-gray-900'
                    }`}
                  >
                    {escenario[column]?.toFixed?.(4) || escenario[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, processedData.length)} de{' '}
              {processedData.length} escenarios
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}