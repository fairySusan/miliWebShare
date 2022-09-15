<template>
  <div class="login-page">
    <div class="left-container">
      <div class="mili-title misans-font">MILI</div>
      <div class="mili-describe misans-font">
        <span>Grow with your business</span>
        <span>and be the best entrepreneur</span>
      </div>
    </div>
    <div class="right-container">
      <div class="platform-title"><span>Mili</span> <span>service</span> <span>platform</span></div>
      <div class="login-block">
        <a-tabs v-if="showRegistryForm">
          <a-tab-pane>
            <template #title><span class="tab-title">邮箱注册</span></template>
            <registryForm></registryForm>
            <div 
              class="flexCenter marginTop primaryFontColor registry-link"
              @click="showRegistryForm=false"
            >已有账号，去登录<icon-right />
            </div>
          </a-tab-pane>
        </a-tabs>
        <a-tabs v-else v-model:active-key="activeKey">
          <a-tab-pane :key="TabEnum['登录']">
            <template #title><span class="tab-title">邮箱登录</span></template>
            <a-form class="marginTopL" :model="formData" :rules="formRules" ref="formRef" 
              :label-col-props="{span:0}"
              :wrapper-col-props="{span:24}"
            >
              <a-form-item field="email">
                <a-input v-model="formData.email" size="large" placeholder="Please enter email account" allow-clear>
                  <template #prefix><icon-email /></template>
                </a-input>
              </a-form-item>
              <a-form-item field="password">
                <a-input-password v-model="formData.password" size="large" placeholder="Please input a password" allow-clear>
                  <template #prefix><icon-lock /></template>
                </a-input-password>
              </a-form-item>
              <a-form-item field="captcha">
                <div class="flexRow">
                  <a-input v-model="formData.captcha" size="large" placeholder="Verification Code" allow-clear>
                    <template #prefix><icon-safe /></template>
                  </a-input>
                  <img @click="getImageCode" :src="imageCode.picPath" class="verfication-code-img" />
                </div>
              </a-form-item>
            </a-form>
            <!-- <div>
              <a-checkbox @change="onRemenberPwd" v-model="isSavePassword"><span class="lightDarkFontColor">Remenber password</span></a-checkbox>
            </div> -->
            <div class="flexRowCenter">
              <a-button @click="onLogin" :loading="loading" class="login-button" type="primary" shape="round">
                {{ loading ? '登录中...' : '登录'}}
              </a-button>
            </div>

            <div 
              class="flexCenter marginTop primaryFontColor registry-link"
              @click="showRegistryForm=true"
            >
              没有账号，去注册<icon-right />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <a-modal title="验证邮箱"  v-model:visible="showModal">
      <a-form 
        ref="validateEmailRef"
        :model="validateEmailForm"
        :rules="{code: [{ required: true, message: '请输入验证码'}]}"
        :footer="false"
      >
        <a-form-item label="邮箱">{{ formData.email }}</a-form-item>
        <a-form-item field="code" label="验证码">
          <div class="flexRow">
            <a-input placeholder="邮箱验证码" size="large" v-model="validateEmailForm.code" allow-clear>
              <template #prefix><icon-safe /></template>
            </a-input>
            <CountDownButton ref="countDownRef" class="code-button" @click="onSendEmailCode">
              获取验证码
            </CountDownButton>
          </div>
        </a-form-item>
      </a-form>
      <div class="flexCenter">
        <a-button type="primary" @click="onValidateEmail">验证</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { bindTeam, getCode, getEmailcode, emailVerify } from '../../api/user';
import { useFormSubmit, useOptionRequest, useRequestV2 } from '../../hooks/request';
import { useUserStore, useAppStore } from '../../store';
import { CountDownButton } from '../../components';
import {ref, reactive, watch, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { formRules } from './type'
import registryForm from './components/registry-form.vue';

enum TabEnum {
  '登录' = '1',
}
const activeKey = ref(TabEnum['登录'])
const showModal = ref(false)
const showRegistryForm = ref(false)
const isSavePassword = ref(false)
const loading = ref(false)
const countDownRef = ref<any>()
const validateEmailRef = ref<any>()
const userStore = useUserStore();
const appStore = useAppStore();
const formRef = ref()
const route = useRoute()
const router = useRouter()

const validateEmailForm = reactive({
  nickname: '',
  email: '',
  code: ''
})
const formData = reactive({
  email: '',
  password: '',
  captcha: '',
  captchaId: ''
})

const {data: imageCode, run: getImageCode} = useRequestV2(getCode, {captchaId: '', picPath: ''})
const {submit: onBindTeam} = useOptionRequest(bindTeam)
const {submit: sendEmailCode} = useOptionRequest(getEmailcode, {
  success: '验证码已发送至您的邮箱'
})
const {submit: validateEmailRequest} = useFormSubmit(emailVerify, {
  success: '验证成功'
})

watch(imageCode, (newVal) => {
  formData.captchaId = newVal.captchaId
})

onMounted(() => {
  if (route.query.code) {
    onBindTeam({invitation_code: route.query.code}).then(() => {
      router.push({
        name: 'home',
        query: {invite_code: route.query.code},
      }).catch(() => {
        router.push({name: 'home'});
      });
    })
  }
})

const onLogin = () => {
  formRef.value.validate(async (errors: any) => {
    if (!errors) {
      loading.value = true
      try {
        await userStore.login(formData)
        loading.value = false
        appStore.fetchServerMenuConfig();
        userStore.getUserInfoStore();

        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        if (route.query.code) {
          router.push({
            path: '/',
            query: {
              ...othersQuery,
              invite_code: route.query.code,
              user_login: 'true',
            },
          });
        } else {
          router.push({
            path: '/',
            query: {
              ...othersQuery,
            },
          });
        }
      } catch(err: any) {
        if (!err.response) return
        if (err.response.data.reason === 'MEMBER_EMAIL_NOT_VERIFIED') {
          validateEmailForm.nickname = err.response.data.metadata.nickname;
          validateEmailForm.email = formData.email
          showModal.value = true
        }
        loading.value = false
        getImageCode()
      }
    }
  })
}

const onSendEmailCode = () => {
  formRef.value.validateField(['email'], async (errors: any) => {
    if (!errors) {
      try {
        const params = {
          email: formData.email,
          nickname: validateEmailForm.nickname,
          scene: '2',
        }
        await sendEmailCode(params)
        countDownRef.value.startCountDown();
      } catch(e) {}
    }
  })
}

const onValidateEmail = () => {
  validateEmailRef.value.validate(async (errors: any) => {
    if (!errors) {
      try {
        const params = {
          email: validateEmailForm.email,
          code: validateEmailForm.code
        }
        await validateEmailRequest(params)
      } catch(e) {}
    }
  })
}

const onRemenberPwd = (value: boolean | (string | number | boolean)[]) => {
  if (value) {
  }
  console.log(value)
}

</script>

<style lang="less" scoped>
  @import './style.less';
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
  .registry-link {
    &:hover {
      cursor: pointer;
      color: @color-primary-5;
    }
  }
</style>
