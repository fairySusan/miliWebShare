const importImg = (url: string) => {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}

// 把base64转换成文件
const base64toFile = (base64Str:string) => {
  var arr = base64Str.split(","),
    fileType = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `screenshot${Date.now()}.png`, {
    type: fileType,
  });
};

const getObjectURL = (file: Blob):Promise<string> => {
  return new Promise((resolve, reject) => {
    let url = null;
    if ((window as any).createObjectURL !== undefined) { // basic
        url = (window as any).createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file);            
        } catch (error) {
          reject(error)
        }
    } else if (window.URL != undefined) { // mozilla(firefox)
      try {
        url = window.URL.createObjectURL(file);
      } catch (error) {
        reject(error)
      }
    }
    resolve(url)
  })
}

export default {
  importImg,
  base64toFile,
  getObjectURL
}
