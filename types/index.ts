export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  leadTime: string;
  features: string[];
  popular?: boolean;
};

export type AdvantageItem = {
  id: string;
  title: string;
  description: string;
  stat?: string;
};

export type ProcessStep = {
  id: number;
  title: string;
  description: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  car: string;
  text: string;
  rating: number;
  date: string;
  service: string;
};

export type BrandItem = {
  id: string;
  name: string;
  color: string;
  group: "china" | "japan" | "korea" | "europe" | "usa" | "russia";
  featured?: boolean;
};

export type PartnerBrandItem = {
  id: string;
  index: string;
  name: string;
  role: string;
  logo: string;
  accent: string;
  description: string;
  tags: string[];
};

export type LeadPayload = {
  name: string;
  phone: string;
  service: string;
  message: string;
};
