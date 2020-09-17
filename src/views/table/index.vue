<template>
  <div class="app-container">
    请求参数：
    <div class="demo-input-suffix">
      <el-input
        class="params_input"
        v-model="invokeParams"
        type="textarea"
        :rows="8"
        contenteditable="true"
        placeholder="请输入内容"
        style="margin-left:10px"
      ></el-input>
    </div>
    <el-row style="margin-top:10px;margin-left:10px">
      <el-button type="primary" @click="showInvokeLog()" icon="el-icon-document">请求记录</el-button>
      <el-button type="primary" @click="invokeDubboController()" icon="el-icon-s-promotion">请求服务</el-button>
      <el-button
        type="primary"
        v-clipboard:copy="dubboResponse"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        icon="el-icon-document-copy"
      >复制结果</el-button>
    </el-row>
    <el-input
      class="params_input"
      id="response"
      v-model="dubboResponse"
      type="textarea"
      contenteditable="true"
      :rows="20"
      placeholder="返回结果"
      :disabled="true"
      style="margin-left:10px"
    ></el-input>
    <!-- 调用记录弹出框 -->
    <el-dialog
      title="接口调用记录"
      style="width:100%;pading-top:10px"
      :visible.sync="dialogFormVisibleShow"
    >
      <!-- 搜索 -->
      <el-row class="searchRow">
        <el-col>
          服务名：
          <el-input
            @clear="loadDubboList()"
            clearable
            placeholder="如：com.test.Itest"
            v-model="serviceName"
            class="inputSearch"
          ></el-input>方法名：
          <el-input
            @clear="loadDubboList()"
            clearable
            placeholder="如：getActivityStockAllocation"
            v-model="methodName"
            class="inputSearch"
          ></el-input>
          <el-button style="margin-left:5px" type="primary" @click="searchDubbo()">搜 索</el-button>
        </el-col>
      </el-row>
      <el-table :data="dubboLogList" border style="width: 100%;margin-top:10px">
        <el-table-column fixed prop="service_name" label="服务名" width="300"></el-table-column>
        <el-table-column prop="dubbo_method" label="方法名" width="200"></el-table-column>
        <el-table-column prop="params_type" label="入参类型" width="80"></el-table-column>
        <el-table-column prop="params" label="请求参数" width="320"></el-table-column>
        <el-table-column fixed="right" prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-thumb"
              circle
              @click="showEditDubboInfo(scope.row)"
            >填充</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-dialog>
  </div>
</template>



<script>
export default {
  data() {
    return {
      invokeParams: "",
      dubboResponse: "",
      dialogFormVisibleShow: false,
      methodName: "",
      serviceName: "",
      author: "",
      dubboLogList: [],
      pagenum: 1,
      pagesize: 10,
      total: -1,
    };
  },
  methods: {
    //填充数据
    showEditDubboInfo(val) {
      // console.log(type(val.params))
      const res = {
        service_name: val.service_name,
        dubbo_method: val.dubbo_method,
        params_type: val.params_type,
        params: JSON.parse(val.params),
      };
      this.invokeParams = JSON.stringify(res, null, 2);
      this.dialogFormVisibleShow = false;
      this.$message({ type: "success", message: "一键填充成功" });
    },
    // 分页相关方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.showInvokeLog();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.showInvokeLog();
    },
    async searchDubbo() {
      const res = await this.$http.get(
        `dubbo/infos?page=${this.pagenum}&page_size=${this.pagesize}&service_name=${this.serviceName}&dubbo_method=${this.methodName}`
      );
      const { data, code, message } = res.data;
      this.dubboLogList = data.dubbo_infos;
      this.total = data.total;
    },

    // 获取请求记录
    async showInvokeLog() {
      this.dialogFormVisibleShow = true;
      const res = await this.$http.get(
        `dubbo/infos?page=${this.pagenum}&page_size=${this.pagesize}&service_name=&dubbo_method=`
      );
      const { data, code, message } = res.data;
      this.dubboLogList = data.dubbo_infos;
      this.total = data.total;
    },
    // 执行用例
    async invokeDubboController() {
      const res = await this.$http.post(`dubbo/invoke`, this.invokeParams);
      const { data, msg, code } = res.data;
      if (code === 200) {
        this.dubboResponse = JSON.stringify(data, null, 2);
        this.$message({ type: "success", message: "请求成功" });
      } else {
        this.$message.warning("请求失败");
      }
    },
    onCopy: function (e) {
      this.$message({ type: "success", message: "复制成功" });
    },
    onError() {
      this.$message.warning("复制失败");
    },
  },
};
</script>
<style scoped>
.params_input {
  margin-top: 10px;
  width: 80%;
  margin-left: 5%;
}
.inputSearch {
  width: 150px;
}
</style>
