import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import multicall from './multicall'

export const reducer = combineReducers({
  [multicall.reducerPath]: multicall.reducer,
})
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActionPaths: ['meta.arg', 'meta.baseQueryMeta', 'payload.trade'],
      },
    }),
})
