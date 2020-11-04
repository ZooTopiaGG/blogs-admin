// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
// import proxy from './proxy';

// const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index'
  },
  targets: {
    ie: 11
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: '登录-FeRookie_博客',
          path: '/user/login',
          component: './user/login'
        }
      ]
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user', 'superAdmin'],
          routes: [
            {
              path: '/',
              redirect: '/artManage'
            },
            {
              path: '/artManage',
              name: '文章管理',
              icon: 'smile',
              authority: ['admin', 'user', 'superAdmin'],
              component: './artManage',
            },
            {
              path: '/artManage/add',
              name: '添加文章',
              hideInMenu: true,
              authority: ['admin', 'user', 'superAdmin'],
              component: './artManage/AddArt',
            },
            {
              path: '/artManage/edit',
              name: '编辑文章',
              hideInMenu: true,
              authority: ['admin', 'user', 'superAdmin'],
              component: './artManage/AddArt',
            },
            {
              path: '/dyManage',
              name: '动态管理',
              icon: 'heart',
              authority: ['admin', 'user', 'superAdmin'],
              component: './dyManage'
            },
            {
              path: '/dyManage/add',
              name: '发布动态',
              hideInMenu: true,
              authority: ['admin', 'user', 'superAdmin'],
              component: './dyManage/AddDy',
            },
            {
              path: '/musicManage',
              name: '音乐管理',
              icon: 'star',
              authority: ['admin', 'user', 'superAdmin'],
              component: './musicManage'
            },
            { path: '/403', name: '403', hideInMenu: true, component: './403' },
            {
              component: './404'
            }
          ]
        },
        { path: '/403', name: '403', hideInMenu: true, component: './403' },
        {
          component: './404'
        }
      ]
    },
    { path: '/403', name: '403', hideInMenu: true, component: './403' },
    {
      component: './404'
    }
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  // proxy: REACT_APP_ENV === 'dev' ? proxy[REACT_APP_ENV || 'dev'] : false,
  manifest: {
    basePath: '/'
  }
});
