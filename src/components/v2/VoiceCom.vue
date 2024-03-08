<template>
  <div class="flex flex-col justify-end items-center w-full h-full">
    <n-button
      @mousedown="handleTouchOrMouseDown"
      @touchstart="handleTouchOrMouseDown"
      @touchend="handleTouchOrMouseUp"
      @touchcancel="handleTouchOrMouseUp"
      size="large"
      strong
      round
      type="primary"
      :render-icon="renderVoiceIcon"
      class="shadow-lg">
      {{ recording ? '松开 结束' : '按住 说话' }}
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { NIcon } from 'naive-ui'
import { KeyboardVoiceFilled } from '@vicons/material'
import Recorder from 'js-audio-recorder'
import axios from '@/utils/axios'
import { useDigitalStore } from "@/stores/digital"
import { process as VoiceProcess } from "@/utils/voicePostProcess";

const recording = ref(false);
let recorder: Recorder | undefined;
const store = useDigitalStore();
function renderVoiceIcon () {
  return h(NIcon, null, {
    default: () => h(KeyboardVoiceFilled)
  })
}
function setRecording(value: boolean) {
  recording.value = value;
}

function handleTouchOrMouseDown() {
  setRecording(true);

  // 开始录制
  if (recorder === undefined) recorder = new Recorder();
  // if (recorder === undefined) return;

  recorder.start().then(
    () => {
      // 开始录音
    },
    (error) => {
      // 出错了
      console.log(`${error.name} : ${error.message}`);
    },
  );
}
async function handleTouchOrMouseUp() {
  setRecording(false);

  if (recorder === undefined) return;
  // 停止录制
  // recorder.play();
  // 创建一个 FormData 对象
  const formData = new FormData();
  formData.append("file", recorder.getWAVBlob());
  formData.append("model", "whisper-1");
  console.log(URL.createObjectURL(recorder.getWAVBlob()));

  await axios
    .post("https://aium.cc/v1/audio/transcriptions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer sk-PICS7z4404Txw5ec9792B70d40C64f1d969d900690Cd549a",
      },
    })
    .then((res) => {
      // 将自己说话的内容转换为文本后存到store中
      // 将返回过来的文本数据传给ChatGPT作为输入，等待GPT回复信息
      // 拿到GPT回复的信息后，将回复的信息通过Text-To-Speech转换为语音，
      // 最后将转换的语音数据和最初的数字人形象结合，等待生成数字人视频并显示到界面上

      const text = res.data.text;
      store.oneselfContent.push(text);
      VoiceProcess(text);
    });

  recorder.destroy().then(() => {
    recorder = undefined;
  });
}

onMounted(() => {
  // 处理当recording为true时，且当前屏幕无任何交互时将其设为false
  document.addEventListener('mouseup', function(event) {
    if (event.button === 0) {
      // console.log('Left mouse button was released.');
      if (recording) handleTouchOrMouseUp();
    } else {
      console.log('Another mouse button was released.');
    }
  });
})
</script>