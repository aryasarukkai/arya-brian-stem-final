import React, { useState } from 'react';
import axios from 'axios';

function Trivia() {
  const [teamName, setTeamName] = useState('');
  const [trivia, setTrivia] = useState('');

  const generateTrivia = async () => {
    const response = await axios.post('http://localhost:5002/api/trivia', { teamName });
    setTrivia(response.data);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter an NBA team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={generateTrivia}>Generate Trivia</button>
      <p>{trivia}</p>
    </div>
  );
}

export default Trivia;