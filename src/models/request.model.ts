import { DateValue } from "@mantine/dates";
import { Property } from "./property.model";
import { Tenant } from "./tenant.model";
import { Unit } from "./unit.model";

export type TenantRequest = {
  id: string;
  propertyId: string;
  property: Property;
  tenantId: string;
  tenant: Tenant;
  unitId: string;
  unit: Unit;
  description: string;
  type: string;
  priority: string;
  archiveReason: string;
  createdBy: string;
  updatedBy: string;
  createdAt: DateValue;
  updatedAt: DateValue;
  deletedAt: DateValue;
  deletedBy: string;
};
