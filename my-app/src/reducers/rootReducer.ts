import { BALANCE_AUTH, START_DAY, chooseStartDay, END_DAY } from '../../src/actions/filterMenu';


const initialState: any = {
  BA: 'PJM',
  StartDay: new Date('2020-06-01'),
  EndDay: new Date(),
}

export function rootReducer(state: any = initialState, action: any) {

  switch (action.type) {
    case BALANCE_AUTH:
      console.log("balance auth chosen : " + action.balanceAuthority);
      var newState = { ...state, BA: action.balanceAuthority};
      return newState;
    case START_DAY:
      console.log("start day : " + action.day);
      var newState = {...state, StartDay: action.day};
      return newState;
      case END_DAY:
        console.log("end day : " + action.day);
        var newState = {...state, EndDay: action.day};
        return newState;
    default:
      return state;
  }

}
