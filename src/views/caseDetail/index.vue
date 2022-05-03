<template>
    <div style="display:flex;flex-direction:column;">
        <div>
            <el-page-header @back="goBack" :content="caseInfo.caseName">
            </el-page-header>
        </div>
        <div style="display:flex;">
            <div></div>
            <el-divider direction="vertical"></el-divider>
            <div class="textbox">
                <div class="cardImg">
                    <svg-icon icon-class="phone">
                </div>
                <div class="dataInfo">
                    <span></span>
                </div>    
                <div class="cardDuty"></div>
            </div>
            <div class="textbox" v-for="(value, name) in infoDisplay" :key="value">
                <div class="cardImg">
                    <svg-icon :icon-class="iconList[name]">
                </div>
                <div class="dataInfo">
                    <span>{{value}}</span>
                </div>    
                <div class="cardDuty"></div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name:'caseDetail',
    directives: { waves },
    data(){
        return{
            AppInfo:{
                dateTime:'',
                package:'',
            },
            DeviceInfo:{
                SerialNum:'',
                OSName:'',
                OpenGL:'',
                serialName:'',
                CPUInfo:'',
            },
            Avg:{
                avgFps:0,
                peakMemory:0,
                avgMemory:0,
            },
            FPSList:[],
            //MB
            memoryData:{
                Memory:[],
                NativePss:[],
                Gfx:[],
                EGL:[],
                GL:[],
                Unknown:[],
                PrivateClean:[],
                PrivateDirty:[],
            },

            temperature:{
                CPUTemp:[],
                GpuTemp:[],
                BatteryTemp:[],
            },
            //MHz
            cpuClock:{
                CPUClock0:[],
                CPUClock1:[],
                CPUClock2:[],
                CPUClock3:[],
                CPUClock4:[],
                CPUClock5:[],
                CPUClock6:[],
                CPUClock7:[],
            },
            //%
            cpuUsage:{
                CPUUsage0:[],
                CPUUsage1:[],
                CPUUsage2:[],
                CPUUsage3:[],
                CPUUsage4:[],
                CPUUsage5:[],
                CPUUsage6:[],
                CPUUsage7:[],
            },
            caseInfo:{
                caseId:0,
                caseName:'',
                comment:'',
            },
            iconList:{
                userName:'role',
                uploadTime:'upload'
            },
            infoDisplay:{
                userName:this.$store.getters.userName,
                uploadTime:'',
            }
        }
    },
    created(){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.caseId = this.$route.params.caseId
        this.$store.dispatch('case/get_case_detail',{caseId:[].push(this.caseId)}).then(res =>{
            const {stateCode, data} = res
            if(stateCode===1000){
                this.setCaseInfo(caseId, data.caseName, data.comment)
                this.infoDisplay.uploadTime = data.createdTime
            }
        })

        this.$store.dispatch('case/get_case_data',{caseId:this.caseId}).then(res => {
            const{ stateCode, data } = res
            if(stateCode===1000 && !data){
                this.getData(data)
            }
        })
        loading.close()
    },
    methods: {
      
        getData(data){
            this.setAppInfo(data)
            this.setDeviceInfo(data)
            this.setAvg(data)
            this.setFPSList(data)
            this.setMemoryData(data)
            this.setTemperature(data)
            this.setCpuClock(data)
            this.setCpuUsage(data)
        },

        setCaseInfo(caseId, caseName, comment){
            this.caseInfo.caseId = caseId
            this.caseInfo.caseName = caseName
            this.caseInfo.comment = comment
        },
        setAppInfo(data){
            this.AppInfo.dateTime = data.AppInfo.Date
            this.AppInfo.package = data.AppInfo.Package
        },
        setDeviceInfo(data){
            this.DeviceInfo.SerialNum = data.DeviceInfo.SerialNum
            this.DeviceInfo.OSName = data.DeviceInfo['OS']
            this.DeviceInfo.OpenGL = data.DeviceInfo.OpenGL
            this.DeviceInfo.CPUInfo = data.DeviceInfo['CPU Info']
            this.DeviceInfo.OpenGL = data.DeviceInfo['Device Name']

        },
        setAvg(data){
            this.Avg.avgFps = data.Data.Avg['Avg(FPS)']
            this.Avg.peakMemory = data.Data.Avg['Peak(Memory)[MB]']
            this.Avg.avgMemory = data.Data.Avg['Avg(Memory)[MB]']

        },
        setFPSList(data){
            this.FPSList = data.Data.Table['FPS']
        },
        setMemoryData(data){
            this.memoryData.Memory = data.Data.Table['Memory[MB]']
            this.memoryData.NativePss = data.Data.Table['NativePss[MB]']
            this.memoryData.Gfx = data.Data.Table['Gfx[MB]']
            this.memoryData.EGL = data.Data.Table['EGL[MB]']
            this.memoryData.GL = data.Data.Table['GL[MB]']
            this.memoryData.Unknown = data.Data.Table['Unknown[MB]']
            this.memoryData.PrivateClean = data.Data.Table['PrivateClean[MB]']
            this.memoryData.PrivateDirty = data.Data.Table['PrivateDirty[MB]']

        },
        setTemperature(data){
            this.temperature.CPUTemp = data.Data.Table.CpuTemp
            this.temperature.GpuTemp = data.Data.Table.GpuTemp
            this.temperature.BatteryTemp = data.Data.Table.BatteryTemp
        },

        setCpuClock(data){
            this.cpuClock.CPUClock0 = data.Data.Table['CPUClock0[MHz]']
            this.cpuClock.CPUClock1 = data.Data.Table['CPUClock1[MHz]']
            this.cpuClock.CPUClock2 = data.Data.Table['CPUClock2[MHz]']
            this.cpuClock.CPUClock3 = data.Data.Table['CPUClock3[MHz]']
            this.cpuClock.CPUClock4 = data.Data.Table['CPUClock4[MHz]']
            this.cpuClock.CPUClock5 = data.Data.Table['CPUClock5[MHz]']
            this.cpuClock.CPUClock6 = data.Data.Table['CPUClock6[MHz]']
            this.cpuClock.CPUClock7 = data.Data.Table['CPUClock7[MHz]']
        },

        setCpuUsage(data){
            this.cpuUsage.CPUUsage0 = data.Data.Table['CPUUsage0[%]']
            this.cpuUsage.CPUUsage1 = data.Data.Table['CPUUsage1[%]']
            this.cpuUsage.CPUUsage2 = data.Data.Table['CPUUsage2[%]']
            this.cpuUsage.CPUUsage3 = data.Data.Table['CPUUsage3[%]']
            this.cpuUsage.CPUUsage4 = data.Data.Table['CPUUsage4[%]']
            this.cpuUsage.CPUUsage5 = data.Data.Table['CPUUsage5[%]']
            this.cpuUsage.CPUUsage6 = data.Data.Table['CPUUsage6[%]']
            this.cpuUsage.CPUUsage7 = data.Data.Table['CPUUsage7[%]']
        },

        goBack() {
            this.$router.push({path:'caseView'})
        }
    }
  }
</script>

<style scoped>
    .textbox{
        margin-left: 10px;
    }


</style>