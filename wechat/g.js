'use strict'
var sha1 = require('sha1');
var gerRawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');



module.exports = function(opts) {
    // var wechat = new Wechat(opts);
    return async function(ctx,next){
        await next();
        const query = ctx.request.query;
        var token = opts.token;
        var signature = query.signature;
        var nonce = query.nonce;
        var timestamp = query.timestamp;
        var echostr = query.echostr;
        var str = [token,timestamp,nonce].sort().join('');
        var sha = sha1(str);
        if(ctx.method ==='GET'){    //验证请求
            if(sha === signature){
                ctx.body = echostr + '';
            }else{
                ctx.body = 'wrong';
            }
        }else if(ctx.method === 'POST'){     //用户事件
            if(sha !== signature){
                ctx.body = 'wrong';
                return false;
            }
            var data = await gerRawBody(ctx.req,{
                length: ctx.request.length,
                limit:'1mb',
                encoding: ctx.request.charset || 'utf-8'
            });
            var content = await util.parseXMLAsync(data);
            var message = util.formatMessage(content.xml);
            console.log('---mm--',message);
            if(message.MsgType === 'event'){
                if(message.Event === 'subscribe'){
                    var now = new Date().getTime();
                    ctx.status = 200;
                    ctx.type = 'application/xml';
                    ctx.body = '<xml>' +
                        '<ToUserName><![CDATA[' + message.FromUserName+ ']]></ToUserName>' +
                        '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' +
                        '<CreateTime>' + now + '</CreateTime>' +
                        '<MsgType><![CDATA[text]]></MsgType>' +
                        '<Content><![CDATA[你好，你是大美女]]></Content>' +
                        // '<MsgId>1234567890123456</MsgId>' +
                    '</xml>';
                    return;
                }
            }

        }
    }
}