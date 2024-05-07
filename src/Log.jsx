import React, { useState, useEffect } from 'react';

const Logrecord = () => {
  const [inputValue, setInputValue] = useState('');
  const [displayTexts, setDisplayTexts] = useState([]);

  useEffect(() => {
    const storedTexts = localStorage.getItem('displayTexts');
    if (storedTexts) {
      setDisplayTexts(JSON.parse(storedTexts));
    }
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
    return `${time}  ${date}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const currentTime = getCurrentDateTime();
      const enteredText = `${inputValue}   ${currentTime}`;
      setDisplayTexts((prevDisplayTexts) => [enteredText, ...prevDisplayTexts]);
      setInputValue(''); // Clear the input field after displaying the text
      localStorage.setItem('displayTexts', JSON.stringify([enteredText, ...displayTexts]));
    }
  };

  const handleDeleteAll = () => {
    setDisplayTexts([]);
    localStorage.removeItem('displayTexts');
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter some text..."
      />
      <div>
        {displayTexts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
      <button onClick={handleDeleteAll}>Delete All Messages</button>
    </div>
  );
};

export default Logrecord;
