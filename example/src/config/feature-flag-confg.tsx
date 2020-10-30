import { AxiosRequestConfig } from 'axios';
import {FeatureFlagConfig} from 'feature-flag-react-lite';
import defaultValues from './feature-flag-default-values.json';

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