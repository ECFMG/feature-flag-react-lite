# feature-flag-react-lite

> A lightweight Higher Order Component for quickly adding Feature Flags to any React project.

[![NPM](https://img.shields.io/npm/v/feature-flag-react-lite.svg)](https://www.npmjs.com/package/feature-flag-react-lite) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install feature-flag-react-lite
```

## Overview

Features:
 - **AutoRefresh:** Allows users can get updated flag values by periodically refreshing feature flag values from an HTTP endpoint, and caches the result for a period of time. (configurable) 
 - **Local Fallback:** If the HTTP endpoint is unavailable, will read from local default values.
 - **Personalized Flags:** Exposes a callback to add HTTP headers, helpful if the HTTP endpoint emits personalized feature flags based on a JWT.
 

Tip:

If your feature flags are not personalized, leveraging AWS S3 or Azure Blob may be an economical approach for hosting the feature flags.

## Usage

**Local Fallback**
Create a local fallback file, in the event the endpoint is not reachable.

```\src\config\feature-flag-default-values.json```

```json
{
  "FeatureFlags": [
    {
      "Name": "FeatureOne",
      "Value": "false"
    },
    {
      "Name": "FeatureTwo",
      "Value": "true"
    },
    {
      "Name": "FeatureThree",
      "Value": "blue"
    }
  ]
}
```

**Configuration Settings**

| Setting | Description |
| ------- | ----------- |
| cache (optional)  | Amount of time (in milliseconds) the retrieved values will be cached for before getting refreshed - defaults to 30 seconds |
| url | The URL to request updated Feature Flag settings from |
| fallbackFlagValues | Should the URL be unreachable, a set of default values to use as a fallback |
| axiosRequestConfig (optional) | Allows for intercepting the refresh request and injecting a JWT or other custom headers |


Begin by creating a configuration file and set appropriate values for your app:

```\src\config\feature-flag-config.tsx```

```tsx
import { AxiosRequestConfig } from 'axios';
import {FeatureFlagConfig} from 'feature-flag-react-lite';
import defaultValues from './feature-flag-default-values.json';

//Optional - Allow for personalized feature flags.
var addJwtToFeatureFlagRequest = async (config:AxiosRequestConfig) => {
    const token = localStorage.getItem("AccessToken");
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config
}

var featureFlagConfig : FeatureFlagConfig = {
    cache: 30 * 1000,
    url: 'https://featureflagdemo.blob.core.windows.net/flags/hosted-sample-flags.json',
    fallbackFlagValues: defaultValues,
    axiosRequestConfig: addJwtToFeatureFlagRequest
}
export default featureFlagConfig;
```


Setup Feature Flags in your main Index.tsx by adding the `FeatureFlagProvider` component and  setting the `config`.

```\src\index.tsx```
```tsx
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import featureFlagConfig from './config/feature-flag-config';
import FeatureFlagProvider from 'feature-flag-react-lite';


ReactDOM.render(
  <FeatureFlagProvider config={featureFlagConfig}>
    <App />
  </FeatureFlagProvider>
, document.getElementById('root'))
```

Read feature flags from within any component throughout your App.

```\src\App.tsx```
```tsx
import React from 'react'

import { useFeatureFlags } from 'feature-flag-react-lite'

const App = () => {
  const { GetFeatureFlagByName } = useFeatureFlags()
  const featureTwoValue = GetFeatureFlagByName("FeatureTwo");
  const featureThreeValue = GetFeatureFlagByName("FeatureThree");
  return (
    <div>
      Reading feature flag from: {GetFeatureFlagByName("FeatureOne") === 'false'?<span>Local Default Settings</span>:<span>Remote Flag Source</span>}<br/>
      Feature Two Value: <span>{featureTwoValue}</span><br/>
      Feature Three Value: <span style={{backgroundColor:featureThreeValue,color:"white"}}>{featureThreeValue}</span>
    </div>
  )
}

export default App
```

## Demo

[Demo Site](https://ecfmg.github.io/feature-flag-react-lite/)

## License

MIT © [ecfmg](https://github.com/ecfmg)
