import config from 'config'
import fetch from 'node-fetch'


const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = config.get('token');
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {webHook:{
	port:8443
}});
const url=config.get('url');
bot.setWebHook(url+'/bot'+token);

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/price\s./, (msg) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
	let chatId = msg.chat.id;
    let array_string=msg.text.toString().toLowerCase().split(" ");
    let clear_string=array_string.slice(1);
    let item=clear_string.join(" ");
    let counter=[];
    let url_total = config.get('url_total')

    fetch(url_total)
        .then(
            (response) => response.json()
        )
        .then(
            (response) =>{
                response.map((index)=>{
                    if (index.title.toString().toLowerCase().includes(item)) {
                        bot.sendMessage(chatId,"Стоимость ->  "+ index.title+"  :  "+index.price);
                        counter.push(index);
                    }
                });
                if (counter.length===0) {
                    bot.sendMessage(chatId,"Я не нашел такой позиции...");
                }
            }
        );
});

bot.onText(/\/help/, (msg) => {
  
  bot.sendMessage(msg.chat.id, "Перечень доступных команд:\n\n/contacts - Наши контакты\n\n/sites - адреса наших сайтов\n\n/getprice - получить Excel прайс\n\n/showcommonprice - паказать прайс на общие металлы\n\n/showrareprice - показать прайс на редкоземельные металлы\n\n/showelectrprice - показать прайс на электронный лом\n\n/showcatolprice - показать прайс на электронный лом\n\n/map - мы на карте\n\n/price [название] - получить цену на интересующую позицию");
      
  });

bot.onText(/\/start/, (msg) => {
  
    bot.sendMessage(msg.chat.id, "Здравствуйте!\nЯ помогу вам получить информацию о работе компании ООО ВеКо.\n Вы можете воспользоваться следующими командами:\n\n/contacts - Наши контакты\n\n/sites - адреса наших сайтов\n\n/getprice - получить прайс\n\n/showcommonprice - паказать прайс на общие металлы\n\n/showrareprice - показать прайс на редкоземельные металлы\n\n/showelectrprice - показать прайс на электронный лом\n\n/showcatolprice - показать прайс на электронный лом\n\n/map - мы на карте\n\n/price [название] - получить цену на интересующую позицию\n Или вы можете задать мне некоторые вопросы. Но не забывайте, что я просто ...бот..");
        
    });

bot.onText(/\/map/, (msg) => {
  bot.sendLocation(msg.chat.id,55.775706, 38.450638);
  bot.sendMessage(msg.chat.id, "Мы находимся тут");
        
    });

bot.onText(/\/sites/, (msg) => {
    bot.sendMessage(msg.chat.id, "www.vekomet.ru - покупка лома цветных и редкоземельных металлов\n\nwww.vekolom.ru - покупка электронного лома\n\nwww.vekokat.ru - покупка автоиобильных катализаторов");

});

bot.onText(/\/getprice/, (msg) => {
  bot.sendDocument(msg.chat.id,config.get('price_url'));
    });

bot.onText(/\/showcommonprice/, (msg) => {
    let chatId = msg.chat.id;
    let url_common = config.get('api_url_common');
    fetch(url_common)
        .then(
            (response) => response.json()
        )
        .then(
            (array) =>{
                let group=[];
                let group_object ={};
                for (let item in array) {
                    let group=array[item].group;
                    if (group_object[array[item].group]) {
                        group_object[array[item].group].push(array[item])
                    }
                    else {
                        group_object[array[item].group] = [array[item]]
                    }

                }
                for (let key in group_object) {
                    group[key]=group_object[key];
                }
                let notEmptyGroup=group.filter(function(x){
                    return (x !== (undefined || null || ''));
                });
                let table=[];
                let final_array=notEmptyGroup.map((index)=>{
                    index.map((item)=>{
                        table.push(item.title+"   "+item.price+"\n")
                    })
                });
                let table_string=table.join(" ");
                bot.sendMessage(chatId, table_string);
            }
        );
});

