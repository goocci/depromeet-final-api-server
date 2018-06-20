// 모듈 삽입 부분
const express = require('express');
const http = require('http');

// 익스프레스 객체 생성 및 속성 설정
const app = express();

// Express 모듈 포트 설정
app.set('port', process.env.PORT || 8080);

// 예시 API, 서버 정상 작동의 여부와, 서버 시간을 반환한다.
app.get('/on', (req, res) => {
    res.send({server_on:true});
});
app.get('/time', (req,res) =>{
    let time = new Date();
    res.send({server_time:time.toLocaleString()});
});

//서버 실행
http.createServer(app).listen(app.get('port'), () => {
    console.log(app.get('port') + '번 포트에서 API 서버를 시작했습니다.');
});