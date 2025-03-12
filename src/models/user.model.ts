import { Address } from "./address.model";
import { EmergencyContact } from "./emergencyContact.model";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  enabled: boolean;
  profileImage?: ProfileImage;
  type: string;
  address: Address;
  accountId: string;
  emergencyContact: EmergencyContact;
  role: string[];
  permission: string[];
  archiveReason?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  deletedBy?: string;
}
interface ProfileImage {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

export interface Account {
  phoneNumber: string;
  password: string;
  type: string;
}
