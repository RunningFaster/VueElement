<template>

  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部的警告区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="selectedCatekeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTapClick">
        <!-- 添加动态参数的页面 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtDisable" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable="">{{ item
                   }}</el-tag>

                <!-- 添加tag标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogOpen(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的页面 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtDisable" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogOpen(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数的对话框 -->
      <el-dialog :title="'添加' + dialogTitle" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 添加参数的对话框的表单 -->
        <el-form ref="addFormRefs" :model="addForm" :rules="addFormRules" label-width="100px">
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 操作逻辑按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数的对话框 -->
      <el-dialog :title="'修改' + dialogTitle" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 添加参数的对话框的表单 -->
        <el-form ref="editFormRefs" :model="editForm" :rules="editFormRules" label-width="100px">
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 操作逻辑按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 100
      },
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框对应的数据
      selectedCatekeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数表单
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单对象
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 点击按钮展示修改对话框
      editDialogVisible: false,
      // 修改参数的表单对象
      editForm: {
        attr_name: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制按钮的展示与隐藏
      inputVisible: false,
      // 文本框输入的内容
      inputValue: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类的列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data.result
      console.log(this.cateList)
    },
    // 级联选中框选中项变化， 会触发此事件
    handleChange () {
      this.getParamsData()
    },
    // tap 页签的点击事件
    handleTapClick () {
      this.getParamsData()
    },
    // 单独封装的 获取参数列表接口
    async getParamsData () {
      if (this.selectedCatekeys.length !== 3) {
        this.selectedCatekeys = []
        this.$message.warning('只能选择第三级参数！')
        return
      }
      // 根据所选分类的id获取参数列表
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏，数据公用属性时，会发生错误的联动效果，需要为每个单独设置值
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRefs.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      this.$refs.addFormRefs.validate(async valid => {
        console.log(this.addForm)
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 201) return this.$message.error('新增参数失败')
        this.$message.success('添加成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 点击按钮打开修改对话框
    async editDialogOpen (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      console.log(res.data)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭修改对话框
    editDialogClosed () {
      this.$refs.editFormRefs.resetFields()
    },
    // 点击按钮修改
    editParams () {
      this.$refs.editFormRefs.validate(async valid => {
        if (!valid) return this.$message.error('参数校验错误')
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 文本框失去焦点
    handleInputConfirm () {
      console.log('ok')
    },
    // 点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  // 响应式的，计算属性
  computed: {
    // 如果按钮需要被禁用
    isBtDisable () {
      if (this.selectedCatekeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的值
    cateId () {
      if (this.selectedCatekeys.length === 3) {
        return this.selectedCatekeys[2]
      }
      return null
    },
    dialogTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
  font-size: 18px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
