import { Address } from "./address.model"
import { EmergencyContact } from "./emergencyContact.model"
import { Owner } from "./owner.model"

export type Tenant = {
  id?: string
  name?: string
  email?: string
  phoneNumber?: string
  gender?: string
  enabled?: boolean
  ownerId?: string
  owner?: Owner
  profileImageFilename?: string
  identificationFilename?: string
  address?: Address
  emergencyContact?: EmergencyContact
  archiveReason?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
  minioProfileImage?: string
  minoioIdentification?: string
  identification?: any
}
