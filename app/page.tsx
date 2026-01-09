"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Download, Info } from "lucide-react";

export default function LabCalculator() {
  const [obezbolCount, setObezbolCount] = useState(0);
  const [obezbolFree, setObezbolFree] = useState(0);
  const [days, setDays] = useState(0);
  const [product, setProduct] = useState("analgetik");
  const [equipment, setEquipment] = useState(false);
  const [security, setSecurity] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const [includeLab, setIncludeLab] = useState(false);
  const [includeEquipment, setIncludeEquipment] = useState(false);
  const [includeSecurity, setIncludeSecurity] = useState(false);
  const [includeAssistant, setIncludeAssistant] = useState(false);
  const [obezbolPrice, setObezbolPrice] = useState(0);
  const [analgetikSellPrice, setAnalgetikSellPrice] = useState(0);
  const [spankSellPrice, setSpankSellPrice] = useState(0);

  const baseLab = 50000;
  const baseRent = 1000;
  const analgetikPerObezbol = 3;

  let totalInvest = 0;
  let dailyRent = baseRent;
  const upgrades: {
    name: string;
    cost: number;
    rent: number;
    included: boolean;
  }[] = [];

  if (includeLab) {
    totalInvest += baseLab;
    upgrades.push({
      name: "Базовая лаборатория",
      cost: baseLab,
      rent: 0,
      included: true,
    });
  } else {
    upgrades.push({
      name: "Базовая лаборатория",
      cost: baseLab,
      rent: 0,
      included: false,
    });
  }

  if (equipment) {
    dailyRent += 1000;
    if (includeEquipment) {
      totalInvest += 500000;
      upgrades.push({
        name: "Оборудование",
        cost: 500000,
        rent: 0,
        included: true,
      });
    } else {
      upgrades.push({
        name: "Оборудование",
        cost: 500000,
        rent: 0,
        included: false,
      });
    }
  }

  if (security) {
    dailyRent += 1000;
    if (includeSecurity) {
      totalInvest += 500000;
      upgrades.push({
        name: "Безопасность",
        cost: 500000,
        rent: 0,
        included: true,
      });
    } else {
      upgrades.push({
        name: "Безопасность",
        cost: 500000,
        rent: 0,
        included: false,
      });
    }
  }

  if (assistant) {
    dailyRent += 3000;
    if (includeAssistant) {
      totalInvest += 5000;
      upgrades.push({ name: "Ассистент", cost: 5000, rent: 0, included: true });
    } else {
      upgrades.push({
        name: "Ассистент",
        cost: 5000,
        rent: 0,
        included: false,
      });
    }
  }

  const rawMaterialCost = obezbolCount * obezbolPrice;
  const rentCost = dailyRent * days;
  const totalOperating = rawMaterialCost + rentCost;

  const totalObezbol = obezbolCount + obezbolFree;
  const productCount = totalObezbol * analgetikPerObezbol;
  const productPrice =
    product === "analgetik" ? analgetikSellPrice : spankSellPrice;
  const revenue = productCount * productPrice;

  const totalCosts = totalInvest + totalOperating;
  const profit = revenue - totalCosts;
  const profitPerUnit = productCount > 0 ? profit / productCount : 0;

  const hasInvestments =
    includeLab || includeEquipment || includeSecurity || includeAssistant;
  const tableNumberOperating = hasInvestments ? 2 : 1;
  const tableNumberRevenue = hasInvestments ? 3 : 2;
  const tableNumberSummary = hasInvestments ? 4 : 3;

  function formatMoney(val: number) {
    if (isNaN(val) || !isFinite(val)) {
      return "0$";
    }
    return val.toLocaleString("ru-RU") + "$";
  }

  function formatProfitPerUnit(val: number) {
    if (isNaN(val) || !isFinite(val)) {
      return "0$";
    }
    const sign = val >= 0 ? "+" : "";
    return sign + val.toFixed(0) + "$";
  }

  useEffect(() => {
    // Удалил автоматическую блокировку ассистента
  }, [product]);

  const downloadCSV = () => {
    let csv = "КАЛЬКУЛЯТОР ЛАБОРАТОРИИ GTA5 RP - СЕРВЕР МУРИЕТТА\n\n";
    csv += "ПАРАМЕТРЫ\n";
    csv += `Обезболов,${obezbolCount}\n`;
    csv += `Дней аренды,${days}\n`;
    csv += `Продукт,${product === "analgetik" ? "Анальгетик" : "Спанк"}\n`;
    csv += `Оборудование,${equipment ? "Да" : "Нет"}\n`;
    csv += `Безопасность,${security ? "Да" : "Нет"}\n`;
    csv += `Ассистент,${assistant ? "Да" : "Нет"}\n\n`;

    csv += "1. НАЧАЛЬНЫЕ ИНВЕСТИЦИИ\n";
    csv += "Статья,Стоимость,Учтено\n";
    upgrades.forEach((u) => {
      csv += `${u.name},${u.cost},${u.included ? "Да" : "Нет"}\n`;
    });
    csv += `ИТОГО,${totalInvest}\n\n`;

    csv += "2. ОПЕРАЦИОННЫЕ РАСХОДЫ\n";
    csv += "Статья,Количество,Цена,Сумма\n";
    csv += `Обезбол,${obezbolCount},${obezbolPrice},${rawMaterialCost}\n`;
    csv += `Аренда,${days},${dailyRent},${rentCost}\n`;
    csv += `ИТОГО,,,${totalOperating}\n\n`;

    csv += "3. ДОХОДЫ\n";
    csv += "Продукт,Количество,Цена,Сумма\n";
    csv += `${
      product === "analgetik" ? "Анальгетик" : "Спанк"
    },${productCount},${productPrice},${revenue}\n\n`;

    csv += "4. ИТОГИ\n";
    csv += "Показатель,Сумма\n";
    csv += `Инвестиции,${totalInvest}\n`;
    csv += `Операционные расходы,${totalOperating}\n`;
    csv += `Общие затраты,${totalCosts}\n`;
    csv += `Доход,${revenue}\n`;
    csv += `ПРИБЫЛЬ,${profit}\n`;
    csv += `Прибыль на единицу,${profitPerUnit.toFixed(0)}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "GTA5_Lab_Calculator.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-8 h-8" />
              <h1 className="text-3xl font-bold">
                Калькулятор лаборатории GTA5 RP
              </h1>
            </div>
            <p className="text-purple-100">Анализ прибыльности by THUNDERS</p>
          </div>

          <div className="p-6 bg-gray-50 grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Количество (покупка)
              </label>
              <input
                type="number"
                value={obezbolCount === 0 ? "" : obezbolCount}
                onChange={(e) =>
                  setObezbolCount(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Обезболов за деньги</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Количество (бесплатно)
              </label>
              <input
                type="number"
                value={obezbolFree === 0 ? "" : obezbolFree}
                onChange={(e) =>
                  setObezbolFree(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-green-600 mt-1">Обезболов с работ</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Цена покупки Обезбола ($)
              </label>
              <input
                type="number"
                value={obezbolPrice === 0 ? "" : obezbolPrice}
                onChange={(e) =>
                  setObezbolPrice(
                    e.target.value === "" ? 0 : Number(e.target.value)
                  )
                }
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">За 1 штуку</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Период аренды (дней)
              </label>
              <input
                type="number"
                value={days === 0 ? "" : days}
                onChange={(e) =>
                  setDays(e.target.value === "" ? 0 : Number(e.target.value))
                }
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Что продаём
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="analgetik">Анальгетик</option>
                <option value="spank">Спанк</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Цена продажи ($)
              </label>
              <input
                type="number"
                value={
                  product === "analgetik"
                    ? analgetikSellPrice === 0
                      ? ""
                      : analgetikSellPrice
                    : spankSellPrice === 0
                    ? ""
                    : spankSellPrice
                }
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  if (product === "analgetik") {
                    setAnalgetikSellPrice(val);
                  } else {
                    setSpankSellPrice(val);
                  }
                }}
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                min="0"
              />
            </div>
          </div>

          <div className="p-6 bg-gray-100 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Улучшения (активные)
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all">
                  <input
                    type="checkbox"
                    checked={equipment}
                    onChange={(e) => setEquipment(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Оборудование</span>
                  <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    <span>+1.000$/день</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all">
                  <input
                    type="checkbox"
                    checked={security}
                    onChange={(e) => setSecurity(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Безопасность</span>
                  <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    <span>+1.000$/день</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-all">
                  <input
                    type="checkbox"
                    checked={assistant}
                    onChange={(e) => setAssistant(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Ассистент</span>
                  <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    <span>+3.000$/день</span>
                  </div>
                </label>
                <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg mt-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-yellow-800">
                    <span>Общая аренда:</span>
                    <span className="text-lg">
                      {formatMoney(dailyRent)}/день
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Учитывать в расчёте инвестиций
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-green-400 transition-all">
                  <input
                    type="checkbox"
                    checked={includeLab}
                    onChange={(e) => setIncludeLab(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Лаборатория</span>
                  <div className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    <span>50.000$</span>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 transition-all ${
                    !equipment
                      ? "opacity-50 cursor-not-allowed border-gray-200"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeEquipment}
                    onChange={(e) => setIncludeEquipment(e.target.checked)}
                    disabled={!equipment}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Оборудование</span>
                  <div className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    <span>500.000$</span>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 transition-all ${
                    !security
                      ? "opacity-50 cursor-not-allowed border-gray-200"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeSecurity}
                    onChange={(e) => setIncludeSecurity(e.target.checked)}
                    disabled={!security}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Безопасность</span>
                  <div className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    <span>500.000$</span>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 transition-all ${
                    !assistant
                      ? "opacity-50 cursor-not-allowed border-gray-200"
                      : "border-gray-200 hover:border-green-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeAssistant}
                    onChange={(e) => setIncludeAssistant(e.target.checked)}
                    disabled={!assistant}
                    className="w-5 h-5"
                  />
                  <span className="text-sm flex-1">Ассистент</span>
                  <div className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    <span>5.000$</span>
                  </div>
                </label>
                <div className="bg-red-50 border-2 border-red-300 p-3 rounded-lg mt-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
                    <span>Итого инвестиций:</span>
                    <span className="text-lg">{formatMoney(totalInvest)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
              <h2 className="text-xl font-semibold mb-2">Чистая прибыль</h2>
              <div
                className={`text-5xl font-bold ${
                  profit >= 0 ? "text-green-300" : "text-red-300"
                }`}
              >
                {profit >= 0 ? "+" : ""}
                {formatMoney(profit)}
              </div>
              <p className="mt-2 text-blue-100">
                {formatProfitPerUnit(profitPerUnit)} на единицу
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                График расходов и доходов
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Инвестиции</span>
                    <span className="font-semibold text-red-600">
                      -{formatMoney(totalInvest)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width:
                          totalCosts > 0
                            ? `${Math.min(
                                (totalInvest / totalCosts) * 100,
                                100
                              )}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Операционные</span>
                    <span className="font-semibold text-orange-600">
                      -{formatMoney(totalOperating)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width:
                          totalCosts > 0
                            ? `${Math.min(
                                (totalOperating / totalCosts) * 100,
                                100
                              )}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Доход</span>
                    <span className="font-semibold text-green-600">
                      +{formatMoney(revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width:
                          totalCosts > 0
                            ? `${Math.min(
                                (revenue / (totalCosts + revenue)) * 100,
                                100
                              )}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-800 font-bold">
                      Итоговая прибыль
                    </span>
                    <span
                      className={`font-bold ${
                        profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {profit >= 0 ? "+" : ""}
                      {formatMoney(profit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        profit >= 0
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                      style={{
                        width: `${
                          profit >= 0
                            ? Math.min((profit / revenue) * 100, 100)
                            : Math.min(
                                (Math.abs(profit) / totalCosts) * 100,
                                100
                              )
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 py-6 px-8 shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                📊 ДЕТАЛЬНЫЙ РАСЧЁТ
              </h2>
              <p className="text-purple-100 text-lg">
                Полная аналитика расходов и доходов на основе ваших данных
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {hasInvestments && (
              <div>
                <h3 className="text-lg font-bold bg-purple-600 text-white p-3 rounded-t-lg">
                  1. НАЧАЛЬНЫЕ ИНВЕСТИЦИИ
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-3 text-left">
                          Статья расходов
                        </th>
                        <th className="border p-3 text-right">
                          Стоимость (единоразово)
                        </th>
                        <th className="border p-3 text-center">
                          Учтено в расчёте
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upgrades.map((u, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-gray-50 ${
                            !u.included ? "opacity-50" : ""
                          }`}
                        >
                          <td className="border p-3">{u.name}</td>
                          <td
                            className={`border p-3 text-right font-semibold ${
                              u.included ? "text-red-600" : "text-gray-400"
                            }`}
                          >
                            {u.included ? "-" : ""}
                            {formatMoney(u.cost)}
                          </td>
                          <td className="border p-3 text-center text-lg">
                            {u.included ? "✓" : "✗"}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold">
                        <td className="border p-3" colSpan={2}>
                          ИТОГО ИНВЕСТИЦИЙ
                        </td>
                        <td className="border p-3 text-right text-red-700">
                          -{formatMoney(totalInvest)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold bg-purple-600 text-white p-3 rounded-t-lg">
                {tableNumberOperating}. ОПЕРАЦИОННЫЕ РАСХОДЫ
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Статья</th>
                      <th className="border p-3 text-right">Количество</th>
                      <th className="border p-3 text-right">Цена за ед.</th>
                      <th className="border p-3 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Обезбол (покупка)</td>
                      <td className="border p-3 text-right">
                        {obezbolCount} шт
                      </td>
                      <td className="border p-3 text-right">
                        {formatMoney(obezbolPrice)}
                      </td>
                      <td className="border p-3 text-right text-red-600 font-semibold">
                        -{formatMoney(rawMaterialCost)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-green-50">
                      <td className="border p-3">Обезбол (бесплатно)</td>
                      <td className="border p-3 text-right text-green-600 font-semibold">
                        {obezbolFree} шт
                      </td>
                      <td className="border p-3 text-right text-green-600">
                        0$
                      </td>
                      <td className="border p-3 text-right text-green-600 font-semibold">
                        0$
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Аренда лаборатории</td>
                      <td className="border p-3 text-right">{days} дней</td>
                      <td className="border p-3 text-right">
                        {formatMoney(dailyRent)}
                      </td>
                      <td className="border p-3 text-right text-red-600 font-semibold">
                        -{formatMoney(rentCost)}
                      </td>
                    </tr>
                    <tr className="bg-blue-50 border-t-2 border-blue-300">
                      <td
                        className="border p-3 font-semibold text-blue-800"
                        colSpan={3}
                      >
                        Всего Обезболов для крафта
                      </td>
                      <td className="border p-3 text-right font-bold text-blue-800">
                        {totalObezbol} шт
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border p-3" colSpan={3}>
                        ИТОГО РАСХОДОВ
                      </td>
                      <td className="border p-3 text-right text-red-700">
                        -{formatMoney(totalOperating)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold bg-purple-600 text-white p-3 rounded-t-lg">
                {tableNumberRevenue}. ДОХОДЫ ОТ ПРОДАЖИ
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Продукт</th>
                      <th className="border p-3 text-right">Количество</th>
                      <th className="border p-3 text-right">Цена за ед.</th>
                      <th className="border p-3 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">
                        {product === "analgetik" ? "Анальгетик" : "Спанк"}
                      </td>
                      <td className="border p-3 text-right">
                        {productCount} шт
                      </td>
                      <td className="border p-3 text-right">
                        {formatMoney(productPrice)}
                      </td>
                      <td className="border p-3 text-right text-green-600 font-semibold">
                        +{formatMoney(revenue)}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border p-3" colSpan={3}>
                        ИТОГО
                      </td>
                      <td className="border p-3 text-right text-green-700">
                        +{formatMoney(revenue)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold bg-purple-600 text-white p-3 rounded-t-lg">
                {tableNumberSummary}. ИТОГОВЫЙ РАСЧЁТ
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Показатель</th>
                      <th className="border p-3 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Начальные инвестиции</td>
                      <td className="border p-3 text-right text-red-600">
                        -{formatMoney(totalInvest)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Операционные расходы</td>
                      <td className="border p-3 text-right text-red-600">
                        -{formatMoney(totalOperating)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Общие затраты</td>
                      <td className="border p-3 text-right text-red-600">
                        -{formatMoney(totalCosts)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Доход от продажи</td>
                      <td className="border p-3 text-right text-green-600">
                        +{formatMoney(revenue)}
                      </td>
                    </tr>
                    <tr className="bg-yellow-100 font-bold text-lg">
                      <td className="border p-3">ЧИСТАЯ ПРИБЫЛЬ</td>
                      <td
                        className={`border p-3 text-right ${
                          profit >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {profit >= 0 ? "+" : ""}
                        {formatMoney(profit)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Прибыль на единицу</td>
                      <td
                        className={`border p-3 text-right ${
                          profitPerUnit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatProfitPerUnit(profitPerUnit)}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Произведено единиц</td>
                      <td className="border p-3 text-right text-blue-600">
                        {productCount} шт
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-6 rounded">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">
                💡 Рекомендации для максимальной прибыли:
              </h3>
              <ul className="space-y-2 text-yellow-900">
                {product === "analgetik" ? (
                  <>
                    <li>
                      ✓ Продавайте Анальгетик вместо Спанка - на 20% выгоднее!
                    </li>
                    <li>
                      ✓ Обязательно купите Оборудование - ускоряет крафт в 2
                      раза
                    </li>
                    <li>
                      ✓ Обязательно купите Безопасность - защищает сырьё от краж
                    </li>
                    <li>
                      ✓ НЕ покупайте Ассистента - он не нужен для Анальгетика
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      ✓ Рассмотрите продажу Анальгетика вместо Спанка - это
                      выгоднее на 20%
                    </li>
                    <li>
                      ✓ Если продаёте Спанк, купите Ассистента для мгновенного
                      крафта
                    </li>
                    <li>✓ Обязательно купите Оборудование и Безопасность</li>
                  </>
                )}
              </ul>

              <div className="mt-4 pt-4 border-t-2 border-yellow-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-yellow-900">
                    📊 Средние рыночные цены:
                  </span>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div className="text-sm text-yellow-700 mb-1">
                        Обезбол
                      </div>
                      <div className="text-xl font-bold text-yellow-900">
                        от 1.500$+
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">и выше</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div className="text-sm text-yellow-700 mb-1">
                        Анальгетик
                      </div>
                      <div className="text-xl font-bold text-yellow-900">
                        ~1.200$
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">
                        средняя цена
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div className="text-sm text-yellow-700 mb-1">Спанк</div>
                      <div className="text-xl font-bold text-yellow-900">
                        ~1.000$
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">
                        средняя цена
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-xs text-yellow-700 italic">
                    * Цены могут меняться в зависимости от рынка
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadCSV}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg"
            >
              <Download className="w-6 h-6" />
              Скачать CSV (для Excel)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
