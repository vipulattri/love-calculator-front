import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import './App.css';

function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const calculateLove = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://love-calulator-backend.onrender.com/api/calculate-love', {
        name1,
        name2
      });
      setResult(res.data.percentage);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('https://love-calulator-backend.onrender.com/api/results');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (result && result > 90) {
      gsap.to('body', {
        backgroundColor: '#ff80e1', // Cherry blossom color
        duration: 3,
        ease: 'power3.inOut'
      });

      // Cherry blossom shower animation when love > 90%
      createCherryBlossomShower();
    }
  }, [result]);

  const createCherryBlossomShower = () => {
    const numBlossoms = 100;
    for (let i = 0; i < numBlossoms; i++) {
      const blossom = document.createElement('div');
      blossom.classList.add('cherry-blossom');
      document.body.appendChild(blossom);
      const size = Math.random() * 10 + 5;
      const leftPosition = Math.random() * window.innerWidth;
      const animationDuration = Math.random() * 4 + 3;
      gsap.fromTo(
        blossom,
        {
          left: leftPosition,
          top: -50,
          opacity: 1,
        },
        {
          top: window.innerHeight + 50,
          opacity: 0,
          duration: animationDuration,
          ease: 'power1.in',
          repeat: -1,
          delay: Math.random() * 3
        }
      );
    }
  };

  // Love cursor effect
  const moveLoveCursor = (e) => {
    const loveCursor = document.querySelector('.love-cursor');
    if (loveCursor) {
      gsap.to(loveCursor, {
        x: e.clientX - 15, // 15 to center the cursor
        y: e.clientY - 15, // 15 to center the cursor
        duration: 0.2,
      });
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="app-container" onMouseMove={moveLoveCursor}>
      <div className="love-cursor"></div>
      <h1 className="title">❤️ Love Calculator ❤️</h1>
      
      <form className="form" onSubmit={calculateLove}>
        <input
          className="input"
          type="text"
          placeholder="First Name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          required
        />
        <input
          className="input"
          type="text"
          placeholder="Second Name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          required
        />
        <button className="submit-btn" type="submit">Calculate Love</button>
      </form>

      {result && (
        <div className="result">
          <h2>Love Compatibility: {result}%</h2>
        </div>
      )}

      <div className="footer" onClick={toggleHistory}>
        <p>Made with 💖 by Vipul | Click to See History</p>
      </div>

      {showHistory && (
        <div className="history">
          <h3>Recent Checks:</h3>
          <ul>
            {history.map((pair) => (
              <li key={pair._id} className="history-item">
                {pair.name1} ❤ {pair.name2} - {pair.percentage}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
