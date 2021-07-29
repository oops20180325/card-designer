require('./fabric.min')
require('./fontFamilyLoader')
import {CardDesigner} from './editor' 

/**/
 // 图片工具
  /**
 * 上传图片
 * 选择图片后应先上传到服务器获取图片url后再在编辑器中使用
 * 由于该项目只有前端
 * 所以直接返回图片的src
 * @param {File} imgFile
 */
   function uploadImgAssets(imgFile) {
    console.log('图片已上传---本地测试用')
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(imgFile)
    })
  }
  // Converts canvas to an image
  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }
  //下载通用方法,模拟a标签
  function dowmLoadFunc(url,MIME_TYPE='image/png'){
      //创建一个a链接，模拟点击下载
      let dlLink = document.createElement('a');
      let filename = '' + (new Date()).getTime() + '.png';
      dlLink.download = filename;
      dlLink.href = url;
      dlLink.target = "_blank";
      document.body.appendChild(dlLink);
      dlLink.click();
      // document.body.removeChild(dlLink);
  }


export default CardDesigner
export{
  CardDesigner,
  uploadImgAssets,
  convertCanvasToImage,
  dowmLoadFunc
}