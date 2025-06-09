import { IAuditable } from "../../common/schemes/auditable.js";
import { ISoftDelete } from "../../common/schemes/soft-delete.js";

export interface ICustomer extends ISoftDelete, IAuditable {
  email?: string;
  phone: string;
  name: string;
  defaultAddress: string;
  invoiceAddress: string;
  identityNumber: string;
}
