import React from 'react';

import StyledRadioButton from './styled';

// export interface Props {
//     name?: string;
//     disabled?: boolean;
//     value: string;
//     checked: boolean;
//     onChange?: ( e?: React.ChangeEvent | any ) => void;
// };

export const RadioButton = ( {
    name
    , disabled
    , value
    , checked
    , onChange
} ) => {
    return (
        <StyledRadioButton
            type="radio"
            data-testid="radio-button"
            name={ name }
            disabled={ disabled }
            checked={ checked }
            value={ value }
            onChange={ onChange }
        />
    )
};

export default RadioButton;