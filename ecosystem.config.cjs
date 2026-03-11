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
    },
  ],
};

