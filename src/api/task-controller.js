import request from '@/utils/request'

export function create_task(data){
    return request({
        url:'/task/create_task',
        method:'post',
        data
    })
}

export function delete_task(data){
    return request({
        url:'/task/delete_task',
        method:'post',
        data
    })
}

export function update_task(data){
    return request({
        url:'/task/update_task',
        method:'post',
        data
    })
}

export function get_user_tasks(){
    return request({
        url:'/task/get_user_tasks',
        method:'post',
    })
}

export function get_task_projects(data){
    return request({
        url:'/task/get_task_projects',
        method:'post',
        data
    })
}

export function get_user_cases(data){
    return request({
        url:'/task/get_user_cases',
        method:'post',
        data
    })
}

export function add_task_members(data){
    return request({
        url:'/task/add_task_members',
        method:'post',
        data
    })
}

export function select_task_members(data){
    return request({
        url:'/task/select_task_members',
        method:'post',
        data
    })
}

export function remove_task_members(data){
    return request({
        url:'/task/remove_task_members',
        method:'post',
        data
    })
}