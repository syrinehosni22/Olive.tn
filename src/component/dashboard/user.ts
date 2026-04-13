// types/user.ts
export type UserRole = "vendeur" | "acheteur" | "prestataire" | "admin";

export interface RoleConfig {
  label: string;
  primaryColor: string;
  secondaryColor: string;
  icon: any; // Ou LucideIcon si vous importez le type de lucide-react
  menuItems: Array<{ id: string; label: string; icon: any }>;
}

export interface UserData {
  role: UserRole;
  planId?: string;
  email: string;
  firstName?: string;
  name?: string;
  phone?: string;
  companyName?: string;
  seller?: { registrationNumber?: string; capacity?: number; region?: string; delegation?: string; altitude?: string };
  buyer?: { buyerType?: string; searchRegion?: string };
  provider?: { serviceType?: string; website?: string; linkedin?: string; instagram?: string };
}