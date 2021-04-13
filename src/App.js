import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './App.css';
import React, { useState, useEffect } from 'react';

// query for list of all countries
const LIST_COUNTRIES = gql`
  {
    countries {
      name
      code
    }
  }
`;

// generates random country code
const randomCode = (countries) => {
  const countriesArray = { ...countries };
  const num = Math.floor(Math.random() * 249);
  return countriesArray[num];
};

export const App = () => {
  // gets list of all countries
  const { data: list, loading: loadingList } = useQuery(LIST_COUNTRIES);
  // tracks number of wins per session
  const [wins, setWins] = useState(0);
  // tracks number of loses per session
  const [loses, setLoses] = useState(0);
  // tracks current country code
  const [currCode, setCode] = useState('');
  // tracks current country name
  const [answer, setAnswer] = useState('');
  // tracks whether a user guess right or wrong
  const [status, setStatus] = useState('');
  // the users guess
  const [guess, setGuess] = useState('');

  // query for flag of currCode
  const GET_COUNTRY = gql`
        {
          country(code: "${currCode}") {
            emoji
          }
        }
      `;

  // gets the country flag of currCode when invoked
  const [country, { data, loading }] = useLazyQuery(GET_COUNTRY);

  // randomly resets the country being guessed
  const setRandomCode = async () => {
    const response = await randomCode(list.countries);
    console.log('ANSWER', response.name);
    console.log('CODE', response.code);

    setCode(response.code);
    setAnswer(response.name);

    country();
  };
  // invokes setRandomCode once list of countries is available
  useEffect(() => {
    if (list && list.countries) {
      setRandomCode();
    }
  }, [list]);
  // updates status for next guess
  useEffect(() => {
    setTimeout(() => {
      if (status === 'correct 🎉') {
        setGuess('');
        setRandomCode();
      }
      setStatus('');
    }, 2000);
  }, [status]);

  if (!data || loading || loadingList) return <p>loading...</p>;

  return (
    <>
      <div>Guess this country : {data.country.emoji}</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const g = guess;
          console.log('GUESS', g);
          if (g.toLowerCase() === answer.toLowerCase()) {
            setStatus('correct 🎉');
            setWins(wins + 1);
          } else {
            setStatus('incorrect 🥴');
            setLoses(loses + 1);
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
      <div>Wins: {wins}</div>
      <div>Ls: {loses}</div>
      {status ? <div>{status}</div> : null}
    </>
  );
};
