'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';
import { useGlobalContext } from '../context/store';

//import LinesChart from "./LinesChart";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


const Dashboard = () => {
  interface Micro {
    idMicrocontrolador: number;
    nombre: string;
  }  

  const [deviceId, setDeviceId] = useState(1);
  const [deviceData, setDeviceData] = useState({});
  const [dates, setDates] = useState([]);
  const [temperatura, setTemperature] = useState([]);
  const [humedad, setHumidity] = useState([]);
  const [distancia, setDistance] = useState([]);
  const { idUser } = useGlobalContext();
  const [loaded, setLoaded] = useState(false);
  //const [Microcontrolador, setMicrocontrolador] = useState(1);
  const [aggregationLevel, setAggregationLevel] = useState('live');

  const [chartKey, setChartKey] = useState(0);


  const data = {
    labels: dates,
    datasets: [
        {
          label: 'Temperatura',
          data: temperatura,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
            label: 'Humedad',
            data: humedad,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
            label: 'Distancia',
            data: distancia,
            fill: false,
            backgroundColor: 'rgb(161, 255, 99)',
            borderColor: 'rgba(161, 255, 99, 0.2)',
        },
    ],
  };

  const dataTemp = {
    labels: dates,
    datasets: [
        {
          label: 'Temperatura',
          data: temperatura,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
    ],
  };

  const dataHum = {
    labels: dates,
    datasets: [
        {
            label: 'Humedad',
            data: humedad,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
        },
    ],
  };

  const dataDist = {
    labels: dates,
    datasets: [
        {
            label: 'Distancia',
            data: distancia,
            fill: false,
            backgroundColor: 'rgb(161, 255, 99)',
            borderColor: 'rgba(161, 255, 99, 0.2)',
        },
    ],
  };

  var misoptions = {
      scales : {
          y : {
              min : 0
          },
          x: {
              ticks: { color: 'rgb(23, 60, 69)'}
          }
      }
  };


  const aggregateData = (data, level) => {
    const groupedData = {};

    data.forEach(item => {
        const date = new Date(item.fecha * 1000);
        date.setTime(date.getTime() - (6 * 60 * 60 * 1000));
        let key;

        switch(level) {
            case 'days':
                key = date.toISOString().split('T')[0]; // Group by date
                break;
            case 'hours':
                key = date.toISOString().split(':')[0]; // Group by hour
                break;
            // Add more cases for 'minutes' and 'live'
            case 'minutes':
                key = date.toISOString().split(':')[0] + ":" + date.toISOString().split(':')[1]; // Group by minute
                break;
            case 'live':
                key = date.toISOString().split('T')[1].split('.')[0]; // Group by second
                break;
            default:
                key = date.toISOString();
        }

        if (!groupedData[key]) {
            groupedData[key] = { temperatura: [], humedad: [], distancia: [] };
        }

        groupedData[key].temperatura.push(item.temperatura);
        groupedData[key].humedad.push(item.humedad);
        groupedData[key].distancia.push(item.distancia);
    });

    // Now, average (or sum) the data in each group
    const aggregatedData = Object.keys(groupedData).map(key => {
        const group = groupedData[key];
        return {
            date: key,
            temperatura: average(group.temperatura),
            humedad: average(group.humedad),
            distancia: average(group.distancia)
        };
    });

    return aggregatedData;
  };

  const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  useEffect(() => {
    if (loaded) return;
  
    const fetchData = async () => {
      try {
        const response = await fetch('https://iotevidencia.uc.r.appspot.com/api/datos');
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
  
        const filteredData = data.filter((dataX) => {
          return dataX.idMicrocontrolador === deviceId && dataX.idUsuario === idUser;
        });
  
        let processedData = [];
  
        if (aggregationLevel === 'last10') {
          // Select the last 10 records
          processedData = filteredData.slice(-10).map(item => {
            const date = new Date(item.fecha * 1000);
            date.setHours(date.getHours() - 6);
            const formattedDate = date.toISOString().split('.')[0];
            return {
              date: formattedDate,
              temperatura: item.temperatura,
              humedad: item.humedad,
              distancia: item.distancia
            };
          });
        } else {
          // For other aggregation levels, use the aggregateData function
          processedData = aggregateData(filteredData, aggregationLevel);
        }
  
        setDates(processedData.map((dataX) => dataX.date));
        setTemperature(processedData.map((dataX) => dataX.temperatura));
        setHumidity(processedData.map((dataX) => dataX.humedad));
        setDistance(processedData.map((dataX) => dataX.distancia));
  
        setLoaded(true);
      } catch (error) {
        console.error("error fetching data", error);
      }
    };
  
    fetchData();
  }, [deviceId, idUser, aggregationLevel, loaded]);
  


  useEffect(() => {
    console.log("deviceData updated:");
    console.log(deviceData);
    console.log("dates updated:");
    console.log(dates);
    console.log("temperatura updated:");
    console.log(temperatura);
    console.log("humedad updated:");
    console.log(humedad);
    console.log("distancia updated:");
    console.log(distancia);

  }, [deviceData]);


  const [micros, setMicros] = useState<Micro[]>([]);


  const [loaded2, setLoaded2] = useState(false);
  useEffect(() => {
    if(loaded2) return;
    const fetchData = async () => {
      try {
        const response = await fetch('https://iotevidencia.uc.r.appspot.com/api/micros');
        if (!response.ok) {
          // Handle response errors
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();

        console.log(data);

        const userMicros = data.filter(micro => micro.idUsuario == idUser)
                           .map(micro => ({ idMicrocontrolador: micro.idMicrocontrolador, nombre: micro.nombre }));
    
        setMicros(userMicros);
        setLoaded2(true);
      } catch (error) {
        console.error("error fetching data", error);
      }
    };

    fetchData();
  });

  const handleDeviceChange = (e) => {
    setDeviceId(e.target.value);
    console.log(e.target.value);

    setDeviceData({});
    setDates([]);
    setTemperature([]);
    setHumidity([]);
    setDistance([]);

    setLoaded2(false);
    setLoaded(false);

    setChartKey(chartKey + 1);  
  };

  const handleAggChange = (e) => {
    setAggregationLevel(e.target.value);
    setLoaded(false);
  };


  return (
    <div>
      <div className={styles.headerDiv}>
        <h1 className={styles.header}>Dashboard</h1>
      </div>

      <div className={styles.selectDiv}>
      <select onChange={handleDeviceChange} value={deviceId} className={styles.select}>
            {/* Populate this with device IDs */}
            {micros.map((micro) => (
              <option value={micro.idMicrocontrolador} key={micro.idMicrocontrolador}>{micro.nombre}</option>
            ))}
            {/* Add more devices as needed */}
        </select>

        <select onChange={handleAggChange} value={aggregationLevel} className={styles.aggSelect}>
          <option value="live">Live</option>
          <option value="last10">Ultimos 10</option>
          <option value="minutes">Minutos</option>
          <option value="hours">Horas</option>
          <option value="days">Dias</option>
        </select>
      </div>

      <div className={styles.graphDiv}>
        {/*
        <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{width:"100%", height:"100%"}}>
          <Line key={chartKey} data={data} options={misoptions} />
        </div>
        */}
        <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{width:"100%", height:"100%", marginBottom:"5%"}}>
          <Line key={chartKey} data={dataDist} options={misoptions} />
        </div>
        <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{width:"100%", height:"100%", marginBottom:"5%"}}>
          <Line key={chartKey} data={dataHum} options={misoptions} />
        </div>
        <div className="bg-light mx-auto px-2 border border-2 border-primary" style={{width:"100%", height:"100%", marginBottom:"5%"}}>
          <Line key={chartKey} data={dataTemp} options={misoptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;