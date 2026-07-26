import { useEffect, useState, useCallback } from 'react'
import { fetchProducts } from '../api/products'

export function useProducts(params = {}) {
  const [state, setState] = useState({
    items: [],
    status: 'loading', // 'loading' | 'success' | 'error'
    error: null,
    usingMockData: false,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const { items, usingMockData } = await fetchProducts(params)
      setState({ items, status: 'success', error: null, usingMockData })
    } catch (err) {
      setState({ items: [], status: 'error', error: err, usingMockData: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load }
}
