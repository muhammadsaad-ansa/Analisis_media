/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ProductInventoryItem, StockRestockOrder, AbcClassification, StockStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_RESTOCK_ORDERS } from '../data/analyticsExtendedData';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  Layers,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  ShieldAlert,
  Boxes,
  Truck,
  Sparkles,
  Link2,
  Edit3,
  Trash2,
  X
} from 'lucide-react';

export const ProductInventoryView: React.FC = () => {
  const [products, setProducts] = useState<ProductInventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [restockOrders, setRestockOrders] = useState<StockRestockOrder[]>(() => {
    try {
      const saved = localStorage.getItem('pulsetrack_restock_orders');
      return saved ? JSON.parse(saved) : INITIAL_RESTOCK_ORDERS;
    } catch {
      return INITIAL_RESTOCK_ORDERS;
    }
  });

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [abcFilter, setAbcFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Restock Calculator states
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [targetStockDays, setTargetStockDays] = useState<number>(30);
  const [orderCreatedNotice, setOrderCreatedNotice] = useState<string | null>(null);

  // Manual Add / Edit Product Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductInventoryItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Skincare & Kecantikan');
  const [formPrice, setFormPrice] = useState('125000');
  const [formCogs, setFormCogs] = useState('45000');
  const [formStock, setFormStock] = useState('100');
  const [formSafety, setFormSafety] = useState('20');
  const [formBurnRate, setFormBurnRate] = useState('5');
  const [formLeadTime, setFormLeadTime] = useState('3');
  const [formAbc, setFormAbc] = useState<AbcClassification>('A');

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('Skincare & Kecantikan');
    setFormPrice('125000');
    setFormCogs('45000');
    setFormStock('100');
    setFormSafety('20');
    setFormBurnRate('5');
    setFormLeadTime('3');
    setFormAbc('A');
    setIsProductModalOpen(true);
  };

  const openEditModal = (prod: ProductInventoryItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormCategory(prod.category);
    setFormPrice(prod.price.toString());
    setFormCogs(prod.cogs.toString());
    setFormStock(prod.currentStock.toString());
    setFormSafety(prod.safetyStock.toString());
    setFormBurnRate(prod.dailyBurnRate.toString());
    setFormLeadTime(prod.leadTimeDays.toString());
    setFormAbc(prod.abcClass);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${prod.name}" (${prod.sku}) secara manual?`)) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('pulsetrack_products', JSON.stringify(updated));
      setOrderCreatedNotice(`Produk "${prod.name}" berhasil dihapus secara manual.`);
      setTimeout(() => setOrderCreatedNotice(null), 3500);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(formPrice, 10) || 10000;
    const cogsNum = parseInt(formCogs, 10) || 5000;
    const stockNum = parseInt(formStock, 10) || 10;
    const safetyNum = parseInt(formSafety, 10) || 5;
    const burnNum = parseInt(formBurnRate, 10) || 1;
    const leadNum = parseInt(formLeadTime, 10) || 3;

    const daysLeft = burnNum > 0 ? Math.floor(stockNum / burnNum) : 999;
    const margin = priceNum > 0 ? Number((((priceNum - cogsNum) / priceNum) * 100).toFixed(1)) : 50;

    let status: StockStatus = 'optimal';
    if (stockNum === 0) status = 'out_of_stock';
    else if (daysLeft <= 7 || stockNum <= safetyNum) status = 'critical';
    else if (daysLeft > 60) status = 'overstock';

    if (editingProduct) {
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            sku: formSku,
            category: formCategory,
            price: priceNum,
            cogs: cogsNum,
            currentStock: stockNum,
            safetyStock: safetyNum,
            dailyBurnRate: burnNum,
            daysOfInventory: daysLeft,
            leadTimeDays: leadNum,
            reorderPoint: safetyNum + burnNum * leadNum,
            abcClass: formAbc,
            status,
            grossMarginPercent: margin,
          };
        }
        return p;
      });
      setProducts(updated);
      localStorage.setItem('pulsetrack_products', JSON.stringify(updated));
      setOrderCreatedNotice(`Produk "${formName}" berhasil diperbarui secara manual!`);
    } else {
      const newProd: ProductInventoryItem = {
        id: `prod-${Date.now()}`,
        sku: formSku,
        name: formName,
        category: formCategory,
        price: priceNum,
        cogs: cogsNum,
        currentStock: stockNum,
        safetyStock: safetyNum,
        dailyBurnRate: burnNum,
        daysOfInventory: daysLeft,
        leadTimeDays: leadNum,
        reorderPoint: safetyNum + burnNum * leadNum,
        abcClass: formAbc,
        status,
        totalUnitsSold: 0,
        totalRevenue: 0,
        grossMarginPercent: margin,
      };
      const updated = [newProd, ...products];
      setProducts(updated);
      localStorage.setItem('pulsetrack_products', JSON.stringify(updated));
      setOrderCreatedNotice(`Produk baru "${formName}" berhasil ditambahkan!`);
    }

    setIsProductModalOpen(false);
    setTimeout(() => setOrderCreatedNotice(null), 3500);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (abcFilter !== 'all' && p.abcClass !== abcFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, abcFilter, statusFilter, searchQuery]);

  // Aggregate Inventory KPIs
  const kpis = useMemo(() => {
    const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + p.currentStock * p.cogs, 0);
    const totalRetailValue = products.reduce((acc, p) => acc + p.currentStock * p.price, 0);
    const criticalStockCount = products.filter(
      (p) => p.status === 'critical' || p.status === 'out_of_stock'
    ).length;
    const validDays = products.filter((p) => p.daysOfInventory > 0);
    const avgDaysRemaining = validDays.length > 0 ? Number(
      (
        validDays.reduce((acc, p) => acc + p.daysOfInventory, 0) /
        validDays.length
      ).toFixed(1)
    ) : 0;
    const avgGrossMargin = products.length > 0 ? Number(
      (products.reduce((acc, p) => acc + p.grossMarginPercent, 0) / products.length).toFixed(1)
    ) : 0;

    return {
      totalStockUnits,
      totalInventoryValue,
      totalRetailValue,
      criticalStockCount,
      avgDaysRemaining,
      avgGrossMargin,
    };
  }, [products]);

  // Selected product for calculator
  const activeProductForRestock = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Restock calculation
  const restockRecommendation = useMemo(() => {
    if (!activeProductForRestock) return { neededQty: 0, totalCost: 0 };
    const requiredForTarget = Math.ceil(activeProductForRestock.dailyBurnRate * targetStockDays);
    const needed = Math.max(0, requiredForTarget - activeProductForRestock.currentStock);
    const totalCost = needed * activeProductForRestock.cogs;
    return {
      neededQty: needed,
      totalCost,
    };
  }, [activeProductForRestock, targetStockDays]);

  const handleCreateRestockPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProductForRestock) return;

    const newPO: StockRestockOrder = {
      id: `po-${Date.now().toString().slice(-4)}`,
      sku: activeProductForRestock.sku,
      productName: activeProductForRestock.name,
      orderQuantity: restockRecommendation.neededQty || 50,
      unitCost: activeProductForRestock.cogs,
      totalCost: restockRecommendation.totalCost || 50 * activeProductForRestock.cogs,
      supplier: 'Supplier Resmi Pabrik',
      estimatedArrival: new Date(
        Date.now() + 86400000 * activeProductForRestock.leadTimeDays
      ).toLocaleDateString('id-ID'),
      status: 'ordered',
      createdAt: new Date().toLocaleDateString('id-ID'),
    };

    const updatedOrders = [newPO, ...restockOrders];
    setRestockOrders(updatedOrders);
    localStorage.setItem('pulsetrack_restock_orders', JSON.stringify(updatedOrders));

    setOrderCreatedNotice(`✓ Purchase Order #${newPO.id} berhasil dicatat untuk ${activeProductForRestock.name} (${newPO.orderQuantity} unit)!`);
    setTimeout(() => setOrderCreatedNotice(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notice */}
      {orderCreatedNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white text-xs font-semibold rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{orderCreatedNotice}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl p-5 border border-emerald-800/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                Product Velocity & Inventory Health
              </span>
              <span className="text-xs text-emerald-300">·</span>
              <span className="text-xs text-emerald-200">
                {products.length} SKU Aktif Terpantau
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Analisis Produk & Manajemen Stok Manual
            </h2>
            <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
              Atur dan kelola produk serta stok secara manual, hapus SKU yang tidak terpakai, dan pantau kecepatan perputaran barang secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Produk Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Header Pill */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <span className="text-[11px] text-slate-500 block font-medium">Nilai Stok (HPP)</span>
          <span className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white">
            Rp {(kpis.totalInventoryValue / 1000000).toFixed(1)} Jt
          </span>
        </div>
        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-medium">Potensi Omzet Stok</span>
          <span className="text-sm sm:text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Rp {(kpis.totalRetailValue / 1000000).toFixed(1)} Jt
          </span>
        </div>
        <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200/50">
          <span className="text-[11px] text-rose-700 dark:text-rose-300 block font-medium">Peringatan Kritis</span>
          <span className="text-sm sm:text-base font-mono font-bold text-rose-600 dark:text-rose-400">
            {kpis.criticalStockCount} SKU
          </span>
        </div>
        <div className="p-3 bg-cyan-50/50 dark:bg-cyan-950/30 rounded-xl border border-cyan-200/50">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300 block font-medium">Rata-rata Margin Laba</span>
          <span className="text-sm sm:text-base font-mono font-bold text-cyan-600 dark:text-cyan-400">
            {kpis.avgGrossMargin}%
          </span>
        </div>
      </div>

      {/* Product Catalog & Velocity Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Katalog SKU & Pengaturan Manual Stok
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredProducts.length} Produk
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari SKU atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs w-44"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            >
              <option value="all">Semua Status Stok</option>
              <option value="critical">Kritis (&lt; 7 Hari)</option>
              <option value="optimal">Optimal (15-45 Hari)</option>
              <option value="overstock">Overstock (&gt; 60 Hari)</option>
              <option value="out_of_stock">Habis (0 Unit)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold">SKU & Nama Produk</th>
                <th className="py-3 px-3 font-semibold text-center">Kelas ABC</th>
                <th className="py-3 px-3 font-semibold text-right">Harga / HPP</th>
                <th className="py-3 px-3 font-semibold text-right">Stok Fisik</th>
                <th className="py-3 px-3 font-semibold text-right">Kecepatan Terjual</th>
                <th className="py-3 px-3 font-semibold text-right">Sisa Hari Stok</th>
                <th className="py-3 px-3 font-semibold text-right">Margin Laba</th>
                <th className="py-3 px-3 font-semibold">Tautan Pendorong Utama</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-3 font-semibold text-center">Aksi Manual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredProducts.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* SKU & Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {prod.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{prod.sku}</span>
                      <span>·</span>
                      <span>{prod.category}</span>
                    </div>
                  </td>

                  {/* ABC Class */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        prod.abcClass === 'A'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : prod.abcClass === 'B'
                          ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      Kelas {prod.abcClass}
                    </span>
                  </td>

                  {/* Price & COGS */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      Rp {prod.price.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      HPP: Rp {prod.cogs.toLocaleString('id-ID')}
                    </div>
                  </td>

                  {/* Current Stock */}
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-sm">
                    <span
                      className={
                        prod.currentStock <= prod.safetyStock
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-900 dark:text-white'
                      }
                    >
                      {prod.currentStock} unit
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Buffer: {prod.safetyStock}
                    </div>
                  </td>

                  {/* Daily Burn Rate */}
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                    {prod.dailyBurnRate} unit/hr
                  </td>

                  {/* Days of Inventory */}
                  <td className="py-3.5 px-3 text-right">
                    <div
                      className={`font-mono font-bold ${
                        prod.daysOfInventory <= 7
                          ? 'text-rose-600 dark:text-rose-400'
                          : prod.daysOfInventory <= 30
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {prod.daysOfInventory > 0 ? `${prod.daysOfInventory} hari` : 'HABIS (0)'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Lead: {prod.leadTimeDays} hari
                    </div>
                  </td>

                  {/* Margin % */}
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {prod.grossMarginPercent}%
                  </td>

                  {/* Top referral tracked link */}
                  <td className="py-3.5 px-3">
                    {prod.topReferralLinkTitle ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                        <Link2 className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[140px] font-medium" title={prod.topReferralLinkTitle}>
                          {prod.topReferralLinkTitle}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Stock Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        prod.status === 'critical'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                          : prod.status === 'optimal'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : prod.status === 'out_of_stock'
                          ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-400'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {prod.status === 'critical'
                        ? 'Segera Restock (<7d)'
                        : prod.status === 'optimal'
                        ? 'Optimal'
                        : prod.status === 'out_of_stock'
                        ? 'Habis Total'
                        : 'Overstock (>60d)'}
                    </span>
                  </td>

                  {/* Manual Actions (Edit & Delete) */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Atur / Edit Produk Manual"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Produk Manual"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah / Edit Produk Manual */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>{editingProduct ? 'Atur / Edit Produk & Stok Manual' : 'Tambah Produk & Stok Manual Baru'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola spesifikasi produk, harga, HPP, dan stok fisik secara manual.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Serum Glowing Gold 30ml"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    SKU Kode Barang
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="Contoh: SKU-SRM-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Contoh: Skincare & Kecantikan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kelas Pareto ABC
                  </label>
                  <select
                    value={formAbc}
                    onChange={(e) => setFormAbc(e.target.value as AbcClassification)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  >
                    <option value="A">Kelas A (Top Penjualan / Kritis)</option>
                    <option value="B">Kelas B (Reguler / Stabil)</option>
                    <option value="C">Kelas C (Slow Moving)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Modal / HPP (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formCogs}
                    onChange={(e) => setFormCogs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Stok Fisik
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Buffer Min
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formSafety}
                    onChange={(e) => setFormSafety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Terjual/Hari
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formBurnRate}
                    onChange={(e) => setFormBurnRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lead Time (Hr)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formLeadTime}
                    onChange={(e) => setFormLeadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Simpan Produk & Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
