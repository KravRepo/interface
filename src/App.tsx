/** @jsxImportSource @emotion/react */
import './App.css'
import { Header } from './components/Header/Header'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { messages as enMessages } from './locales/en/messages'
import { messages as csMessages } from './locales/zh/messages'
import { Trade } from './pages/Trade'
import { AppTheme } from './theme/appTheme'
import Web3Provider from './connectors/Web3Provider'
import { Footer } from './components/Footer/Footer'
import { Liquidity } from './pages/Liquidity'
import { useEffect } from 'react'
import { useFactory } from './hook/hookV8/useFactory'
import { useBTCPrice } from './hook/hookV8/useBTCPrice'
import { ErrorDialog } from './components/Dialog/ErrorDialog'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { TransactionDialog } from './components/Dialog/TransactionDialog'
import { Home } from './pages/Home'
import { HomeStake } from './pages/home/HomeStake'
import { HomeReferral } from './pages/home/HomeReferral'
import { HomeFarm } from './pages/home/HomeFarm'
import { css } from '@emotion/react'
import DashboardBg from './assets/imgs/dashboard_bg.png'
import DashboardDarkBg from './assets/imgs/darkModel/dashboard_bg_dark.png'
import { SuccessSnackbar } from './components/Dialog/SuccessSnackbar'
import { SuccessDialog } from './components/Dialog/SuccessDialog'
import { Statistics } from './pages/Statistics'
import ReportImg from './assets/imgs/report.png'
import ReportDark from './assets/imgs/darkModel/report_dark.png'
import { useTheme } from '@mui/material'
import { useInterval } from './hook/hookV8/useInterval'
import { useRootStore } from './store/root'
import { useUserPosition } from './hook/hookV8/useUserPosition'
import { useChainIdListener } from './hook/hookV8/useChainIdListener'
import { DEFAULT_CHAIN } from './constant/chain'
import { Exchange } from './pages/Exchange'

i18n.load({
  en: enMessages,
  cs: csMessages,
})
i18n.activate('en')

const FullApp = () => {
  const expectChainId = useRootStore((store) => store.expectChainId)
  const allPoolParams = useRootStore((store) => store.allPoolParams)
  const factoryLock = useRootStore((store) => store.factoryLock)
  const getUserPosition = useUserPosition()
  const factory = useFactory()

  useChainIdListener()
  useInterval(factory, 60000)
  useInterval(async () => getUserPosition(), 15000)
  useBTCPrice()
  const theme = useTheme()

  useEffect(() => {
    const localChainId = localStorage.getItem('krav-chain-id')
    factory(localChainId ? Number(localChainId) : DEFAULT_CHAIN).then()
  }, [])

  useEffect(() => {
    if (!factoryLock) {
      factory().then()
    }
  }, [expectChainId, factoryLock])

  useEffect(() => {
    if (allPoolParams) getUserPosition().then()
  }, [allPoolParams])

  return (
    <Router>
      <div
        className="App"
        css={css`
          position: relative;
          background: url(${theme.palette.mode === 'dark' ? DashboardDarkBg : DashboardBg});
        `}
      >
        <div className="fullApp">
          <I18nProvider i18n={i18n}>
            <ErrorDialog />
            <SuccessDialog />
            <SuccessSnackbar />
            <TransactionDialog />
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to={'/trade'} replace />} />
              <Route path={'/trade'} element={<Trade />} />
              <Route path={'/trade/:referral'} element={<Trade />} />
              <Route path={'/liquidity'} element={<Liquidity />} />
              <Route path={'/portfolio'} element={<Home />} />
              <Route path={'/portfolio/stake'} element={<HomeStake />} />
              <Route path={'/portfolio/farm'} element={<HomeFarm />} />
              <Route path={'/portfolio/referral'} element={<HomeReferral />} />
              <Route path={'/statistics'} element={<Statistics />} />
              <Route path={'/exchange'} element={<Exchange />} />
            </Routes>
            <Footer />
          </I18nProvider>
        </div>
        <img
          src={theme.palette.mode === 'dark' ? ReportDark : ReportImg}
          width={64}
          style={{ position: 'fixed', right: '20px', bottom: '21px', cursor: 'pointer' }}
          onClick={() => window.open('https://forms.gle/yASELgYTzR1KTGbU8', '_blank')}
          alt="report bugs"
        />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppTheme>
      <Web3Provider>
        <FullApp />
      </Web3Provider>
    </AppTheme>
  )
}

export default App
