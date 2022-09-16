<template>
  <a-upload
    :action="uploadUrl"
    :accept="accept"
    :on-before-upload="onBeforeUpload"
    :custom-request="customRequest"
    @success="onUploadSuccess"
    @error="onUploadFail"
    list-type="picture-card"
    tip="上传头像"
    image-preview
    :auto-upload="true"
    :show-retry-button="false"
    :limit="1"
    v-model:file-list="fileList" 
  >
  </a-upload>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { getUpload, upload } from '../../api/user'
import { Message, RequestOption } from '@arco-design/web-vue';
import { CommonTool } from '../../utils';

const props = withDefaults(defineProps<{
  url?: string;
  accept?: string;
}>(), {
  accept: 'image/png, image/jpeg, image/jpg'
})

const $emit = defineEmits<{
  (event: 'success', url: string):void;
  (event: 'fail'):void
}>()

const fileList = ref<any[]>([])
const uploadUrl = ref('')
const imgUrl = ref('')

watch(() => props.url, (newVal) => {
  imgUrl.value = newVal || ''
  if (newVal) {
    fileList.value = [{
      uid:  CommonTool.randomStr(),
      name: '图片',
      url: newVal
    }]
  } else {
    fileList.value = []
  }
})

const onBeforeUpload = (file: File) => {
  return new Promise((resolve, reject) => {
    const arr = file.name.split('.')
    const extend = arr[arr.length-1] || file.type.split('/')[1]
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
  Message.success({content: '上传成功'})
}

const onUploadFail = () => {
  Message.error({content: '上传失败'})
}

const customRequest = (option: RequestOption) => {
  const {onError, onSuccess, fileItem} = option
  if (fileItem.file) {
    upload(uploadUrl.value, fileItem.file).then(res => {
      console.log(res)
      if (res.status === 200) {
        imgUrl.value = uploadUrl.value.split('?')[0];
        fileList.value = [{
          uid: CommonTool.randomStr(),
          name: '图片',
          url: imgUrl.value
        }]
        onSuccess()
        $emit('success', imgUrl.value)
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