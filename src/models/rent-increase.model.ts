import { DateValue } from "@mantine/dates"
import { Lease } from "./lease.model"

export interface RentIncrease {
  id?: string
  leaseId?: string
  lease?: Lease
  baseRent?: number
  increaseDate?: DateValue
  increasePercentage?: number
  increaseAmount?: number
  newRentAmount?: number
  reasonForIncrease?: string
  nextIncreaseDate?: DateValue
  status?: string
  notes?: string
  archiveReason?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: DateValue
  updatedAt?: DateValue
  deletedAt?: DateValue
  deletedBy?: string
}
