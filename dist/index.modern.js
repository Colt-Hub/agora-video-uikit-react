import React, { useContext, useState, createContext, useEffect, useRef, useReducer } from 'react';
import AgoraRTC, { AgoraVideoPlayer, createClient, createMicrophoneAndCameraTracks, createCameraVideoTrack } from 'agora-rtc-react';
import VirtualBackgroundExtension from 'agora-extension-virtual-background';
import AgoraRTM, { createLazyChannel, createLazyClient } from 'agora-rtm-react';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

var remoteTrackState;
(function (remoteTrackState) {
  remoteTrackState[remoteTrackState["yes"] = 0] = "yes";
  remoteTrackState[remoteTrackState["subbed"] = 1] = "subbed";
  remoteTrackState[remoteTrackState["no"] = 2] = "no";
})(remoteTrackState || (remoteTrackState = {}));
var layout;
(function (layout) {
  layout[layout["grid"] = 0] = "grid";
  layout[layout["pin"] = 1] = "pin";
})(layout || (layout = {}));
var ToggleState;
(function (ToggleState) {
  ToggleState[ToggleState["disabled"] = 0] = "disabled";
  ToggleState[ToggleState["enabled"] = 1] = "enabled";
  ToggleState[ToggleState["disabling"] = 2] = "disabling";
  ToggleState[ToggleState["enabling"] = 3] = "enabling";
})(ToggleState || (ToggleState = {}));
var initialValue = {
  rtcProps: {
    appId: '',
    channel: '',
    role: 'host'
  },
  rtmProps: {}
};
var PropsContext = React.createContext(initialValue);
var PropsProvider = PropsContext.Provider;

var icons = {
  videocam: React.createElement(React.Fragment, null, React.createElement("polygon", {
    points: '23 7 16 12 23 17 23 7'
  }), React.createElement("rect", {
    x: '1',
    y: '5',
    width: '15',
    height: '14',
    rx: '2',
    ry: '2'
  })),
  videocamOff: React.createElement(React.Fragment, null, React.createElement("path", {
    d: 'M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10'
  }), React.createElement("line", {
    x1: '1',
    y1: '1',
    x2: '23',
    y2: '23'
  })),
  remoteSwap: React.createElement(React.Fragment, null, React.createElement("polyline", {
    points: '15 3 21 3 21 9'
  }), React.createElement("polyline", {
    points: '9 21 3 21 3 15'
  }), React.createElement("line", {
    x1: '21',
    y1: '3',
    x2: '14',
    y2: '10'
  }), React.createElement("line", {
    x1: '3',
    y1: '21',
    x2: '10',
    y2: '14'
  })),
  callEnd: React.createElement(React.Fragment, null, React.createElement("path", {
    d: 'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91'
  }), React.createElement("line", {
    x1: '23',
    y1: '1',
    x2: '1',
    y2: '23'
  })),
  mic: React.createElement(React.Fragment, null, React.createElement("path", {
    d: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'
  }), React.createElement("path", {
    d: 'M19 10v2a7 7 0 0 1-14 0v-2'
  }), React.createElement("line", {
    x1: '12',
    y1: '19',
    x2: '12',
    y2: '23'
  }), React.createElement("line", {
    x1: '8',
    y1: '23',
    x2: '16',
    y2: '23'
  })),
  micOff: React.createElement(React.Fragment, null, React.createElement("line", {
    x1: '1',
    y1: '1',
    x2: '23',
    y2: '23'
  }), React.createElement("path", {
    d: 'M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6'
  }), React.createElement("path", {
    d: 'M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23'
  }), React.createElement("line", {
    x1: '12',
    y1: '19',
    x2: '12',
    y2: '23'
  }), React.createElement("line", {
    x1: '8',
    y1: '23',
    x2: '16',
    y2: '23'
  })),
  screen: React.createElement(React.Fragment, null, React.createElement("rect", {
    x: '2',
    y: '3',
    width: '20',
    height: '14',
    rx: '2',
    ry: '2'
  }), React.createElement("line", {
    x1: '8',
    y1: '21',
    x2: '16',
    y2: '21'
  }), React.createElement("line", {
    x1: '12',
    y1: '17',
    x2: '12',
    y2: '21'
  })),
  stop: React.createElement(React.Fragment, null, React.createElement("line", {
    x1: '18',
    y1: '6',
    x2: '6',
    y2: '18'
  }), React.createElement("line", {
    x1: '6',
    y1: '6',
    x2: '18',
    y2: '18'
  })),
  fullScreen: React.createElement(React.Fragment, null, React.createElement("path", {
    d: 'M0.31456 13.6441L0.314903 13.7441L0.414903 13.7438L5.74537 13.7255L5.84537 13.7251L5.84502 13.6251L5.84009 12.1862L5.83974 12.0863L5.73975 12.0866L2.82959 12.0966L2.82925 12.0966L1.94516 12.0966L1.94516 11.2189L1.94516 11.2185L1.93517 8.30803L1.93483 8.20803L1.83483 8.20838L0.395932 8.21331L0.295932 8.21366L0.296275 8.31366L0.31456 13.6441ZM0.287412 5.73018L0.287755 5.83018L0.387754 5.82984L1.82665 5.8249L1.92665 5.82456L1.92631 5.72456L1.91689 2.97864L1.93333 2.09348L2.79459 2.09348L2.79493 2.09348L5.57462 2.08394L5.67462 2.0836L5.67428 1.9836L5.66934 0.544703L5.669 0.444703L5.569 0.445046L0.369343 0.462884L0.269343 0.463228L0.269686 0.563227L0.287412 5.73018ZM8.2285 13.617L8.22884 13.717L8.32884 13.7166L13.4958 13.6989L13.5958 13.6986L13.5955 13.5986L13.5777 8.43161L13.5774 8.33161L13.4774 8.33195L12.0385 8.33689L11.9385 8.33723L11.9388 8.43723L11.9483 11.1839L11.9483 11.1842L11.9483 12.0683L11.0706 12.0683L11.0702 12.0683L8.32322 12.0777L8.22322 12.0781L8.22357 12.1781L8.2285 13.617ZM8.18856 1.97498L8.18891 2.07498L8.28891 2.07463L11.0343 2.06521L11.9284 2.09065L11.92 2.94192L11.92 2.94192L11.92 2.94325L11.9294 5.69024L11.9297 5.79024L12.0297 5.7899L13.4686 5.78496L13.5686 5.78462L13.5683 5.68462L13.5506 0.517667L13.5502 0.417667L13.4502 0.41801L8.28328 0.435736L8.18328 0.436079L8.18363 0.536078L8.18856 1.97498Z',
    fill: 'white',
    stroke: 'white',
    strokeWidth: '0.2'
  })),
  switchCamera: React.createElement(React.Fragment, null, React.createElement("path", {
    d: 'M17.2315 9.27891L14.3054 12.2422L15.3695 13.2898L16.5517 12.0925C16.4138 13.5293 15.9212 14.6966 15.0739 15.5946C14.2266 16.4925 13.202 16.9415 12 16.9415C11.665 16.9415 11.3744 16.9166 11.1281 16.8667C10.8818 16.8168 10.6502 16.7419 10.4335 16.6422L9.3399 17.7197C9.75369 17.9791 10.1724 18.1637 10.5961 18.2735C11.0197 18.3832 11.4877 18.4381 12 18.4381C13.6749 18.4381 15.069 17.8494 16.1823 16.6721C17.2956 15.4948 17.9015 13.9882 18 12.1524L19.1232 13.2898L20.1872 12.2422L17.2315 9.27891ZM6.82759 15.415L9.75369 12.4517L8.68966 11.4041L7.50739 12.6014C7.64532 11.1646 8.13793 9.99728 8.98522 9.09932C9.83251 8.20136 10.8571 7.75238 12.0591 7.75238C12.3941 7.75238 12.6847 7.77732 12.931 7.82721C13.1773 7.8771 13.4089 7.95193 13.6256 8.0517L14.7192 6.97415C14.3054 6.71474 13.8867 6.53016 13.4631 6.42041C13.0394 6.31066 12.5714 6.25578 12.0591 6.25578C10.3842 6.25578 8.99015 6.84444 7.87685 8.02177C6.76355 9.19909 6.15764 10.7057 6.05911 12.5415L4.93596 11.4041L3.87192 12.4517L6.82759 15.415ZM2.00985 22C1.47783 22 1.00985 21.7955 0.605911 21.3864C0.20197 20.9773 0 20.5034 0 19.9646V4.72925C0 4.19048 0.20197 3.71655 0.605911 3.30748C1.00985 2.89841 1.47783 2.69388 2.00985 2.69388H6.26601L8.48276 0H15.5172L17.734 2.69388H21.9901C22.5222 2.69388 22.9901 2.89841 23.3941 3.30748C23.798 3.71655 24 4.19048 24 4.72925V19.9646C24 20.5034 23.798 20.9773 23.3941 21.3864C22.9901 21.7955 22.5222 22 21.9901 22H2.00985ZM21.9901 19.9646V4.72925H16.8177L14.5714 2.06531H9.42857L7.18227 4.72925H2.00985V19.9646H21.9901Z',
    fill: 'white',
    stroke: 'white',
    strokeWidth: '0.2'
  }))
};

var BtnTemplate = function BtnTemplate(props) {
  var onClick = props.onClick,
    name = props.name,
    disabled = props.disabled,
    style = props.style;
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps;
  var _ref = styleProps || {},
    theme = _ref.theme,
    BtnTemplateStyles = _ref.BtnTemplateStyles,
    iconSize = _ref.iconSize,
    customIcon = _ref.customIcon;
  return React.createElement("div", {
    style: _extends({}, {
      width: 35,
      height: 35,
      borderRadius: '100%',
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: '#fff',
      backgroundColor: 'rgba(0,80,180,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      cursor: disabled ? 'auto' : 'pointer',
      margin: 4
    }, BtnTemplateStyles, style),
    onClick: onClick
  }, customIcon && customIcon[name] ? React.createElement("img", {
    src: customIcon[name],
    alt: name
  }) : React.createElement("svg", {
    style: {
      width: iconSize || 24,
      height: iconSize || 24
    },
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    opacity: disabled ? '0.5' : '1',
    stroke: theme || '#fff',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, icons[name]));
};

function EndCall() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    callbacks = _useContext.callbacks;
  var _ref = styleProps || {},
    localBtnStyles = _ref.localBtnStyles;
  var _ref2 = localBtnStyles || {},
    endCall = _ref2.endCall;
  return React.createElement(BtnTemplate, {
    style: endCall || {
      backgroundColor: '#ef5588',
      borderColor: '#f00'
    },
    name: 'callEnd',
    onClick: function onClick() {
      return (callbacks === null || callbacks === void 0 ? void 0 : callbacks.EndCall) && callbacks.EndCall();
    }
  });
}

