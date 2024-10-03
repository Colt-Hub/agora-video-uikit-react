import React from 'react';
import { UIKitUser } from './PropsContext';
/**
 * React context to expose user array displayed in the smaller view
 */
declare const MinVideoView: (props: {
    user: UIKitUser;
}) => React.JSX.Element;
export default MinVideoView;
