
import styled from 'styled-components';

export const StyledRadioButton = styled.input`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    padding: .25rem;
    background-clip: content-box;
    border: 1px solid #FF7957;
    border-radius: 50%;
    &:checked {
        background-color: #FF7957;
    }
    &:disabled {
        border: #D4D5D8;
        background-color: #D4D5D8;
    }
`;

export default StyledRadioButton;
// export default styled.input``;