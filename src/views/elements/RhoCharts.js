'use client';
import React, { memo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

function RhoCharts({ rhoData = [], rhoKeys = [] }) {
  if (!rhoData?.length) return <p className="text-gray-600">No hay datos de rho para graficar.</p>;

  return (
    <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue mb-4">
      <h2 className="text-lg font-semibold mb-4">Coeficientes Rho vs Riqueza Inicial</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rhoKeys.map((rho, key) => (
          <div key={key} className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-md font-semibold mb-2">Gráfica de {rho}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={rhoData[key]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="riquezaFinal" label={{ value: 'Riqueza Final', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rho" stroke="#14213d" dot={false} name={rho} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(RhoCharts);