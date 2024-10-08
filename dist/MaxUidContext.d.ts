import React from 'react';
import { UIKitUser } from './PropsContext';
/**
 * React context to expose user array displayed in the maximised view
 */
declare const MaxUidContext: React.Context<UIKitUser[]>;
export declare const MaxUidProvider: React.Provider<UIKitUser[]>;
export declare const MaxUidConsumer: React.Consumer<UIKitUser[]>;
export default MaxUidContext;
