import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const AirtableSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  // Replace with your actual Airtable base ID and API key
  const AIRTABLE_BASE_ID = 'apphuBNpFBRqJcHbR';
  const AIRTABLE_API_KEY = 'patblyKBhtPzNkG8c.2347c7c2a4f953e0484263f703ae9e69645bb4205e3fdc19b90135024414627c';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true

      try {
        const response = await axios.get(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Info`, {
          headers: {
            Authorization: "Bearer patblyKBhtPzNkG8c.2347c7c2a4f953e0484263f703ae9e69645bb4205e3fdc19b90135024414627c",
          },
        });

        const filteredData = response.data.records.filter((record) =>
          // Customize filtering based on your Airtable field and input value
          record.fields.FieldName.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSearchResults(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    if (inputValue) {
      fetchData();
    } else {
      setSearchResults([]); // Clear search results when input is empty
    }
  }, [inputValue]); // Re-run useEffect on input value change

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter search term..."
      />
      {isLoading ? (
        <p>Searching...</p>
      ) : (
        <div>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result) => (
                <li key={result.id}>
                  {/* Access and display relevant fields from your Airtable data */}
                  <h2>{result.fields.FieldName}</h2>
                  <p>{result.fields.AnotherFieldName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AirtableSearch;
