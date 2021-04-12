import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function PermanentIcon(props) {
    return (
        <SvgIcon
            width="32"
            height="28"
            viewBox="0 0 32 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M27 14C27 6.545 20.955 0.5 13.5 0.5C6.045 0.5 0 6.545 0 14C0 21.455 6.045 27.5 13.5 27.5C17.235 27.5 20.595 25.985 23.04 23.54L20.91 21.41C19.02 23.315 16.395 24.5 13.5 24.5C7.695 24.5 3 19.805 3 14C3 8.195 7.695 3.5 13.5 3.5C19.305 3.5 24 8.195 24 14H19.5L25.56 20.045L25.665 19.835L31.5 14H27ZM15 15.5V8H12.75V14.225L7.47 17.36L8.625 19.28L15 15.5Z"
            />
        </SvgIcon>
    );
}
