import styled, { CommonTheme, createGlobalStyle, DefaultTheme, css } from 'styled-components'

export const colorPalette = {
    parrot: '#18cfa8',
    xparrot: '#26bec0',
    darkGray: '#656565',
    white: '#fff'
}

export const PaddingContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    @media screen and (min-width: 1023px){
        max-width: 974px;
    }
    @media screen and (min-width: 1300px){
        max-width: 1250px;
    }
`

export const GlobalStyles = createGlobalStyle`
    body {
        font-family: "Helvetica Neue", HelveticaNeue, "TeX Gyre Heros", TeXGyreHeros, FreeSans, "Nimbus Sans L", "Liberation Sans", Arimo, Helvetica, Arial, sans-serif;
        iframe {
            display: none !important;
            z-index: -1 !important;
        }
    }
    *{
        margin: 0;
        padding: 0;
        font-family: "Helvetica Neue", HelveticaNeue, "TeX Gyre Heros", TeXGyreHeros, FreeSans, "Nimbus Sans L", "Liberation Sans", Arimo, Helvetica, Arial, sans-serif;
        box-sizing: border-box;
    }
`