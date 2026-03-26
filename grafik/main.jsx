import * as bootstrap from 'bootstrap'
import React, { useContext, useEffect, useState, createContext, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { createStore } from 'redux'
import { createSlice, configureStore } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'
import axios from 'axios'


const state = localStorage.getItem('redux')
const initialState = !!state ? JSON.parse(state) : {
  value: null,
  lang: (getUrlParam('lang') ?? navigator.language.substring(0, 2)).toLocaleLowerCase(),
  tenant: null
}
initialState.lang = (getUrlParam('lang') ?? initialState.lang).toLocaleLowerCase()

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialState,
  reducers: {
    selectedAdded: (state, action: PayloadAction<String>) => { state.value = action.payload },
    selectedRemoved: state => { state.value = undefined },
    langSet: (state, action: PayloadAction<String>) => { state.lang = action.payload },
    tenantSet: (state, action: PayloadAction<String>) => { state.tenant = action.payload }
  }
})
const { selectedAdded, selectedRemoved, langSet, tenantSet } = preferencesSlice.actions

const store = configureStore({ reducer: preferencesSlice.reducer })
store.subscribe(() => localStorage.setItem('redux', JSON.stringify(store.getState())))

i18n.use(initReactI18next).init({
  resources: resources,
  lng: initialState.lang,
  fallbacking: "pl",
  interpolation: {
    escapeValue: false
  }
})


/* InputText */
const InputText = ({ name, label, className, formId, help }) => <div class={className}>
  <label for={`input_${formId}${name}`} class="form-label">{label}</label>
  <input type="text" class="form-control" id={`input_${formId}${name}`} aria-describedby={help ? `help_${formId}${name}` : ''} name={name} />
  { help && <div id={`help_${formId}${name}`} class="form-text">{help}</div> }
</div>


/* Form */
const Form = ({ id, disabled=false, legend, onSubmit, children }) => {
  const { t } = useTranslation()
  
  return <form id={id} enctype="multipart/form-data" onSubmit={onSubmit}>
  <fieldset disabled={disabled}>
    { legend && <legend>{t(legend)}</legend> }
    {children}
    { onSubmit && !disabled && <button type="submit" class="btn btn-primary">{t('label_submit')}</button> }
  </fieldset>
</form>
}


/* Toast */
const Toast = ({ message, onClose }) => {
  const { t } = useTranslation()

  const [toast, setToast] = useState()

  useEffect(() => {
    const toastElement = document.getElementById('notification')
    toastElement.addEventListener('hidden.bs.toast', onClose)

    setToast(bootstrap.Toast.getOrCreateInstance(toastElement))
  }, [])

  useEffect(() => {
    if (message) {
      toast.show()
    }
  }, [message])
  
  return <div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div class="toast text-bg-success align-items-center" id="notification" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">{t(message)}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label={t('label_close')}></button>
    </div>
  </div>
</div>
}


/* ModalForm */
const ModalForm = (props) => {
  const { id, title, onSubmit, children } = props

  const { t } = useTranslation()
  const { setNotification } = usePreferences()
  
  const handleSubmit = (event) => {
    event.preventDefault()

    const form = document.getElementById(`form_${id}`)
    onSubmit(form)
    
    const modal = bootstrap.Modal.getInstance(document.getElementById(id))
    modal.hide()
    
    setNotification('label_saved')
    
    event.stopPropagation()
  }
  
  return <div class="modal fade" id={id} tabindex="-1" aria-labelledby={`title_${id}`} aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id={`title_${id}`}>{t(title)}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label={t('label_close')}></button>
        </div>
        <div class="modal-body">
          <form id={`form_${id}`} enctype="multipart/form-data">{children}</form>
        </div>
        <div class="modal-footer">
          <button type="reset" class="btn btn-secondary" data-bs-dismiss="modal">{t('label_cancel')}</button>
          <button type="submit" class="btn btn-primary" onClick={handleSubmit}>{t('label_save')}</button>
        </div>
      </div>
    </div>
  </div>
}


