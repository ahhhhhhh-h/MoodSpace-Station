module.exports = function override(config, env) {
  // 添加 node polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "querystring": require.resolve("querystring-es3"),
    "url": require.resolve("url/"),
    "path": require.resolve("path-browserify"),
    "fs": false,
    "net": false,
    "tls": false,
  };

  return config;
}; 