var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();

//multer setting
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname);
    }
  })
});

//MySQL
var mysql = require('mysql');
var con = mysql.createConnection({
  host: '54.180.112.25',
  user: 'lwj',
  password: '12345678Oyr!',
  port: 3306,
  database: 'recycle'
});

con.connect(function (err) {
  if (err) {
    console.log(con.host);
    throw err;
  }
  console.log('Connected!');
});

//session check
router.post('/sessionchecker', function (req, res){
  if (req.session.userid){
    res.send(true);
  }
  else {
    res.send(false);
  }
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

/* GET register page. */
router.get('/register', function (req, res) {
  res.render('register');
});

/* GET find page. */
router.get('/find', function (req, res) {
  res.render('find');
});

/* POST find page. */
router.post('/find', function (req, res) {
  var sql = "select * from article where category not like '가구'";

  con.query(sql, function(err, result, fields) {
    if(err) {
      throw err;
    }
    console.log(result);
    res.send(result);
  });
});


/* GET signup page. */
router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/upload', upload.single('userFile'), function(req, res){
  //res.send('Uploaded! : '+req.file); // object를 리턴함
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  var postId = req.body.postId;

  var sql = `insert into article (category, img, local, state, title, user, price, description) values ('temp', '${req.file.path}', 'temp', 'temp', 'temp', 'temp', 9999, 'temp')`;

  con.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    else {
      console.log('1 record inserted');
      console.log(result.insertId);
      res.send({id:result.insertId});
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

  var sql =`update article set category = '${category}', local = '${local}', state = '${state}', title = '${title}', price = ${price}, description = '${description}' where id = ${postId}`;

  console.log(sql);

  con.query(sql, function (err, reault) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/register');
      console.log('1 record inserted');
    }
  });
});


module.exports = router;
