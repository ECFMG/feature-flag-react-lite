import React, { FC, useState, ReactNode, useEffect } from 'react' // useState
import axios, { AxiosRequestConfig } from 'axios'
import { setupCache } from 'axios-cache-adapter'
import axiosRetry from 'axios-retry'
import FeatureFlagContext, { FeatureFlags } from './feature-flag-context'

/**
 * FeatureFlagConfig
 */
export interface FeatureFlagConfig {
  /** maximum age for the cache (in milliseconds), defaults to 30 seconds */
  cache?: number
  /** url to retrieve the feature flags from */
  url: string
  /** if url cannot be reached, load local feature flags */
  fallbackFlagValues: FeatureFlags

  /** if making authenticated feature flag requests may need to add JWT to requests */
  axiosRequestConfig?: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>
}
export type FeatureFlagProps = {
  config: FeatureFlagConfig
  children: ReactNode
}

const FeatureFlagProvider: FC<FeatureFlagProps> = (props: FeatureFlagProps): JSX.Element => {
  console.log('loading component')
  var tempFeatureFlagList: FeatureFlags | undefined
  const [featureFlagList, setFeatureFlagListVal] = useState<FeatureFlags | undefined>()
  const cacheTimeout = !props.config.cache ? 30 * 1000 : props.config.cache
  const isRendered = React.useRef(false) // Used to make Async code not get called on every render.

  const setFeatureFlagList = (newVal: FeatureFlags | undefined) => {
    // prevents re-rendering each time feature flags are set.
    if (JSON.stringify(tempFeatureFlagList) === JSON.stringify(newVal)) return
    tempFeatureFlagList = newVal
    setFeatureFlagListVal(newVal)
  }

  useEffect(() => {
    const setIntervalImmediately = (func: any, interval: number) => {
      func()
      return setInterval(func, interval)
    }

    const cache = setupCache({
      maxAge: cacheTimeout,
      readOnError: (error: any) => {
        return error.response.status >= 400 && error.response.status < 600
      },
      clearOnStale: false
    })

    axiosRetry(axios, { retries: 3 })
    const remoteFlags = axios.create({
      adapter: cache.adapter
    })

    remoteFlags.interceptors.request.use(async (axiosConfig) => {
      
      if (typeof props.config.axiosRequestConfig === 'undefined') {
        return axiosConfig
      }
      return await props.config.axiosRequestConfig(axiosConfig);
    })

    const GetFeatureFlags = async () => {
      const options = {
        url: props.config.url,
        method: 'get'
      } as AxiosRequestConfig
      try {
        var result = await remoteFlags(options)
        setFeatureFlagList(result.data)
      } catch (ex) {
        console.error('Fallback to local feature flags', ex)
        setFeatureFlagList(props.config.fallbackFlagValues)
      }
    }

    ;(async () => {
      // IIFE to make async code work in a non-async Functional Component
      if (!isRendered.current) {
        setFeatureFlagList(props.config.fallbackFlagValues)
        setIntervalImmediately(async () => await GetFeatureFlags(), cacheTimeout / 2)
      }
    })()
    return () => {
      isRendered.current = true
    }
  }, [])

  const getFeatureFlagByName = (name: string) => {
    var temp = !featureFlagList ? undefined : featureFlagList.FeatureFlags
    if (!temp) return ''
    var result = temp.find((i) => i.Name === name)?.Value
    return !result ? '' : result
  }

  return (
    <FeatureFlagContext.Provider
      value={{
        FeatureFlagList: featureFlagList,
        GetFeatureFlagByName: (name: string) => getFeatureFlagByName(name)
      }}
    >
      {props.children}
    </FeatureFlagContext.Provider>
  )
}

export default FeatureFlagProvider
