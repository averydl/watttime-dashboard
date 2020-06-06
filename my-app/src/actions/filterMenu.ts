export const BALANCE_AUTH = "BALANCE_AUTH";
export const DAYS = "DAYS";
export const END_DAY = "END_DAY";

export function chooseBA(balanceAuthority: any) {
  return {
    type: BALANCE_AUTH,
    balanceAuthority
  }
}

export function chooseDays(day: any) {
  return {
    type: DAYS,
    day
  }
}

export function chooseEndDay(day: any) {
  return {
    type: END_DAY,
    day
  }
}