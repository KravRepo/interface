import { css } from '@emotion/react'

export const leftMenu = css`
  display: flex;
  flex-direction: column;
  width: 300px;
  border-right: 1px solid #dadada;
  padding: 40px 24px 0;
`

export const menuActive = css`
  background: #f6f6f6;
`

export const home = css`
  background: white;
  display: flex;
  margin-bottom: -40px;
  .home-content {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`

export const dashboard = css`
  width: 100%;
  padding: 40px 0;
  margin: 0 40px;
  max-width: 1060px;
  font-family: 'Inter';
  .tabs {
    background: #a4a8fe;
    padding: 2px 8px;
    border-radius: 100px;
    font-size: 14px;
    color: #fff;
  }
  .learn-more {
    border-radius: 8px;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .learn-more-left {
      > p {
        font-family: 'Inter';
        font-weight: 500;
      }
      > p:first-of-type {
        font-family: 'GT-Flexa-Bold-Trial';
        font-size: 28px;
        font-weight: 900;
      }
      > p:last-of-type {
        margin-bottom: 32px;
      }
    }
    .learn-more-right {
      background: white;
      padding: 16px;
      border-radius: 8px;
      width: 360px;
      .rate {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        font-weight: 500;
        > span:last-of-type {
          color: #db4c40;
        }
      }
    }
  }
  .points {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 32px 0;
    > div {
      > p {
        margin: 0;
        display: flex;
        align-items: center;
      }
      > p:first-of-type {
        color: #2832f5;
        font-size: 110px;
        font-family: 'GT-Flexa-Bold-Trial';
        font-weight: 900;
        line-height: 110%;
        text-transform: uppercase;
      }
    }
  }
  .data {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 148px 148px;
    gap: 20px;
    font-size: 12px;
    .data-card {
      padding: 24px;
      border-radius: 8px;
      background: #fff;
      color: #000;
      box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
      > p {
        padding-top: 18px;
        font-family: 'GT-Flexa-Bold-Trial';
        font-size: 40px;
        font-style: normal;
        font-weight: 900;
        line-height: 110%;
        letter-spacing: 0.8px;
      }
    }
  }
`

export const stake = css`
  width: 100%;
  padding: 40px 0;
  margin: 0 40px;
  max-width: 1060px;
  min-height: calc(100vh - 284px);
  .title {
    font-family: 'GT-Flexa-Bold-Trial';
    font-size: 28px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 30.8px */
    letter-spacing: 0.56px;
    color: #000;
    margin-bottom: 32px;
  }
  .overview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dadada;
    padding: 8px 32px 12px;
    > div {
      > span:last-of-type {
        font-size: 16px;
        color: #2832f5;
      }
      > span:first-of-type {
        font-size: 20px;
        margin-right: 16px;
      }
    }
  }
  .grid-layout {
    display: grid;
    align-items: center;
    grid-template-columns: 2fr minmax(180px, 2.2fr) 1.7fr 1fr 2.2fr 0.96fr;
    padding: 0 32px;
    font-size: 14px;
    line-height: 1.4;
  }
  .nowrap {
    > span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .no-stake {
    text-align: center;
    padding: 32px 24px;
    border-radius: 8px;
    width: 100%;
    > p:first-of-type {
      font-family: 'GT-Flexa-Bold-Trial';
      font-size: 28px;
      font-style: normal;
      font-weight: 900;
      line-height: 110%; /* 30.8px */
      letter-spacing: 0.56px;
    }
  }
  .grey {
    color: #757575;
  }
  .liquidity {
    padding: 0 32px 16px 32px;
    align-items: center;
    display: grid;
    grid-template-columns:
      1.7fr minmax(100px, 1.8fr) minmax(60px, 1fr) minmax(60px, 1.3fr) minmax(120px, 2.5fr) minmax(120px, 1.7fr)
      80px;
    font-size: 14px;
    line-height: 1.4;
    .more {
      width: 78px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid #2e2e2e;
      cursor: pointer;
    }
  }
`

