import { createStore, combineReducers } from 'redux'
import { foodListReducer } from './FoodList'
import { reversedFoodListReducer } from './ReversedFoodList'

const root = combineReducers({
    foodList: foodListReducer,
    reversedFoodList: reversedFoodListReducer
})

export const store = createStore(root)