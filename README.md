# Redux Rest Easy

A simple Redux middleware for declarative data fetching - helps you REST easy 😴

## Requirements

Except for [Redux](https://github.com/reactjs/redux), Redux Rest Easy depends on [Redux Thunk](https://github.com/gaearon/redux-thunk), which middleware has to be included _after_ Redux Rest Easy in your store's middlewares.

## Installation

```bash
npm install --save redux-rest-easy
```

To enable Redux Rest Easy, use [`applyMiddleware()`](http://redux.js.org/docs/api/applyMiddleware.html):

```javascript
import { createStore, applyMiddleware } from 'redux'
import { middleware as restEasy } from 'redux-rest-easy'
import thunk from 'redux-thunk'
import rootReducer from './reducer'

const store = createStore(
  rootReducer,
  applyMiddleware(restEasy, thunk)
)
```

## Usage

TBD