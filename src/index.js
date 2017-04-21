import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import './index.css';
import initializeStore from './stores/initializeStore';
import * as actions from './actions';

//dummy data for testing
const songs = [{title: 'sample title'}, {title: 'title 2'}];

//make the store
const store = initializeStore();

//make the playlist with songs
store.dispatch(actions.setPlaylist(songs));

//render
ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root')
);