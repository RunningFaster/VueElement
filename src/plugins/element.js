import Vue from 'vue'
// 导入 element 组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 组册 element 组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 注册 message 到vue this 对象中
Vue.prototype.$message = Message
