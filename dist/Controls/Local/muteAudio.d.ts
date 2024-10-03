import { DispatchType } from '../../RtcContext';
import { LocalUIKitUser } from '../../PropsContext';
import { ILocalAudioTrack } from 'agora-rtc-react';
import { CallbacksInterface } from '../..';
declare const _default: (user: LocalUIKitUser, dispatch: DispatchType, localAudioTrack: ILocalAudioTrack, callbacks?: Partial<CallbacksInterface> | undefined) => Promise<void>;
export default _default;
