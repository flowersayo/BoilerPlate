const mongoose =require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength:50
    },
    email:{
        type: String,
        trim: true, // 공백을 없애주는 역할
        unique: 1 
    },
    password:{
        type:String,
        maxlength:50
    },
    role:{ //관리자 vs 일반 유저
        type : Number, // 0: 일반유저 1: 관리자 
        default : 0 //값을 지정하지 않을 경우 기본값
    },
    image: String,
    token :{
        type:String //유효성 관리
    },
    tokenExp :{ //token의 유효기간
        type : Number
    }

})

const User =mongoose.model('User',userSchema)

module.exports ={User}