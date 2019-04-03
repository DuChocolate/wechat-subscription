'use strict'
var config = require('./config');
var Wechat = require('./wechat/wechat');
var wechatApi = new Wechat(config.wechat);
exports.reply = async function(weixin,next){
    var message = weixin;
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            if(message.EventKey){
                console.log('扫二维码进来：' + message.EventKey + ' ' + message.ticket);
            }
            this.body = '哈哈，你订阅了这个号';
        }else if(message.Event === 'unsubscribe'){
            console.log('无情取关');
            this.body = '';
        }else if(message.Event === 'LOCATION'){
            this.body = '您上报的位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        }else if(message.Event === 'CLICK'){
            this.body = '您点击了菜单：' + message.EventKey;
        }else if(message.Event === 'SCAN'){
            console.log('关注后扫二维码' + message.EventKey + '' + message.Ticket);
            this.body = '看到你扫了一下哦';
        }else if(message.Event === 'VIEW'){
            this.body = '您点击了菜单中的链接：' + message.EventKey;
        }
    }else if(message.MsgType === 'text'){
        var content = message.Content;
        var reply = '额，你说的' + message.Content + '太复杂了';
        if(content === '1'){
            reply = '天下第一大美女';
        }else if(content === '2'){
            reply = '天下第二大才子';
        }else if(content === '3'){
            reply = '天下第三大傻蛋';
        }else if(content === '4'){
            reply = [{
                title: '技术改变世界',
                description: '这里是描述，哈哈哈，被骗了',
                picUrl: 'http://pic31.nipic.com/20130730/2737196_121646788000_2.jpg',
                url: 'www.baidu.com'
            },{
                title: '大千世界风景美好',
                description: '这里是描述，哈哈哈，第二个被骗了',
                picUrl: 'http://img17.3lian.com/d/file/201703/07/693c362c5ade8d3b629996d253eb842f.jpg',
                url: 'https://github.com/'
            }]
        }else if(content === '5'){
            var data = await wechatApi.uploadMaterial('image',__dirname + '/2.jpg');
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        }else if(content === '6'){
            var data = await wechatApi.uploadMaterial('video',__dirname + '/6.mp4');
            reply = {
                type: 'video',
                title:'学习视频',
                description:'这只是一小段',
                mediaId: data.media_id
            }
        }else if(content === '8'){
            var data = await wechatApi.uploadMaterial('image',__dirname + '/2.jpg',{type:'image'});
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        }else if(content === '9'){
            var data = await wechatApi.uploadMaterial('video',__dirname + '/6.mp4',{type:'video', description: '{"title":"标题","introduction":"非常洋气的描述"}'});
            console.log('------ff---',data);
            reply = {
                type: 'video',
                title:'学习视频',
                description:'这只是一小段',
                mediaId: data.media_id
            }
        }
        this.body = reply;
    }
    await next;
}