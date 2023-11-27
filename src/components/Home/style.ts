import { css } from '@emotion/react'

export const leftMenu = css`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 40px 24px 0;
  > button > span {
    font-family: 'Inter';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
  }
`

// export const menuActive = css`
//   background: #f6f6f6;
// `

export const home = css`
  display: flex;
  margin-bottom: -40px;
  .home-content {
    @media screen and (max-width: 1200px) {
      padding: 0 16px;
    }
    width: 100%;
    display: flex;
    justify-content: center;
  }
`

export const comingSoon = css`
  width: 100%;
  padding: 40px 0;
  font-family: 'Inter';
  font-weight: 500;
  min-height: calc(100vh - 284px);
  @media screen and (max-width: 600px) {
    min-height: calc(100vh - 200px);
  }
  font-size: 16px;
  position: relative;
  overflow: hidden;
  .title {
    font-family: 'GT-Flexa-Bold-Trial';
    font-size: 28px;
    font-style: normal;
    font-weight: 900;
    line-height: 110%; /* 30.8px */
    letter-spacing: 0.56px;
    margin-left: 40px;
    margin-bottom: 98px;
    @media screen and (max-width: 600px) {
      margin-left: 16px;
    }
  }
  > p:last-of-type {
    text-align: center;
  }
  > div {
    overflow: hidden;
    display: flex;
    position: absolute;
    height: 212px;
    margin-top: 65px;
    > svg {
      margin-left: -55px;
    }
  }
  .coming {
    animation: animate-coming 10s infinite linear;
    top: 0;
  }
  @keyframes animate-coming {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
    }
  }
`

