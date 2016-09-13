import { FETCH } from './constants'
import { Request } from './request'

// Available response types for Response
const FETCH_RESPONSE_TYPES = ['arrayBuffer', 'blob', 'formData', 'json', 'text']

/**
 * constructUrl
 * Constructs a URL with a query string appended to it
 *
 * @param {string} baseUrl
 * @param {object} options
 * @param {Map} options.query
 *   - A map of key value pairs of query properties
 *
 * @return {string} url
 */
const constructUrl = (baseUrl, { query } = {}) => {
  if (!query) return baseUrl
  if (!(query instanceof window.Map)) throw new TypeError('[@@redux-easy-rest middleware] unkown query object, must be Map')

  const queryString = Array.from(query.entries())
    .map(([k, v]) => `${k}=${v}`)

  return `${baseUrl}?${queryString}`
}

/**
 * Fetch Middleware
 * Handles actions of the following format:
 *
 * @param {object} action
 * @param {string} action.type
 *   - If not [FETCH], passes the action to the next middleware
 * @param {object} action.payload
 * @param {string} action.payload.type
 *   - The action to be dispatched to the store
 * @param {Request|string} action.payload.input
 *   - A request object or a URL string (think of this as the first argument passed to
 *     window.fetch, because that's exactly what this is)
 * @param {object} action.payload.options
 *   - An options object, containing options for fetch (see init at https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch)
 *     and the middleware
 * @param {string} action.payload.options.responseType
 *   - The response type to expect from the API. Will call the appropriate method on the Response
 *     object when returning the body from the middleware
 * @param {Map} action.payload.options.query
 *   - A map of key value pairs of query properties
 * @param {object} action.payload.meta
 *   - Data to pass in meta in the resulting action from the middleware
 */
const middleware = store => next => action => {
  // If wrong action, pass it on to the next Redux middleware
  if (action.type !== FETCH) return next(action)

  // Deconstruct the payload passed to the API middleware
  const {
    payload: {
      type,
      input,
      options,
      meta: payloadMeta
    }
  } = action

  const request = input instanceof window.Request
    ? input
    : new Request(constructUrl(input, options), options)

  const meta = {
    originalPayload: action.payload,
    ...payloadMeta
  }

  next({
    type,
    meta: {
      ...meta,
      status: 'begin'
    }
  })

  const respond = ({ error, payload, response }) => {
    const action = {
      type,
      payload,
      meta: {
        ...meta,
        response,
        status: 'end'
      }
    }

    if (error) action.error = error

    return next(action)
  }

  const responseType = options && options.responseType ? options.responseType : 'json'

  if (!FETCH_RESPONSE_TYPES.includes(responseType)) {
    const error = TypeError(`[@@redux-easy-rest middleware]: unkown response type ${responseType}, must be one of ${FETCH_RESPONSE_TYPES.join(', ')}.`)

    return Promise.resolve(next({ type, error: true, payload: error, meta }))
  }

  return window.fetch(request)
    .then(response => (
      response[responseType]()
        .then(body => ({
          body,
          headers: response.headers,
          status: response.status,
          statusText: response.statusText
        }))
    ))
    .then(response => respond({
      payload: response.body,
      response
    }))
    .catch(error => respond({ error: true, payload: error }))
}

export default middleware
