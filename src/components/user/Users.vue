<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- el-row 设置每一个元素之间的间距 -->
      <el-row :gutter="20">
        <!-- el-col 设置每个元素在栅格所占的份数 -->
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"
                     @click="addDialogVisiable = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList"
                stripe
                border
                style="width: 100%">
        <el-table-column type="index"
                         label="编号"
                         width="70">
        </el-table-column>
        <el-table-column prop="username"
                         label="姓名"
                         width="180">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         width="180">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>
        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>
        <el-table-column prop="mg_state"
                         label="状态">
          <!-- 定义一个 作用域插槽 通过 scope 获取到当前行的数据信息 -->
          <template slot-scope="scope">
            <!-- scope.row 表示当前行的数据信息 作用域插槽 -->
            <!-- {{ scope.row }} -->
            <!-- switch 开关的 change 事件，可以监听开关的变化 -->
            <el-switch v-model="scope.row.mg_state"
                       @change="userStatusChanged(scope.row)"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mobile"
                         label="操作"
                         width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         @click="setRoleDialogVisable(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisiable"
               width="50%"
               @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFromRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisiable"
               width="50%"
               @close="editDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="editForm"
               :rules="addFormRules"
               ref="editFromRef"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户绑定角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialog"
               width="50%"
               @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色： <el-select v-model="selectRoleId"
                     placeholder="请选择">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) return cb()
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 10,
        // 条件过滤
        query: ''
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisiable: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '2@qq.com',
        mobile: '13322422231'
      },
      // 添加表单的验证规则对象, 修改表单复用
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度必须在3～10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名的长度必须在6～15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义的校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          // 自定义的校验规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisiable: false,
      // 修改用户对象
      editForm: {},
      // 控制分配角色对话框的显示
      setRoleDialog: false,
      // 需要分配的用户信息
      userInfo: {},
      // 所有角色的数据
      rolesList: [],
      // 选择框选择的对象 id
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 拿到最新的 page 页码值
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听用户 状态变化
    async userStatusChanged (userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 关闭对话框重置表单
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return this.$message.error('表单参数校验错误')
        // 发起添加用户的 网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.addDialogVisiable = false
        // 刷新用户
        this.getUserList()
        this.$message.success('添加用户成功！')
      })
    },
    // 点击按钮，显示修改用户 dialog
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      this.editDialogVisiable = true
    },
    // 监听对话框重置表单
    editDialogClosed () {
      this.$refs.editFromRef.resetFields()
    },
    // 提交对表单的修改
    editUserInfo () {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return this.$message.error('表单参数校验错误')
        // 发起修改用户的 网络请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editDialogVisiable = false
        // 刷新用户
        this.getUserList()
        this.$message.success('修改用户成功！')
      })
    },
    // 根据 id 删除对应的用户删除用户
    async removeUserById (id) {
      // 询问是否删除
      // 如果请求的结果是 Promise 对象，则可以通过使用 async 和 await进行优化
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户 确认删除，则返回值为字符串 confirm
      // 如果用户 取消删除 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRoleDialogVisable (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前，获取所有所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.rolesList = res.data
      this.setRoleDialog = true
    },
    // 点击按钮 分配角色
    async saveRoleInfo () {
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色！')
      console.log(this.selectRoleId)
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.$message.success('更新当前用户角色成功！')
      this.getUserList()
      this.setRoleDialog = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.selectRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
