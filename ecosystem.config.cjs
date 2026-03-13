module.exports = {
  apps: [
    {
      name: "vipauto161",
      cwd: "/var/www/vipauto_161",
      script: "npm",
      args: "run start -- -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      error_file: "/var/log/pm2/vipauto161-error.log",
      out_file: "/var/log/pm2/vipauto161-out.log",
      log_file: "/var/log/pm2/vipauto161-combined.log",
      time: true,
    },
  ],
};