bot.onText(/\/showrareprice/, (msg) => {
    let chatId = msg.chat.id;
    let url_rare=config.get('api_url_rare');
    fetch(url_rare)
        .then(
            (response) => response.json()
        )
        .then(
            (array) =>{
                let group=[];
                let group_object ={};
                for (let item in array) {
                    let group=array[item].group;
                    if (group_object[array[item].group]) {
                        group_object[array[item].group].push(array[item])
                    }
                    else {
                        group_object[array[item].group] = [array[item]]
                    }

                }
                for (let key in group_object) {
                    group[key]=group_object[key];
                }
                let notEmptyGroup=group.filter(function(x){
                    return (x !== (undefined || null || ''));
                });
                let table=[];
                let final_array=notEmptyGroup.map((index)=>{
                    index.map((item)=>{
                        table.push(item.title+"   "+item.price+"\n")
                    })
                });
                let table_string=table.join(" ");
                bot.sendMessage(chatId, table_string);
            }
        );
});


bot.onText(/\/showelectrprice/, (msg) => {
    let chatId = msg.chat.id;
    let url_pos = config.get('api_url_pos');
    fetch(url_pos)
        .then(
            (response) => response.json()
        )
        .then(
            (array) =>{
                let order=[];
                let order_object ={};
                for (let item in array) {
                    let order=array[item].order;
                    if (order_object[array[item].order]) {
                        order_object[array[item].order].push(array[item])
                    }
                    else {
                        order_object[array[item].order] = [array[item]]
                    }

                }
                for (let key in order_object) {
                    order[key]=order_object[key];
                }
                let notEmptyGroup=order.filter(function(x){
                    return (x !== (undefined || null || ''));
                });
                let table=[];
                let final_array=notEmptyGroup.map((index)=>{
                    index.map((item)=>{
                        table.push(item.name+"   "+item.price+"\n")
                    })
                });
                let table_string=table.join(" ");
                bot.sendMessage(chatId, table_string);
            }
        );
});

bot.onText(/\/showcatolprice/, (msg) => {
    let chatId = msg.chat.id;
    let url_catol=config.get('api_url_catol');
    fetch(url_catol)
        .then(
            (response) => response.json()
        ).then((data)=>{
        const table=[];
        data.map((item)=>{
            table.push(item.title+"   "+item.price+"\n")
        });
        let table_string=table.join(" ");
        bot.sendMessage(chatId, table_string);
    })

});

bot.onText(/\/contacts/, (msg) => {
  bot.sendMessage(msg.chat.id,"адрес: Московская область\nгород Электросталь\nулица Пионерская д.22\nтелефоны:+7(499)499-84-74\n+7(917)599-52-22\nпочта: vekomet@gmail.com");   
    });

bot.on('message', (msg) => {

    let hi = "привет";
    if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
    bot.sendMessage(msg.chat.id,"Привет,"+ msg.from.first_name);
    }
    let sites = "сайт";
    if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
        bot.sendMessage(msg.chat.id,"www.vekomet.ru - покупка лома цветных и редкоземельных металлов\n\nwww.vekolom.ru - покупка электронного лома\n\nwww.vekokat.ru - покупка автоиобильных катализаторов");
    }

    let bye = "пока";
    if (msg.text.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(msg.chat.id, "До свидания,"+ msg.from.first_name+" "+"надеюсь увидеть вас снова!");
    } 

    let loc = "местоположение";
    if (msg.text.toString().toLowerCase().includes(loc)) {
        bot.sendLocation(msg.chat.id,55.775706, 38.450638);
        bot.sendMessage(msg.chat.id, "Мы находимся тут");
      } 
    let where="где вы";
    if (msg.text.toString().toLowerCase().includes(where)) {
          bot.sendLocation(msg.chat.id,55.775706, 38.450638);
          bot.sendMessage(msg.chat.id, "Мы находимся тут");
      } 
    let where_var="находитесь";
    if (msg.text.toString().toLowerCase().includes(where_var)) {
            bot.sendLocation(msg.chat.id,55.775706, 38.450638);
            bot.sendMessage(msg.chat.id, "Мы находимся тут");
      }
    
    let contacts="контакты";
    if (msg.text.toString().toLowerCase().includes(contacts)) {
      bot.sendMessage(msg.chat.id,"адрес: Московская область\nгород Электросталь\nулица Пионерская д.22\nтелефоны:+7(499)499-84-74\n+7(917)599-52-22\nпочта: vekomet@gmail.com");       
        }     
    let contacts_phrase="адрес";
      if (msg.text.toString().toLowerCase().includes(contacts_phrase)) {
          bot.sendMessage(msg.chat.id,"адрес: Московская область\nгород Электросталь\nулица Пионерская д.22\nтелефоны:+7(499)499-84-74\n+7(917)599-52-22\nпочта: vekomet@gmail.com");       
        }

    });

