import { User } from "./user.model"

export interface Notification {
  id?: string
  title?: string
  body?: string
  receiver?: string
  type?: CredentialType

  status?: string
  isSeen?: boolean

  accountReceiver?: User
  method?: NotificationMethod

  driverLocation?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
  archiveReason?: string
}

export enum CredentialType {
  Owner = "owner",
  Tenant = "tenant",
  All = "all",
}

export enum NotificationMethod {
  Notification = "notification",
  Sms = "sms",
  Both = "both",
}