/* ConfirmModal */
const ConfirmModal = ({ id, title, onOk }) => {
  const { t } = useTranslation()
  
  return <div class="modal" id={id} tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{t('label_title_confirm')}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label={t('label_close')}></button>
      </div>
      <div class="modal-body"><p>{t(title)}</p></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{t('label_cancel')}</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={onOk}>{t('label_ok')}</button>
      </div>
    </div>
  </div>
</div>
}


/* Table */
const Table = ({ columns, children }) => {
  return <div class="table-responsive small">
  <table class="table table-stripped table-sm">
    <thead><tr>{ columns.map((e, i) => <th scope="col">{e}</th>) }</tr></thead>
    <tbody>{children}</tbody>
  </table>
</div>
}


/* AccordionItem */
const AccordionItem = ({ id, parent, show = false, children }) => {
  const { t } = useTranslation()

  return <div class="accordion-item">
  <h2 class="accordion-header">
    <button class={`accordion-button ${!show ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${id}`} aria-expanded="true" aria-controlls={`collapse${id}`}>{t(`label_${id}`)}</button>
  </h2>
  <div id={`collapse${id}`} class={`accordion-collapse collapse ${!!show ? 'show' : ''}`} data-bs-parent={`#${parent}`}>
    <div class="accordion-body">
      <div class="row">{children}</div>
    </div>
  </div>
</div>}


/* Password */
const Password = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const code = getUrlParam('code')
  
  const handleSubmit = (event) => {
    event.preventDefault()
    
    const form = document.getElementById('form_password')
    axios.post('api/event-cd', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      if (response.data) {
        navigate('/signin')
        window.history.replaceState({}, document.title, 'https://grafik.wlap.pl/#/signin')
      }
      console.debug(response.data)
    })
    
    event.stopPropagation()
  }
  
  return <div class="d-flex align-items-center py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto" style={{maxWidth: '330px', padding: '1rem'}}>
      <form id="form_password" enctype="multipart/form-data" onSubmit={handleSubmit}>
        <h1 class="h3 mb-3 fw-normal">{t('label_please_sign_in')}</h1>
        <div class="form-floating">
          <input type="text" class="form-control" id="floatingInput" placeholder="demo" name="tenant" />
          <label for="floatingInput">{t('label_tenant')}</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder={t('label_password')} name="password" />
          <label for="floatingPassword">{t('label_password')}</label>
        </div>
        <input type="hidden" name="code" value={code} />
        <div class="form-check text-start my-3">
          <input class="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
          <label class="form-check-label" for="checkDefault">{t('label_remember_me')}</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">{t('label_sign_in')}</button>
        <p class="mt-5 mb-3 text-body-secondary">{t('label_copyright')}</p>
      </form>
    </main>
  </div>
}


