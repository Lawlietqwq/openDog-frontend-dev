import request from '@/utils/request'

export function create_project(data){
    return request({
        url:'/project/create_project',
        method:'post',
        data
    })
}

export function delete_project(data){
    return request({
        url:'/project/delete_project',
        method:'post',
        data
    })
}

export function update_project(data){
    return request({
        url:'/project/update_project',
        method:'post',
        data
    })
}

export function select_project_case(data){
    return request({
        url:'/project/select_project_case',
        method:'post',
        data
    })
}

export function select_user_projects(){
    return request({
        url:'/project/select_user_projects',
        method:'post',
    })
}

export function get_project_detail(data){
    return request({
        url:'/project/get_project_detail',
        method:'post',
        data
    })
}