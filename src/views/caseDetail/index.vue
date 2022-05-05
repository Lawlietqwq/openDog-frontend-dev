<template>
    <div class="textbox">
        <div style="height:60px;">
            <el-page-header style="height:100%;" @back="goBack" :content="caseInfo.caseName">
            </el-page-header>
        </div>
        <div class="infobox">
            <div class="textbox">
                <div>Android版本号:{{DeviceInfo.OSName}}</div>
                <div style="margin-top:10px;">{{AppInfo.package}}</div>
                
            </div>
            <el-divider direction="vertical"></el-divider>
            <div class="infobox">
                <div>
                    <svg-icon icon-class="phone" class-name="icon-format"/>
                </div>
                <div class="textbox">
                    <span>
                        <strong style="font-size:30px;">{{DeviceInfo.deviceName}}</strong>
                    </span>
                    <span>SerialNum:{{DeviceInfo.SerialNum}}</span>
                    <span>OpenGL:{{DeviceInfo.OpenGL}}</span>
                    <span>CPU:{{DeviceInfo.CPUInfo}}</span>
                </div>
            </div>
            <div class="infobox" v-for="(value, name) in infoDisplay" :key="value">
                <div class="cardImg">
                    <svg-icon :icon-class="iconList[name]" class-name="icon-format"/>
                </div>
                <div class="textbox">
                    <span>
                        <strong style="font-size:25px;">{{name==='userName'?'创建者':'上传时间'}}</strong>
                    </span>
                    <span>{{value}}</span>
                </div>    
            </div>
        </div>
        <div style="width:100%;">
            <el-collapse v-model="activeNames" @change="initCharts">
            <el-collapse-item title="概览" name="general">
                <div class="infobox">
                    <div class="textbox" v-for="(value, name) in Avg" :key="name">
                        <span>{{name}}</span>
                        <span style="font-size:25px;"><strong>{{value}}</strong></span>
                    </div>
                </div>    
            </el-collapse-item>
            <el-collapse-item title="FPS" name="FPSList">
                <div class="chartBox" ref="FPSList"></div>
            </el-collapse-item>
            <el-collapse-item title="CPU" name="CPU">
                <div class="chartBox" ref="CPUUsage"></div>
                <div style="margin-top:15px" class="chartBox" ref="CPUClock"></div>
            </el-collapse-item>
            <el-collapse-item title="Memory" name="memoryData">
                <div class="chartBox" ref="memoryData"></div>
            </el-collapse-item>
            <el-collapse-item title="Temperature" name="temperature">
                <div class="chartBox" ref="temperature"></div>
            </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import * as echarts from 'echarts'
