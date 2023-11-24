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
  }
  .select-token-header {
    padding: 0 24px 24px;
    @media screen and (max-width: 1200px) {
      padding: 0 24px;
    }
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
    padding: 16px 0;
    max-height: 368px;
    overflow: scroll;
    > div {
      cursor: pointer;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &::-webkit-scrollbar {
      display: none
    },
  }
  .wallet-dialog {
    padding: 24px;
    > div {
      display: flex;
      align-items: center;
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
    text-align: center;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 20px;
    padding: 20px 0;
  }
  .confirm-content-input2 {
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

export const snackbar = css`
  border-radius: 8px;
  padding: 24px;
  font-family: 'Inter';
  font-size: 14px;
  line-height: 140%;
  letter-spacing: -0.28px;
  .snackbar-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 48px;
    > div {
      display: flex;
      align-items: center;
      > span {
        font-size: 20px;
        font-weight: 500;
        margin-left: 16px;
      }
    }
  }
  .snackbar-time {
    color: #757575;
    font-size: 12px;
    letter-spacing: 0.24px;
    padding-top: 24px;
  }
`

export const errorDialog = css`
  padding: 24px 0;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-align: center;
  .error-dialog-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px 24px 64px;
    @media screen and (max-width: 1200px) {
      padding: 0 24px 24px 24px;
    }
    > span {
      padding-left: 15px;
      padding-right: 45px;
      @media screen and (max-width: 1200px) {
        text-align: start;
        padding: 0;
      }
    }
  }
  .error-dialog-content {
    padding: 24px 24px 0;
    font-size: 14px;
    > svg {
      margin: 24px 0;
    }
    .flash {
      -webkit-animation: flash 6s ease alternate infinite;
      animation: flash 6s ease alternate infinite;
    }
  }
  @keyframes flash {
    0%,
    50%,
    100% {
      opacity: 1;
    }

    25%,
    75% {
      opacity: 0;
    }
  }
`
