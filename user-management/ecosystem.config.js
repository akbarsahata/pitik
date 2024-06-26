const os = require('os');

module.exports = {
  apps: [
    {
      name: 'user-management',
      script: 'dist/src/index.js',
      node_args: '-r dotenv/config --expose-gc --max-old-space-size=2048',
      exec_mode: os.cpus().length > 1 ? 'cluster' : 'fork',
      instances: os.cpus().length,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '~/.pm2/logs/production-user-management-error.log',
      out_file: '~/.pm2/logs/production-user-management-out.log',
      kill_timeout: 30000,
    },
  ],
};
