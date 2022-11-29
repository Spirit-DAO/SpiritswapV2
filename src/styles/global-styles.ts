import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    overflow-y: overlay;
  }
  html,
  body {
    height: 100%;
    width: 100%;
    word-break: inherit;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  p,
  label {
    font-family: Jost, Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  button, div, input, select {
    font-family: inherit;
    font-size: inherit;
  }

  ::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track {
    box-shadow: none; 
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #374151; 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-corner {
    background-color: transparent;
    }

  // used to handle position of notifications container 
  #chakra-toast-manager-top-right{
    top: 152px !important
  }


  // header background color and blur state
  .Header {
    position: fixed;
    z-index: 11;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    back-drop-filter: none;
    background: transparent !important;
    -webkit-transition: all ease-out .3s;
    -moz-transition: all ease-out .3s;
    -o-transition: all ease-out .3s;
    transition: all ease-out .3s;
  }

  .Header.scrolled {
    background: rgb(0, 3, 21, .90) !important;
    backdrop-filter: blur(12px);
  }
 
`;
