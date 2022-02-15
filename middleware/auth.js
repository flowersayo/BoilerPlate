
const {User} =require('../models/User');
  
//인증 처리 
let auth =(req,res,next)=>{

    // 클라이언트에 저장된 쿠키에서 토큰을 가져온다.
    let token =req.cookies.x_auth; 


    // 토큰을 복호화한다음 유저를 찾는다. -> 유저 모델에서 메소드 만들기
    User.findByToken(token,(err,user)=>{ //
        if(err) throw err;
        if(!user) return res.json({isAuth:false,error:true}) //유저가 없다면 리턴문으로 빠져나감

        // 유저가 있다면 cb에서 접근 가능하도록 req에 넣기! 
        req.token=token;
        req.user=user; 
        next(); //middleware에서 callback function으로 이동.

    })
   

}


module.exports={auth};
