
├── vite.config.js/             # vite 配置文件
├── config/                     # 项目构建相关的常用配置，如：HOST
├── deploy_conf/                # docker 配置文件（不可随意改动）
├── dockerfile/                	# docker 部署命令文件（不可随意改动）
├── public/                     # 纯静态资源，不会被 vite 处理，直接被拷贝到输出目录
├── src/
│   ├── api/                    # 网络模块，如：接口
│   ├── assets/                 # 静态资源，如：图片、视频
│   ├── components/             # 公共组件，注：不应存放非公用、模块内功能组件
│   │   ├── icon/             	# 共用的图标组件
│   │   ├── common/             # 共用的全局组件，loading 组件，提示组件等
│   │   ├── UItemp/             # UI组件，如：根据 element 自定义的一些组件
│   │   ├── 'PageName'          # 功能组件，如：contextMenu
│   │   ├── ...                 # 
│   ├── constant/         		# 存放 js 常量、公共配置等
│   ├── hook/         			# 自定义 hook
│   ├── lib/          			# 存放引用的库
│   ├── pages/          		# 存放页面组件
│   ├── router/                 # 路由模块
│   ├── store/                  # 组件共享状态
│   ├── style/       			# 存放 less 变量，element 配置等
│   ├── util/             		# 项目内通用工具
│   ├── view/                  	# 功能模块组件
│   ├── App.vue             	# app 的根组件
│   ├── main.js                 # vite 的入口文件
├── .env.test            		# 测试环境变量
├── .env.production            	# 生产环境变量
├── .env.development            # 开发环境变量
├── .eslintrc.json              # eslint 的配置文件
├── .gitignore                  # git的忽略配置文件
├── .gitlab-ci.yml              # CICD 配置文件（不可随意改动）
├── index.html                  # HTML模板
├── package.json                # npm包配置文件，定义项目的npm脚本，依赖包等信息
└── README.md                   # 项目信息文档



// bad 四层嵌套
├── projectDetail/
│   ├── components/             # 项目详情下的组件
│   ├── content/                # 项目详情下的主功能模块
│   │   ├── comment/            # 项目详情下的评论模块
│   │   │   ├── components/     # 评论模块下的独立组件

// good 三层嵌套
├── projectDetail/
│   ├── components/             # 项目详情下的组件
│   │   ├── comment/            # 评论模块下的独立组件
│   ├── content/                # 项目详情下的主功能模块
│   │   ├── comment/            # 项目详情下的评论模块
