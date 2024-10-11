import React, { useContext, useEffect, useState } from 'react'
import "./Coin.css"
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {

  const { coinId } = useParams();
  const{currency} = useContext(CoinContext);
  const [coinData, setCoinData] = useState();
  const [historicalData, setHistoricalData] = useState();
  

  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-nUBakq6Eb7c1PYnw1cFabdcW'}
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      if(!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data  = await response.json();
      setCoinData(data)

    } catch (error) {
      console.error("Failed to fetch historical data:", error);
    }
  }

  const fetchHistoricalData = async() => {
    const options = {
      method: 'GET',
      headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-nUBakq6Eb7c1PYnw1cFabdcW'}
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options);
      if(!response.ok){
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setHistoricalData(data);
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
    }
  }
    
   
  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  },[currency])

  
  if(coinData && historicalData){  
    return (
      <div className="coin">
        <div className="coin-name">
          <img src= {coinData.image.large} alt="coinimg.png" />
          <p><b>{coinData.name} {coinData.symbol.toUpperCase()}</b></p>
        </div>
        <div className="coin-chart">
          <LineChart historicalData = {historicalData}/>
        </div>

        <div className="coin-info">
          <ul>
            <li>Crypto Market</li>
            <li>{coinData.market_cap_rank}</li>
          </ul>

          <ul>
            <li>Crypto Price</li>
            <li>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
          </ul>

          <ul>
            <li>Market Cap</li>
            <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
          </ul>         
        </div>

      </div>
    )
  }
  else{
    return (
      <div className="load-spinner">
        <span className="loader"></span>
      </div>
    )

  }
}


export default Coin