function FullScreen() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    callbacks = _useContext.callbacks;
  var _ref = styleProps || {},
    localBtnStyles = _ref.localBtnStyles;
  var _ref2 = localBtnStyles || {},
    fullScreen = _ref2.fullScreen,
    normalScreen = _ref2.normalScreen;
  var _useState = useState('fullScreen'),
    action = _useState[0],
    setAction = _useState[1];
  var onClick = function onClick() {
    if (action === 'fullScreen') {
      (callbacks === null || callbacks === void 0 ? void 0 : callbacks.FullScreen) && callbacks.FullScreen();
      setAction('normal');
    }
    if (action === 'normal') {
      (callbacks === null || callbacks === void 0 ? void 0 : callbacks.NormalScreen) && callbacks.NormalScreen();
      setAction('fullScreen');
    }
  };
  return React.createElement("div", null, React.createElement(BtnTemplate, {
    style: action === 'fullScreen' ? fullScreen : normalScreen || fullScreen,
    name: 'fullScreen',
    onClick: onClick
  }));
}

var MaxUidContext = React.createContext([]);
var MaxUidProvider = MaxUidContext.Provider;
var MaxUidConsumer = MaxUidContext.Consumer;

var MinUidContext = React.createContext([]);
var MinUidProvider = MinUidContext.Provider;
var MinUidConsumer = MinUidContext.Consumer;

var TracksContext = React.createContext({});
var TracksProvider = TracksContext.Provider;

var LocalContext = createContext({});
var LocalUserContext = function LocalUserContext(props) {
  var _useContext = useContext(TracksContext),
    localAudioTrack = _useContext.localAudioTrack;
  var max = useContext(MaxUidContext);
  var min = useContext(MinUidContext);
  var localUser;
  if (max[0].uid === 0) {
    localUser = max[0];
  } else {
    localUser = min.find(function (u) {
      return u.uid === 0;
    });
  }
  localUser.hasAudio = localAudioTrack !== null && localAudioTrack !== void 0 && localAudioTrack.enabled ? 1 : 0;
  return React.createElement(LocalContext.Provider, {
    value: localUser
  }, props.children);
};

var RtcContext = React.createContext({});
var RtcProvider = RtcContext.Provider;
var RtcConsumer = RtcContext.Consumer;

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var muteAudio = (function (user, dispatch, localAudioTrack, callbacks) {
  try {
    var _temp3 = function () {
      if (user.uid === 0) {
        var localState = user.hasAudio;
        var _temp2 = function () {
          if (localState === ToggleState.enabled || localState === ToggleState.disabled) {
            var newState = localState === ToggleState.enabled ? ToggleState.disabling : ToggleState.enabling;
            dispatch({
              type: 'local-user-mute-audio',
              value: [newState]
            });
            callbacks && callbacks['local-user-mute-audio'] && callbacks['local-user-mute-audio'](newState);
            var _temp = _catch(function () {
              return Promise.resolve(localAudioTrack === null || localAudioTrack === void 0 ? void 0 : localAudioTrack.setEnabled(localState !== ToggleState.enabled)).then(function () {
                newState = localState === ToggleState.enabled ? ToggleState.disabled : ToggleState.enabled;
                callbacks && callbacks['local-user-mute-audio'] && callbacks['local-user-mute-audio'](newState);
                dispatch({
                  type: 'local-user-mute-audio',
                  value: [localState === ToggleState.enabled ? ToggleState.disabled : ToggleState.enabled]
                });
              });
            }, function () {
              dispatch({
                type: 'local-user-mute-audio',
                value: [localState]
              });
            });
            if (_temp && _temp.then) return _temp.then(function () {});
          }
        }();
        if (_temp2 && _temp2.then) return _temp2.then(function () {});
      }
    }();
    return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
});

function LocalAudioMute() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    callbacks = _useContext.callbacks;
  var _ref = styleProps || {},
    localBtnStyles = _ref.localBtnStyles;
  var _ref2 = localBtnStyles || {},
    muteLocalAudio = _ref2.muteLocalAudio,
    unmuteLocalAudio = _ref2.unmuteLocalAudio;
  var _useContext2 = useContext(RtcContext),
    dispatch = _useContext2.dispatch,
    localAudioTrack = _useContext2.localAudioTrack;
  var local = useContext(LocalContext);
  return React.createElement("div", null, React.createElement(BtnTemplate, {
    style: local.hasAudio === ToggleState.enabled ? muteLocalAudio : unmuteLocalAudio || muteLocalAudio,
    name: local.hasAudio === ToggleState.enabled ? 'mic' : 'micOff',
    onClick: function onClick() {
      return localAudioTrack && muteAudio(local, dispatch, localAudioTrack, callbacks);
    }
  }));
}

function LocalCameraSwitch() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps;
  var _ref = styleProps || {},
    localBtnStyles = _ref.localBtnStyles;
  var _ref2 = localBtnStyles || {},
    switchCameraButton = _ref2.switchCamera;
  var _useContext2 = useContext(RtcContext),
    switchCamera = _useContext2.switchCamera;
  return React.createElement("div", null, React.createElement(BtnTemplate, {
    style: switchCameraButton,
    name: 'switchCamera',
    onClick: switchCamera
  }));
}

var muteVideo = (function (user, dispatch, localVideoTrack, callbacks) {
  try {
    var _temp3 = function () {
      if (user.uid === 0) {
        var localState = user.hasVideo;
        var _temp2 = function () {
          if (localState === ToggleState.enabled || localState === ToggleState.disabled) {
            var newState = localState === ToggleState.enabled ? ToggleState.disabling : ToggleState.enabling;
            dispatch({
              type: 'local-user-mute-video',
              value: [newState]
            });
            callbacks && callbacks['local-user-mute-video'] && callbacks['local-user-mute-video'](newState);
            var _temp = _catch(function () {
              return Promise.resolve(localVideoTrack === null || localVideoTrack === void 0 ? void 0 : localVideoTrack.setEnabled(localState !== ToggleState.enabled)).then(function () {
                newState = localState === ToggleState.enabled ? ToggleState.disabled : ToggleState.enabled;
                callbacks && callbacks['local-user-mute-video'] && callbacks['local-user-mute-video'](newState);
                dispatch({
                  type: 'local-user-mute-video',
                  value: [newState]
                });
              });
            }, function () {
              dispatch({
                type: 'local-user-mute-video',
                value: [localState]
              });
            });
            if (_temp && _temp.then) return _temp.then(function () {});
          }
        }();
        if (_temp2 && _temp2.then) return _temp2.then(function () {});
      }
    }();
    return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
  } catch (e) {
    return Promise.reject(e);
  }
});

function LocalVideoMute() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    callbacks = _useContext.callbacks;
  var _ref = styleProps || {},
    localBtnStyles = _ref.localBtnStyles;
  var _ref2 = localBtnStyles || {},
    muteLocalVideo = _ref2.muteLocalVideo,
    unmuteLocalVideo = _ref2.unmuteLocalVideo;
  var _useContext2 = useContext(RtcContext),
    dispatch = _useContext2.dispatch,
    localVideoTrack = _useContext2.localVideoTrack;
  var local = useContext(LocalContext);
  return React.createElement("div", null, React.createElement(BtnTemplate, {
    style: local.hasVideo === ToggleState.enabled ? muteLocalVideo : unmuteLocalVideo || muteLocalVideo,
    name: local.hasVideo === ToggleState.enabled ? 'videocam' : 'videocamOff',
    onClick: function onClick() {
      return localVideoTrack && muteVideo(local, dispatch, localVideoTrack, callbacks);
    }
  }));
}

function Screenshare() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps;
  var _ref = styleProps || {},
    localBtnStyles = _ref.localBtnStyles;
  var _ref2 = localBtnStyles || {},
    screenshare = _ref2.screenshare;
  var _useContext2 = useContext(RtcContext),
    toggleScreensharing = _useContext2.toggleScreensharing,
    isScreensharing = _useContext2.isScreensharing;
  return React.createElement("div", null, React.createElement(BtnTemplate, {
    style: screenshare,
    name: isScreensharing ? 'stop' : 'screen',
    onClick: function onClick() {
      return toggleScreensharing();
    }
  }));
}

