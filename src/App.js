import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './App.css';
import React, { useState } from 'react';

export const App = () => {
  const GET_COUNTRY = gql`
    {
      country(code: "BR") {
        name
        native
        capital
        emoji
        currency
        languages {
          code
          name
        }
      }
    }
  `;
  const [guess, setGuess] = useState('');

  const [status, setStatus] = useState('');

  const { data, loading, error } = useQuery(GET_COUNTRY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  console.log(data);

  return (
    <>
      {status ? <div>status</div> : null}
      <div>Guess this country : {data.country.emoji}</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log('GUESS', guess);
          if (guess.toLowerCase() === data.country.country.toLowerCase()) {
            setStatus('correct');
          } else {
            setStatus('incorrect');
          }
        }}>
        <input
          placeholder='mordor'
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
          }}
        />
        <button type='submit'>submit</button>
      </form>
    </>
  );
};
