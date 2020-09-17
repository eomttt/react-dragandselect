import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const Wrapper = styled.div(({
  styles,
}) => css`
  ${styles}
  position: relative;
`);

export const Selection = styled.div(({
  boxStyle,
}) => css`
  position: absolute;
  ${boxStyle};
  background-color: rgba(31, 140, 230, 0.3);
  border: 0.5px solid rgba(31, 140, 230);
  opacity: .5;
  box-sizing: border-box;
`);
