# 🤖 Local AI Assistant (Qwen 2.5 Coder)

이 프로젝트는 **Apple Silicon (M4 Mac Mini)** 환경에 최적화된 로컬 AI 챗봇 서비스입니다. **MLX 프레임워크**로 구동되는 백엔드 API와 **React 19**, **Tailwind CSS v4** 기반의 현대적인 웹 인터페이스를 연결하며, Nginx와 Certbot을 통해 안전한 HTTPS 외부 접속 환경을 제공합니다.

---

## ✨ 핵심 기능

* **실시간 스트리밍(SSE)**: AI의 답변이 생성되는 즉시 화면에 한 글자씩 렌더링됩니다.
* **지능형 코드 하이라이팅**: 프로그래밍 언어를 자동 감지하여 가독성 높은 UI와 복사 기능을 제공합니다.
* **하이브리드 테마**: 로컬 스토리지와 연동된 다크/라이트 모드 및 부드러운 테마 전환 효과를 지원합니다.
* **대화 내역 관리**: 사이드바를 통해 이전 대화 목록을 확인, 삭제, 재생성할 수 있으며 모든 데이터는 로컬에 저장됩니다.
* **보안 접속(HTTPS)**: Let's Encrypt SSL 인증서를 통해 외부에서도 안전한 통신이 가능합니다.

---

## 🛠 기술 스택

### **Frontend**

* **Framework**: `React 19`
* **Build Tool**: `Vite 7`
* **Styling**: `Tailwind CSS v4`
* **Markdown**: `react-markdown` & `react-syntax-highlighter`

### **Server & Network**

* **Web Server**: `Nginx` (macOS Homebrew)
* **SSL**: `Certbot` (Let's Encrypt)
* **Domain**: `DuckDNS` (Sub-domain: `[sub domain]`)

---

## 📐 서비스 아키텍처 및 설정

### 1. Nginx 역방향 프록시 설정

외부에서 들어오는 요청을 프론트엔드(3000)와 백엔드(8080)로 배분합니다.

**파일 경로**: `/opt/homebrew/etc/nginx/servers/[sub domain].conf`

```nginx
server {
    listen 80;
    server_name [sub domain].ddns.net;
    return 301 https://$host$request_uri; # HTTP를 HTTPS로 강제 리다이렉트
}

server {
    listen 443 ssl;
    server_name [sub domain].ddns.net;

    # SSL 인증서 경로 (Certbot 발급 후 자동 연동)
    ssl_certificate /etc/letsencrypt/live/[sub domain].ddns.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/[sub domain].ddns.net/privkey.pem;

    # 프론트엔드 연결 (Vite)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 백엔드 API 연결 (FastAPI - 8080 포트)
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # SSE 스트리밍 최적화 설정
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_cache_off;
        proxy_buffering off;
        proxy_read_timeout 3600s;
    }
}

```

---

## 🚀 설치 및 배포 가이드

### **Step 1: 프론트엔드 준비**

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드 및 프리뷰 (포트 3000 유지 확인)
npm run build
npm run preview

```

### **Step 2: Nginx 및 SSL 설정 (macOS)**

1. **Nginx 설치**: `brew install nginx`
2. **포트 포워딩**: 공유기 설정에서 80(HTTP) 및 443(HTTPS) 포트를 Mac mini IP로 개방합니다.
3. **인증서 발급**:
```bash
sudo certbot --nginx -d [sub domain].ddns.net

```


* 안내에 따라 이메일 입력 및 약관 동의(`A`)를 진행합니다.
* HTTPS 리다이렉트 옵션 선택 시 `2: Redirect`를 선택합니다.



### **Step 3: 인증서 자동 갱신**

```bash
# 갱신 테스트
sudo certbot renew --dry-run

```

## ⚙️ 환경 설정 (Configuration)

이 프로젝트는 환경 변수를 통해 도메인과 API 주소를 관리합니다.

1. 프로젝트 루트에 `.env` 파일을 생성합니다.
2. 아래 형식에 맞춰 본인의 정보를 입력합니다.
   ```env
   VITE_API_URL=https://[sub domain].ddns.net/api/ask
   VITE_ALLOWED_HOST=[sub domain].ddns.net

## 📂 주요 파일 구조

* `src/App.jsx`: 메인 로직 및 챗 UI (Streaming API 연동)
* `src/index.css`: Tailwind CSS v4 변수 기반 테마 설정
* `package.json`: 최신 React 19 및 종속성 정의
* `eslint.config.js`: 코드 품질 및 스타일 가이드 설정

---

**Developed by Jodongik** | Powered by **M4 Mac Mini** & **MLX**

---

이 README 파일은 프로젝트의 전체적인 흐름과 보안 설정까지 완벽하게 요약하고 있습니다. 이제 이 내용을 프로젝트 루트 폴더에 저장하시면 됩니다.

혹시 **백엔드(FastAPI) 실행 스크립트(예: PM2 설정)**에 대한 내용도 추가로 필요하신가요?