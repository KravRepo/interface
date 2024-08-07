/** @jsxImportSource @emotion/react */
import './App.css'
import { Header } from './components/Header/Header'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import { Trade } from './pages/Trade'
import { AppTheme } from './theme/appTheme'
import { Footer } from './components/Footer/Footer'
import { Liquidity } from './pages/Liquidity'
import { useFactory } from './hook/hookV8/useFactory'
import { useBTCPrice } from './hook/hookV8/useBTCPrice'
import { ErrorDialog } from './components/Dialog/ErrorDialog'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { TransactionDialog } from './components/Dialog/TransactionDialog'
import { Home } from './pages/Home'
import { HomeStake } from './pages/home/HomeStake'
import { Greeting } from './pages/Greeting'
// import { HomeReferral } from './pages/home/HomeReferral'
// import { HomeFarm } from './pages/home/HomeFarm'
import { css } from '@emotion/react'
import DashboardBg from './assets/imgs/dashboard_bg.png'
import DashboardDarkBg from './assets/imgs/darkModel/dashboard_bg_dark.png'
import { SuccessSnackbar } from './components/Dialog/SuccessSnackbar'
import { SuccessDialog } from './components/Dialog/SuccessDialog'
import { Statistics } from './pages/Statistics'
// import ReportImg from './assets/imgs/report.png'
// import ReportDark from './assets/imgs/darkModel/report_dark.png'
import { useTheme } from '@mui/material'
import { useUserPosition } from './hook/hookV8/useUserPosition'
import { useChainIdListener } from './hook/hookV8/useChainIdListener'
import { Exchange } from './pages/Exchange'
import TermsAndAgreementDialog from './components/Dialog/TermsAndAgreementDialog'
import MuiThemeProvider from './theme/muiTheme'
import { MulticallUpdater } from './state/multicall'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './state'
import { Provider as BlockNumberProvider } from './hook/useBlockNumber'
import { locales } from './constant/locales'
import Points from './pages/Points'
import { Provider as Web3Provider2 } from './hook/web3'
import { ChainId } from './constant/chain'

i18n.load(locales)
i18n.activate('en-US')

const FullApp = () => {
  // const expectChainId = useRootStore((store) => store.expectChainId)
  // const allPoolParams = useRootStore((store) => store.allPoolParams)
  useUserPosition()
  useFactory()
  useChainIdListener()
  // useInterval(factory, 60000)
  // useInterval(async () => getUserPosition(), 15000)
  useBTCPrice()
  const theme = useTheme()

  // useEffect(() => {
  //   const localChainId = localStorage.getItem('krav-chain-id')
  //   factory(localChainId ? Number(localChainId) : DEFAULT_CHAIN).then()
  // }, [factory])

  // useEffect(() => {
  //   if (!factoryLock) {
  //     factory().then()
  //   }
  // }, [expectChainId, factory, factoryLock])

  // useEffect(() => {
  //   if (allPoolParams) getUserPosition().then()
  // }, [allPoolParams])

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
            <MulticallUpdater />
            <TermsAndAgreementDialog />
            <ErrorDialog />
            <SuccessDialog />
            <SuccessSnackbar />
            <TransactionDialog />
            <Header />
            <Routes>
              <Route path="/" element={<Greeting />} />
              <Route path={'/trade'} element={<Trade />} />
              <Route path={'/trade/:token'} element={<Trade />} />
              <Route path={'/liquidity'} element={<Liquidity />} />
              <Route path={'/liquidity/:token'} element={<Liquidity />} />
              <Route path={'/portfolio'} element={<Home />} />
              <Route path={'/points'} element={<Points />} />
              <Route path={'/portfolio/stake'} element={<HomeStake />} />
              {/* <Route path={'/portfolio/farm'} element={<HomeFarm />} /> */}
              {/* <Route path={'/portfolio/referral'} element={<HomeReferral />} /> */}
              <Route path={'/statistics'} element={<Statistics />} />
              <Route path={'/exchange'} element={<Exchange />} />
            </Routes>
            <Footer />
          </I18nProvider>
        </div>
        {/* <img
          src={theme.palette.mode === 'dark' ? ReportDark : ReportImg}
          width={64}
          style={{ position: 'fixed', right: '20px', bottom: '21px', cursor: 'pointer' }}
          onClick={() => window.open('https://forms.gle/yASELgYTzR1KTGbU8', '_blank')}
          alt="report bugs"
        /> */}
      </div>
    </Router>
  )
}

function App() {
  return (
    <ReduxProvider store={store}>
      <MuiThemeProvider>
        <AppTheme>
          <Web3Provider2 defaultChainId={ChainId.BASE}>
            <BlockNumberProvider>
              <FullApp />
            </BlockNumberProvider>
          </Web3Provider2>
        </AppTheme>
      </MuiThemeProvider>
    </ReduxProvider>
  )
}

export default App
