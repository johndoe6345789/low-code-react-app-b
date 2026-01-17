import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import projectReducer from './slices/projectSlice'
import filesReducer from './slices/filesSlice'
import modelsReducer from './slices/modelsSlice'
import componentsReducer from './slices/componentsSlice'
import componentTreesReducer from './slices/componentTreesSlice'
import workflowsReducer from './slices/workflowsSlice'
import lambdasReducer from './slices/lambdasSlice'
import themeReducer from './slices/themeSlice'
import settingsReducer from './slices/settingsSlice'
import syncReducer from './slices/syncSlice'

export const store = configureStore({
  reducer: {
    project: projectReducer,
    files: filesReducer,
    models: modelsReducer,
    components: componentsReducer,
    componentTrees: componentTreesReducer,
    workflows: workflowsReducer,
    lambdas: lambdasReducer,
    theme: themeReducer,
    settings: settingsReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
