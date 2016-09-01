// Wrapper for window.Request to allow using default headers
export class Request {
  constructor (input, init) {
    // Duplicate default headers for allowing them to be replaced by the input headers
    // if wanted
    let requestHeaders = new window.Headers(defaultHeaders)

    // Construct a new headers map from the input headers
    let headers = new window.Headers(init && init.headers || {})

    for (const [name, value] of headers.entries()) {
      requestHeaders.set(name, value)
    }

    return new window.Request(input, {
      ...init,
      headers: requestHeaders
    })
  }
}

export const defaultHeaders = new window.Headers()
