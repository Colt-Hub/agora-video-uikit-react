import React from 'react';
import { UIKitUser } from './PropsContext';
/**
 * React context to expose user array displayed in the minimized view
 */
declare const MinUidContext: React.Context<UIKitUser[]>;
export declare const MinUidProvider: React.Provider<UIKitUser[]>;
export declare const MinUidConsumer: React.Consumer<UIKitUser[]>;
export default MinUidContext;
