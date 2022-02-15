//백엔드 시작점

const express = require('express') // 다운받은 express 모듈 가져오기 
const app = express()
const port = 5000 
const mongoose = require('mongoose');
const {User} =require('./models/User');
const bodyParser =require('body-parser');
const mongoURI =require('./config/dev');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const {auth} =require('./middleware/auth');

// body -parser 는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는거! 

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


// application/json
mongoose.connect(config.mongoURI,{
    //useNewUrlParser : true, useUnifiedTopology:true,useCreateIndex : true,useFindAndModify:false
}).then(()=>console.log('MongoDB connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => { //root로 오면 hello world 출력 
  res.send('nodemon을 이용하면 서버를 껐다 키지 않아도 된다 !')
})

app.post('/api/users/register',(req,res)=>{
    //회원가입할때 필요한 정보들을 client에서 가져오면(req) 그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body);  // 인스턴스 생성. req.body에는 클라이언트에서 보낸 정보가 들어있음.
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        else return res.status(200).json({success:true ,userInfo})
    }); // DB에 추가 및 저장.

})

app.post('/api/users/login',(req,res)=>{

    // 데이터 베이스에서 요청한 이메일에 해당하는 유저 스키마 찾기
    User.findOne({email:req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess:false,
                message:"제공된 이메일에 해당하는 유저가 존재하지 않습니다."
            })
        }
         // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인

            user.comparePassword(req.body.password,(err,isMatch)=>{ //comparePassword는 models안에 존재하는 사용자 정의함수!
                if(!isMatch) //비밀번호가 일치하지 않음
                return res.json({loginSuccess:false,message:'비밀번호가 틀렸습니다.'})
                

                //비밀번호까지 맞다면 토큰을 생성하기
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);

                      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등에! 
                    res.cookie('x_auth',user.token).status(200).json({loginSuccess:true,userId:user._id})
                  
                })

            })
       
    })

})
//role
//0 :일반 유저, 1 : 어드민 ,2 : 특정 부서 어드민
app.get('/api/users/auth',auth,(req,res)=>{
 //auth : 미들웨어 callback function을 수행하기 전에 동작.

 // 미들웨어를 통과해 call back 이 실행됐다는 것은 Auth가 true라는 말 

 res.status(200).json({
     _id:req.user,
     isAdmin: req.user.role ===0?false:true, 
     isAuth : true,
     name:req.user.name,
     lastname:req.user.lastname,
     role:req.user.role,
     image:req.user.image

 })
 
})

app.get('/api/users/logout',auth,(req,res)=>{

    //auth 미들웨어에서 req.user에 값 넣어둠.
    User.findOneAndUpdate({_id:req.user._id},
        {token: ""}, // 토큰 삭제 
        (err,user)=>{
            if(err) return res.json({success:false,err})
            else return res.status(200).send({success:true})
        })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})