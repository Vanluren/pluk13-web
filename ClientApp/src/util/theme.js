import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
html {
  font-size: 14px;
}
@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}
`

export const theme = {
    main: "mediumseagreen"
};