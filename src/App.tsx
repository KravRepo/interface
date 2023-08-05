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
import { SuccessSnackbar } from './components/Dialog/SuccessSnackbar'
import { SuccessDialog } from './components/Dialog/SuccessDialog'

i18n.load({
  en: enMessages,
  cs: csMessages,
})
i18n.activate('en')

const FullApp = () => {
  const factory = useFactory()
  const getBTCPrice = useBTCPrice()
  useEffect(() => {
    Promise.all([factory(), getBTCPrice()]).then()
    setInterval(async () => {
      await factory()
      await getBTCPrice()
    }, 120000)
  }, [])

  return (
    <Router>
      <div className="fullApp">
        <AppTheme>
          <Web3Provider>
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
                {/*<Route path={'/dashboard/reward'} element={<HomeRewardCenter />} />*/}
              </Routes>
              <Footer />
            </I18nProvider>
          </Web3Provider>
        </AppTheme>
      </div>
    </Router>
  )
}

function App() {
  return (
    <>
      <div
        className="App"
        css={css`
          background: url(${DashboardBg});
        `}
      >
        <FullApp />
      </div>
    </>
  )
}

export default App
