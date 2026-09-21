export type Language = 'EN' | 'HI' | 'MR';

export type ActiveTab = 'advisor' | 'mandi';

export type CropId = 'soybean' | 'wheat' | 'gram' | 'mustard' | 'cotton';

export interface LocalizedString {
  EN: string;
  HI: string;
  MR: string;
}

export interface CropData {
  id: CropId;
  name: LocalizedString;
  botanicalName: string;
  season: LocalizedString;
  iconName: string;
  emoji: string;
  description: LocalizedString;
  npkPerAcre: {
    n: number; // kg per acre
    p: number; // kg per acre
    k: number; // kg per acre
  };
  bagMultipliers: {
    urea: number; // bags per acre (50kg bag)
    dap: number;  // bags per acre (50kg bag)
    mop: number;  // bags per acre (50kg bag)
  };
  advice: LocalizedString;
  mandiPrice: {
    modal: number;
    range: string;
    trend: 'up' | 'stable' | 'down';
  };
  soilSuitability: LocalizedString;
}

export interface Supplier {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  phone: string;
  inStock: string[];
  verified: boolean;
}

export interface MandiItem {
  commodity: LocalizedString;
  variety: string;
  market: string;
  pricePerQuintal: number;
  priceChange: number;
  arrivalTons: number;
}

export interface Scheme {
  id: number;
  nameEN: string;
  nameHI: string;
  nameMR: string;
  maxAcres: number;
  benefitEN: string;
  benefitHI?: string;
  benefitMR?: string;
  crop: string;
  portalUrl?: string;
  schemeCode?: string;
}

export interface MandiTickerItem {
  mandi: string;
  price: number;
  trend: string;
}

export interface MandiChartPoint {
  date: string;
  price: number;
  ratio?: string;
}

export interface MandiTableItem {
  id: number;
  name: string;
  distance: number;
  gross: number;
  transportCost: number;
  net: number;
  status: 'OPTIMAL' | 'WARNING';
  arrival?: string;
}

export interface LiveMandiPayload {
  ticker: MandiTickerItem[];
  chartData: MandiChartPoint[];
  tableData: MandiTableItem[];
  scrapedAt?: string;
  source?: string;
}
