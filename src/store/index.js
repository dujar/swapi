

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { logicArr } from '../logic'
import { createLogicMiddleware } from 'redux-logic'

import { peopleReducer } from './people'


let reducers = combineReducers({
    people: peopleReducer,

})

const composeEnhancers = process.env.NODE_ENV !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

const logicMiddleware = createLogicMiddleware(logicArr)
let middlewares = [thunk, logicMiddleware]

export const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares))
)