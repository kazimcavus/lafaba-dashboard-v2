
import { Row, Segment, Metric, Region } from './types';

export const DEFAULT_CSV_DATA = `
TARİH,ABİYE SATIŞ ADET TOPLAM,ABİYE HARİÇ SATIŞ ADET TOPLAM,SATIŞ ADET TOPLAM,TR ABİYE SATIŞ ADET,TR ABİYE HARİÇ SATIŞ ADET,TR SATIŞ ADET,EU ABİYE SATIŞ ADET,EU ABİYE HARİÇ SATIŞ ADET,EU SATIŞ ADET,ABİYE İADE ADET,ABİYE HARİÇ İADE ADET,İADE ADET,ABİYE İADE ORANI,ABİYE HARİÇ İADE ORANI,İADE ORANI,TR NET ABİYE SATIŞ ADET,TR NET ABİYE HARİÇ SATIŞ ADET,TR NET SATIŞ ADET,NET ABİYE SATIŞ ADET,NET ABİYE HARİÇ SATIŞ ADET,NET SATIŞ ADET,STOK DEĞER ABİYE,STOK DEĞER ABİYE HARİÇ,STOK DEĞER,STOK ADET ABİYE,STOK ADET ABİYE HARİÇ,STOK ADET
Nisan 2022,12,,,12,,,-,-,-,1,,,8,,,11,,,11,,,"18.038,00 TRY",,,225,29.775,30.000
Mayıs 2022,710,,,710,,,-,-,-,203,,,29,,,507,,,507,,,"174.975,00 TRY",,,564,29.436,30.000
Haziran 2022,1.990,,,1.990,,,-,-,-,535,,,27,,,1.455,,,1.455,,,"334.599,00 TRY",,,495,29.505,30.000
Temmuz 2022,1.987,,,1.987,,,-,-,-,548,,,28,,,1.439,,,1.439,,,"533.724,00 TRY",,,988,29.012,30.000
Ağustos 2022,3.555,,,3.555,,,-,-,-,959,,,27,,,2.596,,,2.596,,,"630.556,00 TRY",,,1.253,28.747,30.000
Eylül 2022,2.595,,,2.595,,,-,-,-,761,,,29,,,1.834,,,1.834,,,"808.628,00 TRY",,,1.563,28.437,30.000
Ekim 2022,1.791,,,1.791,,,-,-,-,527,,,29,,,1.264,,,1.264,,,"1.073.897,00 TRY",,,1.771,28.229,30.000
Kasım 2022,1.139,,,1.139,,,-,-,-,342,,,30,,,797,,,797,,,"1.365.430,00 TRY",,,2.369,27.631,30.000
Aralık 2022,880,,,880,,,-,-,-,304,,,35,,,576,,,576,,,"1.508.229,00 TRY",,,2.667,27.333,30.000
Ocak 2023,1.646,,,1.646,,,-,-,-,458,,,28,,,1.188,,,1.188,,,"1.595.014,00 TRY",,,2.851,27.149,30.000
Şubat 2023,2.141,,,2.141,,,-,-,-,697,,,33,,,1.444,,,1.444,,,"2.270.312,00 TRY",,,3.945,26.055,30.000
Mart 2023,4.424,,,4.424,,,-,-,-,1.349,,,30,,,3.075,,,3.075,,,"1.862.514,00 TRY",,,3.061,26.939,30.000
Nisan 2023,6.350,,,6.350,,,-,-,-,1.892,,,30,,,4.458,,,4.458,,,"1.884.307,00 TRY",,,3.271,26.729,30.000
Mayıs 2023,11.228,,,11.228,,,-,-,-,4.095,,,36,,,7.133,,,7.133,,,"4.381.001,00 TRY",,,6.215,23.785,30.000
Haziran 2023,12.744,,,10.897,,,1.847,-,-,4.896,,,45,,,6.001,,,7.848,,,"4.881.348,00 TRY",,,8.236,21.764,30.000
Temmuz 2023,15.956,,,12.401,,,3.555,-,-,4.575,,,37,,,7.826,,,11.381,,,"4.919.462,00 TRY",,,8.658,21.342,30.000
Ağustos 2023,14.890,,,11.316,,,3.574,-,-,4.750,,,42,,,6.566,,,10.140,,,"5.632.301,00 TRY",,,9.089,20.911,30.000
Eylül 2023,12.684,,,7.736,,,4.948,-,-,3.639,,,47,,,4.097,,,9.045,,,"6.190.537,00 TRY",,,9.842,20.158,30.000
Ekim 2023,8.183,,,5.316,,,2.867,-,-,2.335,,,44,,,2.981,,,5.848,,,"7.380.144,00 TRY",,,11.335,18.665,30.000
Kasım 2023,6.286,,,3.658,,,2.628,-,-,1.483,,,41,,,2.175,,,4.803,,,"7.391.826,00 TRY",,,11.199,18.801,30.000
Aralık 2023,3.585,,,2.408,,,1.177,-,-,1.131,,,47,,,1.277,,,2.454,,,"9.828.348,00 TRY",,,15.433,14.567,30.000
Ocak 2024,4.929,,,2.889,,,2.040,-,-,1.150,,,40,,,1.739,,,3.779,,,"13.941.326,00 TRY",,,17.490,12.510,30.000
Şubat 2024,6.391,,,4.777,,,1.614,-,-,1.331,,,28,,,3.446,,,5.060,,,"15.522.938,00 TRY",,,18.834,11.166,30.000
Mart 2024,10.666,,,8.200,,,2.466,-,-,2.482,,,30,,,5.718,,,8.184,,,"12.664.430,00 TRY",,,15.200,14.800,30.000
Nisan 2024,15.670,,,11.199,,,4.471,-,-,4.011,,,36,,,7.188,,,11.659,,,"10.632.926,00 TRY",,,12.226,17.774,30.000
Mayıs 2024,21.892,,,18.522,,,3.370,-,-,6.455,,,35,,,12.067,,,15.437,,,"14.618.935,00 TRY",,,16.108,13.892,30.000
Haziran 2024,17.892,,,15.769,,,2.123,-,-,5.528,,,35,,,10.241,,,12.364,,,"21.837.011,00 TRY",,,23.959,6.041,30.000
Temmuz 2024,22.855,,,21.223,,,1.632,-,-,9.884,,,47,,,11.339,,,12.971,,,"26.218.080,00 TRY",,,27.536,2.464,30.000
Ağustos 2024,23.234,,,21.843,,,1.391,-,-,9.514,,,44,,,12.329,,,13.720,,,"18.765.528,00 TRY",,,19.797,10.203,30.000
Eylül 2024,13.805,,,12.710,,,1.095,-,-,6.399,,,50,,,6.311,,,7.406,,,"13.560.807,00 TRY",,,14.046,15.954,30.000
Ekim 2024,5.126,,,4.391,,,735,-,-,2.622,,,60,,,1.769,,,2.504,,,"14.450.609,00 TRY",,,14.632,15.368,30.000
Kasım 2024,3.236,,,2.665,,,571,-,-,1.307,,,49,,,1.358,,,1.929,,,"16.989.866,00 TRY",,,16.395,13.605,30.000
Aralık 2024,1.830,,,1.569,,,261,-,-,840,,,54,,,729,,,990,,,"19.905.340,00 TRY",,,19.433,10.567,30.000
`;

