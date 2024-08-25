import './ComponentsStyling/StockList.css'
import { useState, useEffect, useContext } from 'react'
import AppContext from '../Context/StockContext.jsx'

const StockList = () => {
  const firstLoadMessage = "No stocks added yet"
  const [onlinePrice, setOnlinePrice] = useState();

  const {symbolInput, isSymbolValid, stockList} = useContext(AppContext);
  
  useEffect( () => {
    if (stockList.length > 0) {
      // Online URL
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbolInput}&apikey=EKBMW04GSC6DJMLO`)
      // Demo URL
      // fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`)
      .then(response => response.json())
      .then(data => {
        console.log("Data: ", data);
        const fetchedPrice = parseFloat(data["Global Quote"]["05. price"]);
        setOnlinePrice(fetchedPrice);
        console.log(`${symbolInput} current price is: `, fetchedPrice);
      })
      .catch(error => {
        console.error("Error fetching the stock price:", error);
      });
    }
  }, [stockList]);

  if (stockList.length === 0) {
    return(
      <div className="stocklist-container">
      <h2>Stock List</h2>
      <div className="stock-data">
        <p>{firstLoadMessage}</p>
      </div>
    </div>
    );
  } else {
    return (
      <div className="stocklist-container">
        <h2>Stock List</h2>
        {stockList.map((stockObject, index) => {
          // Calculate the profit / Loss
          const finalValueProfit = parseFloat(
            (stockObject.quantity * onlinePrice) - (stockObject.quantity * stockObject.price)
          );
          // adding condition for profit style and loss style
          const profit_Loss = finalValueProfit > 0 ? "profit-display" : "loss-display";
          // adding + sign if finalValueProfit > 0 else empty string
          const profit_Symbol = finalValueProfit > 0 ? "+" : "";

          return (
            <div className="stock-data" key={index}>
              <p>Symbol: {stockObject.symbol.toUpperCase()}</p>
              <p>Quantity: {stockObject.quantity}</p>
              <p>Purchase Price: {stockObject.price}</p>
              <p>Current Price: {onlinePrice}</p>
              <p className={profit_Loss}>Profit / Loss: {profit_Symbol} {finalValueProfit.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default StockList;