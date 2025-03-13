import { DateValue } from "@mantine/dates"
import { Address } from "./address.model"
import { EmergencyContact } from "./emergencyContact.model"
import { User } from "./user.model"
import { string } from "yup"

export type Owner = {
  id?: string
  name?: string
  email?: string
  phoneNumber?: string
  gender?: string
  enabled?: boolean
  confidential?: boolean
  pricePerMonth?: number
  parentOwnerId?: string
  discountType?: string
  discountAmount?: number
  profileImageFilename?: string
  identificationFilename?: string
  address?: Address
  emergencyContact?: EmergencyContact
  archiveReason?: string
  createdBy?: string
  // createdByUser?: User
  updatedBy?: string
  createdAt?: DateValue
  updatedAt?: DateValue
  deletedAt?: DateValue
  deletedBy?: string
  minioProfileImage?: string
}
