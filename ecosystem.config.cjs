module.exports = {
  apps: [{
    name: "ai-assistant",
    cwd: "/Users/jodongik/workspace/prj/ai-assistant", // 프로젝트 실제 경로
    script: "npm",
    args: "run preview",
    env: {
      NODE_ENV: "production"
    }
  }]
}