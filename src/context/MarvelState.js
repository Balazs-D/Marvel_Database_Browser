import React, { useReducer, useState } from 'react';
import axios from 'axios';
import MarvelContext from './marvelContext';
import MarvelReducer from './marvelReducer';
import {
  FETCH_CHAR_LIST,
  SET_LOADING,
  FETCH_WITH_OFFSET,
  COUNT_FETCH,
  FETCH_SEARCH,
  SET_SEARCH,
  NULL_SEARCH,
  GET_S_TEXT,
  RESET,
  RESET_FETCH,
  RESET_TEXT
} from './types';
import marvelCont from './marvelContext';
import JumpToTop from '../components/JumpToTop';

const MarvelState = props => {
  const initialState = {
    characters: [],
    offsetList: [],
    character: {},
    fetchCounter: 1,
    loading: false,
    search: true,
    searchText: ''
  };

  const [state, dispatch] = useReducer(MarvelReducer, initialState);

  // fetch characters

  const fetchCharacterList = async () => {

    setLoading();
    setSearch();
    reset();
    resetFetch();

    let res = await axios.get(
      'https://gateway.marvel.com:443/v1/public/characters?apikey=80429f9cc6b04d6f8eb26487a6855001'
    );

    let characterList = res.data.data.results;
    console.log(characterList);
        


    JumpToTop();

    dispatch({
      type: FETCH_CHAR_LIST,
      payload: characterList
    });
  };

  // fetchOffset

  const fetchWithOffset = async text => {
    const offsetVal = state.fetchCounter * 20;

    if (state.searchText.text) {
      const res = await axios.get(
        `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${state.searchText.text}&offset=${offsetVal}&apikey=80429f9cc6b04d6f8eb26487a6855001`
      );
      let nextCharList = res.data.data.results;
     

      let currCharList = state.characters;
      nextCharList.map((item, i) => {
        currCharList.push(item);
      });
console.log( 'if search offset')
      await dispatch({
        type: FETCH_WITH_OFFSET,
        payload: currCharList
      });
    } else {
      
      const res = await axios.get(
        `https://gateway.marvel.com:443/v1/public/characters?offset=${offsetVal}&apikey=80429f9cc6b04d6f8eb26487a6855001`
      );
      let nextCharList = res.data.data.results;
console.log('if empty offset');

      let currCharList = state.characters;
      nextCharList.map((item, i) => {
        currCharList.push(item);
      });

      await dispatch({
        type: FETCH_WITH_OFFSET,
        payload: currCharList
      });
    }
    console.log(offsetVal);

    console.log(state.searchText, state.fetchCounter);

    // }

   countFetch();
  };

  // Fetch search

  const fetchSearch = async text => {
    setLoading();
    nullSearch();
    resetFetch();

    const getText = text;

    getSearchText(text);
    const res = await axios.get(
      `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${getText}&apikey=80429f9cc6b04d6f8eb26487a6855001`
    );

    let searchList = res.data.data.results;

    dispatch({
      type: FETCH_SEARCH,
      payload: searchList
    });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  // Reset fetch counter

  const resetFetch = () => dispatch({ type: RESET_FETCH });

  // Fetch counter

  const countFetch = () => dispatch({ type: COUNT_FETCH });

  // Set search

  const setSearch = () => dispatch({ type: SET_SEARCH });

  // Set search false

  const nullSearch = () => dispatch({ type: NULL_SEARCH });

  // reset text

  const resetText = () => dispatch({type: RESET_TEXT})

  // reset 

  const reset = () => dispatch({type: RESET});

  // set search text

  const getSearchText = text => {
    console.log({ text });

    dispatch({
      type: GET_S_TEXT,
      payload: { text }
    });
  };

  return (
    <MarvelContext.Provider
      value={{
        characters: state.characters,
        character: state.character,
        loading: state.loading,
        fetchCharacterList,
        fetchWithOffset,
        setLoading,
        countFetch,
        fetchSearch,
        setSearch,
        nullSearch,
        getSearchText,
        reset,
        resetFetch,
        resetText
      }}
    >
      {props.children}
    </MarvelContext.Provider>
  );
};

export default MarvelState;
