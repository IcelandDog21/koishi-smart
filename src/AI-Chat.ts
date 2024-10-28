//jQuery-Ajax

import OpenAI from "openai";

/**
 * 向指定的API发送消息并获取响应
 *
 * @param {string} msg - 要发送的消息
 * @param {string} key - API密钥
 * @param {string} type - API类型
 * @returns {Promise<string>} - 解析后的响应数据中的output字段
 * @throws {Error} - 如果HTTP请求失败
 */
export async function ChatAI(msg: string, key: string, type: string): Promise<string> {
    const apiUrl = `https://apii.lolimi.cn/api/${type}?key=${key}&msg=${msg}&type=json`;

    console.log('1')
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码：${response.status}`);
        }
        console.log('2')
        const data: any = await response.json();

        console.log(data['data']['output'])
        return data['data']['output'];
    } catch (error) {
        return error;
    }
}

const client = new OpenAI({// 创建一个ai对象
    apiKey: "sk-QsKtJ8n04PPxpDhLU6j1roZPr5324l1qnvaMFAv62wfpNyuZ", // 秘钥
    baseURL: "https://api.moonshot.cn/v1", // URL
});

/**
 * 定义一个名为 KimiAI 的异步函数来处理用户的问题
 *
 * @param {string} question - 一个需要回答的问题
 * @returns {Promise<string>} - 一个 Promise，解析后包含回答的内容
 */
export async function KimiAI(question: string, personality: boolean): Promise<string> {
    const completion = client.chat.completions.create({
        model: "moonshot-v1-8k", // 指定模型
        messages: [{ // 消息列表
            role: "system", // 消息级别：系统
            content: personality ? "你是原神内的可莉 请用原神内可莉的语气回答问题" : "人设" // 这里填系统级别的消息
        }, {
            role: "user", // 用户级
            content: question
        }],
        temperature: 0.3 // 相关性
    });
    let msg: string | null = '';

    await completion.then(data => {
        msg = data.choices[0].message.content
    }).catch(err => {
        msg = '对话请求过快 请等待一会再试';
    });

    console.log(msg);
    return msg;
}