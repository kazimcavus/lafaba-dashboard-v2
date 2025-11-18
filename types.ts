
export interface Row {
  tarihStr: string;
  year: number;
  month: number;
  abiyeTotalSales: number | null;
  abiyeTrSales: number | null;
  abiyeEuSales: number | null;
  abiyeRefundCount: number | null;
  abiyeRefundRate: number | null;
  abiyeTrNet: number | null;
  abiyeNet: number | null;
  abiyeStockQty: number | null;
  abiyeStockValue: number | null;
  otherTotalSales: number | null;
  otherTrSales: number | null;
  otherEuSales: number | null;
  otherRefundCount: number | null;
  otherRefundRate: number | null;
  otherTrNet: number | null;
  otherNet: number | null;
  otherStockQty: number | null;
  otherStockValue: number | null;
  totalTotalSales: number | null;
  totalTrSales: number | null;
  totalEuSales: number | null;
  totalRefundCount: number | null;
  totalRefundRate: number | null;
  totalTrNet: number | null;
  totalNet: number | null;
  totalStockQty: number | null;
  totalStockValue: number | null;
}

export type Theme = 'light' | 'dark';
export type Segment = 'abiye' | 'other' | 'total';
export type Metric = 'netSales' | 'totalSales' | 'refundCount' | 'refundRate' | 'stockQty';
export type Region = 'total' | 'TR' | 'EU';

export interface Filters {
  year: string;
  month: string;
  segment: Segment;
  metric: Metric;
  region: Region;
}
