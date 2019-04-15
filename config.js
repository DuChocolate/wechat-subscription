var path = require('path');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');
var wechat_ticket_file = path.join(__dirname, './config/wechat_ticket.txt')
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
        },
        getTicket: function(){
            return util.readFileAsync(wechat_ticket_file);
        },
        saveTicket: function(data){
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_ticket_file,data);
        }
    }
}
module.exports = config;