/* Confirmation */
const Confirmation = () => {
  const { t } = useTranslation()
  const [confirmation, setConfirmation] = useState([])
  const [selected, setSelected] = useState()
  const [refresh, setRefresh] = useState()

  const tenant = useSelector(state => state.tenant)
  const { locale, setNotification } = usePreferences()

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/visit?${searchParams.toString()}`).then(response => {
      setConfirmation(response.data)
      console.debug(response.data)
    })
    setRefresh(false)
  }, [tenant])

  return <>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">{t('label_statistics')}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary">{t('label_refresh')}</button>
        </div>
      </div>
    </div>
    <h2>{t('label_confirmation')}</h2>
    <Table columns={['#', t('label_firstname'), t('label_surname'), t('label_street'), t('label_number'), t('label_city'), t('label_period'), t('label_date'), t('label_actions')]}>
      { confirmation.map((e, i) => <tr>
        <td>{i + 1}</td>
        <td>{e.firstname}</td>
        <td>{e.surname}</td>
        <td>{e.street}</td>
        <td>{e.number}</td>
        <td>{e.city}</td>
        <td><NumberFormatter value={e.period} locale={locale} /></td>
        <td><DateFormatter timestamp={e.created} locale={locale} format="date" /></td>
        <td><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#deleteVisitModal" onClick={() => setSelected(e['id']) }><i class="bi bi-trash"></i></button></td>
      </tr>) }
    </Table>
    <ConfirmModal id="deleteVisitModal" title="label_delete" onOk={() => {
      const searchParams = new URLSearchParams({ id: selected })
      axios.get(`api/visit-cd?${searchParams.toString()}`).then(response => {
        setRefresh(true)
        setNotification('label_saved')
      })
    }} />
  </>
}


/* Weeks */
const Weeks = () => {
  const { t } = useTranslation()
  const [selectedWeek, setSelectedWeek] = useState()

  const months = [t('label_january'), t('label_february'), t('label_march'), t('label_april'), 
                  t('label_may'), t('label_june'), t('label_july'), t('label_august'), 
                  t('label_september'), t('label_october'), t('label_november'), t('label_december')]
  const weeks = getWeeks(months)
  const { locale } = usePreferences()

  return selectedWeek ? <>
    <button type="button" class="btn btn-sm btn-outline-secondary" onClick={ () => setSelectedWeek(undefined) }>{t('label_back')}</button>
    <CurrentWeek date={selectedWeek} type={'eucharystia'} />
  </> : <>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">{t('label_statistics')}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary">{t('label_refresh')}</button>
        </div>
      </div>
    </div>
    <h2>{t('label_weeks')}</h2>
    <Table columns={['#', t('label_begining'), t('label_month'), t('label_actions')]}>
      { weeks.map((w, i) => <tr>
        <td>{i + 1}</td>
        <td><DateFormatter timestamp={w.start} locale={locale} format="date" /></td>
        <td>{w.month}</td>
        <td><button type="button" class="btn btn-sm btn-outline-secondary" onClick={ () => setSelectedWeek(w.start) }><i class="bi bi-pencil-square"></i></button></td>
      </tr>) }
    </Table>
  </>
}


/* CurrentWeek */
const CurrentWeek = ({ date, type }) => {
  const { t } = useTranslation()

  const [currentWeek, setCurrentWeek] = useState([])
  const [selected, setSelected] = useState()
  const [refresh, setRefresh] = useState(true)

  const tenant = useSelector(state => state.tenant)
  const { locale, setNotification } = usePreferences()

  useEffect(() => {
    if (refresh) {
      const postData = {
        tenant: tenant,
        type: type,
        today: date
      }
      axios.post('api/event-week', postData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
        setCurrentWeek(response.data)
        setForm(document.getElementById('form_statistics'), { count: response.data.length})
        console.debug(response.data)
      })
      setRefresh(false)
    }
  }, [tenant, refresh])

  const handleSelect = (event) => {}

  const getTitle = () => {
    if ('eucharystia' === type) {
      if (!date) {
        return t('label_order')
      }
      else if (datePart() === date) {
        return t('label_current_week')
      }
      else {
        return t('label_next_week')
      }
    }
    else if ('departure' === type) {
      return t('label_departure')
    }
  }
  
  return <>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{t('label_statistics')}</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button type="button" class="btn btn-sm btn-outline-secondary" onClick={() => setRefresh(true)}>{t('label_refresh')}</button>
      </div>
    </div>
  </div>
  <Form id="form_statistics" disabled={true}>
    <div class="row">
      <InputText name="count" label={t('label_count')} className="col-sm-6" formId="statistics" />
      <InputText name="" label={t('label_')} className="col-sm-6" formId="statistics" />
      <InputText name="" label={t('label_')} className="col-sm-6" formId="statistics" />
      <InputText name="" label={t('label_')} className="col-sm-6" formId="statistics" />
    </div>
  </Form>
  <h2>{getTitle()}</h2>
  <Table columns={['#', t('label_date'), t('label_description'), t('label_period'), t('label_notes'), t('label_actions')]}>
    { currentWeek.map((e, i) => <tr>
      <td>{i + 1}</td>
      <td><DateFormatter timestamp={e['starting']} locale={locale} /></td>
      <td>{e['description']}</td>
      <td><NumberFormatter value={e['period']} locale={locale} /></td>
      <td>{e['notes']}{ e.confirmed ? e.assignment.filter(a => a.accepted).map(a => <div>{a.displayName}</div>) : e.assignment.length }</td>
      <td>
        { !e.confirmed && <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#assignModal" onClick={ () => setSelected(e['id']) }><i class="bi bi-people"></i></button> }
        <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editEventModal" onClick={ () => setSelected(e['id']) }><i class="bi bi-pencil-square"></i></button>
        { !e.confirmed && <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#deleteEventModal" onClick={ () => setSelected(e['id']) }><i class="bi bi-trash"></i></button> }
      </td>
    </tr>) }
  </Table>
  <EventModal id="editEventModal" itemId={selected} type={type} />
  <ConfirmModal id="deleteEventModal" title="label_delete" onOk={() => {
    const searchParams = new URLSearchParams({ id: selected })
    axios.get(`api/event-cd?${searchParams.toString()}`).then(response => {
      setRefresh(true)
      setNotification('label_saved')
    })
  }} />
</>
}


/* Dashboard */
const Dashboard = () => {
  const { t } = useTranslation()
  
  const [contact, setContact] = useState()
  const [disabled, setDisabled] = useState(true)

  const tenant = useSelector(state => state.tenant)
  const { setNotification } = usePreferences()

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/contact?${searchParams.toString()}`).then(response => {
      setContact(response.data)
      console.debug(response.data)
      setForm(document.getElementById('form_contact'), response.data)
    })
  }, [tenant])

  const handleDisabled = () => setDisabled(!disabled)

  const handleSubmit = (event) => {
    event.preventDefault()
    
    const form = document.getElementById('form_contact')
    axios.post('api/contact', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => setNotification(response.data))
    
    event.stopPropagation()
  }
  
  return <>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">{t('label_contact')}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" onClick={handleDisabled}>{ disabled ? <i class="bi bi-unlock"></i> : <i class="bi bi-lock"></i> }</button>
        </div>
      </div>
    </div>
    <Form id="form_contact" legend="label_contact" disabled={disabled} onSubmit={handleSubmit}>
      <InputText name="description" label={t('label_description')} className="mb-3" formId="contact" />
      <InputText name="street" label={t('label_street')} className="mb-3" formId="contact" />
      <InputText name="number" label={t('label_number')} className="mb-3" formId="contact" />
      <InputText name="city" label={t('label_city')} className="mb-3" formId="contact" />
      <InputText name="postalcode" label={t('label_postalcode')} className="mb-3" formId="contact" />
      <div class="mb-3">
        <label for="input_contactemail" class="form-label">{t('label_email')}</label>
        <input type="email" id="input_contactemail" class="form-control" name="email" />
      </div>
      <div class="mb-3">
        <label for="input_contactphone" class="form-label">{t('label_phone')}</label>
        <input type="tel" id="input_contactphone" class="form-control" name="phone" />
      </div>
      <div class="mb-3">
        <label for="input_contactiban" class="form-label">{t('label_iban')}</label>
        <input type="text" id="input_contactiban" class="form-control" maxlength="28" name="iban" />
      </div>
    </Form>
  </>
}


