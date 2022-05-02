import * as caseAPI from '@/api/case-controller'
import * as projectApi from '@/api/project-controller'

const state = {
    cid: -1,
    pid: -1,
    projectName: '',
    current_cid:-1,
}

const mutations = {
    SET_CID: (state, cid) => {
        state.cid = cid
    },

    SET_PID: (state, pid) => {
        state.pid = pid
    },

    SET_PNAME: (state, projectName) => {
        state.projectName = projectName
    },

    SET_CURRENT_CID: (state, current_cid) => {
        state.current_cid = current_cid
    }
}

const actions = {

    //删除case
    delete_case({ commit }, caseId){
        return new Promise((resolve, reject) => {
            caseAPI.delete_case(JSON.stringify({caseId:caseId})).then(res => {
                resolve(res.state)
            }).catch(error =>{
                reject(error)
            })
        })
    },
    
    //修改case
    update_case({ commit }, caseInfo){
        // const {caseId, caseName, comment} = caseInfo
        return new Promise((resolve, reject) => {
            caseAPI.update_case(JSON.stringify(caseInfo)).then(res => {
                resolve(res.state)
            }).catch(error =>{
                reject(error)
            })
        })
    },

    //获取用户可见case
    select_case({ commit }){
        // const {caseId, caseName, comment} = caseInfo
        return new Promise((resolve, reject) => {
            caseAPI.select_case().then(res => {
                resolve({stateCode:res.state, cases:res.data.cases})
            }).catch(error =>{
                reject(error)
            })
        })
    },

    //获取用例详情
    get_case_detail({ commit }, data){
        // const {caseId, caseName, comment} = caseInfo
        return new Promise((resolve, reject) => {
            caseAPI.get_case_detail(JSON.stringify(data)).then(res => {
                const stateCode = res.state
                const {caseId, projectId, accessState} = res.data.success
                if(stateCode==1000){
                    commit('SET_CID', caseId)
                    commit('SET_PID', projectId)
                }
                resolve({stateCode:stateCode, data:res.data.success})
            }).catch(error =>{
                reject(error)
            })
        })
    },

    get_case_data({ commit }, caseId){
        return new Promise((resolve, reject) => {
            caseAPI.get_case_data(JSON.stringify({caseId:caseId})).then(res => {
                const stateCode = res.state
                const {caseId, projectId, accessState} = res.data.success
                if(stateCode==1000){
                    // commit('SET_CID', caseId)
                    // commit('SET_PID', projectId)
                    commit('SET_CURRENT_ID',caseId)
                }
                resolve({stateCode:stateCode, data:res.data.success})
            }).catch(error =>{
                reject(error)
            })
        })
    },

    //新建项目
    create_project({ commit }, projectInfo){
        return new Promise((resolve, reject) => {
            projectApi.create_project(JSON.stringify(projectInfo)).then(res => {
                console.log('create',res)
                resolve(res) 
            }).catch(error => {
                reject(error)
            })
        })
    },

    //删除项目
    delete_project({ commit }, projectId){
        return new Promise((resolve, reject) => {
            projectApi.delete_project(JSON.stringify({projectId:projectId})).then(res => {
                resolve(res.state) 
            }).catch(error => {
                reject(error)
            })
        })
    },

    update_project({ commit }, projectInfo){
        return new Promise((resolve, reject) => {
            projectApi.update_project(JSON.stringify(projectInfo)).then(res => {
                resolve(res.state) 
            }).catch(error => {
                reject(error)
            })
        })
    },

    select_user_projects({ commit }){
        return new Promise((resolve, reject) => {
            projectApi.select_user_projects().then(res => {
                resolve({stateCode:res.state, data:res.data.projectList}) 
            }).catch(error => {
                reject(error)
            })
        })
    },
    select_project_case({ commit }, pid){
        return new Promise((resolve, reject) => {
            projectApi.select_project_case(JSON.stringify({pid:pid})).then(res => {
                commit('SET_PID', pid)
                resolve({stateCode:res.state, data:res.data.caseList}) 
            }).catch(error => {
                reject(error)
            })
        })
    }, 

    get_project_detail({ commit }, projectInfo){
        return new Promise((resolve, reject) => {
            projectApi.get_project_detail(JSON.stringify(projectInfo)).then(res => {
                resolve({stateCode:res.state, data:res.data}) 
            }).catch(error => {
                reject(error)
            })
        })
    }, 
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
