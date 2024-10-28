import { h } from 'koishi';
import { ChatAI, KimiAI } from './AI-Chat';

const apiKey = 'UNSqu1qcTCXtLmhCINor8Ci3Mn';

export async function langSynthesis(sx: string, msg: string, yuanshen: boolean, type?: string): Promise<any> {
    let messages: string | Promise<string>;

    if (type === undefined) {
        messages = await KimiAI(msg, false);
    } else {
        let message = await ChatAI(msg, apiKey, type);
        if (type == 'mmai/mm') {
            messages = message.replace(/\([^)]*\)/g, '');
        } else {
            messages = message;
        }
    }


    const apiUrl = yuanshen ? `https://api.lolimi.cn/API/yyhc/api.php?msg=${await messages}&sp=${sx}` :
        `https://api.lolimi.cn/API/yyhc/y.php?msg=${await messages}&name=${sx}`;

    console.log('1')
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码：${response.status}`);
        }
        console.log('2')
        const data: any = await response.json();
        console.log(data,yuanshen ? data['mp3'] : data['url'])
        return h.audio(yuanshen ? data['mp3'] : data['url']);
    } catch (error) {
        return error;
    }
}