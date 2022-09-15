// 修改全局主题色 主题色1-9， --arcoblue-6为主题色
export function useThemeColor (theme: string) {
  const colorFn = new Color()
  const colors = new Array(10)
  for (let i=0; i<6; i++) {
    colors[i] = colorFn.HexToRgb(colorFn.getLightColor(theme, 1-((i+1)/10)))
  }
  for (let i=6; i<10; i++) {
    colors[i] = colorFn.HexToRgb(colorFn.getDarkColor(theme, i/10))
  }
  colors[5] = colorFn.HexToRgb(theme)
  colors.forEach((color, index) => {
    document.body.style.setProperty(`--arcoblue-${index + 1}`, color)
  })
  document.body.style.setProperty('--gray-3', '232,234,241')
  document.body.style.setProperty('--gray-2', '248,250,255')
  document.body.style.setProperty('font-family', 'Adobe Heiti Std,Microsoft Yahei,Arial,apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Segoe UI,Arial,Roboto,PingFang SC,miui,Hiragino Sans GB,sans-serif')
}


class Color {
  HexToRgb(str: string) {
    str = str.replace('#', '')
    const hxs: any = str.match(/../g)
    for (let i = 0; i < 3; i++) {
      hxs[i] = parseInt(hxs[i], 16)
    }
    return hxs
  }
  RgbToHex(a: number, b: number, c: number) {
    const hexs = [a.toString(16), b.toString(16), c.toString(16)]
    for (let i = 0; i < 3; i++) {
      if (hexs[i].length === 1) hexs[i] = '0' + hexs[i]
    }
    return '#' + hexs.join('')
  }
  getDarkColor(color: string, level: number) {
    const rgbc = this.HexToRgb(color)
    for (let i = 0; i < 3; i++) {
      rgbc[i] = Math.floor(rgbc[i] * (1 - level))
    }
    return this.RgbToHex(rgbc[0], rgbc[1], rgbc[2])
  }
  getLightColor(color: string, level: number) {
    const rgbc = this.HexToRgb(color)
    for (let i = 0; i < 3; i++) {
      rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i])
    }
    return this.RgbToHex(rgbc[0], rgbc[1], rgbc[2])
  }
}
