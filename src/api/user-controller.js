import request from '@/utils/request'
// import data from '@/views/pdf/content'

export function register(data){
    return request({
        url:'/user/register',
        method:'post',
        data
    })
}

export function check_field(data){
    return request({
        url:'/user/check_field',
        method:'post',
        data
    })
}

export function login(data){
    return request({
        url:'/user/login',
        method:'post',
        data
    })
}

export function login_out(){
    return request({
        url:'/user/login_out',
        method:'post',
    })
}

export function get_safe_question(data){
    return request({
        url:'/user/get_safe_question',
        method:'post',
        data
    })
}

export function check_question_answer(data){
    return request({
        url:'/user/check_question_answer',
        method:'post',
        data
    })
}

export function reset_forget_password(data){
    return request({
        url:'/user/reset_forget_password',
        method:'post',
        data
    })
}

export function reset_password(data){
    return request({
        url:'/user/reset_password',
        method:'post',
        data
    })
}

export function get_user_detail(){
    return request({
        url:'/user/get_user_detail',
        method:'post',
    })
}

export function update_user_detail(data){
    return request({
        url:'/user/update_user_detail',
        method:'post',  
        data
    })
}

