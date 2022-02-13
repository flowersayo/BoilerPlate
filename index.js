//백엔드 시작점

const express = require('express') // 다운받은 express 모듈 가져오기 
const app = express()
const port = 5000 
const mongoose = require('mongoose');
const {User} =require('./models/User');
const bodyParser =require('body-parser');
const mongoURI =require('./config/dev');

const config = require('./config/key');

// body -parser 는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는거! 

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// application/json
mongoose.connect(config.mongoURI,{
    //useNewUrlParser : true, useUnifiedTopology:true,useCreateIndex : true,useFindAndModify:false
}).then(()=>console.log('MongoDB connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => { //root로 오면 hello world 출력 
  res.send('nodemon을 이용하면 서버를 껐다 키지 않아도 된다 !')
})

app.post('/register',(req,res)=>{
    //회원가입할때 필요한 정보들을 client에서 가져오면(req) 그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body);  // 인스턴스 생성. req.body에는 클라이언트에서 보낸 정보가 들어있음.
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        else return res.status(200).json({success:true ,userInfo})
    }); // DB에 추가 및 저장.

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})