export default {
    name:'caseDetail',
    directives: { waves },
    data(){
        return{
            activeNames:['general'],
            Num:[],
            AppInfo:{
                dateTime:'',
                package:'',
            },
            DeviceInfo:{
                SerialNum:'',
                OSName:'',
                OpenGL:'',
                deviceName:'',
                CPUInfo:'',
            },
            Avg:{
                'Avg[FPS]':0,
                'Peak(Memory)[MB]':0,
                'Avg(Memory)[MB]':0,
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
            CPUClock:{
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
            CPUUsage:{
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
                userName:this.$store.getters.name,
                uploadTime:'',
            },
            echartState:{'FPSList':false, 'CPU':false, 'memoryData':false, 'temperature':false}
        }
    },
    created(){
        this.openFullScreen()
        this.caseInfo.caseId = this.$route.params.caseId
        this.$store.dispatch('case/get_case_detail',{caseId:Array.of(this.caseInfo.caseId)}).then(res =>{
            const {stateCode, data} = res
            if(stateCode===1000){
                this.setCaseInfo(data.caseId, data.caseName, data.comment)
                this.infoDisplay.uploadTime = data.createdTime
            }
        })

        this.$store.dispatch('case/get_case_data',this.caseInfo.caseId).then(res => {
            const{ stateCode, data } = res
            if(stateCode===1000 && data){
                this.getData(data)
            }
        })
        this.closeFullScreen(this.openFullScreen())
    },

    methods: {
      
        getData(data){
            this.setNum(data)
            this.setAppInfo(data)
            this.setDeviceInfo(data)
            this.setAvg(data)
            this.setFPSList(data)
            this.setMemoryData(data)
            this.setTemperature(data)
            this.setCPUClock(data)
            this.setCPUUsage(data)
        },

        setCaseInfo(caseId, caseName, comment){
            this.caseInfo.caseId = caseId
            this.caseInfo.caseName = caseName
            this.caseInfo.comment = comment
        },
        setNum(data){
            this.Num = data.Data.Table.Num
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
            this.DeviceInfo.deviceName = data.DeviceInfo['Device Name']

        },
        setAvg(data){
            this.Avg['Avg[FPS]'] = data.Data.Avg['Avg(FPS)']
            this.Avg['Peak(Memory)[MB]'] = data.Data.Avg['Peak(Memory)[MB]']
            this.Avg['Avg(Memory)[MB]'] = data.Data.Avg['Avg(Memory)[MB]']

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

        setCPUClock(data){
            this.CPUClock.CPUClock0 = data.Data.Table['CPUClock0[MHz]']
            this.CPUClock.CPUClock1 = data.Data.Table['CPUClock1[MHz]']
            this.CPUClock.CPUClock2 = data.Data.Table['CPUClock2[MHz]']
            this.CPUClock.CPUClock3 = data.Data.Table['CPUClock3[MHz]']
            this.CPUClock.CPUClock4 = data.Data.Table['CPUClock4[MHz]']
            this.CPUClock.CPUClock5 = data.Data.Table['CPUClock5[MHz]']
            this.CPUClock.CPUClock6 = data.Data.Table['CPUClock6[MHz]']
            this.CPUClock.CPUClock7 = data.Data.Table['CPUClock7[MHz]']
        },

        setCPUUsage(data){
            this.CPUUsage.CPUUsage0 = data.Data.Table['CPUUsage0[%]']
            this.CPUUsage.CPUUsage1 = data.Data.Table['CPUUsage1[%]']
            this.CPUUsage.CPUUsage2 = data.Data.Table['CPUUsage2[%]']
            this.CPUUsage.CPUUsage3 = data.Data.Table['CPUUsage3[%]']
            this.CPUUsage.CPUUsage4 = data.Data.Table['CPUUsage4[%]']
            this.CPUUsage.CPUUsage5 = data.Data.Table['CPUUsage5[%]']
            this.CPUUsage.CPUUsage6 = data.Data.Table['CPUUsage6[%]']
            this.CPUUsage.CPUUsage7 = data.Data.Table['CPUUsage7[%]']
        },

        goBack() {
            this.$router.push({name:'caseView', params:{pid:this.$store.getters.pid}})
        },

        //Loading加载
        openFullScreen() {
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            return loading;
        },

        closeFullScreen(loading){
            loading.close();
        },

        dataToSeries(data){
            let series = []
            for(let key in data){
                series.push({
                    name: key,
                    type: 'line',
                    smooth: true,
                    data: data[key],
                })
            }
            return series
        },
        listToSeries(chartName, data){
            return {
                name:chartName,
                type: 'line',
                smooth: true,
                data:data,
            }
        },

        initCharts(val){
            this.openFullScreen()
            let chartName = val.slice(-1)
            if(!this.echartState[chartName]){
                if(chartName == 'CPU'){
                    this.initSingleCharts('CPUUsage')
                    this.initSingleCharts('CPUClock')
                }
                else if(chartName != 'general'){
                    this.initSingleCharts(chartName)
                }
                this.echartState[chartName] = true
            }
            this.closeFullScreen(this.openFullScreen())
        },
        initSingleCharts(chartName){
            let myChart = echarts.init(this.$refs[chartName]);
            // 绘制图表
            let data = this[chartName]
            if(chartName != 'FPSList'){
                data = this.dataToSeries(data)
            }
            else{
                data = this.listToSeries(chartName, data)
            }
            console.log('data',data)
                myChart.setOption({
                title: { text: chartName },
                xAxis: {
                    data: this.Num
                },
                yAxis: {
                    type:'value',
                    scale:true
                },
                grid: [{left: '5%', right: '5%', bottom: '20%'}],
                series: data,
                dataZoom: [{
                    type: 'slider', top: '93%', start: 0, end: 100, textStyle: {color: '#8392A5'},
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    dataBackground: {areaStyle: {color: '#8392A5'}, lineStyle: {opacity: 0.8, color: '#8392A5'}},
                    handleStyle: {
                    color: '#fff', shadowBlur: 3, shadowColor: 'rgba(0, 0, 0, 0.6)', shadowOffsetX: 2,
                    shadowOffsetY: 2
                    }}, 
                    {show: true, xAxisIndex: 0, type: 'inside', top: '90%', start: 0, end: 100}
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross'
                    }
                },
            });
        }     
    }
  }
</script>


<style scoped>
    .textbox{
        margin-left: 10px;
        display:flex;
        flex-direction:column;
        justify-content:space-around;
    }

    .infobox{
        display:flex;
        justify-content:space-around;
    }

    .icon-format{
        font-size: 60px;
        margin: auto;
    }
    
    .chartBox{
        width:1500px;
        height:500px;
        align-self: center;
    }

    /* .el-collapse-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
    } */
</style>