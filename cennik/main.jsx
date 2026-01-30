import React, { useEffect, useState, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import axios from 'axios'


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

let installPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  installPrompt = event;
});

const state = localStorage.getItem('redux')
const initialState = !!state ? JSON.parse(state) : {
  value: [],
  warning: true,
  lang: (getUrlParam('lang') ?? navigator.language.substring(0, 2)).toLocaleLowerCase()
}
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

const lang = (getUrlParam('lang') ?? initialState.lang).toLocaleLowerCase()
i18n.use(initReactI18next).init({
  resources: resources,
  lng: lang,
  fallbacking: "pl",
  interpolation: {
    escapeValue: false
  }
})

const store = createStore(selectedReducer)
store.subscribe(() => { localStorage.setItem('redux', JSON.stringify(store.getState())) })
store.dispatch({ type: 'lang/set', payload: lang })


/* Modal */
const Modal = (props: { item: String, storeName: String, day: String }) => {
  const { item, storeName, day } = props
  const { t } = useTranslation()

  const handleSubmit = (event) => {
    event.preventDefault()
    
    const form = document.querySelector('#form_item')
    axios.post('item', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
      if (200 === response.status) {
        form.reset()
        document.querySelector('button.btn-close').click()
      }
    })
  }

  return (<div class="modal" id="exampleModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"> {!item ? t('button_new_product') : `${t('label_item')}: ${item}`} </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label={t('label_close')}></button>
      </div>
      <form id="form_item" enctype="multipart/form-data" onSubmit={handleSubmit}>
        <div class="modal-body">
          <div class="form-group">
            <label for="exampleInputName1">{t('label_name')}</label>
            <input type="text" class="form-control" id="exampleInputName1" aria-describedby="nameHelp" name="name" value={item} required minlength="5" maxlength="100" autocomplete="off" />
            <small id="nameHelp" class="form-text text-muted">{t('help_name')}</small>
          </div>
          <div class="form-group">
            <label for="exampleInputStore1">{t('label_store')}</label>
            <input type="text" class="form-control" id="exampleInputStore1" aria-describedby="storeHelp" name="store" value={storeName} required maxlength="50" />
            <small id="storeHelp" class="form-text text-muted">{t('help_store')}</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPrice1">{t('label_price')}</label>
            <input type="number" min="0.05" max="500" step="0.01" class="form-control" id="exampleInputPrice1" aria-describedby="priceHelp" name="price" required />
            <small id="priceHelp" class="form-text text-muted">{t('help_decimal')}</small>
          </div>
          <div class="form-group">
            <input type="hidden" class="form-control" id="exampleHiddenId1" aria-label="identyfikator" name="identyfikator" value="web" />
          </div>
          <div class="form-group">
            <input type="hidden" class="form-control" id="exampleHiddenCountry1" aria-label="country" name="country" value={store.getState().lang} />
          </div>
          <div class="form-group">
            <input type="hidden" class="form-control" id="exampleHiddenDay1" aria-label="day" name="day" value={day} />
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleInputCoupon1" aria-describedby="couponHelp" name="coupon" />
            <label for="exampleInputCoupon1" class="form-check-label">{t('label_coupon')}</label>
            <small id="couponHelp" class="form-text text-muted">{t('help_membership')}</small>
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleInputBulk1" aria-describedby="bulkHelp" name="bulk" />
            <label for="exampleInputBulk1" class="form-check-label">{t('label_bulk')}</label>
            <small id="couponHelp" class="form-text text-muted">{t('help_bulk')}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> {t('button_cancel')} </button>
          <button type="submit" class="btn btn-primary"> {t('button_save')} </button>
        </div>
      </form>
    </div>
  </div>
</div>)
}