export const MONTH_MAP: { [key: string]: number } = {
  "Ocak": 1, "Şubat": 2, "Mart": 3, "Nisan": 4, "Mayıs": 5, "Haziran": 6,
  "Temmuz": 7, "Ağustos": 8, "Eylül": 9, "Ekim": 10, "Kasım": 11, "Aralık": 12
};

export const MONTH_REVERSE_MAP: { [key: number]: string } = Object.fromEntries(
  Object.entries(MONTH_MAP).map(([k, v]) => [v, k])
);

export function parseTurkishNumber(str: string | null | undefined): number | null {
  if (str === null || str === undefined) return null;
  let v = String(str).trim();
  if (v === "" || v === "-") return null;

  v = v.replace(/"/g, "");
  v = v.replace(/TRY/gi, "");
  v = v.replace(/\s+/g, "");
  v = v.replace(/\./g, "");
  v = v.replace(/,/g, ".");

  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "-";
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

export function formatSignedNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n) || n === 0) return "0";
  const sign = n > 0 ? "+" : "−";
  const abs = Math.abs(n);
  return sign + abs.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
}

export function formatCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return "-";
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";
}

export function parseTarih(tarihStr: string | null): { year: number, month: number } | null {
  if (!tarihStr) return null;
  const parts = tarihStr.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const monthName = parts[0];
  const year = parseInt(parts[1], 10);
  const month = MONTH_MAP[monthName] || null;
  if (!year || !month) return null;
  return { year, month };
}