var Timer = function Timer() {
  var _useState = useState(0),
    counter = _useState[0],
    setCounter = _useState[1];
  useEffect(function () {
    var timer = setInterval(function () {
      return setCounter(counter + 1);
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, [counter]);
  var minutes = Math.trunc(counter / 60);
  var seconds = counter - minutes * 60;
  return React.createElement("p", {
    style: {
      color: 'white',
      fontSize: 14,
      paddingLeft: 30,
      paddingRight: 30
    }
  }, minutes + ":" + (seconds < 10 ? "0" + seconds : seconds));
};

function LocalControls() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    rtcProps = _useContext.rtcProps;
  var _ref = styleProps || {},
    localBtnContainer = _ref.localBtnContainer,
    _ref$showTimer = _ref.showTimer,
    showTimer = _ref$showTimer === void 0 ? false : _ref$showTimer,
    _ref$showSwapButton = _ref.showSwapButton,
    showSwapButton = _ref$showSwapButton === void 0 ? false : _ref$showSwapButton,
    _ref$showEndCallButto = _ref.showEndCallButton,
    showEndCallButton = _ref$showEndCallButto === void 0 ? true : _ref$showEndCallButto,
    _ref$localBtnWrapper = _ref.localBtnWrapper,
    localBtnWrapper = _ref$localBtnWrapper === void 0 ? {} : _ref$localBtnWrapper;
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return React.createElement("div", {
    style: _extends({}, {
      backgroundColor: '#007bff',
      width: '100%',
      height: 70,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    }, localBtnContainer)
  }, React.createElement("div", {
    id: 'wrapper',
    style: _extends({
      width: 350,
      flexDirection: 'row',
      display: 'flex'
    }, localBtnWrapper)
  }, rtcProps.role !== 'audience' && showTimer && React.createElement(Timer, null), rtcProps.role !== 'audience' && React.createElement(LocalVideoMute, null), rtcProps.role !== 'audience' && React.createElement(LocalAudioMute, null), isMobile && rtcProps.role !== 'audience' && showSwapButton && React.createElement(LocalCameraSwitch, null), rtcProps.role !== 'audience' && React.createElement(FullScreen, null), rtcProps.role !== 'audience' && rtcProps.enableScreensharing && React.createElement(Screenshare, null), showEndCallButton && React.createElement(EndCall, null)));
}

var rtmStatusEnum;
(function (rtmStatusEnum) {
  rtmStatusEnum[rtmStatusEnum["initFailed"] = 0] = "initFailed";
  rtmStatusEnum[rtmStatusEnum["offline"] = 1] = "offline";
  rtmStatusEnum[rtmStatusEnum["initialising"] = 2] = "initialising";
  rtmStatusEnum[rtmStatusEnum["loggingIn"] = 3] = "loggingIn";
  rtmStatusEnum[rtmStatusEnum["loggedIn"] = 4] = "loggedIn";
  rtmStatusEnum[rtmStatusEnum["connected"] = 5] = "connected";
  rtmStatusEnum[rtmStatusEnum["loginFailed"] = 6] = "loginFailed";
})(rtmStatusEnum || (rtmStatusEnum = {}));
var clientRoleRaw;
(function (clientRoleRaw) {
  clientRoleRaw[clientRoleRaw["broadcaster"] = 0] = "broadcaster";
  clientRoleRaw[clientRoleRaw["audience"] = 1] = "audience";
})(clientRoleRaw || (clientRoleRaw = {}));
var mutingDevice;
(function (mutingDevice) {
  mutingDevice[mutingDevice["camera"] = 0] = "camera";
  mutingDevice[mutingDevice["microphone"] = 1] = "microphone";
})(mutingDevice || (mutingDevice = {}));
var popUpStateEnum;
(function (popUpStateEnum) {
  popUpStateEnum[popUpStateEnum["closed"] = 0] = "closed";
  popUpStateEnum[popUpStateEnum["muteMic"] = 1] = "muteMic";
  popUpStateEnum[popUpStateEnum["muteCamera"] = 2] = "muteCamera";
  popUpStateEnum[popUpStateEnum["unmuteMic"] = 3] = "unmuteMic";
  popUpStateEnum[popUpStateEnum["unmuteCamera"] = 4] = "unmuteCamera";
})(popUpStateEnum || (popUpStateEnum = {}));
var RtmContext = createContext(null);
var RtmProvider = RtmContext.Provider;
var RtmConsumer = RtmContext.Consumer;

function PopUp() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps;
  var _useContext2 = useContext(RtmContext),
    popUpState = _useContext2.popUpState,
    setPopUpState = _useContext2.setPopUpState;
  var _ref = styleProps || {},
    popUpContainer = _ref.popUpContainer;
  var _useContext3 = useContext(RtcContext),
    dispatch = _useContext3.dispatch,
    localVideoTrack = _useContext3.localVideoTrack,
    localAudioTrack = _useContext3.localAudioTrack;
  var local = useContext(LocalContext);
  return popUpState !== popUpStateEnum.closed ? React.createElement("div", {
    style: _extends({}, styles.container, popUpContainer)
  }, React.createElement("div", {
    style: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 700
    }
  }, popUpState === popUpStateEnum.muteCamera || popUpState === popUpStateEnum.muteMic ? 'Mute ' : 'Unmute ', popUpState === popUpStateEnum.muteCamera || popUpState === popUpStateEnum.unmuteCamera ? 'Camera' : 'Mic', "?"), React.createElement("div", {
    style: {
      flexDirection: 'row',
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around'
    }
  }, React.createElement("div", {
    onClick: function onClick() {
      switch (popUpState) {
        case popUpStateEnum.muteCamera:
          local.hasVideo && localVideoTrack && muteVideo(local, dispatch, localVideoTrack);
          break;
        case popUpStateEnum.muteMic:
          local.hasAudio && localAudioTrack && muteAudio(local, dispatch, localAudioTrack);
          break;
        case popUpStateEnum.unmuteCamera:
          !local.hasVideo && localVideoTrack && muteVideo(local, dispatch, localVideoTrack);
          break;
        case popUpStateEnum.unmuteMic:
          !local.hasAudio && localAudioTrack && muteAudio(local, dispatch, localAudioTrack);
          break;
      }
      setPopUpState(popUpStateEnum.closed);
    },
    style: styles.button
  }, "Confirm"), React.createElement("div", {
    style: styles.buttonClose,
    onClick: function onClick() {
      return setPopUpState(popUpStateEnum.closed);
    }
  }, "Close"))) : null;
}
var styles = {
  button: {
    color: '#fff',
    cursor: 'pointer',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    padding: '2px 4px',
    borderRadius: 4
  },
  buttonClose: {
    color: '#fff',
    cursor: 'pointer',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    padding: '2px 4px',
    borderRadius: 4
  },
  container: {
    backgroundColor: '#007bffaa',
    position: 'absolute',
    width: 240,
    height: 80,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
};

function RemoteAudioMute(props) {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps;
  var _ref = styleProps || {},
    remoteBtnStyles = _ref.remoteBtnStyles;
  var _useContext2 = useContext(RtmContext),
    sendMuteRequest = _useContext2.sendMuteRequest,
    uidMap = _useContext2.uidMap;
  var _ref2 = remoteBtnStyles || {},
    muteRemoteAudio = _ref2.muteRemoteAudio;
  var UIKitUser = props.UIKitUser;
  var isMuted = UIKitUser.hasAudio === remoteTrackState.no;
  return UIKitUser.uid !== 0 && uidMap[UIKitUser.uid] ? React.createElement("div", null, React.createElement(BtnTemplate, {
    style: muteRemoteAudio,
    name: UIKitUser.hasAudio === remoteTrackState.subbed ? 'mic' : 'micOff',
    onClick: function onClick() {
      return sendMuteRequest(mutingDevice.microphone, UIKitUser.uid, !isMuted);
    }
  })) : null;
}

function RemoteVideoMute(props) {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps;
  var _useContext2 = useContext(RtmContext),
    sendMuteRequest = _useContext2.sendMuteRequest,
    uidMap = _useContext2.uidMap;
  var _ref = styleProps || {},
    remoteBtnStyles = _ref.remoteBtnStyles;
  var _ref2 = remoteBtnStyles || {},
    muteRemoteVideo = _ref2.muteRemoteVideo;
  var UIKitUser = props.UIKitUser;
  var isMuted = UIKitUser.hasVideo === remoteTrackState.no;
  return UIKitUser.uid !== 0 && uidMap[UIKitUser.uid] ? React.createElement("div", null, React.createElement(BtnTemplate, {
    name: UIKitUser.hasVideo === remoteTrackState.subbed ? 'videocam' : 'videocamOff',
    style: muteRemoteVideo,
    onClick: function onClick() {
      return sendMuteRequest(mutingDevice.camera, UIKitUser.uid, !isMuted);
    }
  })) : null;
}

var Username = function Username(props) {
  var _useContext = useContext(RtmContext),
    usernames = _useContext.usernames;
  var _useContext2 = useContext(PropsContext),
    rtmProps = _useContext2.rtmProps,
    styleProps = _useContext2.styleProps;
  var user = props.user;
  return rtmProps !== null && rtmProps !== void 0 && rtmProps.displayUsername ? React.createElement("p", {
    style: _extends({}, styles$1.username, styleProps === null || styleProps === void 0 ? void 0 : styleProps.usernameText)
  }, user.uid === 1 ? 'Screenshare' : usernames[user.uid]) : React.createElement(React.Fragment, null);
};
var styles$1 = {
  username: {
    position: 'absolute',
    background: '#007bffaa',
    padding: '2px 8px',
    color: '#fff',
    margin: 0,
    bottom: 0,
    right: 0,
    zIndex: 90
  }
};

function SwapUser(props) {
  var _useContext = useContext(RtcContext),
    dispatch = _useContext.dispatch;
  var UIKitUser = props.UIKitUser;
  return React.createElement("div", null, React.createElement(BtnTemplate, {
    name: 'remoteSwap',
    onClick: function onClick() {
      return dispatch({
        type: 'user-swap',
        value: [UIKitUser]
      });
    }
  }));
}

var VideoPlaceholder = function VideoPlaceholder(props) {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    rtcProps = _useContext.rtcProps;
  var _ref = styleProps || {},
    maxViewStyles = _ref.maxViewStyles,
    maxViewOverlayContainer = _ref.maxViewOverlayContainer;
  var user = props.user;
  var CustomVideoPlaceholder = rtcProps.CustomVideoPlaceholder;
  return !CustomVideoPlaceholder ? React.createElement("div", {
    key: user.uid,
    style: _extends({}, style.max, maxViewStyles)
  }, React.createElement("div", {
    style: style.imgContainer
  }, React.createElement("img", {
    style: style.img,
    src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+'
  })), props.isShown && React.createElement("div", {
    style: _extends({}, style.btnContainer, maxViewOverlayContainer)
  }, props.showButtons && React.createElement(React.Fragment, null, !rtcProps.disableRtm && React.createElement(RemoteVideoMute, {
    UIKitUser: user
  }), !rtcProps.disableRtm && React.createElement(RemoteAudioMute, {
    UIKitUser: user
  }), props.showSwap && React.createElement(SwapUser, {
    UIKitUser: user
  })))) : CustomVideoPlaceholder && CustomVideoPlaceholder(_extends({}, props), null);
};
var style = {
  max: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#007bff33',
    flexDirection: 'row',
    position: 'relative'
  },
  imgContainer: {
    flex: 10,
    display: 'flex',
    justifyContent: 'center'
  },
  img: {
    width: 100,
    height: 100,
    position: 'absolute',
    alignSelf: 'center',
    justifySelf: 'center',
    margin: 'auto',
    display: 'flex'
  },
  btnContainer: {
    position: 'absolute',
    margin: 5,
    flexDirection: 'column',
    display: 'flex'
  }
};

var MaxVideoView = function MaxVideoView(props) {
  var _useContext = useContext(RtcContext),
    mediaStore = _useContext.mediaStore;
  var _useContext2 = useContext(PropsContext),
    styleProps = _useContext2.styleProps,
    rtcProps = _useContext2.rtcProps;
  var _ref = styleProps || {},
    maxViewStyles = _ref.maxViewStyles,
    videoMode = _ref.videoMode,
    maxViewOverlayContainer = _ref.maxViewOverlayContainer;
  var renderModeProp = videoMode === null || videoMode === void 0 ? void 0 : videoMode.max;
  var _useState = useState(false),
    isShown = _useState[0],
    setIsShown = _useState[1];
  var user = props.user;
  return React.createElement("div", {
    id: 'maxvideoview',
    style: _extends({}, styles$2.container, props.style, maxViewStyles),
    onMouseEnter: function onMouseEnter() {
      return setIsShown(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setIsShown(false);
    }
  }, user.hasVideo === 1 ? React.createElement("div", {
    id: 'finishvideocontainer',
    style: styles$2.videoContainer
  }, !rtcProps.disableRtm && React.createElement(Username, {
    user: user
  }), React.createElement(AgoraVideoPlayer, {
    style: styles$2.videoplayer,
    config: {
      fit: renderModeProp || 'cover'
    },
    videoTrack: mediaStore[user.uid].videoTrack
  }), isShown && React.createElement("div", {
    style: _extends({}, styles$2.overlay, maxViewOverlayContainer)
  }, !rtcProps.disableRtm && React.createElement(RemoteVideoMute, {
    UIKitUser: user
  }), !rtcProps.disableRtm && React.createElement(RemoteAudioMute, {
    UIKitUser: user
  }))) : React.createElement("div", {
    style: styles$2.videoContainer
  }, !rtcProps.disableRtm && React.createElement(Username, {
    user: user
  }), React.createElement(VideoPlaceholder, {
    user: user,
    isShown: isShown,
    showButtons: true
  })));
};
var styles$2 = {
  container: {
    display: 'flex',
    flex: 1
  },
  videoContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative'
  },
  videoplayer: {
    width: '100%',
    display: 'flex',
    flex: 1
  },
  overlay: {
    position: 'absolute',
    margin: 5,
    flexDirection: 'column',
    display: 'flex'
  },
  username: {
    position: 'absolute',
    background: '#007bffaa',
    padding: '2px 8px',
    color: '#fff',
    margin: 0,
    bottom: 0,
    right: 0,
    zIndex: 90
  }
};

