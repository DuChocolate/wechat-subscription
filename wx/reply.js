'use strict'
var path = require('path');
var config = require('../config');
var Wechat = require('../wechat/wechat');
var menu = require('./menu');
var wechatApi = new Wechat(config.wechat);




exports.reply = async function(weixin,next){
    var message = weixin;
    wechatApi.deleteMenu().then(function(){
        console.log('---66666666----');
        return wechatApi.creatMenu(menu);
    })
    if(message.MsgType === 'event'){
        console.log('---hh---',message);
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
        }else if(message.Event === 'scancode_push'){
            console.log(message.ScanCodeInfo.ScanType);
            console.log(message.ScanCodeInfo.ScanResult);
            this.body = 'scancode_push您点击了菜单中的：' + message.EventKey;
        }else if(message.Event === 'scancode_waitmsg'){
            console.log(message.ScanCodeInfo.ScanType);
            console.log(message.ScanCodeInfo.ScanResult);
            this.body = 'scancode_waitmsg您点击了菜单中的：' + message.EventKey;
        }else if(message.Event === 'pic_sysphoto'){
            console.log(message.SendPicsInfo.PicList);
            console.log(message.SendPicsInfo.Count);
            this.body = 'pic_sysphoto您点击了菜单中的：' + message.EventKey;
        }else if(message.Event === 'pic_photo_or_album'){
            console.log(message.SendPicsInfo.PicList);
            console.log(message.SendPicsInfo.Count);
            this.body = 'pic_photo_or_album您点击了菜单中的：' + message.EventKey;
        }else if(message.Event === 'pic_weixin'){
            console.log(message.SendPicsInfo.PicList);
            console.log(message.SendPicsInfo.Count);
            this.body = 'pic_weixin您点击了菜单中的：' + message.EventKey;
        }else if(message.Event === 'location_select'){
            console.log(message.SendLocationInfo.Location_X);
            console.log(message.SendLocationInfo.Location_Y);
            console.log(message.SendLocationInfo.Scale);
            console.log(message.SendLocationInfo.Label);
            console.log(message.SendLocationInfo.Poiname);
            this.body = 'location_select您点击了菜单中的：' + message.EventKey;
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
            var data = await wechatApi.uploadMaterial('image',path.join(__dirname, '../2.jpg'));
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        }else if(content === '6'){
            var data = await wechatApi.uploadMaterial('video',path.join(__dirname, '../6.mp4'));
            reply = {
                type: 'video',
                title:'学习视频',
                description:'这只是一小段',
                mediaId: data.media_id
            }
        }else if(content === '8'){
            var data = await wechatApi.uploadMaterial('image',path.join(__dirname, '../2.jpg'),{type:'image'});
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
        }else if(content === '9'){
            var data = await wechatApi.uploadMaterial('video',path.join(__dirname, '../6.mp4'),{type:'video', description: '{"title":"标题","introduction":"非常洋气的描述"}'});
            reply = {
                type: 'video',
                title:'学习视频',
                description:'这只是一小段',
                mediaId: data.media_id
            }
        }else if(content === '10'){
            var picData = await wechatApi.uploadMaterial('image',path.join(__dirname, '../2.jpg'),{});
            var media = {
                articles: [{
                    title: 'tututuut',
                    thumb_media_id: picData.media_id,
                    author: 'dudu',
                    digest: '摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'https://github.com'
                },{
                    title: 'tututuut2222',
                    thumb_media_id: picData.media_id,
                    author: 'dudu',
                    digest: '摘要222',
                    show_cover_pic: 1,
                    content: '没有内容2222',
                    content_source_url: 'https://github.com'
                },{
                    title: 'tututuut3333',
                    thumb_media_id: picData.media_id,
                    author: 'dudu',
                    digest: '摘要333',
                    show_cover_pic: 1,
                    content: '没有内容333',
                    content_source_url: 'https://github.com'
                }]
            }
            var data = await wechatApi.uploadMaterial('news', media, {});
            
            data = await wechatApi.fetchdMaterial(data.media_id,'news',{});
            console.log('---hh---',data);
            var items = data.news_item;
            var news = [];
            items.forEach(function(item){
                news.push({
                    title: item.title,
                    description: item.digest,
                    picUrl: picData.url,
                    url: item.url
                })
            });
            reply = news;
        }else if(content === '11'){
            var count = await wechatApi.countMaterial();
            console.log(JSON.stringify(count));
            var list = await wechatApi.batchMaterial({type:'image',offset:0,count:10});
            // var result = await [
            //     wechatApi.batchMaterial({type:'image',offset:0,count:10}),
            //     wechatApi.batchMaterial({type:'video',offset:0,count:10}),
            //     wechatApi.batchMaterial({type:'news',offset:0,count:10}),
            //     wechatApi.batchMaterial({type:'voice',offset:0,count:10})
            // ];
            console.log(list);
            reply = '1';
        }else if(content === '12'){
            var result2 = await wechatApi.deleteGroup(101);
            var group6 = await wechatApi.fetchGroup();
            console.log('----移动后的所有分组--', group6);


            // var group = await wechatApi.createGroup('wechatgroupName1');
            // console.log('----gg--',group);
            // var groups = await wechatApi.fetchGroup();
            // console.log('----加了分组--', groups);
            // var group2 = await wechatApi.checkGroup(message.FromUserName);
            // console.log('----查看自己的分组--', group2);
            // var group3 = await wechatApi.moveGroup(message.FromUserName,100);
            // console.log('----移动到100--', group3);
            
            // var group5 = await wechatApi.moveGroup([message.FromUserName],2);
            // console.log('----批量移动到2--', group5);
            // var group6 = await wechatApi.fetchGroup();
            // console.log('----批量移动后的所有分组--', group6);
            // var result = await wechatApi.updateGroup(100,'新分组名字');
            // console.log('----修改分组名字--', result);
            // var group7 = await wechatApi.fetchGroup();
            // console.log('----修改分组名后的所有分组--', group7);
            reply = 'Group done';
        }else if(content === '13'){
            var user = await wechatApi.fetchUsers(message.FromUserName);
            console.log('----用户信息--', user);
            var userList = await wechatApi.fetchUsers([{openid: message.FromUserName,lang:'en'}]);
            console.log('----用户信息列表--', userList);
            reply = JSON.stringify(user);
        }else if(content === '14'){
            var userlist = await wechatApi.listUsers();
            console.log('----用户列表----', userlist);
            reply = userlist.total;
        }
        this.body = reply;
    }
    await next;
}