export const dashboard = css`
  width: 100%;
  padding: 40px 0;
  margin: 0 40px;
  max-width: 1060px;
  font-family: 'Inter';
  @media screen and (max-width: 1200px) {
    margin: 0;
    padding: 0;
  }
  .tabs {
    //background: #a4a8fe;
    padding: 2px 8px;
    border-radius: 100px;
    font-size: 14px;
  }
  .my-order {
    .position-layout {
      align-items: center;
      display: grid;
      padding: 12px 24px 0px;
      grid-template-columns: 140px minmax(140px, 1fr) 1fr 1fr 1fr 0.5fr;
      font-size: 12px;
      @media screen and (max-width: 1200px) {
        min-width: 1200px;
      }
    }
    .history-layout {
      align-items: center;
      display: grid;
      padding: 12px 24px 0px;
      grid-template-columns: 140px minmax(140px, 1fr) 1fr 1fr 1fr 1fr 1fr 0.5fr;
      font-size: 12px;
      @media screen and (max-width: 1200px) {
        min-width: 1200px;
      }
    }
    .order-layout {
      align-items: center;
      display: grid;
      padding: 12px 24px 0px;
      grid-template-columns: 80px minmax(140px, 2fr) 1fr 1fr 1fr 1fr 1fr;
      font-size: 12px;
      @media screen and (max-width: 1200px) {
        min-width: 1200px;
      }
    }
    .no-data {
      padding-top: 103px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
      color: #757575;
      @media screen and (max-width: 1200px) {
        padding-top: 50px;
      }
    }
  }
  .income {
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 40px;
    > p:first-of-type {
      font-family: 'Inter';
      font-size: 16px;
      font-weight: 500;
      line-height: 140%;
    }
    > p:last-of-type {
      padding-top: 10px;
      color: #2832f5;
      font-family: 'GT-Flexa-Bold-Trial';
      font-size: 64px;
      font-weight: 900;
      line-height: 110%; /* 70.4px */
      text-transform: uppercase;
    }
    svg:hover {
      cursor: pointer;
      transform: scale(1.1);
    }
  }
  .title {
    font-family: 'GT-Flexa-Bold-Trial';
    font-size: 28px;
    font-weight: 900;
    line-height: 110%; /* 30.8px */
    letter-spacing: 0.56px;
    padding-bottom: 32px;
    @media screen and (max-width: 1200px) {
      padding-bottom: 24px;
    }
  }
  .earning {
    margin-bottom: 40px;
    > div {
      display: grid;
      gap: 20px;
      grid-template-columns: 2.06fr 1fr;
    }
    .card {
      box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
    }
    .krav {
      padding: 24px;
      > p:first-of-type {
        width: 105px;
        margin-bottom: 17px;
      }
      > p:nth-of-type(2) {
        font-family: 'GT-Flexa-Bold-Trial';
        font-size: 40px;
        font-style: normal;
        font-weight: 900;
        line-height: 110%; /* 44px */
        letter-spacing: 0.8px;
        > span {
          font-size: 20px;
          padding-left: 12px;
        }
      }
      > p:last-of-type {
        display: flex;
        align-items: center;
        font-family: 'Inter';
        font-size: 14px;
        font-weight: 400;
        line-height: 140%; /* 19.6px */
        letter-spacing: -0.28px;
      }
      svg:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
    .provided {
      border-radius: 8px;
      padding: 32px;
      .details {
        margin-top: -12px;
        display: grid;
        grid-template-columns: 1fr 1px 1.72fr;
        .total {
          padding-top: 30px;
          > div:first-of-type {
            font-family: 'Inter';
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 140%; /* 19.6px */
            letter-spacing: -0.28px;
            margin-bottom: 8px;
          }
          > div:last-of-type {
            font-family: 'GT-Flexa-Bold-Trial';
            font-size: 40px;
            font-style: normal;
            font-weight: 900;
            line-height: 110%; /* 44px */
            letter-spacing: 0.8px;
          }
        }
        > div:first-of-type {
          height: 100%;
        }
        > div:last-of-type {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .my-pool {
      > div {
        height: 100%;
        padding-top: 30px;
        padding-left: 32px;
        > p {
          font-family: 'Inter';
          font-size: 14px;
          font-weight: 400;
          line-height: 140%; /* 19.6px */
          letter-spacing: -0.28px;
          padding-bottom: 8px;
        }
        > p:last-of-type {
          display: flex;
          align-items: center;
          > span:first-of-type {
            font-family: 'GT-Flexa-Bold-Trial';
            font-size: 40px;
            font-style: normal;
            font-weight: 900;
            line-height: 110%; /* 44px */
            letter-spacing: 0.8px;
            padding-right: 16px;
          }
        }
      }
      .poolArrow:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
  }
  .data {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 148px;
    @media screen and (max-width: 1200px) {
      display: block;
      > div {
        margin-bottom: 16px;
      }
    }
    gap: 20px;
    font-size: 12px;
    padding-bottom: 48px;
    .data-card {
      padding: 24px;
      border-radius: 8px;
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
  .my-order {
    padding-top: 48px;
  }
`

export const farm = css`
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
    margin-bottom: 32px;
  }
  .overview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dadada;
    padding: 8px 32px 12px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
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
    @media screen and (max-width: 1200px) {
      min-width: 1200px;
    }
    grid-template-columns:
      1.7fr minmax(100px, 1.8fr) minmax(60px, 1.3fr) minmax(120px, 2.5fr) minmax(120px, 1.7fr)
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
    .grey {
      color: #757575;
    }
    .small {
      font-size: 12px;
    }
  }
`

