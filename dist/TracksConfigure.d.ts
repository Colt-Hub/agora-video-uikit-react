import React, { PropsWithChildren } from 'react';
import { RtcPropsInterface } from './PropsContext';
/**
 * React component that create local camera and microphone tracks and assigns them to the child components
 */
declare const TracksConfigure: React.FC<PropsWithChildren<Partial<RtcPropsInterface>>>;
export default TracksConfigure;
