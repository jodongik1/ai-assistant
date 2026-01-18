import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 1. defineConfig을 화살표 함수 형태로 변경합니다. ({ mode }) 인자를 통해 현재 모드를 파악합니다.
export default defineConfig(({ mode }) => {
  // 2. loadEnv를 사용하여 .env 파일의 내용을 불러옵니다.
  // process.cwd()는 프로젝트의 루트 경로를 의미합니다.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      port: 3000,
      strictPort: false,
      host: '127.0.0.1'
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: '127.0.0.1',
      // 3. 이제 env 변수가 정의되었으므로 에러 없이 사용할 수 있습니다.
      allowedHosts: [env.VITE_ALLOWED_HOST] 
    }
  }
})