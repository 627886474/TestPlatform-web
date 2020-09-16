<template>
  <div>
    <el-form :model="registerForm" status-icon label-width="100px">
      <el-form-item label="名字">
        <el-input
          type="text"
          v-model="registerForm.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          type="text"
          v-model="registerForm.mobile"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          type="text"
          v-model="registerForm.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input v-model="registerForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        name: "",
        mobile: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async submitForm() {
      console.log(this.registerForm);
      const res = await this.$http.post(`user/register`, {
        name: this.registerForm.name,
        mobile: this.registerForm.mobile,
        email: this.registerForm.email,
        password: this.registerForm.password
      });
      const{code,message} = res.data;
      if (code === 200) {
        this.$message.success("注册成功");
        this.$router.push({ path: "/login" });
      } else {
        this.$message.warning(message);
      }
    }
  }
};
</script>
