
export type RoleType = 'acheteur' | 'vendeur' | 'prestataire' | null;

// types.ts

export interface DetailItem {
  icon: React.ReactNode; // C'est ici le secret : ReactNode accepte <Icons.Search />, etc.
  title?: string;
  label?: string;
  desc?: string;
}

export interface ComparisonRow {
  feature: string;
  classic: boolean | null;
  premium: boolean | null;
}