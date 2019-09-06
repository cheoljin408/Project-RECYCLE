var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();
var mysql = require('mysql');
//multer setting
var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/images/uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname);
    }
  })
});

//MySQL
var con = mysql.createConnection({
  host: '54.180.112.25',
  user: 'lwj',
  password: '12345678Oyr!',
  port: 3306,
  database: 'recycle'
});

con.connect(function(err) {
  if (err) {
    console.log(con.host);
    throw err;
  }
  console.log('Connected!');
});

//session check
router.post('/sessionchecker', function (req, res){
  //console.log('sessioncheck POST:::::::::::');
  //console.log(req.session);
  if (req.session.userID){
    console.log(req.session.userID);
    res.send(true);
  }
  else {
    res.send(false);
    console.log(req.session.userID);
  }
});

router.post('/userID', function (req, res){
  res.send(req.session);
});

//login
router.post('/auth', function (req, res){
  var userID = req.body.userID;
  var userPW = req.body.userPW;
  var sql = `SELECT password FROM member WHERE id = '${userID}'`;

  //console.log('login post');
  //console.log('**********************************');

  con.query(sql, function(err, result, fields){
    
    if (err){
      console.log(err);
      throw err;
    }
    
    else if (!result[0]) { // id 존재 X
      res.send('ID');
    } 
    else {
      //console.log(result[0]['password']);
      if (result[0]['password'] === userPW){
        res.send('OK');
      } else {
        res.send('PW');
      }
    }
  });
});

