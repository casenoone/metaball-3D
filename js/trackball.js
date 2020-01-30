MFAC.TrackBall = function(object, domElement) {
//基于THREEJS的TrackballControls.js开发	
	this.rotateSpeed = 1.5;
	this.panSpeed    = 1.5;
	this.zoomSpeed   = 1.5;
	this.target      = new MFAC.Vector3(0, 0, 0);
	this.object      = object;
	this.noRotate    = false;
	this.noRoll      = false;
	this.noPan       = false;
	this.noZoom      = false;
	this.screen      = { left: 0, top: 0, width: MFAC.CanvasType.width, height : MFAC.CanvasType.height };
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };

 	var _this = this;
	var _eye  = new MFAC.Vector3(0, 0, 0);

	var _state = STATE.NONE;
	var _rotateStart = new MFAC.Vector3(0, 0, 0);
	var _rotateEnd   = new MFAC.Vector3(0, 0, 0);
	var _panEnd      = new MFAC.Vector3(0, 0, 0);
	var _panStart    = new MFAC.Vector3(0, 0, 0);
	var _zoomStart   = new MFAC.Vector2(0, 0);
	var _zoomEnd     = new MFAC.Vector2(0, 0);

	this.getMouseOnScreen = function ( clientX, clientY ) {

		return new MFAC.Vector2(
			( clientX - _this.screen.left ) / _this.screen.width,
			( clientY - _this.screen.top ) / _this.screen.height
		);

	};

	
	this.getMouseProjectionOnBall = function ( clientX, clientY ) {

		var mouseOnBall = new MFAC.Vector3(
			( clientX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width*.5),
			( _this.screen.height * 0.5 + _this.screen.top - clientY ) / (_this.screen.height*.5),
			0.0
		);

		var length = mouseOnBall.length();

		if ( !_this.noRoll ) {

			if ( length < Math.SQRT1_2 ) {

				mouseOnBall.z = Math.sqrt( 1.0 - length*length );

			} else {

				mouseOnBall.z = .5 / length;
				
			}

		} else if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		
		_eye.copy(_this.object.position);
		_eye.copy(_eye.subtract(_this.target));

		var projection = _this.object.up.clone().setLength( mouseOnBall.y );
		projection.copy(projection.add(_this.object.up.clone().cross(_eye).setLength(mouseOnBall.x)));
		projection.copy(projection.add(_eye.setLength(mouseOnBall.z)));

		return projection;

	},


	this.update = function() {

		_eye.copy(_this.object.position.subtract(_this.target));//更新相机视线
		
		if(!_this.noRotate) {

			_this.rotateCamera();

		}

		if(!_this.noPan) {

			_this.panCamera();

		}

		if(!_this.noZoom) {

			_this.zoomCamera();

		}
		

		_this.object.position.copy(_this.target.add(_eye));//更新相机位置*/
		//_this.object.lookAt( _this.target );//让相机指向更新后的target

	}

	this.rotateCamera = function() {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

			if(_state == STATE.ROTATE) { 



				if(angle) {

					var axis = _rotateStart.cross(_rotateEnd).normalize();
					var quaternion = new MFAC.Quaternion();
					angle *= _this.rotateSpeed;
					quaternion.setFromAxisAngle( axis, -angle );
					_eye.applyQuaternion( quaternion );
					_this.object.up.applyQuaternion( quaternion );
					_rotateEnd.applyQuaternion( quaternion );

				} 


			}

			


	};


	this.panCamera = function () {

		var mouseChange = _panEnd.subtract( _panStart );

		if(_state == STATE.PAN) {

			if ( mouseChange.sqrLength() ) {
				
				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );
				var pan = _eye.cross( _this.object.up ).setLength( mouseChange.x );
				pan.copy(pan.add(_this.object.up.clone().setLength( mouseChange.y )));

				_this.object.position.copy(_this.object.position.add( pan ));
				_this.target.copy(_this.target.add( pan ));
				_this.object.center.copy(_this.target);
				_panStart = _panEnd;


			}

		}

		

	};


	this.zoomCamera = function () {

		if(_state == STATE.ZOOM) {

			var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );
				_zoomStart.copy( _zoomEnd );

			}

			_state = STATE.NONE;


		}


	}



	document.onmousedown=function (ev) {

		   var Event=ev||event; 
		   if(Event.button == 0){//左键按下

		   		_state = STATE.PAN;
		   		_panStart = _this.getMouseOnScreen( Event.clientX, Event.clientY );
				_panEnd.copy(_panStart);

   			}

   			if(Event.button == 2) {//右键按下
   			
   				_state = STATE.ROTATE;
   				_rotateStart = _this.getMouseProjectionOnBall( Event.clientX, Event.clientY );
				_rotateEnd.copy(_rotateStart);


   			}

	}


	document.onmouseup = function(ev){

		_state = STATE.NONE;

	}

	document.onmousemove = function(ev) {
			
		var Event=ev||event; 
		
		if(_state == STATE.ROTATE){

   			_rotateEnd = _this.getMouseProjectionOnBall( Event.clientX, Event.clientY );
		
		}

		if(_state == STATE.PAN) {

			_panEnd = _this.getMouseOnScreen(Event.clientX, Event.clientY);

		}



	}


	var scrollFunc=function(e) {
		
		_state = STATE.ZOOM;

		e=e || window.event;
		var delta = 0;

		if ( e.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = e.wheelDelta / 40;

		} else if ( e.detail ) { // Firefox

			delta = - e.detail / 3;

		}

		_zoomStart.y += delta * 0.01;


		
	}


	
	if(document.addEventListener){
     
        document.addEventListener('DOMMouseScroll',scrollFunc,false);
 	
 	}
 	document.onmousewheel=scrollFunc;
 	document.oncontextmenu = function(){//禁止鼠标右键弹出菜单
    	
    	return false;
    
    }
	
}