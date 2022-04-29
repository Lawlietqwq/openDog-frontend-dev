import * as caseAPI from '@/api/case-controller'

const state = {
    cid: [],
    pid: [],
    access_state:[],
}

const mutations = {
    SET_CID: (state, cid) => {
        state.cid = cid
    },

    SET_PID: (state, pid) => {
        state.pid = pid
    },

    SET_ACCESS_STATE: (state, access_state) => {
        state.access_state = access_state
    }
}

const actions = {
    // //新增case
    // new_case({ commit }, caseInfo){
    //     return new Promise((resolve, reject) => {
    //         caseAPI.add_case(JSON.stringify(caseInfo)).then(res => {
    //             resolve(res.state)
    //         }).catch(error =>{
    //             reject(error)
    //         })
    //     })
    // },

    //删除case
    new_case({ commit }, caseId){
        return new Promise((resolve, reject) => {
            caseAPI.delete_case(JSON.stringify({caseId:caseId})).then(res => {
                resolve(res.state)
            }).catch(error =>{
                reject(error)
            })
        })
    },
    
    //修改case
    revise_case({ commit }, caseInfo){
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
    revise_case({ commit }){
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
    revise_case({ commit }, data){
        // const {caseId, caseName, comment} = caseInfo
        return new Promise((resolve, reject) => {
            caseAPI.get_case_detail(JSON.stringify(data)).then(res => {
                const stateCode = res.state
                const {caseId, projectId, accessState} = res.data.success
                if(stateCode==1000){
                    commit('SET_CID', caseId)
                    commit('SET_PID', projectId)
                    commit('SET_ACCESS_STATE', accessState)
                }
                resolve({stateCode:stateCode, data:res.data.success})
            }).catch(error =>{
                reject(error)
            })
        })
    },

    get_case_data({ commit }, caseId){
        return new Promise((resolve, reject) => {
            caseAPI.get_case_detail(JSON.stringify({caseId:caseId})).then(res => {
                const stateCode = res.state
                const {caseId, projectId, accessState} = res.data.success
                if(stateCode==1000){
                    commit('SET_CID', caseId)
                    commit('SET_PID', projectId)
                    commit('SET_ACCESS_STATE', accessState)
                }
                resolve({stateCode:, data:res.data.success})
            }).catch(error =>{
                reject(error)
            })
        })
    },



}