export function getSegmentPrefix(segment: Segment): string {
  if (segment === "other") return "other";
  if (segment === "total") return "total";
  return "abiye";
}

export function getSegmentLabel(segment: Segment): string {
  if (segment === "other") return "Abiye hariç";
  if (segment === "total") return "Tümü";
  return "Abiye";
}

function detectDelimiter(headerLine: string): string {
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return semicolons > commas ? ";" : ",";
}

function splitCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}


function normalizeHeader(h: string): string {
  return String(h)
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}


export function parseCSV(text: string): { rows: Row[], delimiter: string } {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length < 2) {
        return { rows: [], delimiter: ',' };
    }

    const headerLine = lines[0];
    const delimiter = detectDelimiter(headerLine);
    const headerParts = splitCSVLine(headerLine, delimiter);
    const headers = headerParts.map(h => h.trim());

    const idxNorm: { [key: string]: number } = {};
    headers.forEach((h, i) => {
        idxNorm[normalizeHeader(h)] = i;
    });
    
    const parsedRows: Row[] = [];
    for (let i = 1; i < lines.length; i++) {
        const parts = splitCSVLine(lines[i], delimiter);
        if (parts.length === 1 && parts[0].trim() === "") continue;

        const get = (h: string) => {
            const key = normalizeHeader(h);
            const colIndex = idxNorm[key];
            return colIndex !== undefined ? (parts[colIndex] || "").trim() : "";
        };

        const tarihStr = get("TARİH");
        if (!tarihStr) continue;
        const dt = parseTarih(tarihStr);
        if (!dt) continue;

        const { year, month } = dt;

        const abiyeTotalSales = parseTurkishNumber(get("ABİYE SATIŞ ADET TOPLAM"));
        const abiyeTrSales = parseTurkishNumber(get("TR ABİYE SATIŞ ADET"));
        const abiyeEuSales = parseTurkishNumber(get("EU ABİYE SATIŞ ADET"));
        const abiyeRefundCount = parseTurkishNumber(get("ABİYE İADE ADET"));
        const abiyeRefundRate = parseTurkishNumber(get("ABİYE İADE ORANI"));
        const abiyeTrNet = parseTurkishNumber(get("TR NET ABİYE SATIŞ ADET"));
        const abiyeNet = parseTurkishNumber(get("NET ABİYE SATIŞ ADET"));
        const abiyeStockValue = parseTurkishNumber(get("STOK DEĞER ABİYE"));
        const abiyeStockQty = parseTurkishNumber(get("STOK ADET ABİYE"));

        const otherTotalSales = parseTurkishNumber(get("ABİYE HARİÇ SATIŞ ADET TOPLAM"));
        const otherTrSales = parseTurkishNumber(get("TR ABİYE HARİÇ SATIŞ ADET"));
        const otherEuSales = parseTurkishNumber(get("EU ABİYE HARİÇ SATIŞ ADET"));
        const otherRefundCount = parseTurkishNumber(get("ABİYE HARİÇ İADE ADET"));
        const otherRefundRate = parseTurkishNumber(get("ABİYE HARİÇ İADE ORANI"));
        const otherTrNet = parseTurkishNumber(get("TR NET ABİYE HARİÇ SATIŞ ADET"));
        const otherNet = parseTurkishNumber(get("NET ABİYE HARİÇ SATIŞ ADET"));
        const otherStockValue = parseTurkishNumber(get("STOK DEĞER ABİYE HARİÇ"));
        const otherStockQty = parseTurkishNumber(get("STOK ADET ABİYE HARİÇ"));

        let totalTotalSales = parseTurkishNumber(get("SATIŞ ADET TOPLAM"));
        let totalTrSales = parseTurkishNumber(get("TR SATIŞ ADET"));
        let totalEuSales = parseTurkishNumber(get("EU SATIŞ ADET"));
        let totalRefundCount = parseTurkishNumber(get("İADE ADET"));
        let totalRefundRate = parseTurkishNumber(get("İADE ORANI"));
        let totalTrNet = parseTurkishNumber(get("TR NET SATIŞ ADET"));
        let totalNet = parseTurkishNumber(get("NET SATIŞ ADET"));
        let totalStockValue = parseTurkishNumber(get("STOK DEĞER"));
        let totalStockQty = parseTurkishNumber(get("STOK ADET"));

        const safeSum = (a: number | null, b: number | null) => (a === null && b === null) ? null : (a || 0) + (b || 0);
        
        if (totalTotalSales == null) totalTotalSales = safeSum(abiyeTotalSales, otherTotalSales);
        if (totalTrSales == null) totalTrSales = safeSum(abiyeTrSales, otherTrSales);
        if (totalEuSales == null) totalEuSales = safeSum(abiyeEuSales, otherEuSales);
        if (totalRefundCount == null) totalRefundCount = safeSum(abiyeRefundCount, otherRefundCount);
        if (totalTrNet == null) totalTrNet = safeSum(abiyeTrNet, otherTrNet);
        if (totalNet == null) totalNet = safeSum(abiyeNet, otherNet);
        if (totalStockValue == null) totalStockValue = safeSum(abiyeStockValue, otherStockValue);
        if (totalStockQty == null) totalStockQty = safeSum(abiyeStockQty, otherStockQty);
        
        if (totalRefundRate == null && totalRefundCount != null && totalTotalSales != null && totalTotalSales !== 0) {
            totalRefundRate = (totalRefundCount / totalTotalSales) * 100;
        }

        const row: Row = {
            tarihStr: tarihStr.trim(), year, month,
            abiyeTotalSales, abiyeTrSales, abiyeEuSales, abiyeRefundCount, abiyeRefundRate, abiyeTrNet, abiyeNet, abiyeStockQty, abiyeStockValue,
            otherTotalSales, otherTrSales, otherEuSales, otherRefundCount, otherRefundRate, otherTrNet, otherNet, otherStockQty, otherStockValue,
            totalTotalSales, totalTrSales, totalEuSales, totalRefundCount, totalRefundRate, totalTrNet, totalNet, totalStockQty, totalStockValue
        };
        parsedRows.push(row);
    }
    
    parsedRows.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));

    return { rows: parsedRows, delimiter };
}

