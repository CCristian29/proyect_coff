import React, { useState } from 'react';
import { Coffee, Calculator, Printer, Import } from 'lucide-react';
import { jsPDF } from "jspdf";
import "./index.css";

// Helper function to format numbers according to Colombian standards
const formatNumber = (value: number, decimals: number = 0) => {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

function App() {
  const [dryWeight, setDryWeight] = useState('');
  const [price, setPrice] = useState('');
  const [hullingPercentage, setHullingPercentage] = useState('');
  const [grindingPercentage, setGrindingPercentage] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateResult = (e: React.FormEvent) => {
    e.preventDefault();
    const dryWeightNum = parseFloat(dryWeight);
    const priceNum = parseFloat(price);
    const hullingPercentageNum = parseFloat(hullingPercentage);
    const grindingPercentageNum = parseFloat(grindingPercentage);

    if (isNaN(dryWeightNum) || isNaN(priceNum) || isNaN(hullingPercentageNum) || isNaN(grindingPercentageNum)) {
      alert('Por favor, ingrese valores numéricos válidos en todos los campos.');
      return;
    }

    const hulledWeight = dryWeightNum * (1 - hullingPercentageNum / 100);
    const groundWeight = hulledWeight * (1 - grindingPercentageNum / 100);
    const totalCost = dryWeightNum * priceNum;
    const finalWeightGrams = groundWeight * 1000; // Convert to grams
    const finalValue = finalWeightGrams * 40; // precio por gramo
    const profit = finalValue - totalCost;

    setResult({
      hulledWeight: formatNumber(hulledWeight * 1000), // convertir a gramos
      groundWeight: formatNumber(finalWeightGrams),
      totalCost: formatNumber(totalCost),
      finalValue: formatNumber(finalValue),
      profit: formatNumber(profit),
    });
  };

  const printPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Café Tostado - Resultados", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Valores ingresados:", 20, 40);
    doc.text(`Cantidad de kg seco: ${dryWeight} kg`, 30, 50);
    doc.text(`Precio por kg: $${price} COP`, 30, 60);
    doc.text(`Porcentaje en trillado: ${hullingPercentage}%`, 30, 70);
    doc.text(`Porcentaje molido: ${grindingPercentage}%`, 30, 80);

    doc.text("Resultados:", 20, 100);
    doc.text(`Peso trillado: ${result.hulledWeight} g`, 30, 110);
    doc.text(`Peso molido: ${result.groundWeight} g`, 30, 120);
    doc.text(`Costo total: $${result.totalCost} COP`, 30, 130);
    doc.text(`Valor final: $${result.finalValue} COP`, 30, 140);
    doc.text(`Ganancia: $${result.profit} COP`, 30, 150);

    doc.save("cafe-tostado-resultados.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-100 to-brown-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Coffee className="text-brown-600 w-10 h-10 mr-2" />
          <h1 className="text-2xl font-bold text-brown-800">
            Calcular proceso de Café
          </h1>
        </div>
        <form onSubmit={calculateResult} className="space-y-4">
          <InputField
            id="dryWeight"
            label="Ingrese cantidad de kg seco"
            value={dryWeight}
            onChange={setDryWeight}
            placeholder="0,00"
          />
          <InputField
            id="price"
            label="Precio por kg (COP)"
            value={price}
            onChange={setPrice}
            placeholder="0"
          />
          <InputField
            id="hullingPercentage"
            label="Porcentaje de perdida al trillado (peso)"
            value={hullingPercentage}
            onChange={setHullingPercentage}
            placeholder="0"
          />
          <InputField
            id="grindingPercentage"
            label="Porcentaje de perdida al moler (peso)"
            value={grindingPercentage}
            onChange={setGrindingPercentage}
            placeholder="0"
          />
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 transition duration-150 ease-in-out"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Calcular
          </button>
        </form>
        {result && (
          <div className="mt-6">
            <div className="p-4 bg-brown-50 rounded-md mb-4">
              <h2 className="text-lg font-semibold text-brown-800 mb-4">
                Resultados:
              </h2>
              <table className="w-full table-auto border-collapse border border-gray-300">
                <tbody>
                  <tr className="bg-white border-b">
                    <th className="text-left px-4 py-2 text-sm text-gray-600">
                      Peso al trillar
                    </th>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {result.hulledWeight} g
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-2 text-sm text-gray-600">
                      Peso al moler
                    </th>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {result.groundWeight} g
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="text-left px-4 py-2 text-sm text-yellow-600">
                      Costo compra total
                    </th>
                    <td className="px-4 py-2 text-sm font-semibold text-yellow-600">
                      ${result.totalCost} COP
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-2 text-sm text-blue-600">
                      Valor de venta
                    </th>
                    <td className="px-4 py-2 text-sm font-semibold text-blue-600">
                      ${result.finalValue} COP
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <th className="text-left px-4 py-2 text-sm font-bold text-green-700">
                      Ganancia
                    </th>
                    <td className="px-4 py-2 text-sm font-bold text-green-700">
                      ${result.profit} COP
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={printPDF}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimir PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ id, label, value, onChange, placeholder }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-brown-500 focus:ring focus:ring-brown-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
        placeholder={placeholder}
        step="0.01"
        min="0"
        required
      />
    </div>
  );
}

export default App;