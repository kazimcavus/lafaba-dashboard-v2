import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Row, Theme, Filters, Segment, Metric, Region } from './types';
import { DEFAULT_CSV_DATA, parseCSV, formatNumber, formatCurrency, formatSignedNumber, MONTH_REVERSE_MAP, getSegmentLabel, getMetricValue, getSegmentPrefix } from './utils';

declare const Plotly: any;

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const [rows, setRows] = useState<Row[]>([]);
    const [fileName, setFileName] = useState<string | null>('Örnek Veri');
    const [statusMessage, setStatusMessage] = useState<React.ReactNode>(null);
    const [filters, setFilters] = useState<Filters>({
        year: 'ALL',
        month: 'ALL',
        segment: 'abiye',
        metric: 'netSales',
        region: 'total'
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('dashboardTheme') as Theme || 'light';
        setTheme(savedTheme);
    }, []);
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dashboardTheme', theme);
    }, [theme]);
    
    useEffect(() => {
        const { rows: initialRows, delimiter } = parseCSV(DEFAULT_CSV_DATA);
        setRows(initialRows);
        setStatusMessage(
            <>
                <strong>Örnek Veri</strong> yüklendi.<br/>
                <strong>{initialRows.length}</strong> satır okundu. Ayracı: <code className="text-xs">{delimiter}</code>.
            </>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleThemeToggle = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            if (text) {
                const { rows: parsedRows, delimiter } = parseCSV(text);
                setRows(parsedRows);
                 setStatusMessage(
                    <>
                        <strong>{file.name}</strong> yüklendi.<br/>
                        <strong>{parsedRows.length}</strong> satır okundu. Ayracı: <code className="text-xs">{delimiter}</code>.
                    </>
                );
            }
        };
        reader.readAsText(file, 'UTF-8');
    }, []);
    
    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));

        e.target.classList.add('ring-2', 'ring-light-accent', 'dark:ring-dark-accent');
        setTimeout(() => {
            e.target.classList.remove('ring-2', 'ring-light-accent', 'dark:ring-dark-accent');
        }, 500);
    }, []);
    
    const availableYears = useMemo(() => Array.from(new Set(rows.map(r => r.year))).sort((a: number, b: number) => a - b), [rows]);

    const filteredRows = useMemo(() => {
        if (rows.length === 0) return [];
        let result = [...rows];
        if (filters.year !== 'ALL') {
            result = result.filter(r => r.year === parseInt(filters.year, 10));
        }
        if (filters.month !== 'ALL') {
            result = result.filter(r => r.month === parseInt(filters.month, 10));
        }
        return result;
    }, [rows, filters]);
    
    const rangeLabelText = useMemo(() => {
        const { year, month } = filters;
        if (year === "ALL" && month === "ALL") return "Tüm dönem";
        if (year !== "ALL" && month === "ALL") return `${year} yılı`;
        if (year === "ALL" && month !== "ALL") {
            return `${MONTH_REVERSE_MAP[parseInt(month, 10)] || ""} ayı (tüm yıllar)`;
        }
        return `${MONTH_REVERSE_MAP[parseInt(month, 10)] || ""} ${year}`;
    }, [filters]);

    return (
        <div className="max-w-[1320px] mx-auto p-4 md:p-6 lg:p-10 min-h-screen">
            <Header 
                theme={theme}
                onThemeToggle={handleThemeToggle}
                onFileUpload={handleFileUpload}
            />
            <main className="mt-5 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Controls 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    years={availableYears}
                    statusMessage={statusMessage}
                />
                <div className="lg:col-span-2 xl:col-span-3">
                   <div className="bg-light-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-xl border border-light-border-subtle dark:border-dark-border-subtle rounded-2xl shadow-lg p-4">
                        <div id="kpi-container">
                            <KPIs allRows={rows} filteredRows={filteredRows} filters={filters} rangeLabel={rangeLabelText} />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                            <div className="xl:col-span-2">
                                <TimeSeriesChart filteredRows={filteredRows} filters={filters} theme={theme} rangeLabel={rangeLabelText} />
                            </div>
                            <div>
                                <YearlyChart allRows={rows} filters={filters} theme={theme} />
                            </div>
                             <div>
                                <YearlyRefundRateChart allRows={rows} theme={theme} />
                            </div>
                        </div>
                        <DataTable filteredRows={filteredRows} segment={filters.segment} />
                    </div>
                </div>
            </main>
        </div>
    );
};

