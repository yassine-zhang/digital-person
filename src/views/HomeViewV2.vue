<template>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <n-card
      style="width: 600px"
      title="上传数字人形象"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-upload
        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
        :default-file-list="previewFileList"
        list-type="image-card"
        @preview="handlePreview"
        :max="1"
      />
      <n-modal
        v-model:show="showModalImgRef"
        preset="card"
        style="width: 600px"
        title="一张很酷的图片"
      >
        <img :src="previewImageUrl" style="width: 100%" />
      </n-modal>

      <template #footer>
        <div class="flex items-center justify-end">
          <n-space>
            <n-button @click="refuseDigitalNoun"> 取消 </n-button>
            <n-button @click="agreeDigitalNoun" type="primary">
              确认
            </n-button>
          </n-space>
        </div>
      </template>
    </n-card>
  </n-modal>
  <section class="h-svh flex flex-col justify-around">
    <div class="flex-1 p-6 md:p-12 flex flex-col md:flex-row">
      <div class="flex-1 bg-blue-50 rounded-lg p-2 mb-5 md:mr-5 md:mb-0">
        视频区域，数字人视频生成后显示在这里
      </div>
      <div ref="commentRef" class="flex-1 max-h-[50svh] rounded-lg overflow-y-auto">
        <!--数字人形象选择区域-->
        <div v-auto-animate class="grid grid-cols-12 gap-y-2 p-2 mx-auto bg-gray-50">
          <one-self-comment v-for="item in store.oneselfContent" :message="item" />
        </div>
      </div>
    </div>
    <div class="h-1/5 pb-20"><voice /></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { type UploadFileInfo, useMessage } from 'naive-ui'
import { useDigitalStore } from "@/stores/digital";
import Voice from "@/components/v2/VoiceCom.vue";
import OneSelfComment from '@/components/v2/OneSelfComment.vue'

const store = useDigitalStore();
const message = useMessage();

const showModal = ref(false);

const previewImageUrlRef = ref("");
const showModalImgRef = ref(false);
const previewImageUrl = previewImageUrlRef;
const previewFileList = ref<UploadFileInfo[]>([
  {
    id: "face",
    name: "face.png",
    status: "finished",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]);
function handlePreview(file: UploadFileInfo) {
  const { url } = file;
  previewImageUrlRef.value = url as string;
  showModalImgRef.value = true;
}
function agreeDigitalNoun() {
  showModal.value = false;
  store.nounExist = true;
  message.success("已选择数字人形象");
}
function refuseDigitalNoun() {
  showModal.value = false;
  store.nounExist = false;
  message.error("已取消选择，刷新重试");
}

onMounted(() => {
  if (!store.nounExist) showModal.value = true;
  if (commentRef.value !== undefined) commentRef.value.scrollTop = commentRef.value.scrollHeight;
});

const commentRef = ref<HTMLElement | undefined>();
watch(store.oneselfContent, async (newValue) => {
  setTimeout(() => {
    if (commentRef.value === undefined) return;
    commentRef.value.scrollTop = commentRef.value.scrollHeight;
  }, 200);
})
</script>
