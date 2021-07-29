function $(el){
  return document.querySelector(el)
}
/****/   

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
/**/
class CardDesigner {
  constructor(canvasId,callback) {
    this.canvas = new fabric.Canvas(canvasId,this.canvasInitConfig);
    this._currentObj = null;
    this._clipboard = null;
    this._callback = callback;
    this.InitFontFamily = "Microsoft YaHei";
    //event
    this.canvas.on("object:modified", (e)=> {
      if(e&&e.target){
        // console.log(e.target)
      }
    });
    this.canvas.on("object:added", (e)=> {
      if(e&&e.target){
        // console.log(e.target)
      }
    });
    this.canvas.on("object:removed", (e)=> {
      if(e&&e.target){
        // console.log(e.target)
      }
    });
    this.canvas.on("object:rotating", (e)=> {
      if(e&&e.target){
        // console.log(e.target)
      }
    });
    this.canvas.on("mouse:down", (e) => {
      if (e && e.target && e.target.selectable) {
        // console.log(e.target)
      }
    });
    this.canvas.on("mouse:move", (e)=> {
      if(e&&e.target){
        // console.log(e.target)
      }
     
    });
    this.canvas.on("mouse:up", (e) => {
      if(e&&e.target){
        //incloud input except select
        this._currentObj = e.target;
        this._callback('select',this._currentObj);
      }else{
        if (this._currentObj){
          this._currentObj = null;
          this._callback('cancelSelect',null);
        }else{
          let cur = this.canvas.getActiveObject();
          if(cur&&!cur._objects){
            this._currentObj = cur;
            this._callback('select',this._currentObj);
          }
        }
      }
      
    });
    this.canvas.on("selection:created", (e) => {
      if(e&&e.target){
        // console.log(e.target)
        if(e.target._objects&&e.target._objects.length){
          //select more than one
        }
      }
    });   
    this.canvas.on("selection:updated", (e) => {
      if(e&&e.target){
        // console.log(e.target)
        if(e.target._objects&&e.target._objects.length){
          //select more than one
        }
      }
    });
    document.addEventListener("keydown",(e)=>{
      if(e.ctrlKey&&e.keyCode===67){
        e.preventDefault();
        console.log(e);
        console.log('Ctrl+c');
        this.Copy();
      }
      if(e.ctrlKey&&e.keyCode===86){
        e.preventDefault();
        console.log('Ctrl+v');
        this.Paste();
      }
      if(e.code == "Delete"){
        console.log('delete')
        this.clearSelect();
      }
    }) 
    
  }
  canvasInitConfig ={
    preserveObjectStacking:true,
  }
  addRect(options={}){
    let rect = new fabric.Rect(options);
    this.canvas.add(rect);
  }
  addCircle(options={}){
    let rect = new fabric.Circle(options);
    this.canvas.add(rect);
  }
  addTriangle(options={}){
    let Triangle = new fabric.Triangle(options);
    this.canvas.add(Triangle);
  }
  addText(content,options={}){
    let text = new fabric.IText(content,options)
    .setControlsVisibility({
        mb:false,
        mt:false,
        mr:false,
        ml:false,
      });
    this.canvas.add(text)
  }
  addImg(FileUrl,options={}){
    fabric.Image.fromURL(FileUrl, (oImg)=> {
      oImg.set({
        top:200,
        left:200,
      }).setControlsVisibility({
        mb:false,
        mt:false,
        mr:false,
        ml:false,
      })
      this.canvas.add(oImg);
    });
  }
  discardSelect(){
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }
  loadFont(fontfamilyName,callback){
    var myfont = new FontFaceObserver(fontfamilyName);
    myfont.load().then(()=>{
      let cur = this.canvas.getActiveObject();
      if(cur){
        cur.set("fontFamily", myfont.family);
        this.canvas.requestRenderAll();
      }
    });
  }
  toJSON(withDefaults=false){
    // 是否包含默认值
    this.canvas.includeDefaultValues = withDefaults;
    const json =  this.canvas.toJSON();
    return json
  }
  bringForward () {
    var activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.bringForward(activeObject);
    }
  };
  bringToFront () {
    var activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.bringToFront(activeObject);
    }
  };
  sendBackward () {
    var activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.sendBackwards(activeObject);
    }
  };
  sendToBack () {
    var activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.sendToBack(activeObject);
    }
  };
  loadFromJSON (json) {
    this.canvas.loadFromJSON(json, ()=>{
      this.canvas.renderAll();
    });
  };
  clearAll (){
    this.canvas.clear();
  }
  clearSelect(){
    var activeObjects = this.canvas.getActiveObjects();
    this.canvas.discardActiveObject()
    if (activeObjects.length) {
      this.canvas.remove.apply(this.canvas,activeObjects);
    }
  }
  Copy() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    let activeObj = this.canvas.getActiveObject();
    console.log(activeObj)
    if(activeObj){
      activeObj.clone((cloned)=>{
        this._clipboard = cloned;
      });
    }
  }
  Paste() {
    // clone again, so you can do multiple copies.
    let _clipboard = this._clipboard;
    console.log(_clipboard);
    if(_clipboard){
      _clipboard.clone((clonedObj)=> {
        this.canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
        });
        if (clonedObj.type === 'activeSelection') { //more than one
          // active selection needs a reference to the canvas.
          clonedObj.canvas = this.canvas;
          clonedObj.forEachObject((obj) =>{
            this.canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          this.canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        this.canvas.setActiveObject(clonedObj);
        this.canvas.requestRenderAll();
      });
    }
  }
  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return '';
    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  };

  setActiveStyle(styleName, value, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = { };
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    }
    else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.requestRenderAll();
  };
}

export default CardDesigner

export{CardDesigner}