// Sub-components
interface HeaderProps {
    theme: Theme;
    onThemeToggle: () => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onFileUpload }) => (
    <header className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Lafaba – Aylık Satış Panosu</h1>
            <p className="text-sm text-light-text-subtle dark:text-dark-text-subtle mt-1">
                Aylık satış, iade ve stok verilerini CSV yükleyerek incele. Ay bazında YoY & yıllık karşılaştırmalar dahil.
            </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
            <button onClick={onThemeToggle} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border border-light-border-subtle dark:border-dark-border-subtle bg-light-card-bg dark:bg-dark-card-bg shadow-md backdrop-blur-lg">
                <span className="text-base">{theme === 'light' ? '🌞' : '🌙'}</span>
                <span>{theme === 'light' ? 'Açık' : 'Koyu'} tema</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-2 text-xs rounded-full border border-light-border-subtle dark:border-dark-border-subtle bg-light-card-bg dark:bg-dark-card-bg shadow-md backdrop-blur-lg">
                <label htmlFor="fileInput" className="font-semibold cursor-pointer">CSV dosyası yükle</label>
                <input id="fileInput" type="file" accept=".csv,text/csv" onChange={onFileUpload} className="text-xs max-w-[180px] file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-light-accent-soft dark:file:bg-dark-accent-soft file:text-light-accent dark:file:text-dark-accent hover:file:bg-opacity-80"/>
            </div>
        </div>
    </header>
);

interface ControlsProps {
    filters: Filters;
    onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    years: number[];
    statusMessage: React.ReactNode;
}
const Controls: React.FC<ControlsProps> = ({ filters, onFilterChange, years, statusMessage }) => {
    const Select: React.FC<React.PropsWithChildren<React.SelectHTMLAttributes<HTMLSelectElement>>> = ({ children, ...props }) => (
        <select {...props} className="w-full text-xs bg-light-card-bg dark:bg-dark-bg-main border border-light-border-subtle dark:border-dark-border-subtle rounded-full px-3 py-2 outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent transition-all duration-300">
            {children}
        </select>
    );

    return (
        <div className="bg-light-card-bg/80 dark:bg-dark-card-bg/80 backdrop-blur-xl border border-light-border-subtle dark:border-dark-border-subtle rounded-2xl shadow-lg p-5 space-y-4 self-start">
            <div>
                <h2 className="text-sm font-semibold">Filtreler & Veri Kaynağı</h2>
                <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle mt-1">Yıl, ay, ürün grubu ve metrik seçerek panoyu filtreleyebilirsin.</p>
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-light-text-subtle dark:text-dark-text-subtle">Yıl filtresi</label>
                    <Select name="year" value={filters.year} onChange={onFilterChange}>
                        <option value="ALL">Tüm yıllar</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-light-text-subtle dark:text-dark-text-subtle">Ay filtresi</label>
                    <Select name="month" value={filters.month} onChange={onFilterChange}>
                        <option value="ALL">Tüm aylar</option>
                        {Object.entries(MONTH_REVERSE_MAP).map(([val, name]) => <option key={val} value={val}>{name}</option>)}
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-light-text-subtle dark:text-dark-text-subtle">Ürün grubu</label>
                    <Select name="segment" value={filters.segment} onChange={onFilterChange}>
                        <option value="abiye">Abiye</option>
                        <option value="other">Abiye hariç</option>
                        <option value="total">Tümü (Abiye + Abiye hariç)</option>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-light-text-subtle dark:text-dark-text-subtle">Metrik</label>
                    <Select name="metric" value={filters.metric} onChange={onFilterChange}>
                        <option value="netSales">Net satış adet</option>
                        <option value="totalSales">Brüt satış adet</option>
                        <option value="refundCount">İade adet</option>
                        <option value="refundRate">İade oranı (%)</option>
                        <option value="stockQty">Stok adet</option>
                    </Select>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-light-text-subtle dark:text-dark-text-subtle">Bölge (satış adet metrikleri için)</label>
                    <Select name="region" value={filters.region} onChange={onFilterChange}>
                        <option value="total">Toplam (TR+EU)</option>
                        <option value="TR">Sadece TR</option>
                        <option value="EU">Sadece EU</option>
                    </Select>
                </div>
            </div>
            <div className="text-xs text-light-text-subtle dark:text-dark-text-subtle pt-2">
                {statusMessage ? statusMessage : 'Henüz CSV yüklenmedi. Sağ üstten herhangi bir .csv dosyasını seç.'}
            </div>
             <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full border border-light-accent dark:border-dark-accent bg-light-accent-soft dark:bg-dark-accent-soft text-light-accent dark:text-dark-accent">
                    İpucu <span className="font-bold">?</span>
                </div>
                <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle mt-2">Veriler sadece bu tarayıcı sekmesinde işlenir; sunucuya veya üçüncü taraflara gönderilmez.</p>
            </div>
             <div className="text-xs text-light-text-subtle dark:text-dark-text-subtle pt-4 border-t border-dashed border-light-border-subtle dark:border-dark-border-subtle space-y-2">
                <h3 className="font-semibold text-sm text-light-text-main dark:text-dark-text-main">Bu rapor neyi gösteriyor?</h3>
                <p>• Üstteki kartlar seçili dönem için net satış adetini ve ortalama iade oranını, en güncel ay için stok adet ve stok değerini gösterir.</p>
                <p>• Sağdaki grafikler metriklerin ay bazında trendini ve yıllık toplam net satışları karşılaştırır.</p>
                <p>• “Ürün grubu”ndan <strong>Abiye / Abiye hariç / Tümü</strong> seçerek satış, iade ve stokları ayrı ayrı izleyebilirsin.</p>
                <p>• Yıl / ay filtresiyle dönem seçip; kartlardaki açıklamalardan geçen yılın aynı ayına ve önceki yıla göre değişimi okuyabilirsin.</p>
            </div>
        </div>
    );
};

