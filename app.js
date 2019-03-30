'use strict';
var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');

var config = {
    wechat: {
        appID: 'wx11b2246e364f6349',
        appSecret: '624e23cf327465457eb36314d90f4901',
        token: 'yHzH5SwW7YMetaIQjo5e2uF17',
        getAccessToken: function(){
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        }
    }
}
var app = new Koa();
app.use(wechat(config.wechat));
app.listen(3001);
console.log('Listening 3001.....');