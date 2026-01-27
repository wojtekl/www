import React, { useEffect, useState, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import axios from 'axios'

const Button = ReactBootstrap.Button
const Container = ReactBootstrap.Container
const Form = ReactBootstrap.Form
const Image = ReactBootstrap.Image


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

const state = localStorage.getItem('redux')
const initialState = !state ? {
  value: [],
  warning: true,
  lang: navigator.language.substring(0, 2).toLocaleLowerCase()
} : JSON.parse(state)

const selectedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'selected/added':
      return { ...state, value: state.value.concat([action.payload]) }
    case 'selected/removed':
      return { ...state, value: state.value.filter(i => i != action.payload) }
    case 'warning/set':
      return { ...state, warning: false }
    case 'lang/set':
      return { ...state, lang: action.payload }
    default:
      return state
  }
}

const lang = new URLSearchParams(new URL(window.location).search).get('lang') ?? initialState.lang ?? navigator.language.substring(0, 2).toLocaleLowerCase()
i18n.use(initReactI18next).init({
  resources: resources,
  lng: lang,
  fallbacking: "pl",
  interpolation: {
    escapeValue: false
  }
})

const storeName = new URLSearchParams(new URL(window.location).search).get('store') ?? undefined
const day = new URLSearchParams(new URL(window.location).search).get('day') ?? undefined

const store = createStore(selectedReducer)
store.subscribe(() => { localStorage.setItem('redux', JSON.stringify(store.getState())) })
store.dispatch({ type: 'lang/set', payload: lang })


/* DateFormatter */
const DateFormatter = React.memo((props) => {
  const { timestamp } = props
  const locale = new URLSearchParams(new URL(window.location).search).get('lang') ?? navigator.language.substring(3).toLocaleLowerCase()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const format = { month: "short", day: "numeric", timezone: timezone }
  return new Date(timestamp).toLocaleString(locale, format)
})


/* NumberFormatter */
const NumberFormatter = React.memo((props) => {
  const { value } = props
  const locale = new URLSearchParams(new URL(window.location).search).get('lang') ?? navigator.language.substring(3).toLocaleLowerCase()
  const format = { maximumFractionDigits: 2, minimumFractionDigits: 2 }
  return value.toLocaleString(locale, format)
})


const container = document.getElementById('root')

const root = createRoot(container)

root.render(<Provider store={store}><App /></Provider>)