export const stake = css`
  width: 100%;
  padding: 40px 0;
  margin: 0 40px;
  max-width: 1060px;
  font-family: 'Inter';
  line-height: 140%; /* 19.6px */
  letter-spacing: -0.28px;
  font-size: 14px;
  @media screen and (max-width: 1200px) {
    margin: 0;
    padding: 0;
  }
  .gt {
    font-family: 'GT-Flexa-Bold-Trial';
  }
  .title {
    font-size: 28px;
    font-weight: 900;
    line-height: 110%; /* 30.8px */
    letter-spacing: 0.56px;
  }
  .card {
    display: grid;
    grid-template-columns: 1.55fr minmax(280px, 1.152fr) 1fr;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    margin-bottom: 24px;
    @media screen and (max-width: 1200px) {
      display: block;
      padding: 16px 24px;
    }
  }
  .data {
    padding-top: 10px;
    font-size: 20px;
    font-weight: 900;
    line-height: 130%;
  }
  .action {
    padding: 40px 32px 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 76px;
    align-items: start;
    border-radius: 8px;
    box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 1200px) {
      padding: 16px 24px;
      margin-bottom: 40px;
    }
    .my-reward {
      margin: 20px 0;
      display: grid;
      align-items: center;
      gap: 8px;
      grid-template-columns: 1fr 1fr;
      max-height: 80px;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      ,
      > div {
        display: flex;
        align-items: center;
        border-radius: 8px;
        padding: 20px 16px;
      }
    }
  }
  .overview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .liquidity-reward-action {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    @media screen and (max-width: 1200px) {
      display: block;
      margin-bottom: 40px;
    }
  }
  .fees-rewards {
    border-radius: 8px;
    padding: 24px 32px;
    box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media screen and (max-width: 1200px) {
        display: block;
        > div:last-of-type {
          padding-top: 16px;
        }
      }
    }
  }
  .reward-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
  }
  .krav-reward-card {
    border-radius: 8px;
    padding: 24px 32px;
    box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 1200px) {
      padding: 16px 24px;
    }
    > div:first-of-type,
    > div:nth-of-type(2) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media screen and (max-width: 1200px) {
        display: block;
      }
    }
    > div:last-of-type {
      border-radius: 8px;
      padding: 24px;
      font-size: 16px;
      font-weight: 500;
      > p:first-of-type {
        padding-bottom: 25px;
      }
      > p:last-of-type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media screen and (max-width: 1200px) {
          display: block;
          > span {
            display: block;
          }
        }
        > span:first-of-type {
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
  .overview-card {
    border-radius: 8px;
    box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-bottom: 40px;
    @media screen and (max-width: 1200px) {
      display: block;
      padding: 16px 24px;
    }
    > div:first-of-type {
      padding-left: 0 !important;
    }
    > div {
      padding-left: 32px;
      @media screen and (max-width: 1200px) {
        padding-left: 0;
      }
    }
  }
  .grey {
    color: #757575;
  }
`

export const referral = css`
  width: 100%;
  padding: 40px 0;
  margin: 0 40px;
  max-width: 1060px;
  @media screen and (max-width: 1200px) {
    margin: 0;
    padding: 0;
  }
  .referral-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 64px;
    @media screen and (max-width: 1200px) {
      display: block;
      margin-bottom: 24px;
    }
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
      @media screen and (max-width: 600px) {
        position: absolute;
        top: 15px;
        right: 15px;
        margin: 0;
      }
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
  }
  .triangle-up {
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
  .triangle-down {
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    position: absolute;
    top: 0;
    z-index: 2;
  }
  .referral-link {
    display: grid;
    grid-template-columns: 174px auto 174px;
    padding-bottom: 40px;
    font-family: 'Inter';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */
    letter-spacing: -0.28px;
    @media screen and (max-width: 1200px) {
      display: block;
      padding-bottom: 0;
    }
    .link-text {
      flex: 1;
      border-radius: 4px;
      line-height: 40px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      > div {
        padding: 0 24px;
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
      @media screen and (max-width: 1200px) {
        padding: 24px 0;
      }
      > div:first-of-type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
      }
    }
    > div:last-of-type {
      padding-left: 24px;
      @media screen and (max-width: 1200px) {
        padding-left: 0;
        padding-top: 24px;
      }
      > p {
        padding-bottom: 16px;
      }
    }
    .social {
      > svg {
        cursor: pointer;
      }
      > svg:hover path:last-child {
        fill: #757575;
      }
    }
  }
  .referral-stats {
    border-radius: 8px;
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
      padding-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 24px;
    }
    > div:nth-of-type(2) {
      font-size: 12px;
      font-weight: 400;
      line-height: 120%;
      letter-spacing: 0.24px;
      padding: 16px 26px;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .friends-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 24px;
    }
  }
`
