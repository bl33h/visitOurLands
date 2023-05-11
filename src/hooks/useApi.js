import { useState } from 'react'

const apiUrl = 'https://c41d-181-209-195-206.ngrok-free.app'

const useApi = () => {
  const [ data, setData ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const handleRequest = async (method, path, body = {}, headers = {}) => {
    const options = {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    }

    if (method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    setLoading(true)

    let response

    try {
      console.info('API CALL', method, path)

      const fetchResponse = await fetch(`${apiUrl}${path}`, options)
      const jsonResponse = await fetchResponse.json()

      console.info('API RESPONSE', jsonResponse)

      setData(jsonResponse)
      response = jsonResponse
    } catch (e) {
      console.error('Error in api call', e)
      setData({
        error: true,
        message: e.message,
      })
      response = {}
    }
    setLoading(false)
    return response
  }
 
  return {
    loading,
    handleRequest,
    data
  }
}

export default useApi