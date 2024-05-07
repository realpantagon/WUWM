import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios library
import './Scanner.css'; // Import your CSS file

const Scanner = () => {
  const [inputValue, setInputValue] = useState('');
  const [displayTexts, setDisplayTexts] = useState([]);
  const [fetchedData, setFetchedData] = useState(null); 
  const [type, setType] = useState(''); // New state to store the fetched type

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

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      const currentTime = getCurrentDateTime();
      const enteredText = `${inputValue}   ${currentTime}`;
      setDisplayTexts((prevDisplayTexts) => [enteredText, ...prevDisplayTexts]);
      setInputValue(''); 
      localStorage.setItem('displayTexts', JSON.stringify([enteredText, ...displayTexts]));
  
      console.log('Fetching data for ID:', inputValue);
  
      // Axios GET request
      try {
        const response = await axios.get('https://api.airtable.com/v0/apphuBNpFBRqJcHbR/Info', {
          headers: {
            Authorization: 'Bearer patblyKBhtPzNkG8c.2347c7c2a4f953e0484263f703ae9e69645bb4205e3fdc19b90135024414627c'
          }
        });
      
        const filteredRecords = response.data.records.filter(record => record.fields.ID === inputValue);
        console.log('Filtered Records:', filteredRecords);
      
        if (filteredRecords.length > 0) {
          const fetchedType = filteredRecords[0].fields.type;
          console.log('Type:', fetchedType); // Output the type
          setType(fetchedType); // Update the state with the fetched type
        } else {
          console.log('No matching record found.');
          // Handle case where no matching record is found
          setType(''); // Reset the type if no matching record is found
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleDeleteAll = () => {
    setDisplayTexts([]);
    localStorage.removeItem('displayTexts');
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + displayTexts.map(e => e.replace(/,/g, "")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_texts.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container">
      {type && (
        <div className="fetched-type" style={{ color: type === 'WUWM Member' || type === 'Non member' || type === 'Accompanying person' ? 'green' : 'red' }}>
          <h1>{type}</h1>
        </div>
      )}
      <div className="input-container">
        <input
          className="text-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Scan"
        />
      </div>
      <div className="display-texts">
        {displayTexts.map((text, index) => (
          <p className="display-text" key={index}>{text}</p>
        ))}
      </div>
      <button className="delete-button" onClick={handleDeleteAll}>Delete All Messages</button>
      <button className="export-button" onClick={exportToCSV}>Export as CSV</button>
    </div>
  );
};

export default Scanner;
