import { CallbacksInterface } from '../PropsContext';
import { ActionType } from '../RtcContext';
export declare function actionTypeGuard<T extends keyof CallbacksInterface>(_act: ActionType<keyof CallbacksInterface>, _type: T): _act is ActionType<T>;
