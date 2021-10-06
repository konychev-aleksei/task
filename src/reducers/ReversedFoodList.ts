import { foodListType } from '../config/types'

const SETREVERSEDVALUE = 'SETREVERSEDVALUE'

type action = {
    type: string,
    payload: foodListType
}

export const reversedFoodListReducer = (state = true, action: action) => {
  switch(action.type) {
    case SETREVERSEDVALUE:
      return { ...action.payload }
    default:
      return state
  }
}