/* Settings */
const Settings = () => {
  const { t } = useTranslation()

  const [disabled, setDisabled] = useState(true)

  const tenant = useSelector(state => state.tenant)
  const { setNotification } = usePreferences()

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/settings?${searchParams.toString()}`).then(response => {
      setForm(document.getElementById('form_settings'), response.data)
    })
  }, [tenant])

  const handleDisabled = () => setDisabled(!disabled)

  const handleSubmit = (event) => {
    event.preventDefault()
    
    const form = getForm(document.getElementById('form_settings'))
    console.debug(form)
    axios.post('api/settings', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => setNotification('label_saved'))
    
    event.stopPropagation()
  }

  return <>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">{t('label_settings')}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" onClick={handleDisabled}>{ disabled ? <i class="bi bi-unlock"></i> : <i class="bi bi-lock"></i> }</button>
        </div>
      </div>
    </div>
    <Form id="form_settings" legend="label_settings" disabled={disabled} onSubmit={handleSubmit}>
      <div class="mb-3">
        <label for="textarea_settingsschedule" class="form-label">{t('label_schedule')}</label>
        <textarea id="textarea_settingsschedule" class="form-control" rows="4" name="schedule" />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="checkbox_settingsshowVisits" name="showVisits" />
        <label class="form-check-label" for="checkbox_settingsshowVisits">{t('label_show_visit')}</label>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="checkbox_settingsshowBooking" name="showBooking" />
        <label class="form-check-label" for="checkbox_settingsshowBooking">{t('label_show_booking')}</label>
      </div>
      <div class="mb-3">
        <label for="input_settingsgrouppassword" class="form-label">{t('label_password_group')}</label>
        <input id="input_settingsgrouppassword" class="form-control" name="groupPassword" />
      </div>
    </Form>
  </>
}


/* EventModal */
const EventModal = ({ id, itemId, type }) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (!itemId) {
      setForm(document.getElementById(`form_${id}`), { type: type })
      return
    }
    
    const searchParams = new URLSearchParams({ id: itemId })
    axios.get(`api/event?${searchParams.toString()}`).then(response => {
      setForm(document.getElementById(`form_${id}`), response.data)
      console.debug(response.data)
    })
  }, [itemId])

  const handleSubmit = (form) => {
    axios.post(!itemId ? 'api/event-cd' : 'api/event', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      //form.reset()
      console.debug(response.data)
    })
  }

  return <ModalForm id={id} title="label_event" onSubmit={handleSubmit}>
  <InputText name="description" label={t('label_description')} formId={id} help={t('help_description')} />
  <div class="">
    <label for={`date_${id}starting`}>{t('label_date')}</label>
    <input type="datetime-local" class="form-control" id={`date_${id}starting`} aria-describedby={`help_${id}starting`} name="starting" />
    <div id={`help_${id}starting`} class="form-text">{t('help_starting')}</div>
  </div>
  <div class="">
    <label for={`number_${id}period`}>{t('label_period')}</label>
    <input type="number" min="10.00" max="500" step="0.01" class="form-control" id={`number_${id}period`} aria-describedby={`help_${id}period`} name="period" />
    <div id={`help_${id}period`} class="form-text">{t('help_period')}</div>
  </div>
  <InputText name="notes" label={t('label_notes')} formId={id} help={t('help_notes')} />
  <div class="form-check">
    <input type="checkbox" class="form-check-input" id={`text_${id}confirmed`} name="confirmed" />
    <label class="form-check-label" for={`text_${id}confirmed`}>{t('label_confirmed')}</label>
  </div>
  <input type="hidden" name="id" value={itemId} />
  <input type="hidden" name="type" />
</ModalForm>
}


/* Manage */
const Manage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const [tenant, setTenant] = useState(useSelector(state => state.tenant))
  const [selectedTab, setSelectedTab] = useState('dashboardLink')

  useEffect(() => {
    axios.get('api/signin').then(response => {
      if (!response.data || response.data.length > 99 || response.data.includes(';')) {
        //dispatch(tenantSet(undefined))
        //setTenant(undefined)
        if (!tenant) {
          navigate('/signin')
        } else {
          navigate(`/${tenant}`)
        }
      }
      else {
        dispatch(tenantSet(response.data))
        setTenant(response.data)
      }
      console.debug(response.data)
    })
  }, [])

  const handleSignout = () => {
    event.preventDefault()
    
    axios.get('api/signin-cd').then(response => {
      dispatch(tenantSet(undefined))
      setTenant(undefined)
      navigate('/signin')
      console.debug(response.data)
    })
  }

  const handleSwitchTab = (event) => {
    event.preventDefault()
    
    setSelectedTab(event.target.id)
  }

  const DisplayTab = () => {
    if ('dashboardLink' === selectedTab) {
      return <Dashboard />
    }
    else if ('currentWeekLink' === selectedTab) {
      return <CurrentWeek date={ datePart() } type="eucharystia" />
    }
    else if ('nextWeekLink' === selectedTab) {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      return <CurrentWeek date={ datePart(nextWeek) } type="eucharystia" />
    }
    else if ('yearLink' === selectedTab) {
      return <Weeks />
    }
    else if ('settingsLink' === selectedTab) {
      return <Settings />
    }
    return <></>
  }
  
  return !tenant ? <></> : <>
    <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href={`https://grafik.wlap.pl/#/${tenant}`}>{`${t('label_tenant')}: ${tenant}`}</a>
      <ul class="navbar-nav flex-row d-md-none">
        <li class="nav-item text-nowrap">
          <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label={t('label_toggle_navigation')}>
            <i class="bi bi-list"></i>
          </button>
        </li>
      </ul>
    </header>
    <div class="container-fluid">
      <div class="row">
        <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
          <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="sidebarMenuLabel">{`${t('label_tenant')}: ${tenant}`}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label={t('label_close')}></button>
            </div>
            <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="#" onClick={handleSwitchTab} id="dashboardLink"><i class="bi bi-house-fill"></i> {t('label_contact')} </a>
                </li>
              </ul>
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>{t('label_event')}</span>
                <a class="link-secondary" href="#" aria-label={t('label_add_event')} data-bs-toggle="modal" data-bs-target="#newEventModal">
                  <i class="bi bi-plus-circle"></i>
                </a>
              </h6>
              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="currentWeekLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_current_week')} </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="nextWeekLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_next_week')} </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="yearLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_year')} </a>
                </li>
              </ul>
              <hr class="my-3" />
              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="settingsLink" onClick={handleSwitchTab}><i class="bi bi-gear-wide-connected"></i> {t('label_settings')} </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="signoutLink" onClick={handleSignout}><i class="bi bi-door-closed"></i> {t('label_signout')} </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <DisplayTab />
        </main>
      </div>
    </div>
    <EventModal id="newEventModal" type="eucharystia" />
  </>
}


