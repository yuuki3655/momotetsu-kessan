import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Play, Users, Calendar } from 'lucide-react';
import './App.css';

// Import Assets
import backgroundSvg from './assets/background.svg';
import trainSvg from './assets/train.svg';
import logoSvg from './assets/logo.svg';
import boardSvg from './assets/result_board.svg';

const DEFAULT_PLAYERS = [
  { id: 'player1', name: 'ももたろ社長', color: '#ef4444' }, // Red
  { id: 'player2', name: 'きんたろ社長', color: '#3b82f6' }, // Blue
  { id: 'player3', name: 'うらしま社長', color: '#22c55e' }, // Green
  { id: 'player4', name: 'やしゃ社長',   color: '#eab308' }, // Yellow
];

// Helper to generate a data row
const createRow = (yearIndex) => {
  const y = yearIndex + 1; // 1-based year for calculation
  return {
    year: 2017 + yearIndex,
    // P1 (Red): Steady growth (Standard)
    player1: 500 + (y * 250) + Math.floor(Math.random() * 300),
    
    // P2 (Blue): High volatility (The Gambler)
    player2: 1000 + (y * 150) + Math.floor(Math.sin(y * 0.8) * 1000) + Math.floor(Math.random() * 500),
    
    // P3 (Green): Exponential growth (The Tycoon)
    player3: 200 + (y * y * 30) + Math.floor(Math.random() * 200),
    
    // P4 (Yellow): Early lead then crash (The Tragedy)
    player4: 3000 + (y * 100) - (y > 4 ? (y - 4) * 600 : 0) + Math.floor(Math.random() * 400),
  };
};

