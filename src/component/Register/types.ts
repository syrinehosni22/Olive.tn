import React from "react";

export type RoleType = "acheteur" | "vendeur" | "prestataire";


// Adjust based on your actual data structure
export interface PlanDetails {
  classic: DetailItem[];
  premium: DetailItem[];
}


export interface DetailItem {
  icon: React.ReactNode;
  label: string;       // Used for summary cards
  title: string;       // Used for detail sections
  description: string; // Used for detail sections (make sure it's NOT desc)
}

export interface ComparisonRow {
  feature: string;
  classic: boolean | string | null;
  premium: boolean | string | null;
}