/* Signin */
const Signin = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const [tenant, setTenant] = useState(useSelector(state => state.tenant))
  const [signinFailure, setSigninFailure] = useState(false)

  useEffect(() => {
    axios.get('api/client').then(response => {
      if (response.data && !response.data.includes(';')) {
        navigate(`/${reponse.data.tenant}`)
      }
      console.debug(response.data)
    })
    axios.get('api/signin').then(response => {
      if (response.data && !response.data.includes(';')) {
        dispatch(tenantSet(response.data))
        navigate('/')
      }
      console.debug(response.data)
    })
  }, [])

  const handleClientSubmit = (event) => {
    event.preventDefault()
    
    setSigninFailure(false)
    const form = document.getElementById('form_client')
    axios.post('api/client', form).then(response => {
      if (response.data) {
        navigate(`/${response.data.tenant}`)
      }
      else {
        setSigninFailure(true)
      }
    })
    
    event.stopPropagation()
  }

  const handleTenantSubmit = (event) => {
    event.preventDefault()
    
    setSigninFailure(false)
    const form = document.getElementById('form_tenant')
    axios.post('api/signin', form).then(response => {
      if (response.data.length > 0) {
        navigate('/')
      }
      else {
        setSigninFailure(true)
      }
    })

    event.stopPropagation()
  }
  
  return <div class="d-flex align-items-center py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto" style={{maxWidth: '330px', padding: '1rem'}}>
      <div class="alert alert-info visually-hidden" role="alert">
        <h4 class="alert-heading">{t('label_try_title')}</h4>
        <p>{t('label_try_description')}</p>
        <hr />
        <p class="mb-0">{t('label_try_footer')}</p>
      </div>
      <h1 class="h3 mb-3 fw-normal">{t('label_please_sign_in')}</h1>
      {signinFailure && <div class="alert alert-danger" role="alert">{t('label_signin_failure')}</div>}
      <ul class="nav nav-tabs" id="signinTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="clientTab" data-bs-toggle="tab" data-bs-target="#client-tab-pane" type="button" role="tab" aria-controls="client-tab-pane" aria-selected="true">{t('label_client')}</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="tenantTab" data-bs-toggle="tab" data-bs-target="#tenant-tab-pane" type="button" role="tab" aria-controls="tenant-tab-pane" aria-selected="false">{t('label_tenant')}</button>
        </li>
      </ul>
      <div class="tab-content" id="tabContent">
        <div class="tab-pane fade show active" id="client-tab-pane" role="tabpanel" aria-labelledby="client-tab" tabindex="0">
          <form id="form_client" enctype="multipart/form-data" onSubmit={handleClientSubmit}>
            <div class="form-floating">
              <input type="text" class="form-control" id="tenantInput" placeholder="" name="tenant" />
              <label for="tenantInput">{t('label_tenant')}</label>
            </div>
            <div class="form-floating">
              <input type="password" class="form-control" id="tenantPassword" placeholder={t('label_tenant_password')} name="groupPassword" />
              <label for="tenantPassword">{t('label_tenant_password')}</label>
            </div>
            <div class="form-floating">
              <input type="text" class="form-control" id="clientInput" placeholder="" name="client" />
              <label for="clientInput">{t('label_client')}</label>
            </div>
            <button class="btn btn-primary w-100 py-2" type="submit">{t('label_sign_in')}</button>
          </form>
        </div>
        <div class="tab-pane fade" id="tenant-tab-pane" role="tabpanel" aria-labelledby="tenant-tab" tabindex="0">
          <form id="form_tenant" enctype="multipart/form-data" onSubmit={handleTenantSubmit}>
            <div class="form-floating">
              <input type="text" class="form-control" id="floatingInput" placeholder="demo" name="tenant" />
              <label for="floatingInput">{t('label_tenant')}</label>
            </div>
            <div class="form-floating">
              <input type="password" class="form-control" id="floatingPassword" placeholder={t('label_password')} name="password" />
              <label for="floatingPassword">{t('label_password')}</label>
            </div>
            <div class="form-check text-start my-3">
              <input class="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
              <label class="form-check-label" for="checkDefault">{t('label_remember_me')}</label>
            </div>
            <button class="btn btn-primary w-100 py-2" type="submit">{t('label_sign_in')}</button>
          </form>
        </div>
      </div>
      <p class="mt-5 mb-3 text-body-secondary">{t('label_copyright')}</p>
    </main>
  </div>
}


