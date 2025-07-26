import React, { useState } from 'react';
import { Calculator, Home, DollarSign, Percent } from 'lucide-react';

export const MortgageCalculator: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<string>('');

  const calculate = (ltv: number) => {
    if (!purchasePrice) return { loan: 0, ownFunds: 0 };
    
    const price = parseInt(purchasePrice);
    const loan = price * (ltv / 100);
    const ownFunds = price - loan;
    
    return { loan, ownFunds };
  };

  const ltv80 = calculate(80);
  const ltv90 = calculate(90);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hypoteční kalkulačka</h1>
        <p className="text-lg text-gray-600">Výpočet maximální výše úvěru a vlastních zdrojů</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            <Home className="inline w-5 h-5 mr-2" />
            Kupní cena nemovitosti
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="2000000"
              min="0"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Zadejte kupní cenu nemovitosti v korunách českých
          </p>
        </div>

        {purchasePrice && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mr-3">
                  <Percent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">LTV 80%</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-blue-700 font-medium">Výše úvěru:</span>
                  <span className="text-2xl font-bold text-blue-900">
                    {ltv80.loan.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-blue-700 font-medium">Vlastní zdroje:</span>
                  <span className="text-xl font-semibold text-blue-800">
                    {ltv80.ownFunds.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <div className="text-sm text-blue-600 mt-4 bg-blue-100 rounded-lg p-3">
                  <strong>Konzervativní varianta</strong><br />
                  Nižší riziko pro banku i klienta. Vhodné pro stabilní příjmy.
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg mr-3">
                  <Percent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900">LTV 90%</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-green-700 font-medium">Výše úvěru:</span>
                  <span className="text-2xl font-bold text-green-900">
                    {ltv90.loan.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-green-700 font-medium">Vlastní zdroje:</span>
                  <span className="text-xl font-semibold text-green-800">
                    {ltv90.ownFunds.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <div className="text-sm text-green-600 mt-4 bg-green-100 rounded-lg p-3">
                  <strong>Maximální varianta</strong><br />
                  Vyšší úvěr, nižší vlastní zdroje. Vyžaduje vyšší příjmy.
                </div>
              </div>
            </div>
          </div>
        )}

        {purchasePrice && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Shrnutí</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-gray-900">
                  {parseInt(purchasePrice).toLocaleString('cs-CZ')} Kč
                </div>
                <div className="text-sm text-gray-600">Kupní cena</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {(ltv90.loan - ltv80.loan).toLocaleString('cs-CZ')} Kč
                </div>
                <div className="text-sm text-gray-600">Rozdíl v úvěru</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-green-600">
                  {(ltv80.ownFunds - ltv90.ownFunds).toLocaleString('cs-CZ')} Kč
                </div>
                <div className="text-sm text-gray-600">Úspora vlastních zdrojů</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};