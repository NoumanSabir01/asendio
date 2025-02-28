module.exports = {
    apps: [
      {
        name: 'AsendioAISite',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 5173',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };