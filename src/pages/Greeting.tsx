import Preview from '../assets/imgs/dashboard.png';
import { useNavigate } from 'react-router-dom';

export const Greeting = () => {
    const navigate = useNavigate()

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            background: "linear-gradient(to right, #434343 0%, black 100%)",
            textAlign: 'center',
        }}>
            <div style={{height: '150px'}} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <p style={{
                    fontSize: '60px', 
                    background: 'linear-gradient(90deg, rgba(40,50,245,1) 0%, rgba(179, 179, 179,1) 100%)', 
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '900',
                    letterSpacing: '3px',
                    margin: '0px'
                    }}>
                        PERPETUAL FUTURES
                </p>
                <p style={{
                    fontSize: '60px', 
                    background: 'linear-gradient(90deg, rgba(40,50,245,1) 0%, rgba(179, 179, 179,1) 100%)', 
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '900',
                    letterSpacing: '3px',
                    margin: '0px',
                    marginTop: '-30px'
                    }}>
                        WITH ANY ALTCOIN
                </p>                    
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <p style={{
                    fontSize: '17px',
                    color: 'white',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    marginTop: '2px'
                }}>            
                    BET ON BTC WITH MEMES, GAMEFI, AND ANY OTHER ALTCOINS
                </p>                
            </div>            
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginTop: '40px'
            }}>
                <button onClick={() => navigate('/trade')} style={{
                    borderRadius: '5px',
                    minWidth: '200px', 
                    padding: '20px 40px',
                    backgroundColor: 'rgba(40,50,245,1)',
                    color: 'white',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '16px',
                    letterSpacing: '1px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}>
                    Start Trading
                </button>
                <div style={{'width': '10px'}} />
                <button onClick={() => navigate('/liquidity')} style={{
                    borderRadius: '5px',
                    minWidth: '200px', 
                    padding: '20px 40px',
                    backgroundColor: 'rgba(40,50,245,1)',
                    color: 'white',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '16px',
                    letterSpacing: '1px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}>
                    Earn Yield
                </button>                
            </div>
            <div style={{
                width: "100%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '80px',
                marginBottom: '60px'
            }}>
                <button onClick={() => navigate('/trade')} style={{
                    width: "70%",
                    height: "auto",
                    borderRadius: '10px',    
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 'none'
                }}>
                    <img src={Preview} alt="dashboard preview" style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: '10px',
                        border: '4px solid rgba(255,255,255, 0.8)'
                    }} />
                </button>
            </div>
        </div>
    )
}