router.post('/login', function(req, res){
  var userID = req.body.userID;
  var userEmail = 'default';
  var userPhone = 'default';
  var sql = `SELECT * FROM member WHERE id = '${userID}'`;

  con.query(sql, function(err, result, fields){
    if (err){
      console.log(err);
      throw err;
    } else {
      //console.log(result[0]);
      req.session.userID = userID;
      req.session.userEmail = result[0]['email'];
      req.session.userPhone = result[0]['phoneNum'];
      res.redirect('/find');
    }
  });
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET register page. */
router.get('/register', function (req, res) {
  res.render('register');
});

/* GET find page. */
router.get('/find', function(req, res) {
  res.render('find');
});

/* GET find-ex page. */
router.get('/find-ex', function (req, res) {
  console.log(req.query.id);
  var sql = `select * from article where id=${req.query.id}`;

  con.query(sql, function(err, result, fields) {
    if(err) {
      throw err;
    }
    console.log(result[0]);
    res.render('find-ex', {data: result[0]});
  });

});

/* POST find page. */
router.post('/find', function(req, res) {
  console.log('테마 = ' + req.body.theme);
  console.log('지역 = ' + req.body.region);
  console.log('상태 = ' + req.body.buy);
  console.log('가격 = ' + req.body.low_price);
  console.log('page = ' + req.body.page);


  var sql = `select * from article where 1 `;

  // 판매 vs 렌탈 중 하나만 선택
  if (req.body.buy != 'ALL') {
    sql += `and (state like '${req.body.buy}') `;
  }
  if (req.body.low_price != 'ALL' && req.body.high_price != 'ALL' ) {
    sql += `and (price >= '${req.body.low_price}' and price <= '${req.body.high_price}') `;
  }

  // 테마 여러개 선택 가능
  if (req.body.theme != 'ALL') {
    // 테마 1개 선택 했을 때
    if(req.body.theme.length == 1){
      sql += `and (category like '${req.body.theme[0]}') `;
    }
    // 테마 여러개 선택 했을 때
    else {
      sql += `and (category like '${req.body.theme[0]}' `;
      for(var i=1; i<req.body.theme.length; i++)
      {
        sql += `or category like '${req.body.theme[i]}') `;
      }
    }
  }
  // 지역 여러개 선택가능
  if (req.body.region != 'ALL') {
    if(req.body.region.length == 1){
      sql += `and (local like '${req.body.region[0]}') `;
    }
    else{
      sql += `and (local like '${req.body.region[0]}' `;
      for(var i=1; i<req.body.region.length; i++)
      {
        sql += `or local like '${req.body.region[i]}') `;
      }
    }

  }
  sql+= `limit ${req.body.page}, 10`;

  console.log(sql);
  con.query(sql, function(err, result, fields) {
    if (err) {
      throw err;
    }
    console.log(result);
    res.send(result);
  });
});

router.post('/find/category', function(req, res) {
  console.log('요청값 = ' + req.body.buy);
  res.redirect('/find');
});

/* GET signup page. */
router.get('/signup', function(req, res) {
  res.render('signup');
});

/* GET mypage page. */
router.get('/mypage', function(req, res){
  res.render('mypage');
});

/* GET profileEdit page. */
router.get('/profile/edit', function(req, res){
  res.render('profileEdit');
})

/* GET passwordChange page */
router.get('/profile/password/change', function(req, res){
  res.render('pwChange');
})

router.post('/upload', upload.single('userFile'), function(req, res){
  //res.send('Uploaded! : '+req.file); // object를 리턴함
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  var postId = req.body.postId;
  var filepath = req.file.path.substring(6, req.file.path.length);

  var sql = `insert into article (category, img, local, state, title, user, price, description) values ('temp', '${filepath}', 'temp', 'temp', 'temp', 'temp', 9999, 'temp')`;

  con.query(sql, function(err, result) {
    if (err) {
      throw err;
    } else {
      console.log('1 record inserted');
      console.log(result.insertId);
      res.send({
        id: result.insertId
      });
    }
  });
});

router.post('/info', (req, res) => {
  var postId = req.body.postId;
  var category = req.body.category;
  var local = req.body.local;
  var state = req.body.state;
  var title = req.body.title;
  var price = req.body.price;
  var description = req.body.description;

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  var ymd = yyyy+'-'+mm+'-'+dd;

  var sql =`update article set category = '${category}', local = '${local}', state = '${state}', title = '${title}', user = '${req.session.userID}', price = ${price}, description = '${description}', time = '${ymd}' where id = ${postId}`;

  console.log(sql);

  con.query(sql, function(err, reault) {
    if (err) {
      throw err;
    } else {
      res.redirect('/register');
      console.log('1 record inserted');
    }
  });
});

router.post('/insertHashtag', (req, res) => {
  console.log(req.body.postid);
  console.log(req.body.hashtag);

  var postid = req.body.postid;
  var tagarr = req.body.hashtag;

  var tags = ['null', 'null', 'null', 'null', 'null'];

  for(var i=0; i<tagarr.length; i++)
  {
    tags[i] = tagarr[i];
  }

  var sql = `insert into hashtag (postid, tag1, tag2, tag3, tag4, tag5) values (${postid}, '${tags[0]}', '${tags[1]}', '${tags[2]}', '${tags[3]}', '${tags[4]}')`;

  con.query(sql, function (err, result) {
    if (err) {
      throw err;
    }
    else {
      console.log('tag record inserted');
    }
  });
});

router.post('/signup', (req, res) => {
  var id = req.body.id;
  var pw = req.body.pw;
  var email = req.body.email;
  var phoneNum = req.body.phoneNum;

  var sql = `insert into member (id, password, email, phoneNum) values ('${id}', '${pw}', '${email}', '${phoneNum}')`;

  con.query(sql, function(err, result) {
    if(err)
    {
      console.log(err);
      if (err.code = "ER_DUP_ENTRY") {
        res.send("<script>alert('아이디가 중복됩니다.');</script>");
        res.redirect('/signup');
      }
    }
    else
    {
      res.redirect('/');
    }
  });
});

router.post('/idcheck', (req, res) => {
  var userid = req.body.userid;
  console.log(userid);

  var sql = `select count(*) from member where id='${userid}'`;
  var check;

  console.log(userid);

  con.query(sql, function(err, result) {
    if(err)
    {
      throw err;
    }
    else
    {
      console.log(result);
      res.send(result);
    }
  });
});

router.post('/profile/edit', function(req, res){
  var id = req.body.userID;
  var email = req.body.userEmail;
  var phone = req.body.userPhone;
  var address = req.body.userAddress;

  var sql = `UPDATE member SET email = '${email}', phoneNum = '${phone}' WHERE id= '${id}'`;

  con.query(sql, function(err, result){
    if(err){
      throw err;
    } else {
      //console.log('changed!!');
      req.session.userID = id;
      req.session.userEmail = email;
      req.session.userPhone = phone;
      res.redirect('/profile/edit');
    }
  })
});

router.post('/profile/password/change', function(req, res){
  var id = req.body.userID;
  var pw = req.body.newPW;

  var sql = `UPDATE member SET password = '${pw}' WHERE id = '${id}'`;

  con.query(sql, function(err, result){
    if (err){
      throw err;
    } else  {
      //console.log('changed!!');
      res.redirect('/mypage');
    }
  })
});

router.post('/getHashtag', (req, res) => {
  var postid = req.body.postid;

  var sql = `select * from hashtag where postid='${postid}'`;

  console.log(sql);
  con.query(sql, function(err, result) {
    if(err)
    {
      throw err;
    }
    else
    {
      console.log(result[0]);
      res.send(result[0]);
    }
  });
});

router.post('/getTime', (req, res) => {
  var postid = req.body.postid;

  var sql = `select time from article where id='${postid}'`;

  console.log(sql);
  con.query(sql, function(err, result) {
    if(err)
    {
      throw err;
    }
    else
    {
      console.log(result[0]);
      res.send(result[0]);
    }
  });
});


router.post('/myArticle', function(req, res){
  var user = req.body.user;

  var sql = `SELECT * FROM article WHERE user='${user}'`;
  console.log(sql);
  con.query(sql, function(err, result, fields){
    if (err){
      throw err;
    } else if (!result[0]){
      console.log('null');
      res.send("null");
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// router.post('/register', (req, res) => {

module.exports = router;
