import { Address } from "./address.model"
import { Owner } from "./owner.model"
import { Unit } from "./unit.model"

export type Property = {
  id?: string
  name?: string
  type?: string
  address?: Address
  description?: string
  totalUnits?: number
  ownerId?: string
  owner?: Owner
  units?: Unit[]
  enabled?: boolean
  archiveReason?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
  minioProfileImage?: string
}
