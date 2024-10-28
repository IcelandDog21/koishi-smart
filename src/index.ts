import { Context, Extend, Schema, Session } from 'koishi';
import { h } from 'koishi';
import { getSetus } from './imgGet';
import { ChatAI, KimiAI } from './AI-Chat';
import { langSynthesis } from './langSynthesis';

export const name = 'smart';

export interface Config { }

export const Config: Schema<Config> = Schema.object({});

export function apply(ctx: Context) {
  const apiKey = 'UNSqu1qcTCXtLmhCINor8Ci3Mn';

    ctx.command('help', '帮助')
    .action(async () => {
      return `当前可用的指令有：
  /chat  AI对话
  /help  显示帮助信息
  /jingfeng  婧枫
  /langsynthesis  AI对话+语言合成
  /momo  沫沫
输入“/help 指令名”查看特定指令的语法和使用示例。`
    });

  // 涩图命令
  ctx.command('setu', '涩图')
    .alias('s')
    .action(async ({ args }): Promise<any> => {
      const query = args.length > 0 ? `tag=${args[0]}` : '';
      return await getSetus(`https://api.lolicon.app/setu/v2?r18=0&${query}`);
    });

  // R-18命令
  ctx.command('R-18', 'R-18')
    .alias('r18')
    .action(async ({ args }): Promise<any> => {
      const key = args[0];
      const tag = args[1];
      if (key === "Uxj,xYI.*<1C9Rpu0|ce&t&jc2qc:wxV,paVrHFdM4!rIN<0&'") {
        return await getSetus(`https://api.lolicon.app/setu/v2?r18=1&tag=${tag || ''}`);
      } else {
        return "你输入的密钥不正确";
      }
    });

  // 沫沫AI命令
  ctx.command('momo', '沫沫')
    .alias('mm')
    .action(async ({ args }): Promise<any> => {
      const query = args.join(' ');
      const responseMessage = await ChatAI(query, apiKey, `mmai/mm`);
      return `沫沫: ${responseMessage}`;
    });

  // 婧枫AI命令
  ctx.command('jingfeng', '婧枫')
    .alias('jf')
    .action(async ({ args }): Promise<any> => {
      const query = args.join(' ');
      const responseMessage = await ChatAI(query, apiKey, `jjai/jj`);
      return `婧枫: ${responseMessage}`;
    });

  // AI对话命令
  const chatCommand = ctx.command('chat', 'AI对话');
  let isChatEnabled = false;

  chatCommand.subcommand('.on', '开启AI对话')
    .action(() => {
      isChatEnabled = true;
      return '对话开始';
    });

  chatCommand.subcommand('.off', '关闭AI对话')
    .action(() => {
      isChatEnabled = false;
      return '对话结束';
    });

  let userIdArray = [];

  ctx.on('middleware', async (session: Session) => {
    const message = session.content;

    if (message === '/chat on' || message === 'chat on') {
      userIdArray.push(session.userId);
      return;
    }

    if (message === '/chat off' || message === 'chat off') {
      userIdArray = [];
      return;
    }

    if (isChatEnabled && userIdArray.includes(session.userId)) {
      console.log(message);
      const responseMessage = await KimiAI(message, true);
      if (responseMessage === undefined) {
        session.send('请等待上一个请求');
      } else {
        session.send(responseMessage);
      }
    }
  }, true);

  const LangSynthesis = ctx.command('LangSynthesis', 'AI对话+语言合成')
  .alias('ls');

  LangSynthesis.subcommand('.sxlist', '角色列表')
    .action(() => {
      const msg = "人物列表: 丁真,AD学姐,赛马娘,黑手,蔡徐坤,孙笑川,邓紫棋,东雪莲,塔菲,央视配音,流萤,郭德纲,雷军,周杰伦,懒洋洋,女大学生,烧姐姐,麦克阿瑟,马老师,孙悟空,海绵宝宝,光头强,陈泽,村民,猪猪侠,猪八戒,薛之谦,大司马,刘华强,特朗普,满穗,桑帛,李云龙,卢本伟,pdd,tvb,王者语音播报,爱莉希雅,岳山,妖刀姬,少萝宝宝,天海,王者耀,蜡笔小新,琪,茉莉,蔚蓝档案桃井,胡桃,磊哥游戏,洛天依,派大星,章鱼哥,蔚蓝档案爱丽丝,阿梓,科比,于谦老师,嘉然,乃琳,向晚,优优,茶总,小然,夯大力,奶龙,fufu大王,妤萌,胖猫";
      return msg;
    });

    LangSynthesis.subcommand('.help', '帮助')
    .action(() => {
      return `ls mm <文字>
ls jf <文字>
ls sx <人物(具体看ls sxlist)> <文字> <on/off(是否启用愿神的人物 注:这里的人物和ls sxlist的无关)> 
`});

  LangSynthesis.subcommand('.mm', '沫沫语言合成')
    .action(({ args }) => {
      return langSynthesis('流萤', args[0], true, `mmai/mm`);
    });

  LangSynthesis.subcommand('.jf', '婧枫语言合成')
    .action(({ args }) => {
      return langSynthesis('烧姐姐', args[0],true, `jjai/jj`);
    });

  LangSynthesis.subcommand('.sx', '语言合成')
    .action(({ args }) => {
      let yuanshen: boolean = false;
      if (args[2] == 'on') { yuanshen = true } else if (args[2] == 'off') yuanshen = false;
      return langSynthesis(args[0], args[1], yuanshen); // 第一个参数是人物 第二个参数是内容 第三个是是否开启原神版语言合成
    });



  // 随机音乐命令
  ctx.command('music', '随机音乐')
    .alias('m')
    .action(async (): Promise<any> => {
      const musicList = [
        ["鸡你太美", "http://music.163.com/song/media/outer/url?id=1340439829.mp3"],
        ["大香蕉", "http://music.163.com/song/media/outer/url?id=2153987896.mp3"],
        ["打上花火", "http://music.163.com/song/media/outer/url?id=496869422.mp3"],
        ["原神-风与牧歌之城", "https://trackmedia-70856.gzc.vod.tencent-cloud.com/M500002rzsQN0TWfS5.mp3?sign=q-sign-algorithm%3Dsha1%26q-ak%3D4fHArEE8trlnFFvFWyWaemhO%26q-sign-time%3D1724290323%3B1724895123%26q-key-time%3D1724290323%3B1724895123%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D5dec842103d40865e3708589d770288ab421647e"],
        ["七天神像", "http://lu.sycdn.kuwo.cn/a86f2b811bff1cb0238ba15d4ab7e50d/66c69527/resource/n3/17/92/4164954257.mp3"]
      ];
      const randomIndex = Math.floor(Math.random() * musicList.length);
      const [title, url] = musicList[randomIndex];
      return `好的正在给你搞${h.audio(url)}好的旅行者下面来欣赏 ${title} 吧`;
    });
}