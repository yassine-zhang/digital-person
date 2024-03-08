<template>
  <section class="font-serif flex flex-col h-dvh">
    <div class="flex-1 flex w-full">
      <div class="w-56 p-2">
        <div class="mb-1">Input Image</div>
        <n-upload
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          :default-file-list="previewFileList"
          list-type="image-card"
          @preview="handlePreview"
          :max="1"
        />
        <n-modal
          v-model:show="showModal"
          preset="card"
          style="width: 600px"
          title="一张很酷的图片"
        >
          <img :src="previewImageUrl" style="width: 100%" />
        </n-modal>
      </div>
      <div
        :class="[
          'p-5 flex-1 flex items-center justify-center h-full transition-all duration-300',
          IsRecording() ? 'bg-gray-100' : 'bg-gray-50',
        ]"
      >
        <p
          :class="[
            'z-20 absolute transition-all duration-300',
            IsRecording() ? 'opacity-100' : 'opacity-0',
          ]"
        >
          录音中，松手进行音频转文本操作
        </p>
        <div class="flex flex-col items-end justify-end w-full h-full">
          <div class="w-full grid grid-cols-12 gap-y-2">
            <div class="col-start-1 col-end-8 p-3 rounded-lg">
              <div class="flex flex-row items-center">
                <div
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                >
                  A
                </div>
                <div
                  class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                >
                  <div>Lorem ipsum dolor sit amet !</div>
                </div>
              </div>
            </div>
            <div class="col-start-6 col-end-13 p-3 rounded-lg">
              <div class="flex items-center justify-start flex-row-reverse">
                <div
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                >
                  A
                </div>
                <div
                  class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                >
                  <div>
                    Lorem ipsum dolor sit, amet consectetur adipisicing. ?
                  </div>
                  <div
                    class="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500"
                  >
                    Seen
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bt-control h-40 flex items-center justify-center select-none">
      <span
        ref="voice"
        class="cursor-pointer"
        @mousedown="recording = true"
        @mouseup="recording = false"
        @touchstart="recording = true"
        @touchend="recording = false"
      >
        <MicCircleOutline v-if="!recording" class="w-28 text-[#666699]" />
        <MicCircle v-else class="w-28 text-[#666699]" />
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import { MicCircleOutline, MicCircle } from "@vicons/ionicons5";
import { ref, watch } from "vue";
import Recorder from "js-audio-recorder";
import axios from "@/utils/axios";
import { type UploadFileInfo } from "naive-ui";

let recorder: Recorder | undefined;

// 创建一个 recording 引用，初始值为 false
const recording = ref(false);
// 创建一个 voice 引用，初始值为 null
const voice = ref();
// 定义一个函数 IsRecording，用于判断 recording 的值是否为 true
function IsRecording() {
  return recording.value;
}

const previewFileList = ref<UploadFileInfo[]>([
  {
    id: "face",
    name: "face.png",
    status: "finished",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]);
const previewImageUrlRef = ref("");
const showModalRef = ref(false);
const showModal = showModalRef;
const previewImageUrl = previewImageUrlRef;
function handlePreview(file: UploadFileInfo) {
  const { url } = file;
  previewImageUrlRef.value = url as string;
  showModalRef.value = true;
}

const comment = ref([
  { id: 1, content: "你好，请简单介绍一下你自己。", noun: "oneself" },
  {
    id: 2,
    content:
      "当然，我是一个基于中国的大型预训练模型所创建的人工智能助手，专注于提供广泛的知识和帮助。我可以回答各种问题，如科学、历史、技术、文化等方面的内容，并尽力为用户提供准确和有用的信息。\n" +
      "\n" +
      "需要注意的是，我被设计成遵守中国法律法规，不回答任何涉及政治敏感话题的问题，也不提供个人观点或评论。如果您有任何问题或需要帮助，请随时告诉我，我会尽力提供支持。",
    noun: "ai",
  },
]);

watch(recording, async (newValue) => {
  if (recorder === undefined) recorder = new Recorder();

  // 帮我编写录制功能
  if (newValue) {
    // 开始录制
    recorder.resume();
    recorder.start().then(
      () => {
        // 开始录音
      },
      (error) => {
        // 出错了
        console.log(`${error.name} : ${error.message}`);
      },
    );
  } else {
    // 停止录制
    recorder.play();
    // 创建一个 FormData 对象
    const formData = new FormData();
    formData.append("file", recorder.getWAVBlob());
    formData.append("model", "whisper-1");
    console.log(URL.createObjectURL(recorder.getWAVBlob()));
    await axios
      .post("/v1/audio/transcriptions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
      });
    recorder.destroy().then(() => {
      recorder = undefined;
    });
  }
});
</script>
<style scoped>
.bt-control {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
