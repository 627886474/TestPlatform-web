<template>
<el-card class="box-card">
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchUser()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column label="创建时间">
        <!-- 通过template引入插值表达式  fmtdate 为定义的表达式-->
        <template slot-scope="scope">{{
          scope.row.date_joined | fmtdate
        }}</template>
      </el-table-column>
      <el-table-column  label="用户状态">
        <template slot-scope="scope">
          <el-switch
          @change="changeUserStatus(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserInfo(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showEditUserRole(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密 码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

        <!-- 编辑弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled="true" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 分配角色弹出框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form :model="userRoleInfo">
    <el-form-item label="用户名" label-width="100px">
      {{currUsername}}
    </el-form-item>
    <el-form-item label="角色" label-width="100px">
      <el-select v-model="currRoleId">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option
        :label="item.roleName"
        :value="item.id"
        v-for="(item,i) in roles"
        :key="i"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="editRole()">确 定</el-button>
  </div>
</el-dialog>

  </el-card>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      query: "",
      total: -1,
      pagenum: 1,
      pagesize: 10,
      //   表格数据
      userlist: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit:false,
      dialogFormVisibleRole:false,
      form: {
        name: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 分配角色
      currRoleId:0,
      currUsername:'',
      roles:[],
      userInfo:'',
      userRoleInfo:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //编辑角色
    async editRole(){
      const res = await this.$http.put(`users/${this.userRoleInfo.id}/role`,{rid:this.currRoleId})
      const {meta:{status,msg}} = res.data
      if(status===200){
        this.$message({type:"success",message:msg})
      }else{
        this.$message.warning(msg)
      }
      this.dialogFormVisibleRole = false

    },

    //分配角色 -打开对话框
    async showEditUserRole(user){
      this.currUsername = user.username

      const roleRes = await this.$http.get(`roles`)
      this.roles = roleRes.data.data

      const res = await this.$http.get(`users/${user.id}`)
      this.currRoleId = res.data.data.rid

      this.userRoleInfo = user
      this.dialogFormVisibleRole = true
    },
    // 修改状态
    async changeUserStatus(user){
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta:{status,msg}} =res.data
      if(status===200){
        this.$message({type:"success",message:"修改成功"})
      }else{
        this.$message.warning(msg)
      }
    },

    //编辑用户
    async editUser(){
      const res = await this.$http.put(`users/${this.form.id}`,this.form)
      const {meta:{status,msg}} = res.data
      if(status===200){
        this.$message({type:"success",message:"修改成功"})
        this.getUserList()
        this.dialogFormVisibleEdit = false
      }else{
        this.$message.warning(msg)
      }

    },
    //编辑用户弹出框
    showEditUserInfo(user){
      this.form=user
      this.dialogFormVisibleEdit = true
    },
    //删除用户
    showDeleUserMsgBox(userId) {
      this.$confirm("删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`)
          const {meta:{status,msg}} = res.data
          if(status===200){
          this.$message({type: "success",message: "删除成功!"});
          this.getUserList()
          }else{
            this.$message.warning(msg)
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加用户对话框
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;

    },
    // 添加用户接口
    async addUser() {
      const res = await this.$http.post(`users`, this.form);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        //关闭对话框
        this.dialogFormVisibleAdd = false;
        this.getUserList();
      } else {
        this.$message.warning(msg);
      }
    },
    loadUserList() {
      this.getUserList();
    },
    // 搜索方法
    searchUser() {
      this.getUserList();
    },
    // 分页相关方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
    },
    //   获取用户列表的请求
    async getUserList() {
      const res = await this.$http.get(
        `user/info_list?page=${this.pagenum}&page_size=${this.pagesize}`
      );
      const {
        code,message,
        data: { users, total }
      } = res.data;
      if (code === 200) {
        this.userlist = users;
        this.total = total;
        this.$message.success(message);
      } else {
        this.$message.warning(message);
      }
    }
  }
};
</script>
<style scoped>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 24px;
}
</style>