var GridVideo = function GridVideo() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    rtcProps = _useContext.rtcProps;
  var _ref = styleProps || {},
    gridVideoCells = _ref.gridVideoCells,
    gridVideoContainer = _ref.gridVideoContainer;
  var max = useContext(MaxUidContext);
  var min = useContext(MinUidContext);
  var users = rtcProps.role === 'audience' ? [].concat(max, min).filter(function (user) {
    return user.uid !== 0;
  }) : [].concat(max, min);
  var parentRef = useRef(null);
  var _useState = useState(window.innerWidth),
    width = _useState[0],
    setWidth = _useState[1];
  var _useState2 = useState(window.innerHeight),
    height = _useState2[0],
    setHeight = _useState2[1];
  var isLandscape = width > height;
  var unit = 'minmax(0, 1fr) ';
  useEffect(function () {
    var handleResize = function handleResize() {
      if (parentRef.current) {
        setWidth(parentRef.current.offsetWidth);
        setHeight(parentRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
      setHeight(parentRef.current.offsetHeight);
    }
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return React.createElement("div", {
    ref: parentRef,
    style: _extends({}, {
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: isLandscape ? users.length > 9 ? unit.repeat(4) : users.length > 4 ? unit.repeat(3) : users.length > 1 ? unit.repeat(2) : unit : users.length > 8 ? unit.repeat(3) : users.length > 2 ? unit.repeat(2) : unit
    }, gridVideoContainer)
  }, users.map(function (user) {
    return React.createElement(MaxVideoView, {
      user: user,
      style: _extends({}, {
        height: '100%',
        width: '100%'
      }, gridVideoCells),
      key: user.uid
    });
  }));
};

var MinVideoView = function MinVideoView(props) {
  var _useContext = useContext(RtcContext),
    mediaStore = _useContext.mediaStore;
  var _useContext2 = useContext(PropsContext),
    styleProps = _useContext2.styleProps,
    rtcProps = _useContext2.rtcProps;
  var _useContext3 = useContext(TracksContext),
    facingMode = _useContext3.facingMode;
  var _ref = styleProps || {},
    minViewStyles = _ref.minViewStyles,
    videoMode = _ref.videoMode,
    minViewOverlayContainer = _ref.minViewOverlayContainer,
    _ref$showSwapUser = _ref.showSwapUser,
    showSwapUser = _ref$showSwapUser === void 0 ? false : _ref$showSwapUser;
  var renderModeProp = videoMode === null || videoMode === void 0 ? void 0 : videoMode.min;
  var _useState = useState(false),
    isShown = _useState[0],
    setIsShown = _useState[1];
  var user = props.user;
  return React.createElement("div", {
    style: _extends({}, {
      display: 'flex',
      flex: 1
    }, minViewStyles),
    onMouseEnter: function onMouseEnter() {
      return setIsShown(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setIsShown(false);
    }
  }, user.hasVideo === 1 ? React.createElement("div", {
    style: _extends({}, {
      display: 'flex',
      flex: 1,
      position: 'relative'
    })
  }, React.createElement(AgoraVideoPlayer, {
    style: {
      flex: 10,
      display: 'flex',
      transform: facingMode === 'environment' ? 'scaleX(-1)' : 'none'
    },
    config: {
      fit: renderModeProp !== undefined ? renderModeProp : 'cover'
    },
    videoTrack: mediaStore[user.uid].videoTrack
  }), isShown && React.createElement("div", {
    style: _extends({}, {
      margin: 4,
      position: 'absolute',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }, minViewOverlayContainer)
  }, !rtcProps.disableRtm && React.createElement(RemoteVideoMute, {
    UIKitUser: user
  }), !rtcProps.disableRtm && React.createElement(RemoteAudioMute, {
    UIKitUser: user
  }), showSwapUser && React.createElement(SwapUser, {
    UIKitUser: user
  }))) : React.createElement(VideoPlaceholder, {
    user: user,
    isShown: isShown,
    showButtons: true,
    showSwap: true
  }));
};

var styles$3 = {"test":"_3ybTi","scrollbar":"_3Sxu7"};

var PinnedVideo = function PinnedVideo() {
  var _useContext = useContext(PropsContext),
    styleProps = _useContext.styleProps,
    rtcProps = _useContext.rtcProps;
  var max = useContext(MaxUidContext);
  var min = useContext(MinUidContext);
  var users = rtcProps.role === 'audience' ? [].concat(max, min).filter(function (user) {
    return user.uid !== 0;
  }) : [].concat(max, min);
  var _ref = styleProps || {},
    minViewContainer = _ref.minViewContainer,
    pinnedVideoContainer = _ref.pinnedVideoContainer,
    maxViewContainer = _ref.maxViewContainer,
    scrollViewContainer = _ref.scrollViewContainer;
  var parentRef = useRef(null);
  var _useState = useState(0),
    width = _useState[0],
    setWidth = _useState[1];
  var _useState2 = useState(0),
    height = _useState2[0],
    setHeight = _useState2[1];
  var isLandscape = width > height;
  useEffect(function () {
    var handleResize = function handleResize() {
      if (parentRef.current) {
        setWidth(parentRef.current.offsetWidth);
        setHeight(parentRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    if (parentRef.current) {
      setWidth(parentRef.current.offsetWidth);
      setHeight(parentRef.current.offsetHeight);
    }
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return React.createElement("div", {
    id: 'pinnedvideo',
    ref: parentRef,
    style: _extends({}, {
      display: 'flex',
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column-reverse',
      overflow: 'hidden'
    }, pinnedVideoContainer)
  }, React.createElement("div", {
    id: 'maxviewcontainer',
    style: _extends({}, {
      display: 'flex',
      flex: isLandscape ? 5 : 4
    }, maxViewContainer)
  }, React.createElement(MaxUidConsumer, null, function (maxUsers) {
    return rtcProps.role === 'audience' && maxUsers[0].uid === 0 ? null : React.createElement(MaxVideoView, {
      user: maxUsers[0]
    });
  })), (users === null || users === void 0 ? void 0 : users.length) > 1 && React.createElement("div", {
    className: styles$3.scrollbar,
    style: _extends({}, {
      overflowY: isLandscape ? 'scroll' : 'hidden',
      overflowX: !isLandscape ? 'scroll' : 'hidden',
      display: 'flex',
      flex: 1,
      flexDirection: isLandscape ? 'column' : 'row'
    }, scrollViewContainer)
  }, React.createElement(MinUidConsumer, null, function (minUsers) {
    return minUsers.map(function (user) {
      return rtcProps.role === 'audience' && user.uid === 0 ? null : React.createElement("div", {
        style: _extends({}, {
          minHeight: isLandscape ? '25vh' : '99%',
          minWidth: isLandscape ? '99%' : '40vw',
          margin: 2,
          display: 'flex'
        }, minViewContainer),
        key: user.uid
      }, React.createElement(MinVideoView, {
        user: user
      }));
    });
  })));
};

var startScreenshare = function startScreenshare(appId, channel, track, screenshareToken, screenshareUid, tokenUrl, enableDualStream) {
  try {
    var init = function init() {
      try {
        try {
          console.log(screenClient);
          if (tokenUrl) {
            screenClient.on('token-privilege-will-expire', function () {
              try {
                console.log('token will expire');
                return Promise.resolve(fetch(tokenUrl + '/rtc/' + channel + '/publisher/uid/' + uid + '/')).then(function (res) {
                  return Promise.resolve(res.json()).then(function (data) {
                    var token = data.rtcToken;
                    screenClient.renewToken(token);
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
            screenClient.on('token-privilege-did-expire', function () {
              try {
                return Promise.resolve(fetch(tokenUrl + '/rtc/' + channel + '/publisher/uid/' + uid + '/')).then(function (res) {
                  return Promise.resolve(res.json()).then(function (data) {
                    var token = data.rtcToken;
                    screenClient.renewToken(token);
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
          }
          track.on('track-ended', function () {
            screenClient.leave();
            screenClient.removeAllListeners();
          });
        } catch (e) {
          console.log(e);
        }
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };
    var join = function join() {
      try {
        screenClient.setClientRole('host');
        var _temp2 = function () {
          if (tokenUrl) {
            var _temp = _catch(function () {
              return Promise.resolve(fetch(tokenUrl + '/rtc/' + channel + '/publisher/uid/' + uid + '/')).then(function (res) {
                return Promise.resolve(res.json()).then(function (data) {
                  var token = data.rtcToken;
                  return Promise.resolve(screenClient.join(appId, channel, token, uid)).then(function (_screenClient$join) {
                    returnedUid = _screenClient$join;
                  });
                });
              });
            }, function (e) {
              console.log(e);
            });
            if (_temp && _temp.then) return _temp.then(function () {});
          } else {
            return Promise.resolve(screenClient.join(appId, channel, screenshareToken || null, uid || 0)).then(function (_screenClient$join2) {
              returnedUid = _screenClient$join2;
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    var publish = function publish() {
      try {
        var _temp6 = function _temp6() {
          var _temp4 = function () {
            if (track.enabled) {
              var _temp3 = function () {
                if (!localVideoTrackHasPublished) {
                  return Promise.resolve(screenClient.publish([track]).then(function () {
                    localVideoTrackHasPublished = true;
                  })).then(function () {});
                }
              }();
              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            }
          }();
          if (_temp4 && _temp4.then) return _temp4.then(function () {});
        };
        var _temp5 = function () {
          if (enableDualStream) {
            return Promise.resolve(screenClient.enableDualStream()).then(function () {});
          }
        }();
        return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5));
      } catch (e) {
        return Promise.reject(e);
      }
    };
    var screenClient = AgoraRTC.createClient({
      mode: 'live',
      role: 'host',
      codec: 'vp8'
    });
    var returnedUid = 0;
    var uid = screenshareUid || 1;
    var localVideoTrackHasPublished = false;
    var stop = function stop() {
      try {
        var _temp7 = _catch(function () {
          track.close();
          return Promise.resolve(screenClient.leave()).then(function () {
            screenClient.removeAllListeners();
          });
        }, function (e) {
          console.log(e);
        });
        return Promise.resolve(_temp7 && _temp7.then ? _temp7.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    stopScreenshare = stop;
    return Promise.resolve(init()).then(function () {
      return Promise.resolve(join()).then(function () {
        return Promise.resolve(publish()).then(function () {
          if (returnedUid) console.log(returnedUid);
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var stopScreenshare = function stopScreenshare() {};

var initState = {
  max: [{
    uid: 0,
    hasAudio: remoteTrackState.no,
    hasVideo: remoteTrackState.no
  }],
  min: [],
  isScreensharing: false
};
var reducer = function reducer(state, action) {
  var stateUpdate = initState;
  var uids = [].concat(state.max, state.min).map(function (u) {
    return u.uid;
  });
  switch (action.type) {
    case 'Screensharing':
      {
        stateUpdate = _extends({}, state, {
          isScreensharing: action.value[0]
        });
        console.log('!Screensharingstate', state, stateUpdate);
      }
      break;
    case 'update-user-video':
      {
        stateUpdate = {
          min: state.min.map(function (user) {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: remoteTrackState.subbed,
                hasVideo: remoteTrackState.subbed
              };
            } else {
              return user;
            }
          }),
          max: state.max.map(function (user) {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: remoteTrackState.subbed,
                hasVideo: remoteTrackState.subbed
              };
            } else {
              return user;
            }
          }),
          isScreensharing: state.isScreensharing
        };
      }
      break;
    case 'user-joined':
      {
        if (uids.indexOf(action.value[0].uid) === -1) {
          var minUpdate = [].concat(state.min, [{
            uid: action.value[0].uid,
            hasAudio: remoteTrackState.no,
            hasVideo: remoteTrackState.no
          }]);
          if (minUpdate.length === 1 && state.max[0].uid === 0) {
            stateUpdate = {
              max: minUpdate,
              min: state.max,
              isScreensharing: state.isScreensharing
            };
          } else {
            stateUpdate = {
              min: minUpdate,
              max: state.max,
              isScreensharing: state.isScreensharing
            };
          }
          console.log('****** new user joined!\n', action.value[0].uid);
        }
      }
      break;
    case 'user-unpublished':
      {
        if (state.max[0].uid === action.value[0].uid) {
          stateUpdate = {
            max: [{
              uid: action.value[0].uid,
              hasAudio: action.value[1] === 'audio' ? remoteTrackState.no : state.max[0].hasAudio,
              hasVideo: action.value[1] === 'video' ? remoteTrackState.no : state.max[0].hasVideo
            }],
            min: state.min,
            isScreensharing: state.isScreensharing
          };
        } else {
          var UIKitUser = state.min.find(function (user) {
            return user.uid === action.value[0].uid;
          });
          if (UIKitUser) {
            var _minUpdate = [].concat(state.min.filter(function (user) {
              return user.uid !== action.value[0].uid;
            }), [{
              uid: action.value[0].uid,
              hasAudio: action.value[1] === 'audio' ? remoteTrackState.no : UIKitUser.hasAudio,
              hasVideo: action.value[1] === 'video' ? remoteTrackState.no : UIKitUser.hasVideo
            }]);
            stateUpdate = {
              min: _minUpdate,
              max: state.max,
              isScreensharing: state.isScreensharing
            };
          }
        }
      }
      break;
    case 'user-published':
      {
        if (state.max[0].uid === action.value[0].uid) {
          stateUpdate = {
            max: [{
              uid: action.value[0].uid,
              hasAudio: action.value[1] === 'audio' ? remoteTrackState.subbed : state.max[0].hasAudio,
              hasVideo: action.value[1] === 'video' ? remoteTrackState.subbed : state.max[0].hasVideo
            }],
            min: state.min,
            isScreensharing: state.isScreensharing
          };
        } else {
          stateUpdate = {
            min: state.min.map(function (user) {
              if (user.uid !== action.value[0].uid) {
                return user;
              } else {
                return {
                  uid: user.uid,
                  hasAudio: action.value[1] === 'audio' ? remoteTrackState.subbed : user.hasAudio,
                  hasVideo: action.value[1] === 'video' ? remoteTrackState.subbed : user.hasVideo
                };
              }
            }),
            max: state.max,
            isScreensharing: state.isScreensharing
          };
        }
      }
      break;
    case 'user-left':
      {
        if (state.max[0].uid === action.value[0].uid) {
          var _minUpdate2 = [].concat(state.min);
          stateUpdate = {
            max: [_minUpdate2.pop()],
            min: _minUpdate2,
            isScreensharing: state.isScreensharing
          };
        } else {
          stateUpdate = {
            min: state.min.filter(function (user) {
              return user.uid !== action.value[0].uid;
            }),
            max: state.max,
            isScreensharing: state.isScreensharing
          };
        }
      }
      break;
    case 'user-swap':
      {
        if (state.max[0].uid === action.value[0].uid) ; else {
          stateUpdate = {
            max: [action.value[0]],
            min: [].concat(state.min.filter(function (user) {
              return user.uid !== action.value[0].uid;
            }), [state.max[0]]),
            isScreensharing: state.isScreensharing
          };
        }
      }
      break;
    case 'local-user-mute-video':
      {
        stateUpdate = {
          min: state.min.map(function (user) {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: user.hasAudio,
                hasVideo: action.value[0]
              };
            } else {
              return user;
            }
          }),
          max: state.max.map(function (user) {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: user.hasAudio,
                hasVideo: action.value[0]
              };
            } else {
              return user;
            }
          }),
          isScreensharing: state.isScreensharing
        };
      }
      break;
    case 'local-user-mute-audio':
      {
        stateUpdate = {
          min: state.min.map(function (user) {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: action.value[0],
                hasVideo: user.hasVideo
              };
            } else {
              return user;
            }
          }),
          max: state.max.map(function (user) {
            if (user.uid === 0) {
              return {
                uid: 0,
                hasAudio: action.value[0],
                hasVideo: user.hasVideo
              };
            } else {
              return user;
            }
          }),
          isScreensharing: state.isScreensharing
        };
      }
      break;
    case 'remote-user-mute-video':
      {
        stateUpdate = {
          min: state.min.map(function (user) {
            if (user.uid === action.value[0].uid) {
              return {
                uid: user.uid,
                hasVideo: action.value[1],
                hasAudio: user.hasAudio
              };
            } else return user;
          }),
          max: state.max.map(function (user) {
            if (user.uid === action.value[0].uid) return {
              uid: user.uid,
              hasVideo: action.value[1],
              hasAudio: user.hasAudio
            };else return user;
          }),
          isScreensharing: state.isScreensharing
        };
      }
      break;
    case 'remote-user-mute-audio':
      {
        stateUpdate = {
          min: state.min.map(function (user) {
            if (user.uid === action.value[0].uid) return {
              uid: user.uid,
              hasAudio: action.value[1],
              hasVideo: user.hasVideo
            };else return user;
          }),
          max: state.max.map(function (user) {
            if (user.uid === action.value[0].uid) return {
              uid: user.uid,
              hasAudio: action.value[1],
              hasVideo: user.hasVideo
            };else return user;
          }),
          isScreensharing: state.isScreensharing
        };
      }
      break;
    case 'leave-channel':
      stateUpdate = initState;
      break;
    case 'ActiveSpeaker':
      {
        if (state.max[0].uid === action.value[0]) {
          stateUpdate = _extends({}, state);
        } else {
          stateUpdate = {
            max: [state.min.find(function (user) {
              return user.uid === action.value[0];
            })],
            min: [].concat(state.min.filter(function (user) {
              return user.uid !== action.value[0];
            }), [state.max[0]]),
            isScreensharing: state.isScreensharing
          };
        }
      }
      break;
  }
  return _extends({}, state, stateUpdate);
};

var useClient = createClient({
  codec: 'vp8',
  mode: 'live'
});
var RtcConfigure = function RtcConfigure(props) {
  var uid = useRef();
  var screenTrack = useRef();
  var isScreensharingRef = useRef(false);
  var _useContext = useContext(TracksContext),
    localVideoTrack = _useContext.localVideoTrack,
    localAudioTrack = _useContext.localAudioTrack,
    switchCamera = _useContext.switchCamera;
  var _useContext2 = useContext(PropsContext),
    callbacks = _useContext2.callbacks,
    rtcProps = _useContext2.rtcProps;
  var _useState = useState(false),
    ready = _useState[0],
    setReady = _useState[1];
  var _useState2 = useState(false),
    channelJoined = _useState2[0],
    setChannelJoined = _useState2[1];
  var joinRes = null;
  var canJoin = useRef(new Promise(function (resolve, reject) {
    joinRes = resolve;
    console.log(reject);
  }));
  var client = useClient();
  if (rtcProps.customRtcClient) {
    client.removeAllListeners();
    client = rtcProps.customRtcClient;
  }
  var localVideoTrackHasPublished = false;
  var localAudioTrackHasPublished = false;
  var mediaStore = useRef({});
  var callActive = props.callActive;
  if (callActive === undefined) {
    callActive = true;
  }
  var _useReducer = useReducer(reducer, initState),
    uidState = _useReducer[0],
    dispatch = _useReducer[1];
  useEffect(function () {
    var init = function init() {
      try {
        try {
          console.log(client);
          client.on('user-joined', function () {
            try {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              var remoteUser = args[0];
              if (remoteUser.uid === props.screenshareUid && isScreensharingRef.current || remoteUser.uid === 1 && isScreensharingRef.current) {} else {
                mediaStore.current[remoteUser.uid] = {};
              }
              dispatch({
                type: 'user-joined',
                value: args
              });
              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          });
          client.on('user-published', function () {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            try {
              var remoteUser = args[0],
                mediaType = args[1];
              console.log('user-published', remoteUser.uid);
              if (remoteUser.uid === props.screenshareUid && isScreensharingRef.current || remoteUser.uid === 1 && isScreensharingRef.current) {
                dispatch({
                  type: 'user-published',
                  value: args
                });
              } else {
                client.subscribe(remoteUser, mediaType).then(function (_e) {
                  mediaStore.current[remoteUser.uid][mediaType + 'Track'] = remoteUser[mediaType + 'Track'];
                  if (mediaType === 'audio') {
                    var _remoteUser$audioTrac;
                    (_remoteUser$audioTrac = remoteUser.audioTrack) === null || _remoteUser$audioTrac === void 0 ? void 0 : _remoteUser$audioTrac.play();
                  } else {
                    if (rtcProps.enableDualStream && rtcProps.dualStreamMode) {
                      client.setStreamFallbackOption(remoteUser.uid, rtcProps.dualStreamMode);
                    }
                  }
                  dispatch({
                    type: 'user-published',
                    value: args
                  });
                })["catch"](function (e) {
                  return console.error(e);
                });
              }
              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          });
          client.on('user-unpublished', function () {
            try {
              for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
              }
              var remoteUser = args[0],
                mediaType = args[1];
              console.log('user-unpublished', remoteUser.uid);
              if (mediaType === 'audio') {
                var _remoteUser$audioTrac2;
                (_remoteUser$audioTrac2 = remoteUser.audioTrack) === null || _remoteUser$audioTrac2 === void 0 ? void 0 : _remoteUser$audioTrac2.stop();
              }
              dispatch({
                type: 'user-unpublished',
                value: args
              });
              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          });
          client.on('connection-state-change', function () {
            try {
              for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
              }
              var curState = args[0],
                prevState = args[1],
                reason = args[2];
              console.log('connection', prevState, curState, reason);
              if (curState === 'CONNECTED') {
                setChannelJoined(true);
              } else if (curState === 'DISCONNECTED') {
                try {
                  stopScreenshare();
                  isScreensharingRef.current = false;
                } catch (e) {
                  console.log('stopscreenshare', e);
                }
                dispatch({
                  type: 'leave-channel',
                  value: null
                });
              } else {
                setChannelJoined(false);
              }
              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          });
          client.on('user-left', function () {
            for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
              args[_key5] = arguments[_key5];
            }
            dispatch({
              type: 'user-left',
              value: args
            });
          });
          if (rtcProps.tokenUrl) {
            var tokenUrl = rtcProps.tokenUrl,
              channel = rtcProps.channel,
              _uid = rtcProps.uid;
            client.on('token-privilege-will-expire', function () {
              try {
                console.log('token will expire');
                return Promise.resolve(fetch(tokenUrl + '/rtc/' + channel + '/publisher/uid/' + (_uid || 0) + '/')).then(function (res) {
                  return Promise.resolve(res.json()).then(function (data) {
                    var token = data.rtcToken;
                    client.renewToken(token);
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
            client.on('token-privilege-did-expire', function () {
              try {
                return Promise.resolve(fetch(tokenUrl + '/rtc/' + channel + '/publisher/uid/' + (_uid || 0) + '/')).then(function (res) {
                  return Promise.resolve(res.json()).then(function (data) {
                    var token = data.rtcToken;
                    client.renewToken(token);
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            });
          }
          if (callbacks) {
            var events = Object.keys(callbacks);
            events.map(function (e) {
              try {
                client.on(e, function () {
                  ;
                  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                    args[_key6] = arguments[_key6];
                  }
                  callbacks[e].apply(null, args);
                });
              } catch (e) {
                console.error(e);
              }
            });
          }
          ;
          joinRes(true);
          setReady(true);
        } catch (e) {
          console.error(e);
        }
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };
    if (joinRes) {
      init();
      return function () {
        try {
          client.removeAllListeners();
        } catch (e) {
          console.error(e);
        }
      };
    } else return function () {};
  }, [rtcProps.appId]);
  useEffect(function () {
    var join = function join() {
      try {
        return Promise.resolve(canJoin.current).then(function () {
          var tokenUrl = rtcProps.tokenUrl,
            channel = rtcProps.channel,
            userUid = rtcProps.uid,
            appId = rtcProps.appId,
            token = rtcProps.token;
          var _temp4 = function () {
            if (client && !ignore) {
              if (rtcProps.role === 'audience') {
                client.setClientRole(rtcProps.role);
              } else {
                client.setClientRole('host');
              }
              var _temp3 = function () {
                if (tokenUrl) {
                  var _temp = _catch(function () {
                    return Promise.resolve(fetch(tokenUrl + '/rtc/' + channel + '/publisher/uid/' + (userUid || 0) + '/')).then(function (res) {
                      return Promise.resolve(res.json()).then(function (data) {
                        var token = data.rtcToken;
                        return Promise.resolve(client.join(appId, channel, token, userUid || 0)).then(function (_client$join) {
                          uid.current = _client$join;
                        });
                      });
                    });
                  }, function (e) {
                    console.error(e);
                  });
                  if (_temp && _temp.then) return _temp.then(function () {});
                } else {
                  var _temp2 = _catch(function () {
                    return Promise.resolve(client.join(appId, channel, token || null, userUid || 0)).then(function (_client$join2) {
                      uid.current = _client$join2;
                    });
                  }, function (e) {
                    console.error(e);
                    (callbacks === null || callbacks === void 0 ? void 0 : callbacks.ErrorJoining) && callbacks.ErrorJoining();
                  });
                  if (_temp2 && _temp2.then) return _temp2.then(function () {});
                }
              }();
              if (_temp3 && _temp3.then) return _temp3.then(function () {});
            } else {
              console.error('trying to join before RTC Engine was initialized');
            }
          }();
          if (_temp4 && _temp4.then) return _temp4.then(function () {});
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
    var ignore = false;
    if (callActive) {
      join();
      console.log('Attempted join: ', rtcProps.channel);
    } else {
      console.log('In precall - waiting to join');
    }
    return function () {
      ignore = true;
      if (callActive) {
        console.log('Leaving channel');
        try {
          stopScreenshare();
          isScreensharingRef.current = false;
        } catch (e) {
          console.error(e);
        }
        canJoin.current = client.leave()["catch"](function (err) {
          return console.log(err);
        });
      }
    };
  }, [rtcProps.channel, rtcProps.uid, callActive, rtcProps.tokenUrl]);
  useEffect(function () {
    var publish = function publish() {
      try {
        var _temp18 = function _temp18() {
          function _temp16() {
            function _temp14() {
              var _temp12 = function () {
                if (localVideoTrack && channelJoined) {
                  var _temp11 = function () {
                    if (!localVideoTrackHasPublished) {
                      var _temp10 = function _temp10() {
                        return Promise.resolve(client.publish([localVideoTrack])).then(function () {
                          localVideoTrackHasPublished = true;
                        });
                      };
                      var _temp9 = function () {
                        if (!localVideoTrack.enabled) return Promise.resolve(localVideoTrack.setEnabled(true)).then(function () {});
                      }();
                      return _temp9 && _temp9.then ? _temp9.then(_temp10) : _temp10(_temp9);
                    }
                  }();
                  if (_temp11 && _temp11.then) return _temp11.then(function () {});
                }
              }();
              if (_temp12 && _temp12.then) return _temp12.then(function () {});
            }
            var _temp13 = function () {
              if (localAudioTrack !== null && localAudioTrack !== void 0 && localAudioTrack.enabled && channelJoined) {
                var _temp8 = function () {
                  if (!localAudioTrackHasPublished) {
                    return Promise.resolve(client.publish([localAudioTrack]).then(function () {
                      localAudioTrackHasPublished = true;
                    })).then(function () {});
                  }
                }();
                if (_temp8 && _temp8.then) return _temp8.then(function () {});
              }
            }();
            return _temp13 && _temp13.then ? _temp13.then(_temp14) : _temp14(_temp13);
          }
          var _temp15 = function () {
            if (rtcProps.enableDualStream) {
              return Promise.resolve(client.enableDualStream()).then(function () {});
            }
          }();
          return _temp15 && _temp15.then ? _temp15.then(_temp16) : _temp16(_temp15);
        };
        var currentPublishedTrack = client.localTracks.find(function (lt) {
          return lt.trackMediaType === 'video';
        });
        var _temp17 = function () {
          if (currentPublishedTrack && currentPublishedTrack.getTrackId() !== (localVideoTrack === null || localVideoTrack === void 0 ? void 0 : localVideoTrack.getTrackId())) {
            return Promise.resolve(client.unpublish([currentPublishedTrack])).then(function () {
              localVideoTrackHasPublished = false;
              var _temp7 = function () {
                if (localVideoTrack) {
                  var _temp6 = function _temp6() {
                    return Promise.resolve(client.publish([localVideoTrack])).then(function () {
                      localVideoTrackHasPublished = true;
                    });
                  };
                  var _temp5 = function () {
                    if (!localVideoTrack.enabled) return Promise.resolve(localVideoTrack.setEnabled(true)).then(function () {});
                  }();
                  return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
                }
              }();
              if (_temp7 && _temp7.then) return _temp7.then(function () {});
            });
          }
        }();
        return Promise.resolve(_temp17 && _temp17.then ? _temp17.then(_temp18) : _temp18(_temp17));
      } catch (e) {
        return Promise.reject(e);
      }
    };
    if (callActive && channelJoined && (uid === null || uid === void 0 ? void 0 : uid.current) !== undefined) {
      publish();
    }
  }, [callActive, localVideoTrack, localAudioTrack, channelJoined, uid === null || uid === void 0 ? void 0 : uid.current]);
  useEffect(function () {
    if (localVideoTrack && localAudioTrack) {
      mediaStore.current[0] = {
        audioTrack: localAudioTrack,
        videoTrack: localVideoTrack
      };
      dispatch({
        type: 'update-user-video',
        value: [localAudioTrack, localVideoTrack]
      });
    }
  }, [localVideoTrack, localAudioTrack]);
  useEffect(function () {
    if (channelJoined && rtcProps.token) {
      client.renewToken(rtcProps.token).then(function (e) {
        return console.log('renewed token', e);
      });
    }
  }, [rtcProps.token, channelJoined]);
  useEffect(function () {
    if (rtcProps.role) {
      client.setClientRole(rtcProps.role).then(function (e) {
        return console.log('changed role', e);
      });
    }
  }, [rtcProps.role, channelJoined]);
  useEffect(function () {
    var enableActiveSpeaker = function enableActiveSpeaker() {
      try {
        var _temp19 = function () {
          if (rtcProps.activeSpeaker && rtcProps.layout !== layout.grid) {
            client.on('volume-indicator', function (volumes) {
              var highestvolumeObj = volumes.reduce(function (highestVolume, volume) {
                if (highestVolume === null) {
                  return volume;
                } else {
                  if (volume.level > highestVolume.level) {
                    return volume;
                  }
                  return highestVolume;
                }
              }, null);
              var activeSpeaker = highestvolumeObj ? highestvolumeObj.uid : undefined;
              var mapActiveSpeakerToZero = activeSpeaker === uid.current ? 0 : activeSpeaker;
              if (activeSpeaker !== undefined) {
                dispatch({
                  type: 'ActiveSpeaker',
                  value: [mapActiveSpeakerToZero]
                });
              }
            });
            return Promise.resolve(client.enableAudioVolumeIndicator()).then(function () {});
          }
        }();
        return Promise.resolve(_temp19 && _temp19.then ? _temp19.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    if (callActive) {
      enableActiveSpeaker();
    }
    return function () {
      client.removeAllListeners('volume-indicator');
    };
  }, [rtcProps.activeSpeaker, rtcProps.layout]);
  var toggleScreensharing = function toggleScreensharing() {
    try {
      var start = function start() {
        try {
          dispatch({
            type: 'Screensharing',
            value: [true]
          });
          return Promise.resolve(AgoraRTC.createScreenVideoTrack({}, 'disable')).then(function (_AgoraRTC$createScree) {
            screenTrack.current = _AgoraRTC$createScree;
            var uid = rtcProps.screenshareUid || 1;
            mediaStore.current[uid] = {
              videoTrack: screenTrack.current
            };
            screenTrack.current.on('track-ended', function () {
              isScreensharingRef.current = false;
              dispatch({
                type: 'Screensharing',
                value: [false]
              });
            });
            isScreensharingRef.current = true;
            return Promise.resolve(startScreenshare(rtcProps.appId, rtcProps.channel, screenTrack.current, rtcProps.screenshareToken, rtcProps.screenshareUid, rtcProps.tokenUrl, rtcProps.enableDualStream)).then(function () {});
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };
      var stop = function stop() {
        stopScreenshare();
        isScreensharingRef.current = false;
      };
      if (isScreensharingRef.current) {
        stop();
      } else {
        start();
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return React.createElement(RtcProvider, {
    value: {
      client: client,
      mediaStore: mediaStore.current,
      localVideoTrack: localVideoTrack,
      localAudioTrack: localAudioTrack,
      dispatch: dispatch,
      localUid: uid,
      channelJoined: channelJoined,
      toggleScreensharing: toggleScreensharing,
      isScreensharing: isScreensharingRef.current,
      switchCamera: switchCamera
    }
  }, React.createElement(MaxUidProvider, {
    value: uidState.max
  }, React.createElement(MinUidProvider, {
    value: uidState.min
  }, ready ? props.children : null)));
};

var timeNow = function timeNow() {
  return new Date().getTime();
};
var useChannel = createLazyChannel();
var useClient$1 = createLazyClient();
var RtmConfigure = function RtmConfigure(props) {
  var _useContext = useContext(PropsContext),
    rtcProps = _useContext.rtcProps,
    rtmProps = _useContext.rtmProps;
  var _useState = useState(false),
    isLoggedIn = _useState[0],
    setLoggedIn = _useState[1];
  var rtmClient = useClient$1(rtcProps.appId);
  var channel = useChannel(rtmClient, rtcProps.channel);
  var localUid = useRef('');
  var timerValueRef = useRef(5);
  var ext = useRef(new VirtualBackgroundExtension());
  var processor = useRef();
  var local = useContext(LocalContext);
  var _useContext2 = useContext(PropsContext),
    rtmCallbacks = _useContext2.rtmCallbacks;
  var _useState2 = useState({}),
    uidMap = _useState2[0],
    setUidMap = _useState2[1];
  var _useState3 = useState({}),
    usernames = _useState3[0],
    setUsernames = _useState3[1];
  var _useState4 = useState({}),
    userDataMap = _useState4[0],
    setUserDataMap = _useState4[1];
  var _useState5 = useState(popUpStateEnum.closed),
    popUpState = _useState5[0],
    setPopUpState = _useState5[1];
  var _useState6 = useState(rtmStatusEnum.offline),
    rtmStatus = _useState6[0],
    setRtmStatus = _useState6[1];
  var _useContext3 = useContext(RtcContext),
    rtcUid = _useContext3.localUid,
    localAudioTrack = _useContext3.localAudioTrack,
    localVideoTrack = _useContext3.localVideoTrack,
    dispatch = _useContext3.dispatch,
    channelJoined = _useContext3.channelJoined;
  useEffect(function () {
    var initExtension = function initExtension() {
      try {
        AgoraRTC.registerExtensions([ext.current]);
        processor.current = ext.current.createProcessor();
        return Promise.resolve(processor.current.init('<Path to WASM module>')).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };
    initExtension();
  }, []);
  var _login = function login() {
    try {
      var tokenUrl = rtcProps.tokenUrl;
      var _temp3 = function () {
        if (tokenUrl) {
          var _temp = _catch(function () {
            return Promise.resolve(fetch(tokenUrl + '/rtm/' + ((rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.uid) || localUid.current))).then(function (res) {
              return Promise.resolve(res.json()).then(function (data) {
                var serverToken = data.rtmToken;
                return Promise.resolve(rtmClient.login({
                  uid: (rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.uid) || localUid.current,
                  token: serverToken
                })).then(function () {
                  timerValueRef.current = 5;
                });
              });
            });
          }, function () {
            setTimeout(function () {
              try {
                timerValueRef.current = timerValueRef.current + timerValueRef.current;
                _login();
                return Promise.resolve();
              } catch (e) {
                return Promise.reject(e);
              }
            }, timerValueRef.current * 1000);
          });
          if (_temp && _temp.then) return _temp.then(function () {});
        } else {
          var _temp2 = _catch(function () {
            return Promise.resolve(rtmClient.login({
              uid: (rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.uid) || localUid.current,
              token: (rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.token) || undefined
            })).then(function () {
              timerValueRef.current = 5;
            });
          }, function () {
            setTimeout(function () {
              try {
                timerValueRef.current = timerValueRef.current + timerValueRef.current;
                _login();
                return Promise.resolve();
              } catch (e) {
                return Promise.reject(e);
              }
            }, timerValueRef.current * 1000);
          });
          if (_temp2 && _temp2.then) return _temp2.then(function () {});
        }
      }();
      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var blurBackground = function blurBackground() {
    try {
      var _temp4 = function () {
        if (processor.current && localVideoTrack) {
          localVideoTrack.pipe(processor.current).pipe(localVideoTrack.processorDestination);
          processor.current.setOptions({
            type: 'blur',
            blurDegree: 2
          });
          return Promise.resolve(processor.current.enable()).then(function () {});
        }
      }();
      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var _joinChannel = function joinChannel() {
    try {
      var _temp7 = function _temp7() {
        var _temp5 = _catch(function () {
          return Promise.resolve(channel.join()).then(function () {
            timerValueRef.current = 5;
          });
        }, function () {
          setTimeout(function () {
            try {
              timerValueRef.current = timerValueRef.current + timerValueRef.current;
              _joinChannel();
              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          }, timerValueRef.current * 1000);
        });
        if (_temp5 && _temp5.then) return _temp5.then(function () {});
      };
      var _temp6 = function () {
        if (rtcProps !== null && rtcProps !== void 0 && rtcProps.enableBlurBackground) {
          return Promise.resolve(blurBackground()).then(function () {});
        }
      }();
      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6));
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var init = function init() {
    try {
      setRtmStatus(rtmStatusEnum.initialising);
      rtcProps.uid ? localUid.current = String(rtcProps.uid) : localUid.current = String(timeNow());
      rtmClient.on('ConnectionStateChanged', function (state, reason) {
        console.log(state, reason);
      });
      rtmClient.on('TokenExpired', function () {
        try {
          var tokenUrl = rtcProps.tokenUrl;
          console.log('token expired - renewing');
          var _temp9 = function () {
            if (tokenUrl) {
              var _temp8 = _catch(function () {
                return Promise.resolve(fetch(tokenUrl + '/rtm/' + ((rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.uid) || localUid.current))).then(function (res) {
                  return Promise.resolve(res.json()).then(function (data) {
                    var serverToken = data.rtmToken;
                    return Promise.resolve(rtmClient.renewToken(serverToken)).then(function () {
                      timerValueRef.current = 5;
                    });
                  });
                });
              }, function (error) {
                console.error('TokenExpiredError', error);
              });
              if (_temp8 && _temp8.then) return _temp8.then(function () {});
            }
          }();
          return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      });
      rtmClient.on('MessageFromPeer', function (message, peerId) {
        handleReceivedMessage(message, peerId);
      });
      channel.on('ChannelMessage', function (message, peerId) {
        handleReceivedMessage(message, peerId);
      });
      channel.on('MemberJoined', function (peerId) {
        try {
          return Promise.resolve(sendPeerMessage(createUserData(), peerId)).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      });
      channel.on('MemberCountUpdated', function (count) {
        try {
          console.log('RTM-MemberCountUpdated: ', count);
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      });
      if (rtmCallbacks !== null && rtmCallbacks !== void 0 && rtmCallbacks.channel) {
        Object.keys(rtmCallbacks.channel).map(function (callback) {
          if (rtmCallbacks.channel) {
            channel.on(callback, rtmCallbacks.channel[callback]);
          }
        });
      } else if (rtmCallbacks !== null && rtmCallbacks !== void 0 && rtmCallbacks.client) {
        Object.keys(rtmCallbacks.client).map(function (callback) {
          if (rtmCallbacks.client) {
            rtmClient.on(callback, rtmCallbacks.client[callback]);
          }
        });
      }
      if (rtcProps.tokenUrl) {
        var tokenUrl = rtcProps.tokenUrl,
          uid = rtcProps.uid;
        rtmClient.on('TokenExpired', function () {
          try {
            console.log('token expired');
            return Promise.resolve(fetch(tokenUrl + '/rtm/' + (uid || 0) + '/')).then(function (res) {
              return Promise.resolve(res.json()).then(function (data) {
                var token = data.rtmToken;
                rtmClient.renewToken(token);
              });
            });
          } catch (e) {
            return Promise.reject(e);
          }
        });
      }
      setRtmStatus(rtmStatusEnum.loggingIn);
      return Promise.resolve(_login()).then(function () {
        setRtmStatus(rtmStatusEnum.loggedIn);
        return Promise.resolve(_joinChannel()).then(function () {
          setRtmStatus(rtmStatusEnum.connected);
          setUsernames(function (p) {
            return _extends({}, p, {
              0: rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.username
            });
          });
          sendChannelMessage(createUserData());
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var createUserData = function createUserData() {
    return {
      messageType: 'UserData',
      rtmId: (rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.uid) || localUid.current,
      rtcId: rtcUid.current,
      username: rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.username,
      role: rtcProps.role === 'audience' ? 1 : 0,
      uikit: {
        platform: 'web',
        framework: 'react',
        version: '1.2.0'
      },
      agora: {
        rtm: AgoraRTM.VERSION,
        rtc: AgoraRTC.VERSION
      }
    };
  };
  var sendMuteRequest = function sendMuteRequest(device, rtcId, mute) {
    var forced = (rtmProps === null || rtmProps === void 0 ? void 0 : rtmProps.showPopUpBeforeRemoteMute) === false;
    var payload = {
      messageType: 'MuteRequest',
      device: device,
      rtcId: rtcId,
      mute: mute,
      isForceful: forced
    };
    var peerId = uidMap[rtcId];
    if (forced && !mute) {
      console.log('cannot send force unmute request');
    } else if (peerId) {
      sendPeerMessage(payload, peerId);
    } else {
      console.log('peer not found');
    }
  };
  var handleReceivedMessage = function handleReceivedMessage(message, peerId) {
    var messageObject;
    if (message.messageType === 'RAW') {
      messageObject = parsePayload(message.rawMessage);
    } else if (message.messageType === 'TEXT') {
      messageObject = JSON.parse(message.text);
    }
    console.log(messageObject, peerId);
    if (messageObject) {
      switch (messageObject.messageType) {
        case 'UserData':
          handleReceivedUserDataMessage(messageObject);
          break;
        case 'MuteRequest':
          handleReceivedMuteMessage(messageObject);
          break;
        case 'RtmDataRequest':
          switch (messageObject.type) {
            case 'ping':
              handlePing(peerId);
              break;
            case 'userData':
              handleUserDataRequest(peerId);
              break;
            default:
              console.log(peerId);
          }
          break;
        default:
          console.log('unknown message content');
      }
    } else {
      console.log('unknown rtm message type');
    }
  };
  var handleReceivedUserDataMessage = function handleReceivedUserDataMessage(userData) {
    setUidMap(function (p) {
      var _extends2;
      return _extends({}, p, (_extends2 = {}, _extends2[userData.rtcId] = userData.rtmId, _extends2));
    });
    setUsernames(function (p) {
      var _extends3;
      return _extends({}, p, (_extends3 = {}, _extends3[userData.rtcId] = userData.username, _extends3));
    });
    setUserDataMap(function (p) {
      var _extends4;
      return _extends({}, p, (_extends4 = {}, _extends4[userData.rtmId] = userData, _extends4));
    });
  };
  var handleReceivedMuteMessage = function handleReceivedMuteMessage(muteRequest) {
    if (rtcUid.current === muteRequest.rtcId) {
      if (muteRequest.isForceful) {
        if (muteRequest.mute) {
          if (muteRequest.device === mutingDevice.microphone) {
            localAudioTrack && muteAudio(local, dispatch, localAudioTrack);
          } else if (muteRequest.device === mutingDevice.camera) {
            localVideoTrack && muteVideo(local, dispatch, localVideoTrack);
          }
        } else console.error('cannot force unmute');
      } else {
        if (muteRequest.device === mutingDevice.microphone) {
          if (muteRequest.mute) setPopUpState(popUpStateEnum.muteMic);else setPopUpState(popUpStateEnum.unmuteMic);
        } else if (muteRequest.device === mutingDevice.camera) {
          if (muteRequest.mute) setPopUpState(popUpStateEnum.muteCamera);else setPopUpState(popUpStateEnum.unmuteCamera);
        }
      }
    }
  };
  var handlePing = function handlePing(peerId) {
    sendPeerMessage({
      messageType: 'RtmDataRequest',
      type: 'pong'
    }, peerId);
  };
  var handleUserDataRequest = function handleUserDataRequest(peerId) {
    sendPeerMessage(createUserData(), peerId);
  };
  var sendChannelMessage = function sendChannelMessage(payload) {
    try {
      var message = rtmClient.createMessage({
        text: JSON.stringify(payload),
        messageType: AgoraRTM.MessageType.TEXT
      });
      var _temp10 = _catch(function () {
        return Promise.resolve(channel.sendMessage(message)).then(function () {});
      }, function (e) {
        console.error(e);
      });
      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var sendPeerMessage = function sendPeerMessage(payload, peerId) {
    try {
      var message = rtmClient.createMessage({
        text: JSON.stringify(payload),
        messageType: AgoraRTM.MessageType.TEXT
      });
      var _temp11 = _catch(function () {
        return Promise.resolve(rtmClient.sendMessageToPeer(message, String(peerId))).then(function () {});
      }, function (e) {
        console.error(e);
      });
      return Promise.resolve(_temp11 && _temp11.then ? _temp11.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var end = function end() {
    try {
      return Promise.resolve(rtmClient.logout()).then(function () {
        return Promise.resolve(rtmClient.removeAllListeners()).then(function () {});
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  useEffect(function () {
    if (channelJoined) {
      init();
      setLoggedIn(true);
    }
    return function () {
      if (channelJoined) {
        end();
      }
    };
  }, [rtcProps.channel, rtcProps.appId, channelJoined]);
  return React.createElement(RtmProvider, {
    value: {
      rtmStatus: rtmStatus,
      sendPeerMessage: sendPeerMessage,
      sendChannelMessage: sendChannelMessage,
      sendMuteRequest: sendMuteRequest,
      rtmClient: rtmClient,
      uidMap: uidMap,
      usernames: usernames,
      userDataMap: userDataMap,
      popUpState: popUpState,
      setPopUpState: setPopUpState
    }
  }, isLoggedIn ? props.children : React.createElement(React.Fragment, null));
};
var enc = new TextEncoder();
var dec = new TextDecoder();
var createRawMessage = function createRawMessage(msg) {
  return enc.encode(JSON.stringify(msg));
};
var parsePayload = function parsePayload(data) {
  return JSON.parse(dec.decode(data));
};

var useTracks = createMicrophoneAndCameraTracks({
  encoderConfig: {}
}, {
  encoderConfig: {},
  facingMode: 'user'
});
var useEnvironmentTrack = createCameraVideoTrack({
  encoderConfig: {},
  facingMode: 'environment'
});
var TracksConfigure = function TracksConfigure(props) {
  var _useState = useState(null),
    localVideoTrack = _useState[0],
    setLocalVideoTrack = _useState[1];
  var _useState2 = useState(null),
    localAudioTrack = _useState2[0],
    setLocalAudioTrack = _useState2[1];
  var _useContext = useContext(PropsContext),
    callbacks = _useContext.callbacks;
  var _useState3 = useState('user'),
    facingMode = _useState3[0],
    setFacingMode = _useState3[1];
  var _useTracks = useTracks(),
    trackReady = _useTracks.ready,
    tracks = _useTracks.tracks,
    error = _useTracks.error;
  var _useEnvironmentTrack = useEnvironmentTrack(),
    environmentTrack = _useEnvironmentTrack.track;
  var switchCamera = function switchCamera() {
    try {
      if (!tracks || !tracks[1] || !environmentTrack) return Promise.resolve();
      var facing = facingMode === 'user' ? 'environment' : 'user';
      setLocalVideoTrack(facing === 'user' ? tracks[1] : environmentTrack);
      setFacingMode(facing);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
  useEffect(function () {
    if (!localVideoTrack) return;
    localVideoTrack === null || localVideoTrack === void 0 ? void 0 : localVideoTrack.setEnabled(false);
  }, [localVideoTrack]);
  useEffect(function () {
    if (tracks !== null) {
      setLocalAudioTrack(tracks[0]);
      setLocalVideoTrack(tracks[1]);
    } else if (error) {
      (callbacks === null || callbacks === void 0 ? void 0 : callbacks.EndCall) && callbacks.EndCall();
    }
    return function () {
      if (tracks) {
        var _tracks$, _tracks$2, _tracks$3, _tracks$4;
        (_tracks$ = tracks[0]) === null || _tracks$ === void 0 ? void 0 : _tracks$.close();
        (_tracks$2 = tracks[0]) === null || _tracks$2 === void 0 ? void 0 : _tracks$2.stop();
        (_tracks$3 = tracks[1]) === null || _tracks$3 === void 0 ? void 0 : _tracks$3.close();
        (_tracks$4 = tracks[1]) === null || _tracks$4 === void 0 ? void 0 : _tracks$4.stop();
      }
      if (environmentTrack) {
        environmentTrack.close();
        environmentTrack.stop();
      }
      if (localVideoTrack) {
        localVideoTrack.close();
        localVideoTrack.stop();
      }
      if (error && callbacks !== null && callbacks !== void 0 && callbacks.EndCall) {
        callbacks.EndCall();
      }
    };
  }, [trackReady, error]);
  var ready = localAudioTrack !== null && localVideoTrack !== null;
  return React.createElement(TracksProvider, {
    value: {
      localVideoTrack: localVideoTrack,
      localAudioTrack: localAudioTrack,
      switchCamera: switchCamera,
      facingMode: facingMode
    }
  }, ready ? props.children : null);
};

var AgoraUIKit = function AgoraUIKit(props) {
  var styleProps = props.styleProps,
    rtcProps = props.rtcProps;
  var _ref = styleProps || {},
    UIKitContainer = _ref.UIKitContainer;
  return React.createElement(PropsProvider, {
    value: props
  }, React.createElement("div", {
    style: _extends({}, style$1, UIKitContainer)
  }, rtcProps.role === 'audience' ? React.createElement(VideocallUI, null) : React.createElement(TracksConfigure, null, React.createElement(VideocallUI, null))));
};
var VideocallUI = function VideocallUI() {
  var _useContext = useContext(PropsContext),
    rtcProps = _useContext.rtcProps;
  return React.createElement(RtcConfigure, {
    callActive: rtcProps.callActive
  }, React.createElement(LocalUserContext, null, rtcProps.disableRtm ? React.createElement(React.Fragment, null, (rtcProps === null || rtcProps === void 0 ? void 0 : rtcProps.layout) === layout.grid ? React.createElement(GridVideo, null) : React.createElement(PinnedVideo, null), React.createElement(LocalControls, null)) : React.createElement(RtmConfigure, null, React.createElement(PopUp, null), (rtcProps === null || rtcProps === void 0 ? void 0 : rtcProps.layout) === layout.grid ? React.createElement(GridVideo, null) : React.createElement(PinnedVideo, null), React.createElement(LocalControls, null))));
};
var style$1 = {
  display: 'flex',
  flex: 1,
  minHeight: 0,
  flexDirection: 'column'
};

export default AgoraUIKit;
export { BtnTemplate, EndCall, GridVideo, LocalAudioMute, LocalControls, LocalUserContext, LocalVideoMute, MaxUidContext, MaxVideoView, MinUidContext, MinVideoView, PinnedVideo, PropsContext, RemoteAudioMute, PopUp as RemoteMutePopUp, RemoteVideoMute, RtcConfigure, RtcConsumer, RtcContext, RtcProvider, RtmConfigure, RtmConsumer, RtmContext, RtmProvider, SwapUser, ToggleState, TracksConfigure, TracksContext, VideoPlaceholder, VideocallUI, createRawMessage, icons, layout, muteAudio, muteVideo, mutingDevice, parsePayload, popUpStateEnum, rtmStatusEnum };
//# sourceMappingURL=index.modern.js.map
