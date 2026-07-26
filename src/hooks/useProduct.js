import { useEffect, useState, useCallback } from 'react'
import { fetchProduct } from '../api/products'

export function useProduct(id) {
  const [state, setState] = useState({
    item: null,
    status: 'loading',
    error: null,
    usingMockData: false,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const { item, usingMockData } = await fetchProduct(id)
      if (!item) {
        setState({ item: null, status: 'error', error: new Error('Product not found'), usingMockData })
        return
      }
      setState({ item, status: 'success', error: null, usingMockData })
    } catch (err) {
      setState({ item: null, status: 'error', error: err, usingMockData: false })
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load }
}
