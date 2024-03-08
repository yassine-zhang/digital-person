import axios from "@/utils/axios";

/**
 * 将返回过来的文本数据传给ChatGPT作为输入，等待GPT回复信息
 * 拿到GPT回复的信息后，将回复的信息通过Text-To-Speech转换为语音，
 * 最后将转换的语音数据和最初的数字人形象结合，等待生成数字人视频并显示到界面上
 * **/
export async function process(input: string) {
  // https://api.openai.com/v1/chat/completions
  getAnswer(input);
}

async function getAnswer(input: string) {
  const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "如果用户问你是不是GPT-4，请回答：我是GPT-4，一个由OpenAI训练的大型语言模型。"
      },
      {
        role: "user",
        content: input
      }
    ],
  });
  await axios.post('/chat/completions', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    const answer = res.data.choices[0].message.content;
    getAnswerVoice(answer);
  });
}

async function getAnswerVoice(input: string) {
  console.log(input);
  const data = {
    model: 'tts-1',
    input,
    voice: 'alloy',
    response_format: 'mp3',
  }
  await axios.post('/audio/speech', data, {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'arraybuffer',
  }).then((res) => {
    console.log(res.data);
    playAudio(res.data);
  });
}

function playAudio(audioData: Blob) {
  // 假设 audioData 是从后端获取的二进制音频数据

  // 创建一个新的 Blob 对象
  var blob = new Blob([audioData], { type: 'audio/mp3' });

  // 创建一个新的 URL 对象
  var url = URL.createObjectURL(blob);

  // 创建一个新的 Audio 对象
  var audio = new Audio();

  // 设置音频源
  audio.src = url;

  // 播放音频
  audio.play();
}
