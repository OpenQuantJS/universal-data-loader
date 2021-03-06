export interface Dict {
  [key: string]: any
}

export interface SuccessPayload {
  key: string
  data: any
  isFresh: boolean
  lastUpdateTime: number
}

export interface FailurePayload {
  key: string
  error: Error
  lastErrorTime: number
}

export interface LoaderStatus<TData = any> {
  data: TData | null
  loading: boolean
  error: Error | null
  lastUpdateTime?: number
  lastErrorTime?: number
}

export interface State {
  [key: string]: LoaderStatus
}

export const DATA_LOADER_NAMESPACE = '@@dataloader'

export const getDataStorageValue = (key: string) => (state: Dict) => {
  if (state && state[DATA_LOADER_NAMESPACE]) {
    return state[DATA_LOADER_NAMESPACE][key]
  }
  return undefined
}

export const getDataStorageByKeys = (keys: string[]) => (state: Dict) => {
  const dataStorages: Dict = {}
  keys.forEach(key => {
    dataStorages[key] = state[DATA_LOADER_NAMESPACE] && state[DATA_LOADER_NAMESPACE][key]
  })
  return dataStorages
}

export const initialized = (key: string) => (state: Dict) => {
  let dataStorage = state[key]
  if (!dataStorage) {
    dataStorage = {
      data: null,
      loading: false,
      error: null,
    }
    return { ...state, [key]: dataStorage }
  }
  return state
}

export const started = (key: string) => (state: Dict) => {
  let dataStorage = state[key]
  if (!dataStorage) {
    dataStorage = {
      data: null,
      loading: true,
      error: null,
    }
  } else {
    dataStorage = { ...dataStorage, loading: true }
  }
  return { ...state, [key]: dataStorage }
}

export const succeed = (payload: SuccessPayload) => (state: Dict) => {
  let dataStorage = state[payload.key]
  if (dataStorage) {
    dataStorage = {
      ...dataStorage,
      error: null,
      loading: payload.isFresh ? false : dataStorage.loading,
      data: payload.data,
      lastUpdateTime: payload.lastUpdateTime,
    }
    return { ...state, [payload.key]: dataStorage }
  }
  return state
}

export const failed = (payload: FailurePayload) => (state: Dict) => {
  let dataStorage = state[payload.key]
  if (dataStorage) {
    dataStorage = {
      ...dataStorage,
      error: payload.error,
      loading: false,
      lastErrorTime: payload.lastErrorTime,
    }
    return { ...state, [payload.key]: dataStorage }
  }
  return state
}
