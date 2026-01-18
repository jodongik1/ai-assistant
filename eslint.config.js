import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 1. 전역 무시 설정: 린트(Lint) 검사를 하지 않을 폴더 지정
  globalIgnores(['dist']), 

  {
    // 2. 대상 파일 설정: 모든 .js 및 .jsx 파일에 적용
    files: ['**/*.{js,jsx}'],

    // 3. 확장 설정 (공통 규칙 가져오기)
    extends: [
      js.configs.recommended,           // ESLint의 자바스크립트 권장 규칙
      reactHooks.configs.flat.recommended, // React Hooks 규칙 (useEffect 등)
      reactRefresh.configs.vite,        // Vite 환경에서 React Refresh 관련 규칙
    ],

    // 4. 언어 및 환경 옵션
    languageOptions: {
      ecmaVersion: 2020,               // 사용할 자바스크립트 버전
      globals: globals.browser,        // 브라우저 전역 변수(window, document 등) 허용
      parserOptions: {
        ecmaVersion: 'latest',         // 최신 자바스크립트 문법 해석
        ecmaFeatures: { jsx: true },   // JSX 문법 지원
        sourceType: 'module',          // import/export 문법 사용
      },
    },

    // 5. 세부 규칙(Rules) 설정
    rules: {
      // 'no-unused-vars': 사용하지 않는 변수 선언 시 에러 발생
      // 단, 대문자로 시작하거나 언더바(_)로 시작하는 변수는 무시하도록 설정 (패턴 매칭)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])