var MFAC = { version : "2" ,StartData : "2019.8.8" };

var CanvasType = document.getElementById('canvas');//获取canvas标签
CanvasType.width = screen.width;//设定canvas尺寸
CanvasType.height = screen.height;
MFAC.gl = CanvasType.getContext('webgl') || CanvasType.getContext('experimental-webgl');//获取上下文
//MFAC.gl.enable(MFAC.gl.DEPTH_TEST);//开启隐藏面消除
/*MFAC.gl.enable(MFAC.gl.BLEND);//开启混合功能
MFAC.gl.blendFunc(MFAC.gl.SRC_ALPHA, MFAC.gl.SRC_COLOR);//指定混合函数*/


MFAC.Camera = new Object();
MFAC.Init = new Object();
MFAC.Geometry = new Object();
MFAC.readFile = new Object();

MFAC.CanvasType = CanvasType;

//暂不考虑继承的使用，等到第二版写完后，下一轮再进行优化
//在双面绘制上使用了一个捷径，就是一个三角面没有绘制两次（正反面），而是去掉光线与法线点积的绝对值，
 