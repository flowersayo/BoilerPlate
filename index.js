//백엔드 시작점

const express = require('express') // 다운받은 express 모듈 가져오기 
const app = express()
const port = 5000 
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://flowersayo:RHVxep11INsgsWBr@cluster0.cop6l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    //useNewUrlParser : true, useUnifiedTopology:true,useCreateIndex : true,useFindAndModify:false
}).then(()=>console.log('MongoDB connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => { //root로 오면 hello world 출력 
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})