interface KPIsProps {
    allRows: Row[];
    filteredRows: Row[];
    filters: Filters;
    rangeLabel: string;
}
const KPIs: React.FC<KPIsProps> = ({ allRows, filteredRows, filters, rangeLabel }) => {
    const { segment } = filters;
    const segmentLabel = getSegmentLabel(segment);
    const prefix = getSegmentPrefix(segment);

    const kpiData = useMemo(() => {
        let sumNet = 0;
        let sumIadeOran = 0;
        let countIade = 0;

        filteredRows.forEach(r => {
            const vNet = getMetricValue(r, "netSales", "total", segment);
            if (vNet !== null) sumNet += vNet;
            
            const rate = r[(prefix + "RefundRate") as keyof Row] as number | null;
            if (rate !== null) {
                sumIadeOran += rate;
                countIade++;
            }
        });
        
        const avgIade = countIade > 0 ? sumIadeOran / countIade : null;

        const baseRows = filteredRows.length > 0 ? [...filteredRows] : [...allRows];
        baseRows.sort((a, b) => (a.year !== b.year) ? a.year - b.year : a.month - b.month);
        const last = baseRows[baseRows.length - 1];
        const prev = baseRows.length > 1 ? baseRows[baseRows.length - 2] : null;

        return { sumNet, avgIade, last, prev };

    }, [filteredRows, allRows, segment, prefix]);

    const { sumNet, avgIade, last, prev } = kpiData;
    
    const ChangeHint: React.FC<{
      label: string;
      current: number | null;
      previous: number | null;
      unit: string;
      isRate?: boolean;
    }> = ({ label, current, previous, unit, isRate = false }) => {
        if (current == null || previous == null || previous === 0) return null;
        const diff = current - previous;
        const perc = (diff / previous) * 100;
        const diffText = isRate ? 
            `${diff > 0 ? '+' : '−'}${Math.abs(diff).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} puan`
            : `${formatSignedNumber(diff)} ${unit}`;
        
        const percText = `(${perc.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} %)`;

        let cls = "text-gray-500";
        let icon = "●";
        if (diff > 0.01) { cls = "text-green-600 dark:text-green-500"; icon="▲"; }
        else if (diff < -0.01) { cls = "text-red-600 dark:text-red-500"; icon="▼"; }
        
        return (
            <div className="flex items-center gap-1">
                <span className="text-light-text-subtle dark:text-dark-text-subtle">{label}</span>
                <span className={`font-semibold ${cls}`}>
                    <span className="text-xs mr-1">{icon}</span>
                    {diffText} {percText}
                </span>
            </div>
        );
    };

    const netSalesHints = () => {
        if (!last) return null;
        const currentNet = getMetricValue(last, "netSales", "total", segment);
        const prevNet = prev ? getMetricValue(prev, "netSales", "total", segment) : null;
        const prevYearRow = allRows.find(r => r.year === last.year - 1 && r.month === last.month);
        const prevYearNet = prevYearRow ? getMetricValue(prevYearRow, "netSales", "total", segment) : null;
        return (
            <>
                <ChangeHint label="Önceki aya göre" current={currentNet} previous={prevNet} unit="adet" />
                <ChangeHint label="Geçen yılın aynı ayına göre" current={currentNet} previous={prevYearNet} unit="adet" />
            </>
        )
    };
    
    const refundRateHints = () => {
        if (!last) return null;
        const currentRate = last[(prefix + "RefundRate") as keyof Row] as number | null;
        const prevRate = prev ? prev[(prefix + "RefundRate") as keyof Row] as number | null : null;
        const prevYearRow = allRows.find(r => r.year === last.year - 1 && r.month === last.month);
        const prevYearRate = prevYearRow ? prevYearRow[(prefix + "RefundRate") as keyof Row] as number | null : null;
        return (
            <>
                <ChangeHint label="Önceki aya göre" current={currentRate} previous={prevRate} unit="puan" isRate/>
                <ChangeHint label="Geçen yılın aynı ayına göre" current={currentRate} previous={prevYearRate} unit="puan" isRate/>
            </>
        )
    };

    const stockHints = (metric: 'StockValue' | 'StockQty') => {
        if (!last) return null;
        const unit = metric === 'StockValue' ? '₺' : 'adet';
        const current = last[(prefix + metric) as keyof Row] as number | null;
        const previous = prev ? prev[(prefix + metric) as keyof Row] as number | null : null;
        const prevYearRow = allRows.find(r => r.year === last.year - 1 && r.month === last.month);
        const prevYear = prevYearRow ? prevYearRow[(prefix + metric) as keyof Row] as number | null : null;
        return (
             <>
                <ChangeHint label="Önceki aya göre" current={current} previous={previous} unit={unit} />
                <ChangeHint label="Geçen yılın aynı ayına göre" current={current} previous={prevYear} unit={unit} />
            </>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard label={`Seçili aralık – Net satış`} value={formatNumber(sumNet)} hint={<>{rangeLabel} için toplam NET SATIŞ ADET ({segmentLabel}).{netSalesHints()}</>} />
            <SummaryCard label="Seçili aralık – Ortalama iade oranı" value={avgIade === null ? "-" : `${avgIade.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} %`} hint={<>{rangeLabel} için basit ortalama İADE ORANI ({segmentLabel}).{refundRateHints()}</>} />
            <SummaryCard label="Son ay – Stok değer" value={formatCurrency(last?.[(prefix + "StockValue") as keyof Row] as number | null)} hint={<>{last?.tarihStr} sonu {segmentLabel.toLowerCase()} stok değeri.{stockHints('StockValue')}</>} />
            <SummaryCard label="Son ay – Stok adet" value={formatNumber(last?.[(prefix + "StockQty") as keyof Row] as number | null)} hint={<>{last?.tarihStr} sonu {segmentLabel.toLowerCase()} stok adedi.{stockHints('StockQty')}</>} />
        </div>
    );
};

const SummaryCard: React.FC<{ label: string; value: string; hint: React.ReactNode }> = ({ label, value, hint }) => (
    <div className="border border-light-border-subtle dark:border-dark-border-subtle rounded-xl p-3 bg-light-card-bg dark:bg-dark-card-bg">
        <p className="text-xs uppercase tracking-wider text-light-text-subtle dark:text-dark-text-subtle">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <div className="text-xs text-light-text-subtle dark:text-dark-text-subtle mt-2 space-y-1">{hint}</div>
    </div>
);

interface ChartProps {
    filters: Filters;
    theme: Theme;
}
interface TimeSeriesChartProps extends ChartProps {
    filteredRows: Row[];
    rangeLabel: string;
}
const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ filteredRows, filters, theme, rangeLabel }) => {
    const { metric, region, segment } = filters;

    useEffect(() => {
        const chartDiv = document.getElementById('timeseries-chart-container');
        if (!chartDiv) return;

        if (filteredRows.length === 0) {
             Plotly.purge(chartDiv);
             return;
        }

        const isRate = metric === 'refundRate';
        const labelMap: Record<Metric, string> = { netSales: "NET SATIŞ ADET", totalSales: "SATIŞ ADET TOPLAM", refundCount: "İADE ADET", refundRate: "İADE ORANI (%)", stockQty: "STOK ADET" };
        let label = labelMap[metric] || metric;
        const segLabel = getSegmentLabel(segment);

        if (metric === "netSales" || metric === "totalSales") {
            if (region === "TR") label += " – TR";
            else if (region === "EU") label += " – EU";
            else label += " – Toplam";
        }
        label += ` (${segLabel})`;

        const x: string[] = [];
        const y: (number | null)[] = [];
        filteredRows.forEach(r => {
            x.push(r.tarihStr);
            y.push(getMetricValue(r, metric, region, segment));
        });

        const trace = {
            x, y, type: "scatter", mode: "lines+markers",
            hovertemplate: `%{x}<br>${label}: %{y:.1f}${isRate ? ' %' : ''}<extra></extra>`,
            marker: { color: theme === 'light' ? '#4f46e5' : '#6366f1' },
            line: { color: theme === 'light' ? '#4f46e5' : '#6366f1' }
        };

        const colors = {
            paper: "rgba(0,0,0,0)",
            plot: "rgba(0,0,0,0)",
            font: theme === "dark" ? "#e5e7eb" : "#111827",
            grid: theme === "dark" ? "rgba(55,65,81,0.6)" : "rgba(209,213,219,0.7)"
        };

        const layout = {
            margin: { t: 20, r: 10, b: 60, l: 60 },
            paper_bgcolor: colors.paper,
            plot_bgcolor: colors.plot,
            font: { color: colors.font, size: 10 },
            xaxis: { title: "Ay", tickangle: -45, gridcolor: colors.grid },
            yaxis: { title: label, gridcolor: colors.grid, automargin: true },
            hovermode: "x unified",
        };

        Plotly.react('timeseries-chart-container', [trace], layout, { responsive: true, displaylogo: false });

    }, [filteredRows, metric, region, segment, theme]);

    return (
        <div className="border border-light-border-subtle dark:border-dark-border-subtle rounded-xl p-3 bg-light-card-bg dark:bg-dark-card-bg h-full">
            <h3 className="text-sm font-semibold">Aylık trend – Seçili metrik</h3>
            <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle">
                {getSegmentLabel(segment)} - {metric}
            </p>
            <div id="timeseries-chart-container" className="w-full h-[330px]"></div>
            <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle mt-1">Gösterilen dönem: {rangeLabel}.</p>
        </div>
    );
};


