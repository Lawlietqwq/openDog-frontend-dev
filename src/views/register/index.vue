<template>
<el-container style="width:100%;height:100%;justify-content:center;align-items:center;">
  <el-container class="register-container"> 
    <el-header style="text-align: right; font-size: 12px">
      <span style="align-self:flex-end;">
        <em class="bold">已有账号？</em>
        <router-link to='/login'>
            <el-button type="primary" size="mini">登录</el-button>
        </router-link>
      </span>
    </el-header>
    <el-main>
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
      <el-form-item label="账号" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item label="密码" prop="password">
            <div style="display:flex;justify-content:space-between;">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="form.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleRegister"
            />
            <span style="margin-left:10px;" @click="showPwd('password')">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
            </div>
          </el-form-item>
        </el-tooltip>
        
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item label="确认密码" prop="checkPass">

            <el-input
              :key="passwordType"
              ref="checkPass"
              v-model="form.checkPass"
              :type="passwordType"
              placeholder="确认密码"
              name="checkPass"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd('checkPass')">
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>   

        <el-form-item label="密码问题" prop="question">
          <el-input v-model="form.question"></el-input>
        </el-form-item>      

        <el-form-item label="问题答案" prop="answer">
          <el-input v-model="form.answer" @keyup.enter.native="handleRegister('form')"></el-input>
        </el-form-item>  

        <el-form-item>
          <el-button :loading='loading' type="primary" @click="handleRegister('form')">
              提交
          </el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    </el-container>
  </el-container>
</template>
 
<script>
import { validSucceed, validEmail } from '@/utils/validate'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      //rule:password的详细信息，value：password的值，callback:如果都不满足，则正常提交
      if (!validSucceed(this.isSucceed)) {
        callback(new Error("用户名重复"));//输入为空的提示信息
        this.isSucceed = 1000
      } else if(value == ""){
        callback(new Error("用户名不能为空"));
      }
      else
        callback()
    };

    var validatePass2 = (rule, value, callback) => {
      //rule:password的详细信息，value：password的值，callback:如果都不满足，则正常提交
      if (value === "") {
        callback(new Error("请输入密码"));//输入为空的提示信息
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");//如果确认密码不为空，则去validatePass2这个函数
        }
        callback();
      }
    };

    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };


    var validatePass4 = (rule, value, callback) => {
      //rule:password的详细信息，value：password的值，callback:如果都不满足，则正常提交
      if (!validEmail(value)) {
        callback(new Error("邮箱格式不正确"));//输入为空的提示信息
      } else {
        callback();
      }
    };
    // var validatePass4 = (rule, value, callback) => {
    //   //rule:password的详细信息，value：password的值，callback:如果都不满足，则正常提交
    //   if (value === "") {
    //     callback(new Error("请输入问题答案"));//输入为空的提示信息
    //   } else {
    //     if (this.form.checkPass !== "") {
    //       this.$refs.form.validateField("checkPass");//如果确认密码不为空，则去validatePass2这个函数
    //     }
    //     callback();
    //   }
    // };
    return {
      form: {
        username: "",
        password: "",
        checkPass: "",
        email: "",
        question: "",
        answer: "",
      },
      isSucceed: 1000,
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      rules: {
        username:[{ requird: true, validator: validatePass, trigger: "blur" }], 
        password: [{ validator: validatePass2, trigger: "blur" }],
        checkPass: [{ validator: validatePass3, trigger: "blur" }],
        email: [{ validator: validatePass4, trigger: "blur" }],
        question: [{ required: true, message: "请输入密码问题", trigger: "blur" }],
        answer: [{ required: true, message: "请输入问题答案", trigger: "blur" }],
        },    
      };
      
  },

  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd(inputName) {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs[inputName].focus()
      })
    },
    handleRegister(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.form)
            .then(stateCode => {
              console.log('code',stateCode)
              this.isSucceed = stateCode
              if(stateCode==1000){
              console.log("woyun")
              this.$router.push({ path: '/login', query: this.otherQuery })
              this.loading = false
              }
              else{
                this.loading = false
              }

            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('注册失败')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
 
<style scoped>

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .register-container {
    display: flex;
    justify-content: center;
    width: 600px;
    height: 540px;
    flex:unset;
    overflow:hidden;
    border: 1px solid #eee;
  }
  .register-form {
    width: 350px;
    /* margin: 150px auto; */
    background-color: rgba(90, 187, 211, 0.7);
    padding: 30px;
    border-radius: 20px;
  }

</style>