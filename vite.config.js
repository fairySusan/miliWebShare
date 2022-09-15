import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({

  // 打包配置
  build: {
    lib: {
      entry:  './index.ts', // 设置入口文件
      name: 'miliwebstore', // 起个名字，安装、引入用
      fileName: (format) => `miliwebstore${format}.js` // 打包后的文件名
    },
    sourcemap: true, // 输出.map文件
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', '@arco-design/web-vue', 'axios', 'pinia', 'pinia-plugin-persistedstate', 'vue-router'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
        }
      }
    }
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@import "./src/packages/index.less";',
      }
    }
  }
})
