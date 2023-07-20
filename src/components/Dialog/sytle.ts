import { css } from '@emotion/react'

export const dialogContent = css`
  p {
    margin: 0;
  }
  .dialog-header {
    display: flex;
    padding: 0 24px;
    align-items: center;
    justify-content: space-between;
    height: 76px;
    font-size: 20px;
    font-weight: 500;
    border-bottom: 1px solid #dadada;
  }
  .select-token-header {
    border-bottom: 1px solid #dadada;
    padding: 0 24px 24px;
    > div:first-of-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
      font-size: 20px;
      font-weight: 500;
    }
  }
  .select-token-list {
    border-bottom: 1px solid #dadada;
    padding: 16px 0;
    max-height: 368px;
    overflow: hidden;
    > div {
      cursor: pointer;
      :hover {
        background: #f6f6f6;
      }
      padding: 8px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &::-webkit-scrollbar {
      display: none
    },
  }
  .error-dialog {
    margin: 40px 24px;
    max-height: 368px;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none
    },
  }
  .wallet-dialog {
    padding: 24px;
    > div {
      display: flex;
      align-items: center;
      border: 1px solid #dadada;
      border-radius: 4px;
      font-size: 20px;
      padding: 4px 10px;
      margin-bottom: 8px;
      cursor: pointer;
      > span {
        margin-left: 16px;
      }
    }
  }
  .confirm-content-input {
    background: #f6f6f6;
    text-align: center;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 12px 0;
  }
  .confirm-content-input2 {
    background: #f6f6f6;
    text-align: start;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
    padding: 12px 24px;
  }
  .confirm-content-input3 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 12px;
    width: 100%;
    background: #f7f7f7;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .confirm-content-info {
    > p {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .grey {
    font-size: 12px;
    color: #757575;
  }

  .loader {
    position: relative;
    width: 120px;
    height: 100px;
    border-radius: 50%;
    margin: 36px 75px;
    display: inline-block;
    vertical-align: middle;
  }
  .loader-7 .line {
    width: 16px;
    position: absolute;
    border-radius: 5px;
    bottom: 0;
    background: black;
    //background: -webkit-gradient(linear, left top, left bottom, from(#1ee95d), to(#5714ce));
    //background: -webkit-linear-gradient(top, #1ee95d, #5714ce);
    //background: -o-linear-gradient(top, #1ee95d, #5714ce);
    //background: linear-gradient(to bottom, #1ee95d, #5714ce);
  }

  .loader-7 .line1 {
    left: 0;
    -webkit-animation: line-grow 0.5s ease alternate infinite;
    animation: line-grow 0.5s ease alternate infinite;
  }

  .loader-7 .line2 {
    left: 53px;
    -webkit-animation: line-grow 0.5s 0.2s ease alternate infinite;
    animation: line-grow 0.5s 0.2s ease alternate infinite;
  }

  .loader-7 .line3 {
    right: 0;
    -webkit-animation: line-grow 0.5s 0.4s ease alternate infinite;
    animation: line-grow 0.5s 0.4s ease alternate infinite;
  }
  @-webkit-keyframes line-grow {
    0% {
      height: 0;
    }
    100% {
      height: 75%;
    }
  }

  @keyframes line-grow {
    0% {
      height: 0;
    }
    100% {
      height: 75%;
    }
  }
`
