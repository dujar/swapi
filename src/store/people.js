
import { DATA_LOADING, ERROR_LOADING, SUCCESS_DATA_LOAD } from '../actions'

let initialState = {
    loading: false
}

export const peopleReducer = (state = initialState, action) => {

    switch (action.type) {
        case DATA_LOADING:
            return {
                ...state,
                loading: action.payload
            }
        case ERROR_LOADING:
            return {
                ...state,
                error: action.payload
            }
        case SUCCESS_DATA_LOAD:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}