/* List */
const List = (props) => {
  const { list, replace, back, selected, properties } = props
  const { t } = useTranslation()
  
  const [filtered, setFiltered] = useState(list)
  const [select, setSelect] = useState()
  const [saved, setSaved] = useState(store.getState().value)

  const locale = (navigator.language.substring(3) ?? getUrlParam('lang')).toLocaleLowerCase()
  const detailsPage = !!selected
  const storeName = getUrlParam('store')
  const day = getUrlParam('day')
  
  const handleClick = (event) => {
    event.preventDefault()
    const searchParams = new URLSearchParams()
    searchParams.append('lang', store.getState().lang)
    searchParams.append('name', select)
    axios.get(`item?${searchParams.toString()}`).then((response) => {
      const columns_details = ['store', 'price', 'posted', 'coupon', 'bulk']
      replace(<List properties={columns_details} list={response.data} replace={replace} back={back} selected={select} />)
    })
  }

  const handleSearch = (event) => {
    event.preventDefault()
    event.stopPropagating()
  }

  const handleFilter = (event) => {
    const query = event.target.value.trim().toLowerCase()
    setFiltered(3 > query.length ? list : list.filter(i => i.item.toLowerCase().includes(query)))
  }

  const handleChange = (event) => {
    const selectedItem = detailsPage ? select : list.find(i => i.item === select).id
    setSaved(saved.concat([selectedItem]))
    store.dispatch({ type: event.target.checked ? 'selected/added' : 'selected/removed', payload: selectedItem })
  }

  return (<>
  <Navi isNew={!detailsPage} />
  <div class="container">
    {!detailsPage && <div class="row mt-3">
      <form class="form-inline my-2" role="search" onSubmit={handleSearch}>
        <input class="form-control mr-sm-2" type="search" name="search" placeholder={t('label_search')} aria-label="Search" onKeyUp={handleFilter} maxlength="25" />
      </form>
    </div>}
    <div class="row mt-3">
      {detailsPage && <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#" onClick={back}> {t('button_back')} </a></li>
          <li class="breadcrumb-item active" aria-current="page"> {selected} </li>
        </ol>
      </nav>}
      <div class="table-responsive small">
        <table class="table table-stripped table-sm table-hover">
          <thead class="table-dark">
            <tr>
              <th> X </th>
              { properties.map(property => <th>{String(t(`label_${property}`)).toUpperCase()}</th>) }
              { !detailsPage && <th> {t('label_more').toUpperCase()} </th> }
            </tr>
          </thead>
          <tbody>
            {(!detailsPage ? filtered : list).map(row => {
              const enabled = select === row['item']
              return (<tr onMouseOver={() => setSelect(!detailsPage ? row['item'] : row['id'])}>
                <td><input type="checkbox" class="form-check-input" name="selected" checked={() => saved.includes(row['id'])} onChange={handleChange} aria-label={t('label_select')} /></td>
                  {properties.map(property => {
                    if ('posted' === property) {
                      return <td><DateFormatter timestamp={row[property]} locale={locale} /></td>
                    }
                    else if ('price' === property) {
                      return <td class="text-end">{ row['lowest'] === row[property] ? '!' : '' }<NumberFormatter value={row[property]} locale={locale} /></td>
                    }
                    else if ('coupon' === property || 'bulk' === property) {
                      return <td><input type="checkbox" class="form-check-input" name={property} checked={"1" === row[property]} readonly aria-label={property} /></td>
                    }
                    else {
                      return <td> {row[property]} </td>
                    }
                  })}
                  {!detailsPage && <td><a href="#" onClick={handleClick} disabled={!enabled}><span class={`badge text-bg-${enabled ? 'primary' : 'secondary'}`}> -{'>'} </span></a></td>}
                </tr>)
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal item={selected} storeName={storeName} day={day} />
    </div>
  </>)
}


/* Navi */
const Navi = (props) => {
  const { isNew } = props
  const { t } = useTranslation()

  const switchLang = () => 'pl' === store.getState().lang ? 'en' : 'pl'
  
  const handleLang = (event) => {
    event.preventDefault()
    store.dispatch({ type: 'lang/set', payload: switchLang() })
    window.location.href = '/'
  }

  const handleCopy = (event) => {
    event.preventDefault()
    const searchParams = new URLSearchParams()
    searchParams.append('selected', store.getState().value.join(','))
    window.location.href = `/?${searchParams.toString()}`
  }

  const handleInstall = (event) => {
    event.preventDefault()
    if (installPrompt) {
      installPrompt.prompt()
    }
    else {
      window.location.href = 'https://wlap.pl/howto/'
    }
  }

  const HomeLink = () => {
    if(!getUrlParams().has('selected')) {
      return <a class="nav-link active" aria-current="page" href="#" onClick={handleCopy}>{t('nav_yourlist')}</a>
    } else {
      return <a class="nav-link active" aria-current="page" href="/" rel="bookmark">{t('nav_home')}</a>
    }
  }

  return (<div class="navbar navbar-expand-md">
  <div class="container">
    <div class="navbar-brand"><img src="https://raw.githubusercontent.com/wojtekl/google-play/refs/heads/main/pricey/Pricey/app/src/main/res/mipmap-mdpi/ic_launcher_round.webp" width="30px" height="30px" alt="" />{t('title_app')}</div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#basic-navbar-nav" aria-controls="basic-navbar-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="basic-navbar-nav">
      <div className="navbar-nav me-auto">
        <div class="nav-item">
          <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal">{t(isNew ? 'button_new_product' : 'button_update_price')}</a>
        </div>
        <div class="nav-item"><HomeLink /></div>
        <div class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{t('nav_more')}</a>
          <ul class="dropdown-menu">
            <li><a href="https://wlap.pl/" rel="author" class="dropdown-item">{t('nav_aboutus')}</a></li>
            <li><a href={t('url_privacy')} rel="privacy-policy" class="dropdown-item">{t('nav_privacy')}</a></li>
          </ul>
        </div>
        <div class="nav-item"><a class="nav-link" onClick={handleInstall}>{t('nav_install')}</a></div>
        <div class="nav-item"><a class="nav-link" href="#" onClick={handleLang}>{switchLang()}</a></div>
      </div>
    </div>
  </div>
</div>)
}


/* App */
const App = () => {
  const { t } = useTranslation()

  const [source, setSource] = useState(<div class="container-fluid">
  <div class="row mt-3">
    <div class="spinner-border text-warning" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</div>)

  useEffect(() => {
    const searchParams = new URLSearchParams()
    searchParams.append('lang', store.getState().lang)
    const selected = getUrlParam('selected')
    if (selected) {
      searchParams.append('selected', selected)
    }
    axios.get(`items?${searchParams.toString()}`).then((response) => {
      handleReplace(<List properties={columns_list} list={response.data} replace={handleReplace} back={handleBack} />)
    })

    document.title = t('title_app')
  }, [])

  const [warning, setWarning] = useState(store.getState().warning)

  const handleReplace = (source) => setSource(source)

  const handleBack = (event) => {
    event.preventDefault()
    setSource(<App />)
  }

  const handleGotit = () => {
    setWarning(false)
    store.dispatch({ type: 'warning/set' })
  }

  return !warning ? source : <div class="px-4 py-5 my-5 text-center">
  <h1 class="display-5 fw-bold"></h1>
  <div class="col-lg-6 mx-auto">
    <p class="lead m-4">{t('message_warning')}</p>
    <div class="d-grip gap-2 d-sm-flex justify-content-sm-center">
      <button type="button" class="btn btn-primary btn-lg px-4 gap-3" onClick={handleGotit}>{t('button_gotit')}</button>
    </div>
  </div>
</div>}


const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Provider store={store}><App /></Provider>)

const columns_list = ['item', 'store', 'price', 'posted']
