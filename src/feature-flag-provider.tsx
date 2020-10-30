import React, { FC, ReactNode, useState, useEffect } from 'react'
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
  axiosRequestConfig?: ((config: AxiosRequestConfig) => Promise<AxiosRequestConfig>)
}
export type FeatureFlagProps = {
  config: FeatureFlagConfig
  children: ReactNode
}

const FeatureFlagProvider: FC<FeatureFlagProps> = ( props: FeatureFlagProps ): JSX.Element => {
  const [featureFlagList, setFeatureFlagList] = useState<FeatureFlags | undefined>(props.config.fallbackFlagValues)

  const cacheTimeout = !props.config.cache ? 30 * 1000 : props.config.cache
  const isRendered = React.useRef(false) // Used to make Async code not get called on every render.

  useEffect(() => {
    ;(async () => {
      // IIFE to make async code work in a non-async Functional Component
      if (!isRendered.current) {
        setIntervalImmediately(
          async () => await GetFeatureFlags(),
          cacheTimeout
        )
      }
    })()
    return () => {
      isRendered.current = true
    }
  }, [])

  const setIntervalImmediately = (func: any, interval: number) => {
    func()
    return setInterval(func, interval)
  }

  axios.interceptors.request.use(async (axiosConfig) => {
    if (typeof props.config.axiosRequestConfig === 'undefined') {
      return axiosConfig
    }
    return await props.config.axiosRequestConfig(axiosConfig)
  })

  const cache = setupCache({
    maxAge: cacheTimeout
  })

  axiosRetry(axios, { retries: 3 })

  const remoteFlags = axios.create({
    adapter: cache.adapter
  })

  const GetFeatureFlags = async () => {
    const options = {
      url: props.config.url
    }

    var result = await remoteFlags(options)
      .then((res) => {
        setFeatureFlagList(res.data)
        return res.data as FeatureFlags
      })
      .catch((ex: any) => {
        console.error('Fallback to local feature flags', ex)
        setFeatureFlagList(props.config.fallbackFlagValues)
      })

    return result
  }

  const getFeatureFlagByName = (name: string) => {
    if (!featureFlagList) return ''
    var result = featureFlagList.FeatureFlags.find((i) => i.Name === name)
      ?.Value
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
