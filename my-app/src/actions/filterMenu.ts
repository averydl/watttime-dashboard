export const BALANCE_AUTH = "BALANCE_AUTH";
export const DAYS = "DAYS";

export function chooseBA(balanceAuthority: any) {
  return {
    type: BALANCE_AUTH,
    balanceAuthority
  }
}

export function chooseDays(days: any) {
  return {
    type: DAYS,
    days
  }
}