import { BALANCE_AUTH, DAYS, chooseDays } from '../../src/actions/filterMenu';


const initialState: any = {
  BA: 'PJM',
  DayRange: 7,
}

export function rootReducer(state: any = initialState, action: any) {

  switch (action.type) {
    case BALANCE_AUTH:
      console.log("balance auth chosen : " + action.balanceAuthority);
      var newState = { ...state, BA: action.balanceAuthority};
      // newState.BA = action.balanceAuthority;
      return newState;
    case DAYS:
      console.log("date range chosen : " + action.days);
      var newState = {...state, DayRange: action.days};
      // newState.DayRange = action.days;
      return newState;
    default:
      return state;
  }

}
