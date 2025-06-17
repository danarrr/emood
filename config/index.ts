import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import { resolve as pathResolve } from 'path'
import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'myApp',
    date: '2025-3-12',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1.7,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {
    },
    alias: {
      '@': pathResolve(__dirname, '..', 'src'),
      '@components': pathResolve(__dirname, '..', 'src/components'),
      '@utils': pathResolve(__dirname, '..', 'src/utils'),
      '@assets': pathResolve(__dirname, '..', 'src/assets'),
      '@imgs': pathResolve(__dirname, '..', 'src/imgs'),
      '@pages': pathResolve(__dirname, '..', 'src/pages'),
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'react',
    compiler: 'vite',
    mini: {
      postcss: {
        htmltransform: {
          enable: true,
          config: {
            removeCursorStyle: false,
          },
        },
        pxtransform: {
          enable: true,
          config: {
            multiplier: 2, // px单位乘以2  <-- This is the correct line
            unitPrecision: 5, // 保留小数点后几位
            propList: ['*'], // 需要转换的CSS属性列表，'*' 表示全部
            selectorBlackList: [], // 不进行转换的选择器列表
            replace: true, // 是否直接替换属性值
            mediaQuery: false, // 是否转换媒体查询中的px
            minPixelValue: 0, // 小于指定数值的px单位不被转换
          },
        },
        // pxtransform: {
        //   enable: true,
        //   config: {

        //   }
        // },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        },
        
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        },
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }


  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
function resolve(__dirname: string, arg1: string, arg2: string): any {
  throw new Error('Function not implemented.')
}

