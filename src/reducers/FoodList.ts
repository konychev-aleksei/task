import { foodListType } from '../config/types'

const SETVALUE = 'SETVALUE'

type action = {
    type: string,
    payload: foodListType
}

export const foodListReducer = (state = true, action: action) => {
  switch(action.type) {
    case SETVALUE:
      return { ...action.payload }
    default:
      return state
  }
}