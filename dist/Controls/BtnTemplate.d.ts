import React from 'react';
interface BtnTemplateInterface {
    name: string;
    color?: string;
    onClick: () => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}
declare const BtnTemplate: (props: BtnTemplateInterface) => React.JSX.Element;
export default BtnTemplate;
