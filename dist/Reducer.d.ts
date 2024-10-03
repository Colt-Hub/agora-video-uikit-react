import { CallbacksInterface, UIKitUser } from './PropsContext';
import { ActionType } from './RtcContext';
declare type stateType = {
    max: UIKitUser[];
    min: UIKitUser[];
    isScreensharing: boolean;
};
export declare const initState: {
    max: UIKitUser[];
    min: UIKitUser[];
    isScreensharing: boolean;
};
declare const reducer: (state: stateType, action: ActionType<keyof CallbacksInterface>) => {
    max: UIKitUser[];
    min: UIKitUser[];
    isScreensharing: boolean;
};
export default reducer;
