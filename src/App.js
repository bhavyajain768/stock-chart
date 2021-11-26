import React,{useState,useEffect} from 'react';
import Select from 'react-select';
import yahooStockPrices from 'yahoo-stock-prices';
import {CanvasJSChart} from 'canvasjs-react-charts';


function App()
{
    //Contents of combo-box to select company name
    const compList = [
        {
            ticker: 'RELIANCE.NS',
            label: 'Reliance'
        },
        {
            ticker: 'HDFCBANK.NS',
            label: 'HDFC Bank'
        },
        {
            ticker: 'SBIN.NS',
            label: 'SBI Bank'
        },
        {
            ticker: 'TATAMOTORS.NS',
            label: 'Tata Motors'
        }
    ];

    //States use to store the selected compony name from the combo-box
    const[label,setLabel] = useState(compList.label);
    const[ticker,setTicker] = useState(compList.ticker);   
    const handler = (e) => {
        setLabel(e.label);
        setTicker(e.ticker);
    }

    //Contents of combo-box to select time-period
    const timeList = [
        {
            label: '1 Day'
        },
        {
            label: '5 Days'
        },
        {
            label: '1 Month'
        },
        {
            label: '6 Months'
        },
        {
            label: '1 Year'
        },
        {
            label: '5 Years'
        }
    ];

    //States use to store the selected time-period from the combo-box
    const[label2,setLabel2] = useState(timeList.label); 
    const handler2 = (e) => {
        setLabel2(e.label);
    }

    //States use to store the stock price data fetched from the API
    var today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var last = new Date();
    var str = '5 Years';
    const [stockPrice,setStockPrice] = useState([]);
    if(label2=='1 Day'){last.setDate(today.getDate()-1)
    str = label2}
    else if(label2=='5 Days'){last.setDate(today.getDate()-5)
    str = label2}
    else if(label2=='1 Month'){last.setMonth(today.getMonth()-1)
    str = label2}
    else if(label2=='6 Months'){last.setMonth(today.getMonth()-6)
    str = label2}
    else if(label2=='1 Year'){last.setFullYear(today.getFullYear()-1)
    str = label2}
    else {last.setFullYear(today.getFullYear()-5)}
    //Fetching data from API and updating the states
    useEffect(() => {
        const fetchDetails = async () => {
            const prices = await yahooStockPrices.getHistoricalPrices(last.getUTCMonth(), last.getUTCDate(), last.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCFullYear(),ticker, '1d');
            console.log(ticker)
            console.log(last)
            setStockPrice(prices);
        };
    
        fetchDetails()
    },[ticker,label2]);
    console.log(stockPrice);
    return(
        <div>
                <Select placeholder='Select Comapny Name' options={compList} onChange={handler}/>
                <Select placeholder='Select Period' options={timeList} onChange={handler2}/>
                <CanvasJSChart
                    options = { {
                        title:{
                            text: `Stock Prices of ${label} for ${str}`
                        },
                        axisY:{
                            crosshair:{
                                enabled: true,
                                snapToDataPoint: true
                            }
                            },
                        axisX:{
                            crosshair:{
                                enabled: true,
                                snapToDataPoint: true
                            },
                            scaleBreaks: {
                                spacing: 0,
                                fillopacity: 0,
                                lineThickness: 0,
                                customBreaks: stockPrice.reduce((breaks,value,index,array) => {
                                    if (index === 0) return breaks;

                                    const current = Number(new Date(value.date))*1000;
                                    const previous = Number(new Date(array[index-1].date))*1000;
                                    return (previous-current)===86400000
                                        ? breaks
                                        : [
                                            ...breaks,
                                            {
                                                startValue: current,
                                                endValue: previous-86400000
                                            }
                                        ]
                                }, [])
                            }
                        },
                        data: [
                            {
                                type: 'line',
                                dataPoints: stockPrice.map(stockPrice => ({
                                    x: new Date(stockPrice.date*1000),
                                    y: stockPrice.open
                                }))
                            }
                        ]
                    } }
                />
        </div>
    );
}
export default App;

