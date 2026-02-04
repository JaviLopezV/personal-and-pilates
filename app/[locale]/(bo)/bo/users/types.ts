export type Role = "CLIENT" | "ADMIN" | "SUPERADMIN";

export type RoleFilter = Role | "ALL";

export type BoUserItem = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  disabled: boolean;
  availableClasses: number;
};
