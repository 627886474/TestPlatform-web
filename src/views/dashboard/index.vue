<template>
<el-card class="box-card">
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{
          scope.row.date_joined | fmtdate
        }}</template>
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

  </el-card>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      total: -1,
      pagenum: 1,
      pagesize: 10,
      //   表格数据
      userlist: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    loadUserList() {
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
        this.$message.success("获取用户列表成功");
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