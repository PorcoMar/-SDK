
//const redis = require("redis");
//const redisClient = redis.createClient();

// **
// 
const express = require('express');
const path = require("path");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const querystring = require('querystring');
const url = require('url');
const cheerio = require('cheerio')


var indexjs = require("../workJS/workJS").indexTest
var callBack = require("../workJS/workJS").callBack

const REQUEST = require('../utils/request').requestList
router.get("/", authMiddleware.getCode, (req,res,next)=>{
    console.log("<------------------'/'----------------------->")
    res.sendFile(path.join(__dirname, "../views/index.html"));
})
router.get("/userList", authMiddleware.getCode, (req,res,next)=>{
    //res.send("userList");
    res.sendFile(path.join(__dirname,"../views/userList.html")) //可以改不用重新启动服务
    //res.sendFile(path.join(__dirname,"../../public/html/userList.html"))//不建议这么写，前端模版从public／index.html进入
});
// router.get("/second", authMiddleware.getCode,authMiddleware.getAccess_token, (req,res,next)=>{ //我后来发现这样写没什么必要，因为在'/'时已经获取到了所有信息并存在cookie中了
router.get("/second", authMiddleware.getCode, (req,res,next)=>{ //写authMiddleware.getCode在这里的原因是cookies失效时重新获取cookie
        console.log("<------------------'/second'----------------------->")
    console.log('--获取路径--')
    console.log(req.url)
    console.log('--获取参数（对象）--')
    console.log(req.query)
    console.log('--获取带路由和参数--')
    console.log(req.params)
    req.query.abc = 'pppppp'
    console.log(req.query)
    console.log('--获取路由当前安装的url路径--')
    console.log(req.baseUrl)
    console.log('--获取主体和cookies--')
    console.log(req.cookies) 
    console.log(req.body)

    console.log('--获取主机名/ip--')
    console.log(req.hostname)
    console.log(req.ip)

    console.log('--获取请求路径--')
    console.log(req.path)

    console.log('--获取协议路径--')
    console.log(req.protocol)

    console.log('--获取当前匹配的路由--')
    console.log(req.route)

    let result = indexjs();
    console.log("-------->|这是workJS的引用内容的结果")
    console.log(result)
    res.render('second', { name: req.cookies.nickname,list:result, cookie:req.cookies,});
})
router.get("/callBack", authMiddleware.getCode, (req,res,next)=>{
    let back = callBack()
    console.log(back)
    res.render("callBack",{name:"this is callBack",list:back})
});

router.get('/forth', authMiddleware.getCode, (req,res,next) => { //输入 ： /forth?name=porco&sex=male
    console.log('<---------------/forth-------------------->')
//*this is crypto
        crypto.randomBytes(6,(err, buf) => { //(size, callBack) => {}
            if (err) throw err;
                console.log('--------->>>>生成随机数')
                console.log(`buf.length = ${buf.length},buf.toString('hex') = ${buf.toString('hex')}`)
            })
//querystring
        console.log('--------->>>>这是测试querystring解析与格式化 URL 查询字符串')
        console.log('req.query-----'+JSON.stringify(req.query))
        console.log('req.path-----'+req.path)
        console.log('req.url-----'+req.url)
        console.log(url.parse(req.url))//如果req.url : /forth?name=porco&sex=male  则url.parse(req.url) : Url {protocol: null,slashes: null,auth: null,host: null,port: null,hostname: null,hash: null,search: '?name=porco&sex=male',query: 'name=porco&sex=male',pathname: '/forth',path: '/forth?name=porco&sex=male',href: '/forth?name=porco&sex=male' }
        console.log('参数为'+url.parse(req.url).query || '')
        let escapeStr = querystring.escape(req.url || '')
        console.log(escapeStr + '对给定的 str 进行 URL 编码。') //对给定的 str 进行 URL 编码。
        console.log(querystring.unescape(escapeStr)+ ' 对给定的 str 进行 URL 解码。')
        console.log(querystring.parse(url.parse(req.url).query)) //typeof 为object
        // console.log('不用转对象直接请求到带有数组的url中数组中的数据：'+querystring.parse(url.parse(req.url).query).abc[1])
//<<<检测cheerio cheerio是node中的jquery，精简了包含了dom
        console.log('--------->>>>检测cheerio')
        $ = cheerio.load('<h2 class="title">这是cheerio操作dom生成的字符</h2>',{decodeEntities: false});//decodeEntities:false转为中文
        $('h2.title').text('通过cheerio改变后的值，参数decodeEntities: false解决了乱码的问题');
        $('h2').addClass('welcome');
        console.log($.html())
// utility 加密
        console.log('--------->>>>utility 加密')
        const utility = require('utility')
        let name = '我是porcoMar'
        let sha1Value = utility.sha1(name) //  混淆加密
        let md5Value = utility.md5(name)    //md5加密
        console.log(`name=${name},sha1Value=${sha1Value},md5Value=${md5Value}`)
        
//render
    res.render('forth',{})
})

router.get("/getUserInfo",authMiddleware.getAccess_token, authMiddleware.getUserInfo, (req,res,next)=>{
    console.log("<------------------'/getUserInfo'----------------------->")
    console.log('----->|查询的url字符串参数 ：'+JSON.stringify(req.query));
    let back_url = req.query.back_url;
    for(let item in req.query){
        if(item !== "back_url" && item !== "code" && item !== "state"){
            back_url += `&${item}=${req.query[item]}`;
        };
    };
    console.log('---->|重新筛选路径back_url : '+back_url);
    res.redirect(back_url);
});


const crypto = require("crypto");
const sha1 = require("sha1");
const accessTokenMiddle = require("../middlewares/accessToken.middleware.js");
const weixin = require("../../config/env.config");

router.get("/weixin",accessTokenMiddle.accessToken,accessTokenMiddle.ticket,function(req,res,next){
    console.log("<------------------'/weixin'----------------------->")
    console.log('----->| req.query : '+JSON.stringify(req.query));
    crypto.randomBytes(16,function(ex,buf){
        var appId = weixin.appID;
        var noncestr = buf.toString("hex");
        var jsapi_ticket = req.query.ticket;
        var timestamp = new Date().getTime();
        timestamp = parseInt(timestamp/1000);
        var url = req.query.url;
        console.log("参数 ：");
        console.log(noncestr);
        console.log(jsapi_ticket);
        console.log(timestamp);
        console.log(url);

        var str = ["noncestr=" + noncestr, "jsapi_ticket="+jsapi_ticket, "timestamp=" + timestamp, "url=" + url].sort().join("&");
        console.log("待混淆加密的字符串 ： ");
        console.log(str);
        var signature = sha1(str);

        console.log("微信sdk签名signature ：");
        console.log(signature);

        var result = {code:0,result:{appId:appId,timestamp: timestamp,nonceStr: noncestr,signature: signature}};

        res.json(result); //res.json 等同于将一个对象或数组传到给res.send()
    });
});


// router.get("/set", (req, res, next)=>{
//     redisClient.set("username", "liuwenchao");
//     res.send("hello world");
// });

// router.get("/get", (req, res, next)=>{
//     redisClient.get("username", (err, result)=>{
//         res.send(result);
//     });
// });

module.exports = router;