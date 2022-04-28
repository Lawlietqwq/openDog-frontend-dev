import request from '@/utils/request'

export function add_case(data){
    return request({
        url:'/user/add_case',
        method:'post',
        data
    })
}

export function delete_case(data){
    return request({
        url:'/user/delete_case',
        method:'post',
        data
    })
}

export function update_case(data){
    return request({
        url:'/user/update_case',
        method:'post',
        data
    })
}

export function select_case(data){
    return request({
        url:'/user/select_case',
        method:'post',
        data
    })
}

export function get_case_detail(data){
    return request({
        url:'/user/get_case_detail',
        method:'post',
        data
    })
}

export function get_detail_with_passwd(data){
    return request({
        url:'/user/get_detail_with_passwd',
        method:'post',
        data
    })
}

export function get_case_detail(data){
    return request({
        url:'/user/get_case_detail',
        method:'post',
        data
    })
}

export function remove_cases_from_project(data){
    return request({
        url:'/user/remove_cases_from_project',
        method:'post',
        data
    })
}

export function get_case_data(data){
    return request({
        url:'/user/get_case_data',
        method:'post',
        data
    })
}
