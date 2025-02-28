export type FeatureCardType = {
  title: string;
  image: string;
  href: string;
  type: "link" | "modal" | "page" | "cosmetic";
};

export interface FeatureCardProps extends FeatureCardType {
  imageAlt?: string;
  openModal?: (target: string) => void;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export type Clinic = {
  name: string;
  id: number;
};

export type User = {
  id: string;
  date_added: string;
  npi: string;
  name: string;
  status: string;
};
