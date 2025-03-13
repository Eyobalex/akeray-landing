import { DateValue } from "@mantine/dates"
import { Tenant } from "./tenant.model"
import { Unit } from "./unit.model"
import { Property } from "./property.model"

export type Lease = {
  id?: string
  name?: string
  startDate?: DateValue
  endDate?: DateValue
  rentAmount?: number
  securityDeposit?: number
  paymentFrequency?: PaymentFrequency
  leaseStatus: LeaseStatus
  leaseType?: LeaseType
  paymentDueDate?: DateValue
  lateFee?: number
  terminationNotice?: number
  enabled?: boolean
  terminatedAt?: DateValue
  tenantId?: string
  tenant?: Tenant
  unitId?: string
  unit?: Unit
  propertyId?: string
  property?: Property
  autoRenewal?: boolean
  notes?: string
  leaseFilename?: string
  miniolease?: string
  lease?: any
  archiveReason?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
}

export enum PaymentFrequency {
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  SixMonths = "SixMonths",
  Annually = "Annually",
}

export enum LeaseStatus {
  Active = "Active",
  Terminated = "Terminated",
  Expired = "Expired",
  Pending = "Pending",
}
export enum LeaseType {
  FixedTerm = "Fixed-term",
  MonthToMonth = "Month-to-Month",
  Sublease = "Sublease",
}
