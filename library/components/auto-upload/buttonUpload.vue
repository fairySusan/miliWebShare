<template>
  <a-upload
    :action="uploadUrl"
    :accept="accept"
    :on-before-upload="onBeforeUpload"
    :custom-request="customRequest"
    @success="onUploadSuccess"
    @error="onUploadFail"
    @change="onChange"
    :showFileList="showFileList"
    :auto-upload="true"
    :show-retry-button="false"
    :limit="limit"
  >
    <template #upload-button>
      <slot>
        <a-button type="primary">上传</a-button>
      </slot>
    </template>
  </a-upload>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getUpload, upload } from '../../api/user'
import { FileItem, RequestOption } from '@arco-design/web-vue';

withDefaults(defineProps<{
  accept?: string;
  showFileList?: boolean;
  limit?: number;
}>(), {
  accept: 'image/png, image/jpeg, image/jpg',
  showFileList: true,
  limit: 0
})

const $emit = defineEmits<{
  (event: 'success', url: string):void;
  (event: 'fail'):void;
  (event: 'change', data:{fileList: FileItem[], fileItem: FileItem}):void;
}>()

const uploadUrl = ref('')
const fileUrl = ref('')

const onBeforeUpload = (file: File) => {
  return new Promise((resolve, reject) => {
    const extend = file.name.split('.')[1] || file.type.split('/')[1]
    getUpload({
      project: 'saas',
      prefix: 'avatar',
      extend: extend as any
    }).then((res) => {
      uploadUrl.value = res.data.sign_url
      resolve(true)
    }).catch(() => reject('cancel'))
  }) as any
}

const onUploadSuccess = () => {
  console.log('上传成功')
}

const onUploadFail = () => {
  console.log('上传失败')
}

const onChange = (fileList: FileItem[], fileItem: FileItem) => {
  $emit('change', {fileList, fileItem})
}

const customRequest = (option: RequestOption) => {
  const {onError, onSuccess, fileItem} = option
  if (fileItem.file) {
    upload(uploadUrl.value, fileItem.file).then(res => {
      console.log(res)
      if (res.status === 200) {
        fileUrl.value = uploadUrl.value.split('?')[0];
        onSuccess()
        $emit('success', fileUrl.value)
      } else {
        onError()
        $emit('fail')
      }
    })
  }
  return {
    abort() {}
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
}
.avatar-img {
  width: 60px;
  height: 60px;
}
</style>