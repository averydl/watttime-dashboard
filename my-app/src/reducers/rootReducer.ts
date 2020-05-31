import { BALANCE_AUTH, DAYS, chooseDays } from '../../src/actions/filterMenu';


const initialState: any = {
  BA: 'PJM',
  DayRange: 7,
}

export function rootReducer(state: any = initialState, action: any) {

  switch (action.type) {
    case BALANCE_AUTH:
      console.log("balance auth chosen");
      return state;
    case DAYS:
      console.log("date range chosen");
        return state;
    default:
      return state;
  }

}
