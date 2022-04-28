<template>
  <div>
    <el-steps :space="200" :active="active" finish-status="success">
        <el-step title="身份验证"></el-step>
        <el-step title="密码重置"></el-step>
        <el-step title="重置完成"></el-step>
    </el-steps>
    <el-form
      v-if="active!=2"
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
        <div v-if="active==0">
            <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" @input="resetType"></el-input>
            </el-form-item>
            <el-button type="success" :icon="iconType[typeIndex]" @click="checkUsername" circle></el-button>

            <el-form-item label="密码问题">
                {{form.question}}
            </el-form-item>      
            <el-form-item label="问题答案" prop="answer">
                <el-input v-model="form.answer" @keyup.enter.native="checkAnswer"></el-input>
            </el-form-item>

        </div>

        <div v-if="active==1">
            <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item label="密码" prop="password">

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
                    />
                    <span class="show-pwd" @click="showPwd('password')">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
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
                    @keyup.enter.native="resetPass('form')"
                    />
                    <span class="show-pwd" @click="showPwd('checkPass')">
                    </span>
                </el-form-item>
            </el-tooltip>
        </div>


      <el-form-item>
        <el-button v-if="active==0" :loading='loading' type="primary" @click="checkAnswer">
            下一步
        </el-button>
        <el-button v-if="active==1" :loading='loading' type="primary" @click="resetPass('form')">
            下一步
        </el-button>
      </el-form-item>
    </el-form> 
    
    <div v-if="active==2">
        <el-result icon="success" title="密码重置成功" subTitle="请返回登录界面">
            <template slot="extra">
                <el-button type="primary" size="medium" @click="returnLogin">返回</el-button>
            </template>
        </el-result>
    </div>

  </div>
</template>
 
<script>
import pathToRegexp from 'path-to-regexp';
// import get_safe_question from '@/api/user-controller/get_safe_question'
export default {
  data() {

    var validatePass = (rule, value, callback) => {
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

    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      form: {
        username: "",
        question: "",
        answer: "",
        password: "",
        checkPass: "",
      },
      typeIndex: 0,
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      active:0,
      iconType:['el-icon-search','el-icon-check','el-icon-close'],
      rules: {
        username:[{ requird: true, message: "用户名不能为空", trigger: "blur" }], 
        question: [{ required: true, message: "请输入密码问题", trigger: "blur" }],
        answer: [{ required: true, message: "请输入问题答案", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass1, trigger: "blur" }],
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

    checkUsername(){
        if(this.form.username.trim() != ""){
            console.log(this.form.username)
            this.$store.dispatch('user/getQuestion', this.form.username).then(response =>{
                console.log('res',response)
                const stateCode = response.stateCode
                const question = response.question
                if(stateCode==1000){
                    this.form.question = question
                    this.typeIndex = 1
                }
                else{
                    this.typeIndex = 2
                }
            }).catch(() => {
              this.loading = false
            })
        }
    },

    resetType(){
        this.form.question = ""
        this.typeIndex = 0
    },

    checkAnswer() {
    this.loading = true
    this.$store.dispatch('user/checkAnswer', this.form)
        .then(stateCode => {
            if(stateCode==2000){
                this.active++
                this.loading = false
            }
            else{
                this.$alert('提交失败', '提示', {
                    confirmButtonText: '确定',
                    callback: () => {
                    this.$message({
                        type: 'error',
                        message: '问题答案错误'
                    });
                    }
                });
                this.loading = false
            }
    })


    },
    resetPass(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/resetPass', this.form)
            .then(stateCode => {
              if(stateCode==1000){
                this.active++
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
          this.$alert('提交失败', '提示', {
                    confirmButtonText: '确定',
                    callback: () => {
                    this.$message({
                        type: 'error',
                        message: '密码错误'
                    });
                    }
                });
          return false
        }
      })
    },
    returnLogin(){
        this.$router.push({path:'/login'})
    }
  },
};
</script>
 
<style scoped>
.register-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.register-form {
  width: 350px;
  margin: 150px auto;
  background-color: rgba(90, 187, 211, 0.7);
  padding: 30px;
  border-radius: 20px;
}
.title-zc {
  text-align: center;
}
</style>