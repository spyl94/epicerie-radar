if (__DEV__) {
  window.requestIdleCallback = null
  window.cancelIdleCallback = null
}
require('./index.ios');
