export const BALANCE_AUTH = "BALANCE_AUTH";
export const DAYS = "DAYS";

export function chooseBA(id: any) {
  return {
    type: BALANCE_AUTH,
    id
  }
}

export function chooseDays(id: any) {
  return {
    type: DAYS,
    id
  }
}