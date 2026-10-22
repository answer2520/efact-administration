import { isFakeMode } from "@/lib/api-mode";
import { fakeEmployesApi } from "./fake";
import { httpEmployesApi } from "./http";
import type { Employe, EmployeFormData } from "../types";

export interface EmployesApi {
  list(entrepriseId: string): Promise<Employe[]>;
  getById(entrepriseId: string, employeeId: string): Promise<Employe>;
  create(entrepriseId: string, data: EmployeFormData): Promise<Employe>;
  update(entrepriseId: string, employeeId: string, data: EmployeFormData): Promise<Employe>;
  delete(entrepriseId: string, employeeId: string): Promise<void>;
  /** Génère un code d'activation valide 3 minutes. */
  generateActivationCode(entrepriseId: string, employeeId: string): Promise<{ code: string; expiresAt: string }>;
  /** Dissocie l'appareil lié à l'employé. */
  unlinkDevice(entrepriseId: string, employeeId: string): Promise<Employe>;
}

/** API des employés — dispatche vers fake ou http selon API_MODE. */
export const employesApi: EmployesApi = isFakeMode() ? fakeEmployesApi : httpEmployesApi;
