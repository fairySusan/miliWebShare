<template>
  <div class="login_form">
    <!-- 头部logo -->
    <div class="header_logo">
      <div class="logo">
        <div class="logo_text">MILI</div>
      </div>
      服务平台
    </div>

    <!-- 表单 -->
    <div class="form">
      <a-tabs :active-key="form.tab_key" @tab-click="handleTbas">
        <a-tab-pane key="1" title="邮箱登录">
          <div class="login_inp">
            <div class="inp">
              邮箱：
              <a-input v-model="form.email" placeholder="请输入账号" />
            </div>
            <div class="inp">
              登录密码：
              <a-input-password
                v-model="form.pass"
                placeholder="请输入密码"
                allow-clear
              />
            </div>
            <div class="inp verify_box">
              图形验证码：
              <div class="inps">
                <a-input
                  v-model="form.code"
                  class="verify"
                  placeholder="请输入验证码"
                />
                <div class="code" @click="getimgcode">
                  <img :src="form.login_base" />
                </div>
              </div>
            </div>
            <a-button class="login_btn" type="primary" @click="mlogin"
              >登录</a-button
            >
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" title="邮箱注册" v-if="form.is_reg_show">
          <div class="login_inp">
            <div class="inp">
              邮箱：
              <a-input v-model="form.reg_email" placeholder="请输入邮箱" />
            </div>
            <div class="inp">
              密码：
              <a-input-password
                v-model="form.reg_pass"
                placeholder="请输入密码"
              />
            </div>
            <div class="inp verify_box">
              验证码：
              <div class="inps">
                <a-input
                  class="email_code_inp"
                  v-model="form.reg_email_code"
                  placeholder="请输入验证码"
                />
                <div class="get_email_verify_code" @click="regEmailcode">
                  {{ form.reg_is_click ? '获取验证码' : form.reg_count_down }}
                </div>
              </div>
            </div>
            <div class="inp verify_box">
              图形验证码：
              <div class="inps">
                <a-input
                  v-model="form.code"
                  class="verify"
                  placeholder="请输入验证码"
                />
                <div class="code" @click="getimgcode">
                  <img :src="form.login_base" />
                </div>
              </div>
            </div>
            <a-button class="login_btn" type="primary" @click="mregister"
              >注册</a-button
            >
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 邮箱验证提示框 -->
    <a-modal
      v-model:visible="form.is_modal"
      :on-before-ok="handleOk"
      :closable="false"
      ok-text="验证"
      cancel-text="取消"
      @cancel="handleCancel"
    >
      <div class="header"> 邮箱验证 </div>
      <div class="title"> 账号信息 </div>
      <div class="info">
        <!-- <div class="name"> 账号昵称：<a-input :style="{width:'150px'}" v-model="form.nickname" placeholder="请输入账号昵称" allow-clear /></div> -->
        <div class="email"> 邮箱地址：{{ form.email }} </div>
        <div class="get_code">
          <div class="email_code_box">
            验证码：
            <a-input
              v-model="form.email_code"
              :style="{ width: '200px' }"
              placeholder="请输入邮箱验证码"
            />
            <div class="get_emailcode" @click="emailCode"
              >{{ form.is_click ? '获取验证码' : form.count_down }}
            </div>
          </div>
          <div class="message" :style="{ 'font-size': '14px' }">
            <!-- 邮箱默认已发送验证码，请先查看邮箱（如果未收到，再点击获取验证码） -->
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore, useAppStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import {
    getCode,
    LoginData,
    emailVerify,
    getEmailcode,
    reg,
    getUserInfo,
    bindTeam,
  } from '../../../api/user';
  import { setToken } from '../../../utils/auth';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
  const appStore = useAppStore();
  const form = reactive({
    // 切换页面控制
    is_reg_show: false,
    tab_key: '1',
    // 登录表单所需
    email: '',
    pass: '',
    code: '',
    login_baseid: '',
    login_base: '',
    // 邮箱验证弹窗
    is_modal: false,
    email_code: '',
    count_down: 60,
    is_click: true,
    nickname: '',
    // 注册表单所需
    invitation_code: '',
    reg_email: '',
    reg_pass: '',
    reg_email_code: '',
    reg_count_down: 60,
    reg_is_click: true,
  });

  if (route.query.code && localStorage.getItem('token')) {
    const obj: any = {
      invitation_code: route.query.code,
    };
    bindTeam(obj)
      .then((res) => {
        console.log('加入', res);
        if (res.status === 200) {
          Message.success('加入团队成功');
          router.push({
            name: 'mindex',
            query: {
              invite_code: route.query.code,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        router.push({
          name: 'mindex',
        });
      });
  } else if (route.query.code) {
    form.is_reg_show = true;
    form.invitation_code = route.query.code;
    form.tab_key = '2';
  }

  // Tbas页面点击切换
  const handleTbas = (key: any) => {
    form.tab_key = key;
  };

  // 获取验证码
  const getimgcode = async () => {
    getCode().then((res) => {
      form.login_baseid = res.data.captchaId;
      form.login_base = res.data.picPath;
    });
  };
  getimgcode();

  // 弹窗邮箱验证码
  const emailCode = () => {
    if (!form.is_click) {
      return;
    }
    const obj: any = {
      email: form.email,
      nickname: form.nickname,
      scene: '1',
    };
    getEmailcode(obj).then((res) => {
      Message.success('发送成功');
    });
    const timer = setInterval(() => {
      form.is_click = false;
      form.count_down -= 1;
      if (form.count_down <= 0) {
        form.is_click = true;
        form.count_down = 60;
        clearInterval(timer);
      }
    }, 1000);
  };

  // 注册邮箱验证码
  const regEmailcode = () => {
    if (form.reg_email.trim().length === 0) {
      Message.warning('请输入邮箱');
      return;
    }
    if (form.reg_pass.trim().length === 0) {
      Message.warning('请输入密码');
      return;
    }
    if (!form.reg_is_click) {
      return;
    }
    const obj: any = {
      email: form.reg_email,
      nickname: form.reg_email,
      scene: '2',
    };
    getEmailcode(obj).then((res) => {
      Message.success('发送成功');
    });
    const timer = setInterval(() => {
      form.reg_is_click = false;
      form.reg_count_down -= 1;
      if (form.reg_count_down <= 0) {
        form.reg_is_click = true;
        form.reg_count_down = 60;
        clearInterval(timer);
      }
    }, 1000);
  };

  // 登录
  const mlogin = async () => {
    if (form.email.trim().length === 0) {
      Message.warning('请输入账号！');
      return;
    }
    if (form.pass.trim().length === 0) {
      Message.warning('请输入密码！');
      return;
    }
    if (form.code.trim().length === 0) {
      Message.warning('请输入验证码！');
      return;
    }

    const data: LoginData = {
      email: form.email,
      password: form.pass,
      captchaId: form.login_baseid,
      captcha: form.code,
    };
    await userStore
      .login(data as LoginData)
      .then((res) => {
        appStore.fetchServerMenuConfig();
        getUserInfo().then((res) => {
          localStorage.setItem('userinfo', JSON.stringify(res.data));
        });
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        if (route.query.code) {
          router.push({
            path: '/home',
            query: {
              ...othersQuery,
              invite_code: form.invitation_code,
              user_login: 'true',
            },
          });
        } else {
          router.push({
            path: '/home',
            query: {
              ...othersQuery,
            },
          });
        }
      }).catch((err: any) => {
        if (!err.response) return
        form.nickname = err.response.data.metadata.nickname;
        if (err.response.data.reason === 'MEMBER_EMAIL_NOT_VERIFIED') {
          // 邮箱验证
          form.is_modal = true;
          document.getElementsByClassName('arco-modal-body')[0].style.height =
            '300px';
          document.getElementsByClassName('arco-modal-body')[0].style.padding =
            '0px';
        } else if (err.response.data.reason === 'VERIFY_ERROR') {
          getimgcode();
        }
      });
  };

  // 注册
  const mregister = async () => {
    if (form.reg_email.trim().length === 0) {
      Message.warning('请输入邮箱');
      return;
    }
    if (form.reg_pass.trim().length === 0) {
      Message.warning('请输入密码');
      return;
    }
    if (form.reg_email_code.trim().length === 0) {
      Message.warning('请输入邮箱验证码');
      return;
    }
    if (form.code.trim().length === 0) {
      Message.warning('请输入图像验证码');
      return;
    }

    const obj: any = {
      invitation_code: form.invitation_code,
      email: form.reg_email,
      nickname: form.reg_email,
      password: form.reg_pass,
      code: form.reg_email_code,
      captchaId: form.login_baseid,
      captcha: form.code,
    };

    await reg(obj)
      .then((res) => {
        console.log(res);
        setToken(res.data.token);
        localStorage.setItem('CompanyId', res.data.mainCompanyId);
        localStorage.setItem('CompanyName', res.data.mainCompanyName);
        appStore.fetchServerMenuConfig();
        getUserInfo().then((res) => {
          localStorage.setItem('userinfo', JSON.stringify(res.data));
        });
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: 'mindex',
          query: {
            ...othersQuery,
            invite_code: form.invitation_code,
          },
        });
      })
      .catch((err) => {
        getimgcode();
      });
  };

  // 弹窗确定
  const handleOk = (done: any) => {
    if (form.email_code.length === 0) {
      Message.warning('请输入邮箱验证码！');
      done(false);
    } else {
      const obj: any = {
        email: form.email,
        code: form.email_code,
      };
      emailVerify(obj)
        .then((res) => {
          console.log(res);
          if (res.data.success === true) {
            Message.success('验证通过');
            done(true);
            form.is_modal = false;
          }
        })
        .catch((err) => {
          done(false);
        });
    }
  };

  // 弹窗取消
  const handleCancel = () => {
    form.is_modal = false;
  };
</script>

<style lang="less" scoped>
  .login_form {
    display: flex;
    flex-direction: column;
    align-items: center;

    .header_logo {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 28px;

      .logo {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        margin-right: 20px;
        background: rgb(24, 144, 255);
        border-radius: 10px;
        transform: rotate(135deg);

        .logo_text {
          position: absolute;
          color: #fff;
          font-weight: bold;
          font-size: 28px;
          transform: rotate(225deg);
        }
      }
    }

    .form {
      width: 100%;
      height: 520px;
      // border: 1px solid red;
      margin-top: 36px;

      .login_inp {
        box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 12px;
        padding-bottom: 30px;

        .inp {
          margin-bottom: 18px;

          .arco-input-wrapper {
            margin-top: 6px;
          }
        }

        .verify_box {
          display: flex;
          flex-direction: column;

          .email_code_inp {
            width: 220px;
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
            background: rgb(24, 144, 255);
            cursor: pointer;
          }

          .inps {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .verify {
              width: 220px;
              margin-top: 6px;
            }

            .code {
              position: relative;
              top: 3px;
              width: 200px;
              height: 32px;
              background: rgb(230, 230, 230);
              cursor: pointer;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }

        .login_btn {
          width: 100%;
          margin-top: 5px;
        }
      }
    }
  }
  //弹窗
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    color: #fff;
    font-size: 20px;
    background: rgb(24, 144, 255);
  }

  .title {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;
    padding-left: 20px;
    font-size: 18px;
  }

  .info {
    box-sizing: border-box;
    margin-top: 35px;
    padding-left: 35px;
  }

  .get_code {
    width: 100%;
    margin-top: 35px;

    .email_code_box {
      display: flex;
      align-items: center;

      .get_emailcode {
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        width: 100px;
        padding: 5px;
        color: #fff;
        background: rgb(24, 144, 255);
        cursor: pointer;
      }
    }

    .message {
      margin-top: 12px;
      color: red;
    }
  }
</style>
