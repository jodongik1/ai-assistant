import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // 글로벌 스타일 시트 (Tailwind CSS 설정이 포함됨)
import App from './App.jsx' // 실제 앱의 메인 UI를 담고 있는 컴포넌트

// 1. index.html에 있는 id="root"인 요소를 찾아 리액트 루트를 생성합니다.
// 2. render 함수를 통해 리액트 컴포넌트들을 실제 브라우저 화면(DOM)에 그려넣습니다.
createRoot(document.getElementById('root')).render(
  // <StrictMode>는 개발 모드에서 잠재적인 문제를 찾아내기 위한 도구입니다.
  // 이 안에 감싸진 컴포넌트들은 렌더링 과정에서 경고를 미리 띄워줍니다.
  <StrictMode>
    <App />
  </StrictMode>,
)