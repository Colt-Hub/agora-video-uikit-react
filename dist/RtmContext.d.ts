/// <reference types="react" />
import { UID } from 'agora-rtc-react';
import { RtmClient, RtmEvents } from 'agora-rtm-react';
/**
 * Callbacks to pass to RTM events
 */
export declare type rtmCallbacks = {
    channel?: Partial<RtmEvents.RtmChannelEvents>;
    client?: Partial<RtmEvents.RtmClientEvents>;
};
export declare enum rtmStatusEnum {
    initFailed = 0,
    offline = 1,
    initialising = 2,
    loggingIn = 3,
    loggedIn = 4,
    connected = 5,
    loginFailed = 6
}
export declare type messageType = 'UserData' | 'MuteRequest';
export declare type messageObject = userData | muteRequest | genericAction;
export declare enum clientRoleRaw {
    broadcaster = 0,
    audience = 1
}
export declare enum mutingDevice {
    camera = 0,
    microphone = 1
}
export declare type genericAction = {
    messageType: 'RtmDataRequest';
    type: 'ping' | 'pong' | 'userData';
};
export declare type muteRequest = {
    messageType: 'MuteRequest';
    rtcId: UID;
    mute: boolean;
    device: mutingDevice;
    isForceful: boolean;
};
export declare type userData = {
    messageType: 'UserData';
    rtmId: string;
    rtcId: UID;
    username?: string;
    role: clientRoleRaw;
    uikit: {
        platform: string;
        framework: string;
        version: string;
    };
    agora: {
        rtm: string;
        rtc: string;
    };
};
export declare enum popUpStateEnum {
    closed = 0,
    muteMic = 1,
    muteCamera = 2,
    unmuteMic = 3,
    unmuteCamera = 4
}
/**
 * Interface for RTM Context
 */
interface rtmContext {
    /**
     * rtm connection status
     */
    rtmStatus: rtmStatusEnum;
    /**
     * send message to everyone in the channel
     */
    sendChannelMessage: (msg: messageObject) => void;
    /**
     * send message to a specific user
     */
    sendPeerMessage: (msg: messageObject, uid: string) => void;
    /**
     * RTM Client instance
     */
    rtmClient: RtmClient;
    /**
     * map with userdata for each rtc uid in the channel
     */
    userDataMap: Object;
    /**
     * map with rtm uid for each rtc uid in the channel
     */
    uidMap: Object;
    /**
     * Send a mute request
     */
    sendMuteRequest: (device: mutingDevice, rtcId: UID, mute: boolean) => void;
    /**
     * RTM usernames
     */
    usernames: {};
    /**
     * state to display pop up on remote mute request
     */
    popUpState: popUpStateEnum;
    /**
     * set state to hide pop up
     */
    setPopUpState: React.Dispatch<React.SetStateAction<popUpStateEnum>>;
}
/**
 * Context to access RTM data. It's setup by {@link RtmConfigure}.
 */
declare const RtmContext: import("react").Context<rtmContext>;
export declare const RtmProvider: import("react").Provider<rtmContext>;
export declare const RtmConsumer: import("react").Consumer<rtmContext>;
export default RtmContext;
