import { h } from 'koishi';
import fetch from 'node-fetch';
import sharp from 'sharp';

/**
 * 获取图片 URL 并返回带有1px白边的图片的 HTML 标签或错误消息
 * 
 * @param apiUrl - 要获取图片的 API URL
 * @returns 一个 Promise，如果获取成功且 URL 有效，则 resolve 为带有1px白边的图片的 HTML 标签，否则为错误消息
 */
export async function getSetus(apiUrl: any): Promise<any> {
    console.log("1",apiUrl)
    try {
        const response = await fetch(apiUrl);
        console.log("2")

        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码：${response.status}`);
        }

        const data: any = await response.json();
        let imgurl: string = data['data'][0]['urls']['original'];
        console.log(imgurl);
        const isImg = await isImage(imgurl);

        if (!isImg) {
            return '唉！不好意思旅行者...可莉获取到的不是图片 只能再获取一遍了';
        } else {
            // 使用processImage函数添加1px白边
            return h.image( await processImage(imgurl)) + "旅行者可莉已经为你找到图片了!但是不可以对着图片导哦!";
        }
    } catch (error) {
        // 错误处理逻辑保持不变
        if (error instanceof TypeError && error.message.includes("Cannot read properties of undefined (reading 'urls')")) {
            return '旅行者，可莉不能给你提供这样的图片哦，请换一个关键词吧！';
        } else if (error.message.includes("request to")) {
            return '对不起...旅行者 可莉没有成功申请到图片'
        } else {
            console.log(error);
            return '唉！对不起...旅行者 可莉不小心把蹦蹦炸弹丢到代码里面了 可莉保证！下次一定不会了！' + error;
        }
    }
}

/**
 * 处理指定 URL 的图片，为其添加 1px 的白边，并将处理后的图片转换为 base64 编码的字符串
 * 如果获取图片或处理过程中出现错误，将会抛出错误
 * @param {fetch.RequestInfo} imageUrl - 要处理的图片的 URL
 * @throws {Error} 如果获取图片失败或转换过程中出现错误
 * @returns {Promise<string>} 处理后的图片的 base64 编码字符串
 */
async function processImage(imageUrl: fetch.RequestInfo): Promise<string> {
    try {
        // 首先使用 fetch 下载远程图片
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch the image');
        }
        const buffer = await response.buffer();

        // 然后使用 sharp 处理图片
        const imageWithBorder = sharp(buffer)
            .extend({
                top: 1,
                bottom: 1,
                left: 1,
                right: 1,
                background: '#fff' // 使用短横线表示白色背景
            });

        // 将处理后的图片转换为 base64 字符串
        const base64Image = await imageWithBorder.toBuffer().then(buffer => buffer.toString('base64'));
        return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error; // 根据需要重新抛出或处理错误
    }
}

/**
 * 检查给定的 URL 是否指向一个图片资源
 * @param {string} url - 要检查的 URL
 * @returns {Promise<boolean>} 如果 URL 指向一个图片资源，则 Promise 解析为 true，否则为 false
 */
async function isImage(url: string): Promise<boolean> {
    try {
        // 使用fetch API获取资源
        const response = await fetch(url);
        // 检查响应状态
        if (!response.ok) {
            return false;
        }
        // 获取MIME类型
        const contentType = response.headers.get('content-type');
        // 检查MIME类型是否为图片类型
        return contentType && contentType.startsWith('image/');
    } catch (error) {
        // 如果发生错误，返回false
        return false;
    }
}