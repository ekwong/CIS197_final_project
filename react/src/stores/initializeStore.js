import {createStore} from 'redux';
import mainReducer from '../reducers/index';

//configure the initial state of the store
export default function initializeStore(initialState) {
  return createStore(mainReducer, initialState);
}