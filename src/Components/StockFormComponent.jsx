import './ComponentsStyling/StockForm.css'
import { useState, useEffect, useContext, useCallback } from 'react'
import AppContext from '../Context/StockContext.jsx'

const StockForm = () => {
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [currentPurchasePrice, setCurrentPurchasePrice] = useState("");  
  const [currentStockList, setCurrentStockList] = useState([]);
  const [isSymbolValid, setIsSymbolValid] = useState(true);

  const {setSymbolInput, setQuantityInput, setPurchasePriceInput, setStockList} = useContext(AppContext);

  // event list is an object
  const handleChangeSymbol = (event) => {
    setCurrentSymbol(event.target.value);
    // console.log(currentSymbol);
  };

  const handleChangeQuantity = (event) => {
    setCurrentQuantity(event.target.value);
    // console.log(currentQuantity);
  };

  const handleChangePurchasePrice = (event) => {
    setCurrentPurchasePrice(event.target.value);
    // console.log(currentPurchasePrice);
  };

  // --------------- ------------------------------- //
  // Object given by demo url:
  // {
  //   "Global Quote": {
  //     "01. symbol": "IBM",
  //     "02. open": "194.5900",
  //     "03. high": "196.2100",
  //     "04. low": "193.7500",
  //     "05. price": "196.0300",
  //     "06. volume": "1790371",
  //     "07. latest trading day": "2024-08-20",
  //     "08. previous close": "194.7300",
  //     "09. change": "1.3000",
  //     "10. change percent": "0.6676%"
  // }
  // set the symbol is valid by using boolean = true or false
  const validateSymbol = useCallback(
    async () => {
      // Online URL
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${currentSymbol}&apikey=EKBMW04GSC6DJMLO`);
  
      // Demo URL
      // Check first the symbol=${currentSymbol.toUpperCase()} from user input
      // Here's a breakdown of the condition:
  
      // 1) data["Global Quote"]: This checks if the data object has a property called "Global Quote". If the API call was successful and the data is returned correctly, the "Global Quote" property should exist.
  
      // 2) data["Global Quote"]["01. symbol"] === currentSymbol.toUpperCase(): If the "Global Quote" property exists, this part of the condition checks if the stock symbol returned by the API ("01. symbol") matches the currentSymbol entered by the user.
      
      // const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${currentSymbol.toUpperCase()}&apikey=demo`);
      const data = await response.json();
      // Debugging use
      // console.log("Look here 1 ", data["Global Quote"]);
      // console.log("Look here 2 ", data["Global Quote"]["01. symbol"]);
  
      if (data["Global Quote"] && data["Global Quote"]["01. symbol"] === currentSymbol.toUpperCase()) {
        setIsSymbolValid(true);
        return true;
      } else {
        setIsSymbolValid(false);
        return false;
      }
    }, [currentSymbol,setIsSymbolValid]
  );

  // ---------------------------------------------- //
  // sumbit button function
  const submitForm = async (event) => {
    event.preventDefault();
    const isValid = await validateSymbol();

    if ( !currentSymbol || !currentQuantity || !currentPurchasePrice) {
      alert("Please fill in all fields.");
      setCurrentSymbol("");
      setCurrentQuantity("");
      setCurrentPurchasePrice("");
      return;
    } else if (currentQuantity <= 0 || currentPurchasePrice <= 0) {
      alert("Quantity or Purchase Price cannot be less than 0");
      setCurrentSymbol("");
      setCurrentQuantity("");
      setCurrentPurchasePrice("");
    } else if (!isValid) {
      alert("Invalid stock symbol. Please try again.");
      setCurrentSymbol("");
      setCurrentQuantity("");
      setCurrentPurchasePrice("");
      return;
    } else {
      const newStock = {
        symbol: currentSymbol,
        quantity: currentQuantity,
        price: currentPurchasePrice,
      };
   
      //Set stock list
      setCurrentStockList((prevStockList) => (
        [...prevStockList, newStock]
      ));
      // Note:
      // you cannot immediately see the updated state value in a console.log after calling setState in React. The reason is that setState is asynchronous, meaning React schedules the state update and re-render but does not update the state immediately. This behavior allows React to batch multiple state updates together for performance reasons.
  
      // If you try to console.log the state directly after calling setState, you will likely still see the previous state, not the updated one.
      console.log(currentStockList);
      
      //Clear the form inputs
      setCurrentSymbol("");
      setCurrentQuantity("");
      setCurrentPurchasePrice("");
      alert(`${currentSymbol.toUpperCase()} stock added!`);
  
      // Debuging use
      // console.log("Your symbol: ", currentSymbol);
      // console.log("Your quantity: ", currentQuantity);
      // console.log("Your purchasePrice: ", currentPurchasePrice);
      // console.log("Your stock list: ", currentStockList);
      // console.log("Your stock list: ", currentStockList.length);
  
      //Set the global context values
      setSymbolInput(currentSymbol);
      setQuantityInput(currentQuantity);
      setPurchasePriceInput(currentPurchasePrice);
      setStockList((prevStockList) => (
        [...prevStockList, newStock]
      ));
  
      // Debuging use
      // console.log("Your global value symbol: ", symbolInput);
      // console.log("Your global value quantity: ", quantityInput);
      // console.log("Your global value purchasePrice: ", purchasePriceInput);
      // console.log("Your global value stock list: ", stockList);
      // console.log("Your global value stock list: ", stockList.length);
    }
  }

  return (
    <form id="stock-form" className="user-input">
      <input
        className="stock-symbol"
        type="text"
        placeholder="Stock Symbol"
        value={currentSymbol}
        onChange={handleChangeSymbol}
      />
      <input 
        className="input-quantity"
        type="number"
        placeholder="Quantity"
        value={currentQuantity}
        onChange={handleChangeQuantity}
      />
      <input
        className="purchase-price"
        type="number"
        placeholder="Purchase Price"
        value={currentPurchasePrice}
        onChange={handleChangePurchasePrice}
      />
      <button
        className="addstock-button"
        onClick={submitForm}
      >
        Add Stock
      </button>
    </form>
  )
}

export default StockForm;