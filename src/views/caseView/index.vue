<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.caseName" placeholder="请输入用例名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="float:right" type="primary" icon="el-icon-edit" @click="backTo">
        返回
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column label="用例编号" prop="caseId" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例名" prop="caseName" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showDetail(row)">{{ row.caseName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="项目描述" prop="comment" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="修改用例" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用例名">
          <el-input v-model="temp.caseName" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="temp.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'caseView',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        caseName:'',
        sort: '+id'
      },
      current_pid:-1,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        caseId: -1,
        caseName: '',
        comment: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.current_pid = this.$route.params.pid
    this.getList(this.current_pid)
  },
  methods: {
    getList(current_pid) {
      this.listLoading = true
      console.log('pid',current_pid)
      this.$store.dispatch('case/select_project_case',current_pid).then(res => {
          console.log('asdasdads',res)
          let {stateCode, data} = res
          if(stateCode==1000){
            data = data.map(value => {
            let {uid,projectId,taskId,...reset}={...value}
            return reset
          })
              this.list = data
              this.total = data.length
          }
          setTimeout(() => {
          this.listLoading = false
          }, 1.5 * 1000)
      })
    },
    handleFilter() {
      if(this.listQuery.caseName != ''){
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.list.length
      }
      else{
          this.getList(this.current_pid)
      }
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    setTemp(caseId, caseName, comment){
        this.temp = {
        caseId: caseId,
        caseName: caseName,
        comment: comment,
      }
    },
    resetTemp() {
      this.temp = {
        caseId: -1,
        caseName: '',
        comment: '',
      }
    },

    handleUpdate(row) {
      this.setTemp(row.caseId, row.caseName, row.comment)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const casetInfo = {
              caseId:this.temp.caseId,
              caseName:this.temp.caseName,
              comment:this.temp.comment,
            }
          this.$store.dispatch('case/update_case',casetInfo).then(stateCode => {
            if(stateCode==1000){
            const index = this.list.findIndex(v => v.caseId === this.temp.caseId)
            console.log(index)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            }
            else return false 
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$store.dispatch('case/delete_case',[row.caseId]).then(stateCode =>{
      if(stateCode==1000){
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      }
      })
    },
    showDetail(row){
        this.$router.push({name:'caseDetail',params:{caseId:row.caseId}})
    },
    backTo(){
        this.$router.push({name:'projectView'})
    },
    querySearch() {
      var searchData = []
      var vm = this
      this.list.forEach(function (item) {
        if (item.caseName.toLowerCase().indexOf(vm.listQuery.caseName.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.list = searchData;
    },
  }
}
</script>
