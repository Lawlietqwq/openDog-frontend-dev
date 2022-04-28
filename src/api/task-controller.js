import request from '@/utils/request'

export function create_task(data){
    return request({
        url:'/user/create_task',
        method:'post',
        data
    })
}

export function delete_task(data){
    return request({
        url:'/user/delete_task',
        method:'post',
        data
    })
}

export function update_task(data){
    return request({
        url:'/user/update_task',
        method:'post',
        data
    })
}

export function get_user_tasks(){
    return request({
        url:'/user/get_user_tasks',
        method:'post',
    })
}

export function get_task_projects(data){
    return request({
        url:'/user/get_task_projects',
        method:'post',
        data
    })
}

export function get_user_cases(data){
    return request({
        url:'/user/get_user_cases',
        method:'post',
        data
    })
}

export function add_task_members(data){
    return request({
        url:'/user/add_task_members',
        method:'post',
        data
    })
}

export function select_task_members(data){
    return request({
        url:'/user/select_task_members',
        method:'post',
        data
    })
}

export function remove_task_members(data){
    return request({
        url:'/user/remove_task_members',
        method:'post',
        data
    })
}