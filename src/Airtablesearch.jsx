import React, { useState } from 'react';
import axios from 'axios';

const AirtableSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const apiKey = 'patblyKBhtPzNkG8c.2347c7c2a4f953e0484263f703ae9e69645bb4205e3fdc19b90135024414627c';
  const baseId = 'apphuBNpFBRqJcHbR';
  const tableName = 'info';

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=SEARCH('${inputValue}', {your_search_field})`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      setSearchResults(response.data.records);
    } catch (error) {
      console.error('Error searching Airtable:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter search query..."
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        <h2>Search Results</h2>
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>{result.fields.your_display_field}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AirtableSearch;
