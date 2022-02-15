const mongoose =require('mongoose');
const bcrypt =require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

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
        maxlength:100
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

//save() 를 수행하기 전에
userSchema.pre('save',function(next){

    var user =this; // 유저 스키마를 가리킴


    // 비밀번호를 바꿀때에만 
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds,function(err,salt){
        if(err) return next(err)

        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err)
            user.password=hash
            next()
        })
    })

    }else{ // 비밀번호를 바꾸는게 아니라 다른걸 바꿀때
        next()
        
    }
  
})

// 유저스키마에 비밀번호 비교하는 메소드 추가하기
userSchema.methods.comparePassword=function(plainPassword,cb){ //cb : 콜백 함수

    // plainPassword : 1234567
    // 암호화된 비밀번호 : !@#!#%!#
    // plain 과 암호화된 비밀번호가 일치하는지 확인하려면 plain도 암호화를 해서 같은지 확인해야함.
    // 암호화된 비밀번호를 복호화 할수 없기 때문.

    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err)
        cb(null,isMatch)
    })
}

// 토큰 생성 메소드
userSchema.methods.generateToken=function(cb){

    var user =this;
    //jsonwebtoken을 이용해서 토큰을 생성하기

    //toHexString 으로 plain object로 만들기! 
    var token = jwt.sign(user._id.toHexString(),'secretToken') //secretToken자리에 아무거나 넣기

    // user._id + 'secretToken' = token 
    // 'secretToken' 을이용해 user._id 알아냄

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user) // 에러가 없다면 유저 정보 전달
    })
}

userSchema.statics.findByToken =function(token,cb){
    var user =this;

    // 주어진 단어(secertToken)을 이용해 토큰을 decode(해독)
    var decoded = jwt.verify(token, 'secretToken',function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({'_id':decoded,'token':token},function(err,user){ // 해독된 _id에 해당하는 유저스키마 가져오기
            if(err) return cb(err)
            cb(null,user);

        })
    });

}
const User =mongoose.model('User',userSchema)

module.exports ={User}