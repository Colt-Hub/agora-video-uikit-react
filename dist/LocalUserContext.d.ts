import React, { PropsWithChildren } from 'react';
import { LocalUIKitUser } from './PropsContext';
export declare const LocalContext: React.Context<LocalUIKitUser>;
export declare const LocalProvider: React.Provider<LocalUIKitUser>;
export declare const LocalConsumer: React.Consumer<LocalUIKitUser>;
interface LocalUserContextInterface {
    children: React.ReactNode;
}
/**
 * React context that exposes the {@link LocalUIKitUser} data object
 */
declare const LocalUserContext: React.FC<PropsWithChildren<LocalUserContextInterface>>;
export default LocalUserContext;
