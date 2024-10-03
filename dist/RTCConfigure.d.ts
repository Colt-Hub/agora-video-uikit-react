import React, { PropsWithChildren } from 'react';
import { RtcPropsInterface } from './PropsContext';
/**
 * React component that contains the RTC logic. It manages the user state and provides it the children components by wrapping them with context providers.
 */
declare const RtcConfigure: React.FC<PropsWithChildren<Partial<RtcPropsInterface>>>;
export default RtcConfigure;
