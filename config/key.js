
// 개발 vs 배포 모드 분기처리 

if(process.env.NODE_ENV==='production'){
    module.exports=require('./prod') 
}else{ //'development' , 사실은 undefined 라서 이 구문이 실행됨. NODE_ENV=' ' 로 따로 설정해주어야함. 
module.exports=require('./dev')
}