export function getMetricValue(row: Row, metricKey: Metric, regionKey: Region, segment: Segment): number | null {
    if (!row) return null;
    const prefix = getSegmentPrefix(segment);

    const totalKey = (prefix + "TotalSales") as keyof Row;
    const trKey = (prefix + "TrSales") as keyof Row;
    const netKey = (prefix + "Net") as keyof Row;
    const trNetKey = (prefix + "TrNet") as keyof Row;
    const refundCountKey = (prefix + "RefundCount") as keyof Row;
    const refundRateKey = (prefix + "RefundRate") as keyof Row;
    const stockQtyKey = (prefix + "StockQty") as keyof Row;
    const euKey = (prefix + "EuSales") as keyof Row;

    if (metricKey === "stockQty") return row[stockQtyKey] as number | null;
    if (metricKey === "refundCount") return row[refundCountKey] as number | null;
    if (metricKey === "refundRate") return row[refundRateKey] as number | null;
    
    if (metricKey === "netSales") {
        if (regionKey === "TR") return row[trNetKey] as number | null;
        if (regionKey === "EU") {
            const net = row[netKey] as number | null;
            const trNet = row[trNetKey] as number | null;
            if (net == null || trNet == null) return null;
            return net - trNet;
        }
        return row[netKey] as number | null;
    }
    
    if (metricKey === "totalSales") {
        if (regionKey === "TR") return row[trKey] as number | null;
        if (regionKey === "EU") return row[euKey] as number | null;
        return row[totalKey] as number | null;
    }

    return null;
}