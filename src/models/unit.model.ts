import { Property } from "./property.model"

export type Unit = {
  id?: string
  name?: string
  propertyId?: string
  property?: Property
  type?: string
  occupied?: boolean
  description?: string
  enabled?: boolean
  archiveReason?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
  imageFilenames?: string[]
  minioimages?: string[]
}
