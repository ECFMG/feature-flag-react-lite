(this["webpackJsonpfeature-flag-react-lite-example"]=this["webpackJsonpfeature-flag-react-lite-example"]||[]).push([[0],{16:function(e){e.exports=JSON.parse('{"FeatureFlags":[{"Name":"FeatureOne","Value":"false"},{"Name":"FeatureTwo","Value":"true"},{"Name":"FeatureThree","Value":"blue"}]}')},17:function(e,t,r){e.exports=r(45)},18:function(e,t,r){},45:function(e,t,r){"use strict";r.r(t);r(18);var a=r(0),n=r.n(a),u=r(12),o=r.n(u),c=r(2),l=r.n(c),i=r(13),s=r(14),f=r.n(s),g={FeatureFlagList:void 0,GetFeatureFlagByName:function(){throw new Error("You forgot to wrap your component in <FeatureFlagProvider>.")}},m=Object(a.createContext)(g),p=function(e){var t=Object(a.useState)(e.config.fallbackFlagValues),r=t[0],u=t[1],o=e.config.cache?e.config.cache:3e4,c=n.a.useRef(!1);Object(a.useEffect)((function(){try{c.current||s((function(){return Promise.resolve(F())}),o)}catch(e){Promise.reject(e)}return function(){c.current=!0}}),[]);var s=function(e,t){return e(),setInterval(e,t)};l.a.interceptors.request.use((function(t){try{return"undefined"===typeof e.config.axiosRequestConfig?Promise.resolve(t):Promise.resolve(e.config.axiosRequestConfig(t))}catch(r){return Promise.reject(r)}}));var g=Object(i.setupCache)({maxAge:o});f()(l.a,{retries:3});var p=l.a.create({adapter:g.adapter}),F=function(){try{var t={url:e.config.url};return Promise.resolve(p(t).then((function(e){return u(e.data),e.data})).catch((function(t){console.error("Fallback to local feature flags",t),u(e.config.fallbackFlagValues)})))}catch(r){return Promise.reject(r)}};return n.a.createElement(m.Provider,{value:{FeatureFlagList:r,GetFeatureFlagByName:function(e){return function(e){var t;if(!r)return"";var a=null===(t=r.FeatureFlags.find((function(t){return t.Name===e})))||void 0===t?void 0:t.Value;return a||""}(e)}}},e.children)},F=function(){var e=Object(a.useContext)(m).GetFeatureFlagByName,t=e("FeatureTwo"),r=e("FeatureThree");return n.a.createElement("div",null,"Reading feature flag from: ","false"===e("FeatureOne")?n.a.createElement("span",null,"Local Default Settings"):n.a.createElement("span",null,"Remote Flag Source"),n.a.createElement("br",null),"Feature Two Value: ",n.a.createElement("span",null,t),n.a.createElement("br",null),"Feature Three Value: ",n.a.createElement("span",{style:{backgroundColor:r,color:"white"}},r))},d=r(3),h=r.n(d),v=r(15),b={cache:3e4,url:"https://featureflagdemo.blob.core.windows.net/flags/hosted-sample-flags.json",fallbackFlagValues:r(16),axiosRequestConfig:function(){var e=Object(v.a)(h.a.mark((function e(t){var r;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=localStorage.getItem("AccessToken"))&&(t.headers.Authorization="Bearer ".concat(r)),e.abrupt("return",t);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};o.a.render(n.a.createElement(p,{config:b},n.a.createElement(F,null)),document.getElementById("root"))}},[[17,1,2]]]);
//# sourceMappingURL=main.bed574ff.chunk.js.map