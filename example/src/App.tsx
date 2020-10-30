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