import { isFakeMode } from "@/lib/api-mode";
import { fakeEmployesApi } from "./fake";
import { httpEmployesApi } from "./http";
import type { Employe, EmployeCreateData, EmployeUpdateData, ActivationCodeResponse } from "../types";

export interface EmployesApi {
  list(idEntreprise: string): Promise<Employe[]>;
  getById(employeeId: string): Promise<Employe>;
  create(idEntreprise: string, data: EmployeCreateData): Promise<Employe>;
  update(employeeId: string, data: EmployeUpdateData): Promise<Employe>;
  delete(employeeId: string): Promise<void>;
  generateActivationCode(employeeId: string): Promise<ActivationCodeResponse>;
  dissocierAppareil(employeeId: string): Promise<Employe>;
}

export const employesApi: EmployesApi = isFakeMode() ? fakeEmployesApi : httpEmployesApi;
