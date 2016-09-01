import { FETCH } from './constants'

/**
 * fetch
 *
 * @param {string} type
 *   - The type to pass in the action from the middleware
 * @param {object} type
 *   - A complete object for the middleware to consume, including
 *     type, and possibly input and options
 * @param {Request|string} input
 *   - A request object or a string (think of this as the first argument passed to
 *     window.fetch, because that's exactly what this is)
 * @param {object} options
 *   - An options object, containing options for fetch (see init at https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch)
 *     and the middleware
 * @param {string} options.responseType
 *   - The response type to expect from the API. Will call the appropriate method on the Response
 *     object when returning the body from the middleware
 * @param {Map} options.query
 *   - A map of key value pairs of query properties
 * @param {object} meta
 *   - Data to pass in meta in the resulting action from the middleware
 *
 * @return {function} actionCreator
 *   - Returns a generic action creator that when dispatched will resolve through
 *     the API middleware and redux-thunk
 */
export function fetch (type, input, options, meta) {
  let action = {
    type: FETCH,
    payload: {}
  }

  if (typeof type === 'object') {
    action.payload = type
  } else if (typeof typeof type === 'string') {
    action.payload.type = type
  } else {
    throw new TypeError(`[@redux-easy-rest fetch]: passed unkown type argument of type ${typeof type}, must be either string or object`)
  }

  if (input) action.payload.input = input
  if (options) action.payload.options = options
  if (meta) action.payload.meta = meta

  return dispatch => dispatch(action)
}

