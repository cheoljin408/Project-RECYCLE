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

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET register page. */
router.get('/register', function(req, res) {

  res.render('register');
});

/* GET find page. */
router.get('/find', function(req, res) {
  res.render('find');
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

router.post('/upload', upload.single('userFile'), function(req, res) {
  //res.send('Uploaded! : '+req.file); // object를 리턴함
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  var postId = req.body.postId;

  var sql = `insert into article (category, img, local, state, title, user, price, description) values ('temp', '${req.file.path}', 'temp', 'temp', 'temp', 'temp', 9999, 'temp')`;

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

  var sql = `update article set category = '${category}', local = '${local}', state = '${state}', title = '${title}', price = ${price}, description = '${description}' where id = ${postId}`;

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


module.exports = router;
