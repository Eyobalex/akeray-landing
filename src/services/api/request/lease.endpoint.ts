const BASE_API = process.env.NEXT_PUBLIC_BASE_URL;

export const LEASE_ENDPOINT = {
  detail: `${BASE_API}/leases/get-lease`,
  list: `${BASE_API}/leases/get-leases`,
  getOwnersOfLease: `${BASE_API}/owners/get-owners`,
  getPropertiesForLease: `${BASE_API}/properties/get-properties`,
  getTenantsForLease: `${BASE_API}/tenants/get-tenants`,
  getUnitsForLease: `${BASE_API}/properties/get-units`,
  archive: `${BASE_API}/leases/archive-lease`,
  delete: `${BASE_API}/leases/delete-lease`,
  toggleStatus: `${BASE_API}/leases/change-lease-status`,
  restore: `${BASE_API}/leases/restore-lease`,
  archivedLeases: `${BASE_API}/leases/get-archived-leases`,
  archivedLease: `${BASE_API}/leases/get-archived-lease`,
  create: `${BASE_API}/leases/create-lease`,
  update: `${BASE_API}/leases/update-lease`,

  payForLeaseManually: `${BASE_API}/payments/pay-for-lease-manually`,

  detailRentIncrease: `${BASE_API}/rent-increases/get-rent-increase`,
  listRentIncrease: `${BASE_API}/rent-increases/get-rent-increases`,
  createRentIncrease: `${BASE_API}/rent-increases/create-rent-increase`,
  updateRentIncrease: `${BASE_API}/rent-increases/update-rent-increase`,
  changeRentIncreaseStatus: `${BASE_API}/rent-increases/change-rent-increase-status`,
  deleteRentIncrease: `${BASE_API}/rent-increases/delete-rent-increase`,
};
