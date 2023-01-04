import React, { useState , useEffect} from 'react';

import Header from "./components/Header/Header";
import Keypad from "./components/Keypad/Keypad";

import dark from "./assests/dark_mode.png";
import light from "./assests/light_mode.png";
import deleteImg from "./assests/delete.png";

import './App.css';

const usedKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 8, 13, 190, 187, 189, 191, 56, 111, 106, 107, 109];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["+", "-", "*", "/"];


function App() {
  const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem("cal_app_theme"))||false);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem("cal_app_history"))||[]);
    
  useEffect(() => {
    localStorage.setItem("cal_app_theme",JSON.stringify(isDarkMode))
  },[isDarkMode]);

  useEffect(() => {
    localStorage.setItem("cal_app_history",JSON.stringify(history))
  },[history]);
    
   

  const handleKeyPress = (keyCode, key) => {
    if (!keyCode) return;
    if (!usedKeyCodes.includes(keyCode)) return;

    if (numbers.includes(key)) {
      if (key === "0") {
        if (expression.length === 0) return
      }
      calculateResult(expression + key);
      setExpression(expression + key);
    }
    else if (operators.includes(key)) {
      if (!expression) return;
      const lastChar = expression.slice(-1);
      if (operators.includes(lastChar)) return;
      if (lastChar === ".") return;
      setExpression(expression + key);
    }
    else if (keyCode === ".") {
      if (!expression) return;
      const lastChar = expression.slice(-1);
      if (!numbers.includes(lastChar)) return;
      setExpression(expression + key);
    }
    else if (keyCode === 8) {
      if (!expression) return;
      calculateResult(expression.slice(0, -1));
      setExpression(expression.slice(0, -1));
    }
    else if (keyCode === 13) {
      if (!expression) return;
      calculateResult(expression);

      let tempHistory = [...history];
      if (tempHistory.length > 20) {
        tempHistory = tempHistory.splice(0, 1);
      }
      tempHistory.push(expression);
      setExpression("");
      setHistory(tempHistory);
    }
  }

  const calculateResult = (exp) => {
    if (!exp) {
      setResult("");
      return;
    }
    const lastChar = exp.slice(-1);
    if (!numbers.includes(lastChar)) exp = exp.slice(0, -1);
    const ans = eval(exp).toFixed(2) + "";
    setResult(ans);
  }

  return (
      <div className="app"
        tabIndex="0"
        onKeyDown={(event) => handleKeyPress(event.keyCode, event.key)}
        data-theme={isDarkMode ? "dark" : ""}>
        <div className="app_cal">
          <div className="app_cal_navbar">
            <div className="app_cal_navbar_theme" onClick={() => { setIsDarkMode(!isDarkMode) }}>
              <img src={isDarkMode ? light : dark} alt="theme" />
            </div>
            <div className="app_cal_navbar_delete" onClick={() => { setHistory(""); setResult(""); setExpression("") }}>
              <img src={deleteImg} alt="clear" />
            </div>
          </div>
          <Header expression={expression} result={result} history={history} />
          <Keypad handleKeyPress={handleKeyPress} />
        </div>
      </div>
  );
}

export default App;
