import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import featureFlagConfig from './config/feature-flag-confg';
import FeatureFlagProvider from 'feature-flag-react-lite';


ReactDOM.render(
  <FeatureFlagProvider config={featureFlagConfig}>
    <App />
  </FeatureFlagProvider>
, document.getElementById('root'))