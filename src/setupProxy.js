import {
  REACT_APP_PROXY_COVALENT_API,
  REACT_APP_PROXY_SWING_API,
} from 'constants/index';
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/covalenthq/*',
    createProxyMiddleware({
      target: REACT_APP_PROXY_COVALENT_API,
      secure: false,
      logLevel: 'debug',
      changeOrigin: true,
      pathRewrite: { '^/covalenthq': '' },
    }),
  );

  app.use(
    '/swing/*',
    createProxyMiddleware({
      target: REACT_APP_PROXY_SWING_API,
      secure: false,
      logLevel: 'debug',
      changeOrigin: true,
      pathRewrite: { '^/swing': '' },
    }),
  );
};
