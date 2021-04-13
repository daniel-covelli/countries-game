import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './App.css';
import React, { useState, useEffect } from 'react';

const LIST_COUNTRIES = gql`
  {
    countries {
      name
      code
    }
  }
`;

const randomCode = (countries) => {
  const countriesArray = { ...countries };
  const num = Math.floor(Math.random() * 249);
  return countriesArray[num];
};

export const App = () => {
  const { data: list, loading: loadingList } = useQuery(LIST_COUNTRIES);
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);

  const [currCode, setCode] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [guess, setGuess] = useState('');

  const GET_COUNTRY = gql`
        {
          country(code: "${currCode}") {
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

  const [country, { data, loading, error }] = useLazyQuery(GET_COUNTRY);

  const setRandomCode = async () => {
    const response = await randomCode(list.countries);
    console.log('ANSWER', response.name);
    console.log('CODE', response.code);

    setCode(response.code);
    setAnswer(response.name);

    country();
  };

  useEffect(() => {
    if (list && list.countries) {
      setRandomCode();
    }
  }, [list]);

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
          console.log('GUESS', guess);
          if (guess === answer) {
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
