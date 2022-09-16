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
  >
    <template #upload-button>
      <slot>
        <div v-if="imgUrl" class="arco-upload-list-picture custom-upload-avatar">
          <img class="avatar-img" :src="imgUrl" />
          <div class="arco-upload-list-picture-mask">
            <IconEdit />
          </div>
        </div>
        <div class="arco-upload-picture-card" v-else>
          <div class="arco-upload-picture-card-text">
            <IconPlus />
            <div style="margin-top: 10px; font-weight: 600">上传</div>
          </div>
        </div>
      </slot>
    </template>
  </a-upload>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getUpload, upload } from '../../api/user'
import { RequestOption } from '@arco-design/web-vue';

const props = withDefaults(defineProps<{
  defaultUrl?: string;
  accept?: string;
}>(), {
  accept: 'image/png, image/jpeg, image/jpg'
})

const $emit = defineEmits<{
  (event: 'success', url: string):void;
  (event: 'fail'):void
}>()

const uploadUrl = ref('')
const imgUrl = ref('')

watch(() => props.defaultUrl, (newVal) => {
  if (newVal) {
    imgUrl.value = newVal
  }
})

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

const customRequest = (option: RequestOption) => {
  const {onError, onSuccess, fileItem} = option
  if (fileItem.file) {
    upload(uploadUrl.value, fileItem.file).then(res => {
      console.log(res)
      if (res.status === 200) {
        imgUrl.value = uploadUrl.value.split('?')[0];
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