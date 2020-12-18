<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <!-- model 数据双向绑定 -->
      <!-- rules 数据规则校验 -->
      <!-- ref 定义form对象，使得在 js 中可以获取到当前form对象 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <!-- prop 设置输入框对应的属性，用于 rules 规则校验 -->
        <el-form-item prop="username">
          <!-- v-model 实现数据的双向绑定 -->
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- type 设置input输出框的数据类型 -->
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-s-goods"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <!-- @click 点击事件 -->
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 表单数据的校验，validate 通过回调接收一个 bool 类型的结果
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 通过 axios 实现对接口的访问，async 和 await 实现接口的异步请求
        // {data: res} 把 axios 返回结果中 属于数据的部分取出
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // 1. 保存token到 sessionStroage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 路由式跳转到 /home 页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  // 设置背景颜色
  background-color: #2b4b6b;
  // 设置对象高度
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  // 边框 圆角
  border-radius: 20px;
  // 设置为可移动
  position: absolute;
  // 左边距
  left: 50%;
  // 上边距
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    // 画圆
    border-radius: 50%;
    // 设置内边框
    padding: 10px;
    // 设置阴影效果
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  // 设置按钮布局，右下角放置
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 设置不超过外部 box
  box-sizing: border-box;
}
</style>
