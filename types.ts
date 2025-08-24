
export interface TrendCardData {
  category: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceLogoUrl: string;
  publishedDate: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  consent: boolean;
}

export interface HiddenFormData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  timestamp: string;
  page_path: string;
  user_agent: string;
}

export type FullLeadData = LeadFormData & HiddenFormData;
