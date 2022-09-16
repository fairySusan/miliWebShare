<template>
  <div class="paddingL pageContainer">
    <div v-if="true">
      <slot></slot>
    </div>
    <div class="unEnabel-container" v-else>
      <img :src="ImageTool.importImg('noEnable/empty.png')" alt="">
      <span class="fontSizeLL fontWeightBold"> 功能未开启 </span>
      <span class="tip">请联系管理员开启</span>
      <div class="flexRow marginTopL">
        <div class="flexColumnAlignItemCenter marginLeftRightM" v-for="item in 4">
          <img class="customer-avatar" :src="ImageTool.importImg(manageAvatar[Math.floor(Math.random()*4)])" alt=""/>
          <span class="marginTop fontSizeSmall lightDarkFontColor">昵称</span>
          <span class="marginTop fontSizeSmall lighterDarkFontColor">角色名</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ImageTool } from '../../utils';

const manageAvatar = [
  'noEnable/customer1.png', 
  'noEnable/customer2.png',
  'noEnable/customer3.png',
  'noEnable/customer4.png',
]
</script>

<style lang="less" scoped>
.pageContainer {
  background-color: white;
  border-radius: 8px;
}
.unEnabel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tip {
  color: @color-text-2;
  letter-spacing: 0.2em;
  margin-top: 30px;
}
.customer-avatar {
  width: 50px;
  height: 50px;
}
</style>