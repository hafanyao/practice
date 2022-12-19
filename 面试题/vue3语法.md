01. vue2 和 vue3 区别
    1. 取消 v-for 中的 ref 数组
    2. vue2 v-for 高，vue3 v-if 高
    3. vue3 取消 $children，用 $refs 代替
    4. setup：组合式 API，解决组件过大时代码分散的问题
    5. computed
        ```js
            // 1
            let obj = reactive({
                name: 'hafan',
                age: 28,
                str: computed(() => {
                    return obj.name.slice(1, 2)
                })
            })
            // 2
            let msgChange = computed(() => {
                return msg.value.slice(1, 2)
            })
            // 3
            let msgChange = computed(() => {
                get() {
                    return msg.value.slice(1, 2)
                },
                set() {
                    console.log('设置了')
                }
            })
        ```
    6. watch
        ```js
            // 1. 监听 ref
            let msg = ref('data')
            let str = ref('data2')
            watch([msg, str], (newVal, oldVal) => {
                console.log(newVal, oldVal)
            },
                deep: true, // 深度监听
                immediate: true // 初始化的时候也会触发
            )
            // 2. 监听 obj
            let obj = reactive({
                str: 1,
                arr: [1, 2, 3]
            })
            watch(obj, (newVal, oldVal) => {
                // 不需要 deep 可以直接监听
                console.log(newVal, oldVal)
            })
            // 3. 监听对象 key
            watch(() => obj.arr, (newVal, oldVal) => {
                // 不需要 deep 可以直接监听
                console.log(newVal, oldVal)
            })
            // 4. 立即执行监听函数
            watchEffect(() => {
                console.log(msg.value)
            })
        ```
    7. useRoute
        ```js
            // 参考 'images/全局导入vue.png'
            import { useRoute, useRouter } from 'vue-router'
            export default{
                // const router = useRouter() // 方法1
                const router = new useRouter // 方法2
                setup() {
                    const go = () => {
                        router.push('/')
                    }
                    return { go }
                }
            }

            // 守卫
            import { createRouter, createWebHistory } from 'vue-router'
            const routes = [
                {
                    path: '/',
                    name: 'Home',
                    component: Home
                }
            ]
            const router = createRouter({
                hisroty: createWebHistory(),
                routes
            })
            router.beforeEach((news, old, next) => {
                // 权限控制
                next()
            })

            // query
            const route = new useRoute
            console.log(route.query)
        ```
    8. props => 父传子
        ```js
            // 子组件接收
            // 方式 1
            import { defineProps } from 'vue'
            defineProps({
                msg: {
                    type: String,
                    default: ''
                }
            })
            // 方式 2
            export default {
                props: ['msg'],
                setup(props) {
                    console.log(props)
                }
            }
        ```
    9. emit => 子传父
        ```js
            // 子组件传递
            <script setup>
                const name = ref('yao')
                const change = () => {
                    emit(fn)
                }
            </script>
            // 父组件接收
            <children @fn='change'></children>
            <script setup>
                const change = (str) => {
                    console.log(str.value)
                }
            </script>
        ```
    10. v-model => 父子组件双向数据
        ```js
            // 父组件
            <children v-model:name='name'></children>
            <script setup>
                let name = ref('yao')
            </script>
            // 子组件
            <div>{{ name }}</div>
            <button @click='change'></button>
            <script setup>
                const props = defineProps({
                    name: {
                        type: String,
                        default: ''
                    }
                })
                // 修改父组件参数 ***
                const emit = defineEmits(['update:num'])
                const change = () => {
                    emit('update:num', 200)
                }
            </script>
        ```
    11. mitt => 兄弟组件通讯 - 类似 bus
        ```js
            /**
             * 下载：yarn add mitt
            */
            // 1. plugins/Bus.js
            import mitt from 'mitt'
            // export default mitt()
            const emitter = mitt()
            export default emitter
            // 2. 子组件 A
            <button @click='btn'></button>
            import emitter from './plugins/Bus.js'
            const name = ref('name')
            const btn = () => {
                emitter.emit('fn', name)
            }
            // 3. 子组件 B
            <div>{{ name }}</div>
            import emitter from './plugins/Bus.js'
            let name = ref('')
            onBeforeMount(() => {
                emitter.on('fn', e => {
                    name.value = e.value
                })
            })
        ```
    12. 插槽：匿名插槽、具名插槽、作用域插槽、动态插槽
        ```js
            // 父组件
            <children>
                // 匿名
                <template>
                    这是插槽内容 AAA
                    这是插槽内容 BBB
                </template>

                // 具名
                <template v-slot:AAA>
                    这是插槽内容 AAA
                </template>
                <template v-slot:BBB>
                    这是插槽内容 BBB
                </template>

                // 作用域
                // <template v-slot='{data}'>
                <template #default='{data}'> // 简写
                    {{ data.name }} ==> {{ data.age }}
                </template>

                // 动态
                <template #[AAA]>
                    这是插槽内容 AAA
                </template>
                <script setup>
                    const AAA = ref('AAA')
                </script>
            </children>

            // 子组件
            <template>
                // 匿名
                <slot></slot>

                // 具名
                <slot name='AAA'></slot>
                <slot name='BBB'></slot>

                // 作用域
                <div v-for='item in data'>
                    <slot :data='item'></slot>
                </div>
            </template>
        ```
    13. teleport => 传送 - 内置组件
        ```js
            <teleport to='#container'>
                <div>
                    这是传送
                </div>
            </teleport>
        ```
    14. 动态组件
        ```js
            <template>
                <ul>
                    <li
                        v-for='(item, index) in tabList'
                        @click='change(index)'
                    >
                        {{ item.name }}
                    </li>
                </ul>
                <keep-alive>
                    <component :is='curComp.com'></component>
                </keep-alive>
            </template>
            <script setup>
                import A from '/component/A.vue'
                import B from '/component/B.vue'
                import C from '/component/C.vue'
                // markRaw 内容跳过相应
                const tabList = reactive([
                    {name: 'A 准备好面试题', com: markRaw(A)},
                    {name: 'B 准备好简历', com: markRaw(B)},
                    {name: 'C 准备好项目', com: markRaw(C)},
                ])
                const curComp = reactive({
                    com: tabList[0].com
                })
                const change = (idx) => {
                    curComp.com = tabList[idx].com
                }
            </script>
        ```
    15. 异步组件 => 提升性能
        依赖插件：npm i @vueuse/core -S
        ```js
            <template>
                <A></A>
                <B></B>
                <div ref='target'>
                    <C v-if='targetIsVisible'></C>
                </div>
            </template>

            import { defineAsyncComponent } from 'vue'
            import { useIntersectionObserver } from '@vueuse/core'

            import A from '/component/A.vue'
            import B from '/component/B.vue'

            const C = defineAsyncComponent(() => {
                import('/component/C.vue')
            })

            // 固定逻辑
            const target = ref(null)
            const targetIsVisible = ref(false)
            const { stop } = useIntersectionObserver(
                target,
                ([{ isIntersecting }], observerElement) => {
                    if(isIntersecting) {
                        targetIsVisible.value = isIntersecting
                    }
                }
            )
        ```