/* Reader */
const Reader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { locale, setNotification } = usePreferences()
  const { tenant } = useParams()
  
  const [currentWeek, setCurrentWeek] = useState([])
  const [contact, setContact] = useState()
  const [settings, setSettings] = useState()
  const [client, setClient] = useState()
  const [selected, setSelected] = useState()

  const dayOfWeek = [
    { order: '2', name: t('label_monday'), short: 'pn'}, 
    { order: '3', name: t('label_tuesday'), short: 'wt'}, 
    { order: '4', name: t('label_wednesday'), short: 'śr'}, 
    { order: '5', name: t('label_thursday'), short: 'czw'}, 
    { order: '6', name: t('label_friday'), short: 'pt'}, 
    { order: '7', name: t('label_saturday'), short: 'sb'}, 
    { order: '1', name: t('label_sunday'), short: 'nd'}
  ]

  const handleSignout = (event) => {
    event.preventDefault()

    axios.get('api/client-cd').then(response => {
      navigate('/signin')
      console.debug(response.data)
    })
    
    event.stopPropagation()
  }

  useEffect(() => {
    axios.get('api/client').then(response => {
      console.debug(response.data)
      if (response.data) {
        setClient(response.data)
      } else {
        navigate('/signin')
      }
    })
  }, [])

  useEffect(() => {
    if (!client) {
      return
    }
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/contact?${searchParams.toString()}`).then(response => {
      setContact(response.data)
      console.debug(response.data)
    })
    axios.get(`api/settings?${searchParams.toString()}`).then(response => {
      setSettings(response.data)
      console.debug(response.data)
    })
    const postData = {
      tenant: tenant,
      type: "eucharystia",
      today: datePart()
    }
    axios.post('api/event-week', postData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      setCurrentWeek(response.data)
      console.debug(response.data)
    })
  }, [tenant, client])

  return <>
    <header>
      <div class=" text-bg-dark collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 col-md-7 py-4">
              <h4>{t('label_contact_title')}</h4>
              <p class="text-body-secondary">{`${contact?.street} ${contact?.number}`}</p>
              <p class="text-body-secondary">{`${contact?.city} ${contact?.postalcode}`}</p>
              <p class="text-body-secondary">{`${t('label_phone')}: ${contact?.phone}`}</p>
              <p class="text-body-secondary">{`${t('label_iban')}: ${contact?.iban}`}</p>
            </div>
            <div class="col-sm-4 offset-md-1 py-4">
              <h4>{t('label_contact_subtitle')}</h4>
              <ul class="list-unstyled">
                <li><a href={`mailto:${contact?.email}`} class="text-white">{t('label_emailus')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center"><strong>{`${t('label_tenant')}: ${contact?.description}`}</strong></a>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#" id="signoutLink" onClick={handleSignout}><i class="bi bi-door-closed"></i> {t('label_signout')} </a>
            </li>
          </ul>
          <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
            aria-expanded="false" aria-label={t('label_toggle_navigation')}>
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>
    <main>
      <div class="container">
        <h1 class="text-body-emphasis">{t('label_reader_header')}</h1>
        <p class="fs-5 col-md-8 mb-5">{`${t('label_reader_description')}:${settings?.schedule}`}</p>
        <hr class="col-3 col-md-2 mb-5"></hr>
        <div class="row">
        { dayOfWeek.map((e, i) => {
                const currentDay = currentWeek.filter(f => f.dayOfWeek === e.order)
              return <>
                <div class="col-lg-1 bg-info-subtle">{e.short}</div>
                { 1 > currentDay.length ? <div class="col-lg-11">  - - -  </div> : currentDay.map(g => {
                  const endTime = new Date(new Date(g.starting).getTime() + g.period * 60 * 60 * 1000)
                  const isAssigned = g.assignment.find(a => a.clientId === client.clientId)
                  return <div class={`bg-${g.confirmed ? 'secondary' : 'warning' }-subtle border border-secondary col-lg-${Math.round(g.period/3)}`}>
                  {`${g.time}`} - <DateFormatter timestamp={endTime} locale={locale} format="time" /> {g.description} 
                    { g.confirmed ? g.assignment.filter(a => a.accepted).map(a => <div>{a.displayName}</div>) : <a 
                      href="#" 
                      class="btn btn-sm" 
                      data-bs-toggle="modal" 
                      data-bs-target={!isAssigned ? '#createAssignmentModal' : '#deleteAssignmentModal'} 
                      onClick={ () => setSelected(g.id) }
                    >
                      <i class={!isAssigned ? 'bi bi-person-raised-hand' : 'bi bi-person-walking'}></i>
                    </a> }
                  </div>
                }) }
                <div class="w-100"></div>
              </>
              }) }
        </div>
      </div>
    </main>
    <footer class="text-body-secondary py-5">
      <div class="container">
        <p class="float-end mb-1">
          <a href={`#/${tenant}`}>{t('label_backtotop')}</a>
        </p>
        <p class="mb-1">{t('label_copyright')}</p>
        <p class="mb-0"><a href="/">{t('label_home')}</a></p>
      </div>
    </footer>
    <ConfirmModal id="createAssignmentModal" title="label_create_assignment" onOk={() => {
      const postData = {
        eventId: selected,
        clientId: client.clientId
      }
      axios.post('api/assignment-cd', postData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
        console.debug(response.data)
        setNotification('label_saved')
      })
    }} />
    <ConfirmModal id="deleteAssignmentModal" title="label_delete_assignment" onOk={() => {
      const searchParams = new URLSearchParams({
        eventId: selected,
        clientId: client.clientId
      })
      axios.get(`api/assignment-cd?${searchParams.toString()}`).then(response => {
        console.debug(response.data)
        setNotification('label_saved')
      })
    }} />
  </>
}


/* Preferences */
const PreferencesContext = createContext()
const Preferences = ({ children }) => {
  const [notification, setNotification] = useState('')
  
  const locale = (getUrlParam('lang') ?? navigator.language.substring(3)).toLocaleLowerCase()

  return <PreferencesContext.Provider value={{ locale, setNotification }}>
  {children}
  <Toast message={notification} onClose={() => setNotification('')} />
</PreferencesContext.Provider>
}
const usePreferences = () => useContext(PreferencesContext)


const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Provider store={store}>
  <Preferences>
  <Router>
    <Routes>
      <Route path="/" element={<Manage />} />
      <Route path="signin" element={<Signin />} />
      <Route path="password" element={<Password />} />
      <Route path=":tenant" element={<Reader />} />
    </Routes>
  </Router>
  </Preferences>
</Provider>)