interface YearlyChartProps extends ChartProps {
    allRows: Row[];
}
const YearlyChart: React.FC<YearlyChartProps> = ({ allRows, filters, theme }) => {
    const { segment } = filters;

    const yearlyData = useMemo(() => {
        const totals: { [year: number]: number } = {};
        allRows.forEach(r => {
            const v = getMetricValue(r, "netSales", "total", segment);
            if (v !== null) totals[r.year] = (totals[r.year] || 0) + v;
        });

        const yearsArr = Object.keys(totals).map(y => parseInt(y, 10)).sort((a, b) => a - b);
        const values = yearsArr.map(y => totals[y]);
        return { yearsArr, values, totals };
    }, [allRows, segment]);
    
    useEffect(() => {
        const chartDiv = document.getElementById('yearly-chart-container');
        if (!chartDiv) return;
        
        if (yearlyData.yearsArr.length === 0) {
            Plotly.purge(chartDiv);
            return;
        }
        
        const { yearsArr, values } = yearlyData;
        const segLabel = getSegmentLabel(segment);
        const label = `NET SATIŞ ADET (${segLabel})`;

        const trace = {
            x: yearsArr.map(String), y: values, type: "bar",
            hovertemplate: `%{x} – Toplam net satış: %{y:,.0f}<extra></extra>`,
            marker: { color: theme === 'light' ? '#4f46e5' : '#6366f1' },
        };

        const colors = {
            paper: "rgba(0,0,0,0)",
            plot: "rgba(0,0,0,0)",
            font: theme === "dark" ? "#e5e7eb" : "#111827",
            grid: theme === "dark" ? "rgba(55,65,81,0.6)" : "rgba(209,213,219,0.7)"
        };

        const layout = {
            margin: { t: 20, r: 10, b: 40, l: 60 },
            paper_bgcolor: colors.paper,
            plot_bgcolor: colors.plot,
            font: { color: colors.font, size: 10 },
            xaxis: { title: "Yıl", gridcolor: colors.grid },
            yaxis: { title: label, gridcolor: colors.grid, automargin: true },
        };

        Plotly.react('yearly-chart-container', [trace], layout, { responsive: true, displaylogo: false });
    }, [yearlyData, segment, theme]);
    
    const yearlyInfoText = useMemo(() => {
        const { yearsArr, totals } = yearlyData;
        if (yearsArr.length < 2) return "Yıllık karşılaştırma için en az 2 yıl veri gerekir.";
        
        const lastYear = filters.year === 'ALL' ? yearsArr[yearsArr.length - 1] : parseInt(filters.year, 10);
        if (!totals[lastYear]) return `${lastYear} için veri yok.`;
        
        const prevYears = yearsArr.filter(y => y < lastYear);
        if(prevYears.length === 0) return `${lastYear} yılı için önceki yıl verisi bulunamadı.`;
        
        const prevYear = prevYears[prevYears.length - 1];

        const lastVal = totals[lastYear];
        const prevVal = totals[prevYear];
        const diff = lastVal - prevVal;
        const perc = prevVal !== 0 ? (diff / prevVal) * 100 : 0;
        
        let text = `${lastYear} vs ${prevYear}: ${formatSignedNumber(diff)} adet`;
        if (perc !== 0) {
            text += ` (${perc > 0 ? '+' : ''}${perc.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} %)`;
        }
        return text;
    }, [yearlyData, filters.year]);

    return (
        <div className="border border-light-border-subtle dark:border-dark-border-subtle rounded-xl p-3 bg-light-card-bg dark:bg-dark-card-bg h-full">
            <h3 className="text-sm font-semibold">Yıllık net satış karşılaştırması</h3>
            <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle">Her yılın toplam <strong>NET SATIŞ ADET</strong> değeri.</p>
            <div id="yearly-chart-container" className="w-full h-[330px]"></div>
            <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle mt-1">{yearlyInfoText}</p>
        </div>
    );
};

