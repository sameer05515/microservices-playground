module.exports = {
    // other webpack configurations...
    resolve: {
      fallback: {
        "buffer": require.resolve("buffer/")
      }
    }
  };
  