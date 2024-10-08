import { DispatchType } from '../../RtcContext';
import { CallbacksInterface, LocalUIKitUser } from '../../PropsContext';
import { ILocalVideoTrack } from 'agora-rtc-react';
declare const _default: (user: LocalUIKitUser, dispatch: DispatchType, localVideoTrack: ILocalVideoTrack, callbacks?: Partial<CallbacksInterface> | undefined) => Promise<void>;
export default _default;
