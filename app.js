'use strict';
var Koa = require('koa');
var wechat = require('./wechat/g');
var config = require('./config');
var reply = require('./wx/reply');
// 注意：引入的方式
const router = require('koa-router')();
const views = require('koa-views');
var crypto = require('crypto');
var WechatApi = require('./wechat/wechat');

var app = new Koa();
// 配置模版引擎中间件
// 如果这样配置不修改html后缀g改成ejs
app.use(views('views',{extension:'ejs'}));

var ejs = require('ejs');
// var heredoc = require('heredoc');
// var tpl = heredoc(function(){/*
//     <!DOCTYPE html>
//     <html>
//         <head>
//             <title>猜电影</title>
//             <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1">
//         </head>
//         <body>
//             <h1>点击标题，开始录音翻译</h1>
//             <p id="title"></p>
//             <div id="poster"></div>
//             <script src="http://www.zeptojs.cn/skin/zepto-docs.min.js"></script>
//             <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
//         </body>
//     </html>
// */})

var createNonce = function(){
    return Math.random().toString(36).substr(2,15);
}
var createTimestamp = function(){
    return parseInt(new Date().getTime() / 1000, 10) + '';
}
var _sign = function(noncestr, ticket, timestamp, url){
    var params = [
        'noncestr=' + noncestr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ];
    var str = params.sort().join('&');
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
}
function sign(ticket, url){
    var noncestr = createNonce();
    var timestamp = createTimestamp();
    var signature = _sign(noncestr,ticket,timestamp,url);
    return{
        noncestr:noncestr,
        timestamp:timestamp,
        signature:signature
    };
}
router.get('/movie',async (ctx,next)=>{
    var wechatApi = new WechatApi(config.wechat);
    var data = await wechatApi.fetchAccessToken();
    var access_token = data.access_token;
    var ticketData = await wechatApi.fetchTicket(access_token);
    var ticket = ticketData.ticket;
    var url = ctx.request.url;
    var params = sign(ticket, url);
    console.log('-------',params);
    await ctx.render('index',params);
});

// 作用:启动路由
app.use(router.routes());
// app.use(async function (ctx, next){
//     await next();
//     console.log('--11111----',ctx.request.url,ctx.request.url.indexOf('/movie')>-1);
//     if(ctx.request.url.indexOf('/movie')>-1){
//         ctx.body = ejs.render('index',{});
//         return next;
//     }
// });
app.use(wechat(config.wechat,reply.reply));
app.listen(3001);
console.log('Listening 3001.....');