export const referral = css`
  width: 100%;
  padding: 40px 0;
  margin: 0 40px;
  max-width: 1060px;
  .referral-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 64px;
    .referral-title-left {
      max-width: 550px;
      > div {
        font-family: 'GT-Flexa-Bold-Trial';
        font-size: 40px;
        font-weight: 900;
        line-height: 110%; /* 44px */
        letter-spacing: 0.8px;
        display: flex;
        align-items: center;
      }
      > p {
        font-family: 'Inter';
        font-size: 20px;
        font-weight: 500;
        line-height: 140%;
        margin: 16px 0;
      }
    }
    .referral-title-right {
      color: #fff;
      position: relative;
      margin: 15px 15px 15px 98px;
      text-align: center;
      > p {
        padding: 38px 22px 24px;
        font-size: 20px;
        font-weight: 900;
        font-family: 'GT-Flexa-Bold-Trial';
        line-height: 110%; /* 30.8px */
        letter-spacing: 0.56px;
      }
      > div:last-of-type {
        position: absolute;
        height: 186px;
        width: 209px;
        background: white;
        opacity: 0.2;
        border-radius: 6px;
        top: 0;
      }
    }
    .rotate-text {
      color: white;
      position: absolute;
      transform: rotate(-90deg);
      translate: 0 100px;
    }
  }
  .ellipse {
    height: 21px;
    width: 41px;
    border-radius: 100%;
    translate: -21px;
    margin-bottom: 7px;
    background: white;
  }
  .triangle-up {
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 15px solid white;
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
  .triangle-down {
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-top: 15px solid white;
    position: absolute;
    top: 0;
    z-index: 2;
  }
  .referral-link {
    display: grid;
    grid-template-columns: 174px auto 174px;
    padding-bottom: 40px;
    border-bottom: 1px solid #dadada;
    font-family: 'Inter';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */
    letter-spacing: -0.28px;
    .link-text {
      flex: 1;
      border-radius: 4px;
      border: 1px solid #dadada;
      background: #f6f6f6;
      line-height: 40px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      > div {
        padding: 0 24px;
        border-left: 1px solid #dadada;
        position: relative;
        > span:last-of-type {
          position: absolute;
          top: -45px;
          left: 0;
          white-space: nowrap;
        }
      }
    }
    > div:first-of-type {
      padding-right: 24px;
      border-right: 1px solid #dadada;
      > p:first-of-type {
        margin: 0 0 16px;
      }
      > p:last-of-type {
        font-size: 20px;
        margin: 0;
      }
    }
    > div:nth-of-type(2) {
      padding: 0 24px;
      font-size: 14px;
      > div:first-of-type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
      }
    }
    > div:last-of-type {
      padding-left: 24px;
      border-left: 1px solid #dadada;
      > p {
        padding-bottom: 16px;
      }
    }
  }
  .referral-stats {
    border-radius: 8px;
    background: #f6f6f6;
    margin: 40px 0;
    padding: 40px;
    font-size: 12px;
    > p {
      font-size: 20px;
      font-weight: 500;
      font-family: 'Inter';
      padding-bottom: 24px;
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .referral-stats-item {
      > p:first-of-type {
        color: #2832f5;
        font-family: 'GT-Flexa-Bold-Trial';
        font-size: 40px;
        font-weight: 900;
        line-height: 1.1;
        padding-bottom: 12px;
      }
    }
    .line {
      padding-left: 30px;
      border-left: 1px solid #000;
    }
  }
  .referral-leaderboard {
    margin-bottom: 80px;
    > div:first-of-type {
      font-size: 20px;
      font-family: 'Inter';
      font-weight: 500;
      padding-bottom: 24px;
    }
    > div:nth-of-type(2) {
      font-size: 12px;
      font-weight: 400;
      line-height: 120%;
      letter-spacing: 0.24px;
      padding: 16px 26px;
      background: #f6f6f6;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .friends-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 24px;
      border-bottom: 1px solid #dadada;
    }
  }
`
