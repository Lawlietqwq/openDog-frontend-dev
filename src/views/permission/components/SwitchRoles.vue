<template>
  <div>
    <div style="margin-bottom:15px;">
      Your roles: {{ role==0?'admin':'editor' }}
    </div>
    Switch roles:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script>
export default {
  computed: {
    role() {
      return this.$store.getters.role
    },
    switchRoles: {
      get() {
        return this.role
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
}
</script>
