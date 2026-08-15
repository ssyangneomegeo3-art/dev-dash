import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dev-dash/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 무거운 마크다운 파서 관련 패키지 분리 (모달 열릴 때만 비동기 로드)
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown';
            }
            // React 코어 및 전역 상태 라이브러리 분리 (브라우저 캐싱 극대화)
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('zustand') ||
              id.includes('@tanstack')
            ) {
              return 'vendor';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});