interface YearlyRefundRateChartProps {
    allRows: Row[];
    theme: Theme;
}
const YearlyRefundRateChart: React.FC<YearlyRefundRateChartProps> = ({ allRows, theme }) => {
    const yearlyData = useMemo(() => {
        const yearlyStats: { [year: number]: { [segment: string]: { refunds: number, sales: number } } } = {};

        allRows.forEach(r => {
            if (!yearlyStats[r.year]) {
                yearlyStats[r.year] = {
                    abiye: { refunds: 0, sales: 0 },
                    other: { refunds: 0, sales: 0 },
                    total: { refunds: 0, sales: 0 },
                };
            }
            
            if (r.abiyeRefundCount !== null) yearlyStats[r.year].abiye.refunds += r.abiyeRefundCount;
            if (r.abiyeTotalSales !== null) yearlyStats[r.year].abiye.sales += r.abiyeTotalSales;
            if (r.otherRefundCount !== null) yearlyStats[r.year].other.refunds += r.otherRefundCount;
            if (r.otherTotalSales !== null) yearlyStats[r.year].other.sales += r.otherTotalSales;
            if (r.totalRefundCount !== null) yearlyStats[r.year].total.refunds += r.totalRefundCount;
            if (r.totalTotalSales !== null) yearlyStats[r.year].total.sales += r.totalTotalSales;
        });

        const yearsArr = Object.keys(yearlyStats).map(y => parseInt(y, 10)).sort((a, b) => a - b);
        
        const abiyeRates = yearsArr.map(y => yearlyStats[y].abiye.sales > 0 ? (yearlyStats[y].abiye.refunds / yearlyStats[y].abiye.sales) * 100 : 0);
        const otherRates = yearsArr.map(y => yearlyStats[y].other.sales > 0 ? (yearlyStats[y].other.refunds / yearlyStats[y].other.sales) * 100 : 0);
        const totalRates = yearsArr.map(y => yearlyStats[y].total.sales > 0 ? (yearlyStats[y].total.refunds / yearlyStats[y].total.sales) * 100 : 0);

        return { yearsArr, abiyeRates, otherRates, totalRates };
    }, [allRows]);

    useEffect(() => {
        const chartDiv = document.getElementById('refund-chart-container');
        if (!chartDiv) return;

        if (yearlyData.yearsArr.length === 0) {
            Plotly.purge(chartDiv);
            return;
        };
        
        const { yearsArr, abiyeRates, otherRates, totalRates } = yearlyData;
        
        const colors = {
            paper: "rgba(0,0,0,0)",
            plot: "rgba(0,0,0,0)",
            font: theme === "dark" ? "#e5e7eb" : "#111827",
            grid: theme === "dark" ? "rgba(55,65,81,0.6)" : "rgba(209,213,219,0.7)",
            accent: theme === 'light' ? '#4f46e5' : '#6366f1',
            accent2: theme === 'light' ? '#db2777' : '#f472b6',
            accent3: theme === 'light' ? '#059669' : '#34d399',
        };

        const traceAbiye = { x: yearsArr.map(String), y: abiyeRates, name: 'Abiye', type: 'bar', hovertemplate: `Abiye<br>%{x}: %{y:.1f}%<extra></extra>`, marker: { color: colors.accent } };
        const traceOther = { x: yearsArr.map(String), y: otherRates, name: 'Abiye Hariç', type: 'bar', hovertemplate: `Abiye Hariç<br>%{x}: %{y:.1f}%<extra></extra>`, marker: { color: colors.accent2 } };
        const traceTotal = { x: yearsArr.map(String), y: totalRates, name: 'Tümü', type: 'bar', hovertemplate: `Tümü<br>%{x}: %{y:.1f}%<extra></extra>`, marker: { color: colors.accent3 } };

        const layout = {
            barmode: 'group',
            margin: { t: 40, r: 10, b: 40, l: 60 },
            paper_bgcolor: colors.paper,
            plot_bgcolor: colors.plot,
            font: { color: colors.font, size: 10 },
            xaxis: { title: "Yıl", gridcolor: colors.grid },
            yaxis: { title: "Yıllık İade Oranı (%)", gridcolor: colors.grid, automargin: true, tickformat: '.0f' },
            legend: { x: 0.5, y: 1.2, xanchor: 'center', yanchor: 'top', orientation: 'h', font: { size: 9 } }
        };

        Plotly.react('refund-chart-container', [traceAbiye, traceOther, traceTotal], layout, { responsive: true, displaylogo: false });
    }, [yearlyData, theme]);

    return (
        <div className="border border-light-border-subtle dark:border-dark-border-subtle rounded-xl p-3 bg-light-card-bg dark:bg-dark-card-bg h-full">
            <h3 className="text-sm font-semibold">Yıllık İade Oranı Karşılaştırması</h3>
            <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle">Her yılın ağırlıklı ortalama iade oranı (segment bazında).</p>
            <div id="refund-chart-container" className="w-full h-[330px]"></div>
            <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle mt-1">İade Oranı = Toplam İade Adet / Toplam Brüt Satış Adet</p>
        </div>
    );
};