function App() {
  const [view, setView] = useState('input'); // input, animating, result
  const [numPlayers, setNumPlayers] = useState(4);
  const [numYears, setNumYears] = useState(10);
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  
  // Initialize with 10 years of data
  const [data, setData] = useState(Array.from({ length: 10 }, (_, i) => createRow(i)));
  
  const [animationStep, setAnimationStep] = useState(0);

  // Handle resizing data when years change
  useEffect(() => {
    setData(prevData => {
      if (prevData.length === numYears) return prevData;
      
      if (numYears > prevData.length) {
        // Add new rows
        const newRows = Array.from({ length: numYears - prevData.length }, (_, i) => 
          createRow(prevData.length + i)
        );
        return [...prevData, ...newRows];
      } else {
        // Truncate rows
        return prevData.slice(0, numYears);
      }
    });
  }, [numYears]);

  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = parseInt(value) || 0;
    setData(newData);
  };

  const handleNameChange = (id, newName) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === id ? { ...p, name: newName } : p
    ));
  };

  const startKessan = () => {
    setView('animating');
    setAnimationStep(0);
    // 0s: Intro Start (Train + Logo)
    // 5s: Jump directly to Result Board
    
    setTimeout(() => {
        setView('result');
    }, 5000);
  };

  const processedData = [
    { year: 0, yearLabel: '0年', player1: 0, player2: 0, player3: 0, player4: 0 },
    ...data.map((d, i) => ({
      ...d,
      yearLabel: `${i + 1}年` // Relative Year 1, 2, 3...
    }))
  ];

  // Calculate Max for Y-Axis Scale based on ACTIVE players
  const activePlayers = players.slice(0, numPlayers);
  const allValues = processedData.flatMap(d => activePlayers.map(p => d[p.id]));
  
  const dataMax = Math.max(...allValues, 100); 
  const dataMin = Math.min(...allValues, 0);
  
  let viewMax, viewMin, viewMid;

  // Smart Axis Logic
  const padding = (dataMax - dataMin) * 0.1 || 1000;
  viewMax = Math.ceil((dataMax + padding) / 100) * 100;

  if (dataMin >= 0) {
    // Case 1: All positive. Base at 0.
    viewMin = 0;
  } else {
    // Case 2: Negative values exist. Use actual min with padding.
    viewMin = Math.floor((dataMin - padding) / 100) * 100;
  }
  
  viewMid = Math.round((viewMax + viewMin) / 2);

  return (
    <div className="flex flex-col items-center">
      {view === 'input' && (
        <header className="mt-0 mb-0">
          <h1 className="momo-title">桃鉄風 決算メーカー</h1>
        </header>
      )}

      <AnimatePresence mode="wait">
        {view === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="momo-panel w-full max-w-6xl p-6 m-4"
          >
            {/* Settings Control Panel */}
            <div className="flex flex-wrap justify-center gap-8 mb-6 bg-blue-900/50 p-4 rounded-lg border-2 border-yellow-500/30">
              <div className="flex items-center gap-3">
                <Users className="text-yellow-400" />
                <span className="font-bold text-lg">プレイ人数:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setNumPlayers(num)}
                      className={`px-4 py-1 rounded font-bold transition-all ${
                        numPlayers === num 
                          ? 'bg-yellow-400 text-red-800 scale-110 shadow-lg' 
                          : 'bg-blue-800 text-gray-400 hover:bg-blue-700'
                      }`}
                    >
                      {num}人
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-yellow-400" />
                <span className="font-bold text-lg">プレイ年数:</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    value={numYears} 
                    onChange={(e) => {
                      let val = parseInt(e.target.value) || 1;
                      if (val > 100) val = 100;
                      if (val < 1) val = 1;
                      setNumYears(val);
                    }}
                    className="bg-white text-blue-900 font-bold px-3 py-1 rounded w-20 text-center text-lg border-2 border-yellow-400 focus:outline-none"
                  />
                  <span className="font-bold">年</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">総資産の推移を入力 (単位: 万円)</h2>
            
            <div className="overflow-visible">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#004080] z-10 shadow-md">
                  <tr>
                    <th className="p-2 w-20">年度</th>
                    {activePlayers.map(p => (
                      <th key={p.id} className="p-2 min-w-[150px]">
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleNameChange(p.id, e.target.value)}
                          className="bg-transparent font-bold text-center w-full focus:outline-none border-b-2 border-dashed border-white/30 focus:border-white"
                          style={{color: p.color}}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-t border-blue-900 hover:bg-white/5 transition-colors">
                      <td className="p-2 font-bold text-center">{idx + 1}年目</td>
                      {activePlayers.map(p => (
                        <td key={p.id} className="p-2">
                          <input 
                            type="number" 
                            className="momo-input"
                            value={row[p.id]} 
                            onChange={(e) => handleInputChange(idx, p.id, e.target.value)}
                            style={{ borderColor: p.color, color: p.color }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button onClick={startKessan} className="momo-button flex items-center gap-2 mx-auto">
                <Play fill="currentColor" size={20} /> 決算発表を開始する！
              </button>
            </div>
          </motion.div>
        )}

        {view === 'animating' && (
          <div className="kessan-overlay">
            <div className="scene-container">
                <div className="background-layer"><img src={backgroundSvg} alt="Scenery" /></div>
                <div className="train-layer"><div className="train-container"><img src={trainSvg} alt="Train" /></div></div>
                <AnimatePresence>
                  {animationStep === 0 && (
                    <motion.div 
                      key="logo"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                      transition={{ duration: 0.5 }}
                      className="logo-layer"
                    >
                        <img src={logoSvg} alt="Kessan Logo" />
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </div>
        )}

        {view === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="kessan-overlay"
          >
             <div className="scene-container">
                <div className="background-layer"><img src={backgroundSvg} alt="Scenery" /></div>
                <div className="board-layer">
                  <div className="board-container">
                    <img src={boardSvg} className="board-bg" alt="Result Board" />
                    
                    {/* Dynamic Year Label Overlay on Board */}
                    <div 
                      className="absolute text-3xl font-black text-[#5c3317] tracking-widest whitespace-nowrap" 
                      style={{
                        fontFamily: "'Hiragino Kaku Gothic Std', sans-serif",
                        left: '46%',
                        top: '10.8%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                        {numYears}年
                    </div>

                    <div className="yaxis-overlay">
                      <div className="yaxis-label">{viewMax.toLocaleString()}万円</div>
                      <div className="yaxis-label text-gray-600">
                        {viewMid === 0 ? '0円' : `${viewMid.toLocaleString()}万円`}
                      </div>
                      <div className={`yaxis-label ${viewMin < 0 ? 'text-red-700' : ''}`}>
                        {viewMin === 0 ? '0円' : `${viewMin.toLocaleString()}万円`}
                      </div>
                    </div>

                    <div className="graph-overlay">
                       <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#6d5a45" vertical={true} horizontal={true} />
                          <ReferenceLine y={0} stroke="#fff" strokeWidth={2} />
                          <XAxis 
                            dataKey="yearLabel" 
                            stroke="#d2b48c" 
                            tick={{fill: '#d2b48c', fontSize: 12, fontWeight: 'bold'}}
                            axisLine={false}
                            tickLine={false}
                            dy={5}
                            interval={numYears > 20 ? 'preserveStartEnd' : 0} // Adjust ticks for long games
                          />
                          <YAxis hide domain={[viewMin, viewMax]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#004080', border: '1px solid #ffcc00' }}
                            itemStyle={{ fontWeight: 'bold' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend 
                            content={({ payload }) => (
                              <div className="flex justify-center gap-6 pt-4 mb-0">
                                {activePlayers.map((player) => (
                                  <div key={player.id} className="flex items-center gap-2">
                                    <div 
                                      className="w-3 h-3 rounded-full border-2 border-white"
                                      style={{ backgroundColor: player.color }}
                                    />
                                    <span className="text-white font-bold text-sm shadow-black drop-shadow-md">
                                      {player.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                          
                          {activePlayers.map(p => (
                             <Line 
                               key={p.id}
                               type="monotone" 
                               dataKey={p.id} 
                               stroke={p.color} 
                               strokeWidth={3} 
                               dot={numYears <= 20 ? {r: 5, fill: p.color, stroke: "#fff", strokeWidth: 2} : false} // Hide dots for long games
                               name={p.name} 
                               animationDuration={3000} 
                             />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
