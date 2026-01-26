import React, { useEffect, useState } from 'react'
import { createRoot, useNavigate, useParams } from 'react-dom'
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import Provider from 'react-redux'


let installPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  installPrompt = event;
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

const state = localStorage.getItem('redux')
const initialState = !state ? {
  value: null,
  lang: navigator.language.substring(0, 2).toLocaleLowerCase(),
  tenant: null
} : JSON.parse(state)

const selectedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'selected/added':
      return { ...state, value: action.payload }
    case 'selected/removed':
      return { ...state, value: null }
    case 'lang/set':
      return { ...state, lang: action.payload }
    case 'tenant/set':
      return { ...state, tenant: action.payload }
    default:
      return state
  }
}

const store = Redux.createStore(selectedReducer)
store.subscribe(() => { localStorage.setItem('redux', JSON.stringify(store.getState())) })

const lang = new URLSearchParams(new URL(window.location).search).get('lang') ?? initialState.lang
i18n.use(initReactI18next).init({
  resources: resources,
  lng: lang,
  fallbacking: "pl",
  interpolation: {
    escapeValue: false
  }
})
store.dispatch({ type: 'lang/set', payload: lang })


/* App */


const container = document.getElementById('root')

const root = ReactDOM.createRoot(container)

root.render(<Provider store={store}>
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="selected/:name" element={<Selected />} />
      <Route path="list" element={<List />} />
      <Route path="news" element={<News />} />
      <Route path="manage" element={<Manage />} />
      <Route path="signin" element={<Signin />} />
      <Route path="password" element={<Password />} />
      <Route path=":tenant" element={<Reader />} />
    </Routes>
  </Router>
</Provider>)
