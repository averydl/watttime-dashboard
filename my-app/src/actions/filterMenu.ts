export const BALANCE_AUTH = "BALANCE_AUTH";
export const START_DAY = "START_DAY";
export const END_DAY = "END_DAY";

export function chooseBA(balanceAuthority: any) {
  return {
    type: BALANCE_AUTH,
    balanceAuthority
  }
}

export function chooseStartDay(day: any) {
  return {
    type: START_DAY,
    day
  }
}

export function chooseEndDay(day: any) {
  return {
    type: END_DAY,
    day
  }
}