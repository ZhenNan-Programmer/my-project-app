import './App.css'
import StockForm from './Components/StockFormComponent'
import StockList from './Components/StockListComponent'
import AppContext from './Context/StockContext.jsx'
import logo from './assets/FinanceDashboard.png'
import { useState, useEffect, useContext } from 'react'

function App() {
  const [symbolInput, setSymbolInput] = useState('');
  const [quantityInput, setQuantityInput] = useState();
  const [purchasePriceInput, setPurchasePriceInput] = useState();
  const [stockList, setStockList] = useState([]);

  return (
    <AppContext.Provider value={
        {
          symbolInput,
          quantityInput,
          purchasePriceInput,
          stockList,
          setSymbolInput,
          setQuantityInput,
          setPurchasePriceInput,
          setStockList,
        }
      }>

      <div className='content-container'>
        <div className='app-title'>
          <img src={logo} />
          <h1>Finance Dashboard</h1>
        </div>
        <StockForm />
        <StockList /> 
      </div>
    </AppContext.Provider>
  )
}

export default App

// Local:   http://localhost:5173/
// Welcome to Alpha Vantage! Your dedicated access key is: EKBMW04GSC6DJMLO. Please record this API key at a safe place for future data access.