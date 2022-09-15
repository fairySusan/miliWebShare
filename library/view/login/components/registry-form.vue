<template>
  <a-form ref="formRef" class="marginTopL" :model="formData" :rules="formRules"
    :label-col-props="{span:0}"
    :wrapper-col-props="{span:24}"
  >
    <a-form-item field="email" label="邮箱">
      <a-input placeholder="邮箱" size="large" v-model="formData.email" allow-clear>
        <template #prefix><icon-email /></template>
      </a-input>
    </a-form-item>
    <a-form-item field="nickname" label="昵称">
      <a-input placeholder="昵称" size="large" v-model="formData.nickname" allow-clear>
        <template #prefix><icon-user /></template>
      </a-input>
    </a-form-item>
    <a-form-item field="password" label="密码">
      <a-input-password placeholder="密码" size="large" v-model="formData.password" allow-clear>
        <template #prefix><icon-lock /></template>
      </a-input-password>
    </a-form-item>
    <a-form-item field="code" label="验证码">
      <div class="flexRow">
        <a-input placeholder="邮箱验证码" size="large" v-model="formData.code" allow-clear>
          <template #prefix><icon-safe /></template>
        </a-input>
        <CountDownButton ref="countDownRef" class="code-button" @click="onSendEmailCode">
          获取验证码
        </CountDownButton>
      </div>
    </a-form-item>
    <a-form-item field="captcha" label="图形验证码">
      <div class="flexRow">
        <a-input v-model="formData.captcha" size="large" placeholder="图形验证码" allow-clear>
          <template #prefix><icon-safe /></template>
        </a-input>
        <img @click="getImageCode" :src="imageCode.picPath" class="verfication-code-img" />
      </div>
    </a-form-item>
  </a-form>
  <div class="flexRowCenter">
    <a-button @click="onRegistry" :loading="loading" class="login-button" type="primary" shape="round">
      {{ loading ? '注册中...' : '注册'}}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { getCode, getEmailcode, reg} from '../../../api/user';
import { useOptionRequest, useRequestV2 } from '../../../hooks/request';
import { useUserStore } from '../../../store';
import { reactive, ref, watch } from 'vue';
import { CountDownButton } from '../../../components'
import { useRoute } from 'vue-router';

const route = useRoute()
const userStore = useUserStore();

const formRules = {
  email: [{required: true, message: '请输入邮箱'}],
  password: [{required: true, message: '请输入登录密码'}],
  nickname: [{required: true, message: '请输入昵称'}],
  code: [{required: true, message: '请输入邮箱验证码'}],
  captcha: [{required: true, message: '请输入验证码'}],
}

const formRef = ref<any>()
const countDownRef = ref<any>()
const loading = ref(false)
const formData = reactive({
  invitation_code: route.query.code as string,
  email: '',
  nickname: '',
  password: '',
  code: '',
  captchaId: '',
  captcha: ''
})

const {data: imageCode, run: getImageCode} = useRequestV2(getCode, {captchaId: '', picPath: ''})
const {submit: sendEmailCode} = useOptionRequest(getEmailcode, {
  success: '验证码已发送至您的邮箱'
})

watch(imageCode, (newVal) => {
  formData.captchaId = newVal.captchaId
})

const onSendEmailCode = () => {
  formRef.value.validateField(['email'], async (errors: any) => {
    if (!errors) {
      try {
        const params = {
          email: formData.email,
          nickname: formData.nickname,
          scene: '2',
        }
        await sendEmailCode(params)
        countDownRef.value.startCountDown();
      } catch(e) {

      }
    }
  })
}

const onRegistry = async () => {
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      loading.value = true
      try {
        await userStore.regitsry(formData)
        userStore.getUserInfoStore();
        loading.value = false
      } catch (e) {}
    }
  })
}

</script>

<style lang="less" scoped>
.code-button {
  width: 240px;
  height: 36px;
  border-radius: 0;
}
.verfication-code-img {
  width: 240px;
  height: 36px;
  &:hover {
    filter: brightness(1.5);
  }
}
.login-button {
  width: 220px; 
  height: 36px;
  border-radius: 18px;
  margin-top: 30px;
}
.get_email_verify_code {
  position: relative;
  top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 32px;
  color: #fff;
  background: @color-primary-6;
  cursor: pointer;
}

</style>