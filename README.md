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

A simple straight-to-the-point use case looks something like this:

```javascript
import store from './my-redux-store'
import { fetch } from 'redux-rest-easy' // Redux Rest Easy mimicks window.fetch, albeit with a few extensions

const getAnimals = () => fetch('GET_ANIMALS', '/api/animals')

store.dispatch(getAnimals())
  // Since redux-rest-easy in conjunction with redux-thunk makes use of
  promises it's easy to react to a fulfilled API call everywhere
  .then(({ payload, meta, error }) => {
    if (error) return

    console.log('Got animals!', payload.map(animal => animal.name))
  })

// And your reducers might look something like this...

const defaultState = {
  error: false,
  fetching: false,
  animals: null
}

// Redux Rest Easy always returns actions following the Flux Standard Action pattern
const getAnimalsReducer = (state = defaultState, { payload, meta, error }) => {
  if (error) return { ...state, error: payload }

  if (meta.status === 'begin') return { ...state, error: false, fetching: true }

  if (meta.status === 'end')
    return {
      ...state,
      fetching: false,
      animals: payload
    }
  }

  return state
}

const rootReducer = (state, action) => {
  if (action.type === 'GET_ANIMALS') return getAnimalsReducer(state, action)

  return state
}
```

Because we're dealing with promise-based middleware it's also somewhat easier to
react on bulk actions having finished running:

```javascript
// Using ES2017 async/await for simplicity

const getFelines = () => async dispatch => {
  const lions = await dispatch(fetch('GET_LIONS', '/api/animals/lions'))
  const tigers = await dispatch(fetch('GET_LIONS', '/api/animals/tigers'))

  if (lions.error || tigers.error) throw new Error('Failed loading felines')

  return {
    lions: lions.payload,
    tigers: tigers.payload
  }
}

store.dispatch(getFelines())
  .then(felines => {
    console.log('Tigers:', felines.tigers)
    console.log('Lions:', felines.lions)
  })
  .catch(error => console.error(error))
```

Redux Rest Easy also contains its own Request (used internally in the
middleware, but also exposed for you to use), wrapping window.Request
with a set of default headers you can easily modify yourself:

```javascript
import { fetch, defaultHeaders, Request } from 'redux-rest-easy'

// For example, you can set your authorization in the default headers
defaultHeaders.set('Authorization', 'Bearer myToken')

const getAnimals = () => {
  const input = new Request('/api/animals')
  return fetch('GET_ANIMALS', input)
}
```

## API

TBD