interface DataTableProps {
    filteredRows: Row[];
    segment: Segment;
}
const DataTable: React.FC<DataTableProps> = ({ filteredRows, segment }) => {
    const segLabel = getSegmentLabel(segment);
    const prefix = getSegmentPrefix(segment);

    const headers = [
        "Tarih",
        `${segLabel} satış toplam`,
        `Net ${segLabel.toLowerCase()} satış`,
        `TR ${segLabel}`,
        `EU ${segLabel}`,
        `${segLabel} iade adet`,
        `${segLabel} iade oranı (%)`,
        `Stok adet ${segLabel.toLowerCase()}`,
        `Stok değer ${segLabel.toLowerCase()} (TRY)`,
    ];

    const handleExportCSV = useCallback(() => {
        if (filteredRows.length === 0) {
            alert("Dışa aktarılacak veri yok.");
            return;
        }

        const getCsvValue = (value: number | null | undefined) => {
            if (value === null || value === undefined || isNaN(value)) return '';
            return String(value).replace('.', ','); // Use comma for Turkish Excel
        };

        const csvRows = filteredRows.map(r => {
            const rowData = [
                r.tarihStr,
                getCsvValue(r[(prefix + "TotalSales") as keyof Row] as number),
                getCsvValue(r[(prefix + "Net") as keyof Row] as number),
                getCsvValue(r[(prefix + "TrSales") as keyof Row] as number),
                getCsvValue(r[(prefix + "EuSales") as keyof Row] as number),
                getCsvValue(r[(prefix + "RefundCount") as keyof Row] as number),
                getCsvValue(r[(prefix + "RefundRate") as keyof Row] as number),
                getCsvValue(r[(prefix + "StockQty") as keyof Row] as number),
                getCsvValue(r[(prefix + "StockValue") as keyof Row] as number),
            ];
            return rowData.map(val => `"${val}"`).join(',');
        });

        const csvHeader = headers.map(h => `"${h}"`).join(',');
        const csvContent = [csvHeader, ...csvRows].join('\n');

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // BOM for UTF-8 Excel compatibility
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `lafaba_satis_verileri_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [filteredRows, prefix, headers]);

    return (
        <div className="mt-4">
            <div className="overflow-auto border border-light-border-subtle dark:border-dark-border-subtle rounded-xl max-h-80 relative">
                <table className="w-full text-xs text-right min-w-[700px]">
                    <thead className="sticky top-0 bg-gray-200/80 dark:bg-slate-900/80 backdrop-blur-md">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={h} className={`p-2 font-semibold uppercase tracking-wider border-b border-light-border-subtle dark:border-dark-border-subtle ${i === 0 ? 'text-left sticky left-0 bg-gray-200 dark:bg-slate-900' : ''}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border-subtle dark:divide-dark-border-subtle">
                        {filteredRows.slice(0, 20).map(r => (
                            <tr key={r.tarihStr} className="even:bg-gray-100/50 dark:even:bg-white/5">
                                <td className="p-2 text-left sticky left-0 bg-white dark:bg-slate-800 even:bg-gray-100/50 dark:even:bg-white/5">{r.tarihStr}</td>
                                <td>{formatNumber(r[(prefix + "TotalSales") as keyof Row] as number)}</td>
                                <td>{formatNumber(r[(prefix + "Net") as keyof Row] as number)}</td>
                                <td>{formatNumber(r[(prefix + "TrSales") as keyof Row] as number)}</td>
                                <td>{formatNumber(r[(prefix + "EuSales") as keyof Row] as number)}</td>
                                <td>{formatNumber(r[(prefix + "RefundCount") as keyof Row] as number)}</td>
                                <td>{r[(prefix + "RefundRate") as keyof Row] != null ? `${(r[(prefix + "RefundRate") as keyof Row] as number).toLocaleString("tr-TR", {maximumFractionDigits: 1})} %` : '-'}</td>
                                <td>{formatNumber(r[(prefix + "StockQty") as keyof Row] as number)}</td>
                                <td className="px-2">{formatCurrency(r[(prefix + "StockValue") as keyof Row] as number)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-light-text-subtle dark:text-dark-text-subtle">
                    Yalnızca ilk <strong>20</strong> satır gösterilir (seçili yıl/ay filtresine göre).
                </p>
                <button
                    onClick={handleExportCSV}
                    disabled={filteredRows.length === 0}
                    className="px-4 py-1.5 text-xs font-semibold bg-light-accent dark:bg-dark-accent text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Tablo Verisini Dışa Aktar (CSV)
                </button>
            </div>
        </div>
    );
};

export default App;