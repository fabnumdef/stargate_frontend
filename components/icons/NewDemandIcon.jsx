import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function NewDemandIcon(props) {
    return (
        <SvgIcon {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 2C20 0.9 19.1 0 18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H16L20 20V2ZM18 15.17L16.83 14H2V2H18V15.17ZM9 3H11V7H15V9H11V13H9V9H5V7H9V3Z"
            />
        </SvgIcon>
    );
}
