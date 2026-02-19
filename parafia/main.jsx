import * as bootstrap from 'bootstrap'
import React, { useEffect, useState, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import axios from 'axios'
import L from 'leaflet'


if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')

var installPrompt = null;
window.addEventListener("beforeinstallprompt", event => installPrompt = event)

const state = localStorage.getItem('redux')
const initialState = !!state ? JSON.parse(state) : {
  value: null,
  lang: navigator.language.substring(0, 2).toLocaleLowerCase(),
  tenant: null
}

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

const store = createStore(selectedReducer)
store.subscribe(() => localStorage.setItem('redux', JSON.stringify(store.getState())))

const lang = (getUrlParam('lang') ?? initialState.lang).toLocaleLowerCase()
i18n.use(initReactI18next).init({
  resources: resources,
  lng: lang,
  fallbacking: "pl",
  interpolation: {
    escapeValue: false
  }
})
store.dispatch({ type: 'lang/set', payload: lang })


/* FormInput */
const FormInput = (props) => {
  const { name, label, help, modalId } = props
  
  return <div class="form-group">
  <label for={`${modalId}Input${name}`}>{label}</label>
  <input type="text" class="form-control" id={`${modalId}Input${name}`} aria-describedby={`${modalId}Help${name}`} name={name} />
  <small id={`${modalId}Help${name}`} class="form-text text-muted">{help}</small>
</div>
}


/* InputText */
const InputText = (props) => {
  const { name, label, help, parentId } = props
  
  return <div class="mb-3">
  <label for={`$parentId}${name}`} class="form-label">{label}</label>
  <input type="text" id={`${parentId}${name}`} class="form-control" placeholder={help} name={name} />
</div>
}


/* ModalForm */
const ModalForm = (props) => {
  const { id, title, onSubmit, label_close, label_cancel, label_save, children } = props
  
  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit()
    
    event.stopPropagation()
  }
  
  return <div class="modal fade" id={id} tabindex="-1" aria-labelledby={`title_${id}`} aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id={`title_${id}`}>{title}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label={label_close}></button>
        </div>
        <div class="modal-body">
          <form class="dane" id={`form_${id}`} enctype="multipart/form-data">{children}</form>
        </div>
        <div class="modal-footer">
          <button type="reset" class="btn btn-secondary" data-bs-dismiss="modal">{label_cancel}</button>
          <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit}>{label_save}</button>
        </div>
      </div>
    </div>
  </div>
}


/* Table */
const Table = (props) => {
  const { columns, children } = props
  
  return <div class="table-responsive small">
  <table class="table table-stripped table-sm">
    <thead><tr>{ columns.map((e, i) => <th scope="col">{e}</th>) }</tr></thead>
    <tbody>{children}</tbody>
  </table>
</div>
}


/* AccordionItem */
const AccordionItem = (props) => {
  const { id, parent, show = false, children } = props
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


/* ConfirmModal */
const ConfirmModal = (props) => {
  const { title, onOk } = props
  const { t } = useTranslation()
  
  return <div class="modal" id="confirmModal" tabindex="-1">
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
</div>}


/* Password */
const Password = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const postData = {
      code: getUrlParam('code'),
      tenant: document.querySelector(`#floatingInput`).value,
      password: document.querySelector(`#floatingPassword`).value
    }
    axios.post('api/signin-cd', postData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      console.debug(response.data)
      if (response.data) {
        navigate('/signin')
        window.history.replaceState({}, document.title, 'https://parafia.wlap.pl/#/signin')
      }
    })
    event.stopPropagation()
  }
  
  return <div class="d-flex align-items-center py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto" style={{maxWidth: '330px', padding: '1rem'}}>
      <form id="form_submit"  onSubmit={handleSubmit}>
        <h1 class="h3 mb-3 fw-normal">{t('label_please_sign_in')}</h1>
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
        <p class="mt-5 mb-3 text-body-secondary">{t('label_copyright')}</p>
      </form>
    </main>
  </div>
}


/* VisitModal */
const VisitModal = (props) => {
  const { modalId } = props
  const { t } = useTranslation()

  const handleSubmit = () => {
    const form = document.querySelector(`#form_${modalId}`)
    axios.post('api/visit-cd', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      form.reset()
      console.debug(response.data)
    })
  }

  return <ModalForm id={modalId} title={t('label_visit')} onSubmit={handleSubmit} label_close={t('label_close')} label_cancel={t('label_cancel')} label_save={t('label_save')}>
  <FormInput name="firstname" label={t('label_firstname')} help={t('help_firstname')} modalId={modalId} />
  <FormInput name="surname" label={t('label_surname')} help={t('help_surname')} modalId={modalId} />
  <FormInput name="street" label={t('label_street')} help={t('help_street')} modalId={modalId} />
  <FormInput name="number" label={t('label_number')} help={t('help_number')} modalId={modalId} />
  <FormInput name="city" label={t('label_city')} help={t('help_city')} modalId={modalId} />
  <div class="form-group">
    <label for={`${modalId}InputDonation`}>{t('label_donation')}</label>
    <input type="number" min="10.00" max="500" step="0.01" class="form-control" id={`${modalId}InputDonation`} aria-describedby={`${modalId}HelpDonation`} name="donation" />
    <small id={`${modalId}HelpDonation`} class="form-text text-muted">{t('help_donation')}</small>
  </div>
</ModalForm>
}


/* Confirmation */
const Confirmation = () => {
  const { t } = useTranslation()
  const [tenant, setTenant] = useState(store.getState().tenant)
  const [confirmation, setConfirmation] = useState([])
  const [selected, setSelected] = useState()
  const [refresh, setRefresh] = useState()

  const locale = (getUrlParam('lang') ?? navigator.language.substring(3)).toLocaleLowerCase()

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/visit?${searchParams.toString()}`).then(response => {
      setConfirmation(response.data)
      console.debug(response.data)
    })
  }, [])

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
    <Table columns={['#', t('label_firstname'), t('label_surname'), t('label_street'), t('label_number'), t('label_city'), t('label_donation'), t('label_date'), t('label_actions')]}>
      { confirmation.map((e, i) => <tr>
        <td>{i + 1}</td>
        <td>{e.firstname}</td>
        <td>{e.surname}</td>
        <td>{e.street}</td>
        <td>{e.number}</td>
        <td>{e.city}</td>
        <td><NumberFormatter value={e.donation} locale={locale} /></td>
        <td><DateFormatter timestamp={e.created} locale={locale} format="date" /></td>
        <td><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#confirmModal" onClick={() => setSelected(e['id']) }><i class="bi bi-trash"></i></button></td>
      </tr>) }
    </Table>
    <ConfirmModal title="label_delete" onOk={() => {
      const searchParams = new URLSearchParams({ id: selected })
      axios.get(`api/visit-cd?${searchParams.toString()}`).then(response => setRefresh(true))
    }} />
  </>
}


/* Visit */
const Visit = () => {
  const { t } = useTranslation()
  const [tenant, setTenant] = useState(store.getState().tenant)
  const [donations, setDonations] = useState([])
  const [selected, setSelected] = useState()
  const [refresh, setRefresh] = useState()

  const locale = (getUrlParam('lang') ?? navigator.language.substring(3)).toLocaleLowerCase()

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/visit?${searchParams.toString()}`).then(response => {
      setDonations(response.data)
      console.debug(response.data)
    })
  }, [])

  return <>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">{t('label_statistics')}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary">{t('label_refresh')}</button>
        </div>
      </div>
    </div>
    <h2>{t('label_visit')}</h2>
    <Table columns={['#', t('label_firstname'), t('label_surname'), t('label_street'), t('label_number'), t('label_city'), t('label_donation'), t('label_date'), t('label_actions')]}>
      { donations.map((e, i) => <tr>
        <td>{i + 1}</td>
        <td>{e.firstname}</td>
        <td>{e.surname}</td>
        <td>{e.street}</td>
        <td>{e.number}</td>
        <td>{e.city}</td>
        <td><NumberFormatter value={e.donation} locale={locale} /></td>
        <td><DateFormatter timestamp={e.created} locale={locale} format="date" /></td>
        <td><button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#confirmModal" onClick={() => setSelected(e['id']) }><i class="bi bi-trash"></i></button></td>
      </tr>)}
    </Table>
    <ConfirmModal title="label_delete" onOk={() => {
      const searchParams = new URLSearchParams({ id: selected })
      axios.get(`api/visit-cd?${searchParams.toString()}`).then(response => setRefresh(true))}
    } />
  </>
}


/* Weeks */
const Weeks = () => {
  const { t } = useTranslation()
  const [selectedWeek, setSelectedWeek] = useState()

  const months = [t('label_january'), t('label_february'), t('label_march'), t('label_april'), t('label_may'), t('label_june'), t('label_july'), t('label_august'), t('label_september'), t('label_october'), t('label_november'), t('label_december')]
  const locale = (getUrlParam('lang') ?? navigator.language.substring(3)).toLocaleLowerCase()
  const weeks = getWeeks()

  return selectedWeek ? <>
    <button type="button" class="btn btn-sm btn-outline-secondary" onClick={ () => { setSelectedWeek(undefined) }}>{t('label_back')}</button>
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
        <td><button type="button" class="btn btn-sm btn-outline-secondary" onClick={() => setSelectedWeek(w.start)}><i class="bi bi-pencil-square"></i></button></td>
      </tr>) }
    </Table>
  </>
}


/* CurrentWeek */
const CurrentWeek = (props) => {
  const { date, type } = props
  const { t } = useTranslation()

  const [currentWeek, setCurrentWeek] = useState([])
  const [selected, setSelected] = useState()
  const [refresh, setRefresh] = useState(true)

  const locale = (getUrlParam('lang') ?? navigator.language.substring(3)).toLocaleLowerCase()

  useEffect(() => {
    if (refresh) {
      const postData = {
        tenant: store.getState().tenant,
        type: type,
        today: date
      }
      axios.post('api/scheduled-week', postData, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
        setCurrentWeek(response.data)
        console.debug(response.data)
      })
      setRefresh(false)
    }
  }, [refresh])

  const handleSelect = (event) => {}

  const handleRefresh = () => setRefresh(true)

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
          <button type="button" class="btn btn-sm btn-outline-secondary" onClick={handleRefresh}>{t('label_refresh')}</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <label for="" class="form-label">{t('label_liczba_eucharystii')}</label>
        <input type="text" class="form-control" />
      </div>
      <div class="col-sm-6">
        <label for="" class="form-label">{t('label_')}</label>
        <input type="text" class="form-control" />
      </div>
      <div class="col-sm-6">
        <label for="" class="form-label">{t('label_')}</label>
        <input type="text" class="form-control" />
      </div>
      <div class="col-sm-6">
        <label for="" class="form-label">{t('label_')}</label>
        <input type="text" class="form-control" />
      </div>
    </div>
    <h2>{getTitle()}</h2>
    <Table columns={['#', t('label_date'), t('label_description'), t('label_donation'), t('label_notes'), t('label_actions')]}>
      { currentWeek.map((e, i) => <tr>
        <td>{i + 1}</td>
        <td><DateFormatter timestamp={e['scheduled']} locale={locale} /></td>
        <td>{e['description']}</td>
        <td><NumberFormatter value={e['value']} locale={locale} /></td>
        <td>{e['notes']}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editScheduledModal" onClick={ () => setSelected(e['id']) }><i class="bi bi-pencil-square"></i></button>
          <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#confirmModal" onClick={ () => setSelected(e['id']) }><i class="bi bi-trash"></i></button>
        </td>
      </tr>) }
    </Table>
    <Modal modalId="editScheduledModal" itemId={selected} type={type} />
    <ConfirmModal title="label_delete" onOk={() => {
      const searchParams = new URLSearchParams({ id: selected })
      axios.get(`api/scheduled-cd?${searchParams.toString()}`).then(response => handleRefresh())
    }} />
  </>
}


/* Dashboard */
const Dashboard = () => {
  const { t } = useTranslation()
  
  const [tenant, setTenant] = useState(store.getState().tenant)
  const [contact, setContact] = useState()
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/contact?${searchParams.toString()}`).then(response => {
      setContact(response.data)
      document.getElementById('contactdescription').value = response.data.description
      document.getElementById('contactstreet').value = response.data.street
      document.getElementById('contactnumber').value = response.data.number
      document.getElementById('contactcity').value = response.data.city
      document.getElementById('contactpostalcode').value = response.data.postalcode
      document.getElementById('contactEmail').value = response.data.email
      document.getElementById('contactPhone').value = response.data.phone
      document.getElementById('contactIban').value = response.data.iban
    })
  }, [tenant])

  const handleDisabled = () => setDisabled(!disabled)

  const handleSubmit = (event) => {
    event.preventDefault()
    
    const form = document.querySelector(`#form_contact`)
    axios.post('api/contact', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      console.debug(response.data)
    })
    
    event.stopPropagation()
  }
  
  return <>
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">{t('label_dashboard')}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" onClick={handleDisabled}>{ disabled ? <i class="bi bi-unlock"></i> : <i class="bi bi-lock"></i> }</button>
        </div>
      </div>
    </div>
    <form id="form_contact" enctype="multipart/form-data">
      <fieldset disabled={disabled}>
        <legend>{t('label_contact')}</legend>
        <InputText name="description" label={t('label_description')} help={contact?.description} parentId="contact" />
        <InputText name="street" label={t('label_street')} help={contact?.street} parentId="contact" />
        <InputText name="number" label={t('label_number')} help={contact?.number} parentId="contact" />
        <InputText name="city" label={t('label_city')} help={contact?.city} parentId="contact" />
        <InputText name="postalcode" label={t('label_postalcode')} help={contact?.postalcode} parentId="contact" />
        <div class="mb-3">
          <label for="contactEmail" class="form-label">{t('label_email')}</label>
          <input type="email" id="contactEmail" class="form-control" placeholder={contact?.email} name="email" />
        </div>
        <div class="mb-3">
          <label for="contactPhone" class="form-label">{t('label_phone')}</label>
          <input type="tel" id="contactPhone" class="form-control" placeholder={contact?.phone} name="phone" />
        </div>
        <div class="mb-3">
          <label for="contactIban" class="form-label">{t('label_iban')}</label>
          <input type="text" id="contactIban" class="form-control" maxlength="28" placeholder={contact?.iban} name="iban" />
        </div>
        { !disabled && <button type="submit" class="btn btn-primary" onClick={handleSubmit}>{t('label_submit')}</button> }
      </fieldset>
    </form>
  </>
}


/* Settings */
const Settings = () => {
  const { t } = useTranslation()

  const [tenant, setTenant] = useState(store.getState().tenant)
  const [settings, setSettings] = useState()
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/settings?${searchParams.toString()}`).then(response => {
      setSettings(response.data)
      document.getElementById('settingsSchedule').value = response.data.schedule
      document.getElementById('settingsShowVisits').checked = 0 == response.data.showVisits ? false : true
      document.getElementById('settingsShowBooking').checked = 0 == response.data.showBooking ? false : true
    })
  }, [tenant])

  const handleDisabled = () => setDisabled(!disabled)

  const handleSubmit = (event) => {
    event.preventDefault()
    
    //const form = document.querySelector(`#form_settings`)
    const form = {
      schedule: document.getElementById('settingsSchedule').value,
      showVisits: document.getElementById('settingsShowVisits').checked ? 1 : 0,
      showBooking: document.getElementById('settingsShowBooking').checked ? 1 : 0
    }
    axios.post('api/settings', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      console.debug(response.data)
    })
    
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
    <form id="form_settings" enctype="multipart/form-data">
      <fieldset disabled={disabled}>
        <legend>{t('label_settings')}</legend>
        <div class="mb-3">
          <label for="settingsSchedule" class="form-label">{t('label_schedule')}</label>
          <textarea id="settingsSchedule" class="form-control" rows="4" name="schedule" />
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="settingsShowVisits" name="showVisits" />
          <label class="form-check-label" for="settingsShowVisits">{t('label_show_visit')}</label>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="settingsShowBooking" name="showBooking" />
          <label class="form-check-label" for="settingsShowBooking">{t('label_show_booking')}</label>
        </div>
        {!disabled && <button type="submit" class="btn btn-primary" onClick={handleSubmit}>{t('label_submit')}</button>}
      </fieldset>
    </form>
  </>
}


/* Modal */
const Modal = (props) => {
  const { modalId, itemId, type } = props
  const { t } = useTranslation()

  useEffect(() => {
    if (!itemId) {
      document.getElementById(`${modalId}InputType`).value = type
      return
    }
    
    const searchParams = new URLSearchParams({ id: itemId })
    axios.get(`api/scheduled?${searchParams.toString()}`).then(response => {
      document.getElementById(`${modalId}InputId`).value = itemId
      document.getElementById(`${modalId}InputDescription`).value = response.data['description']
      document.getElementById(`${modalId}InputScheduled`).value = response.data['scheduled']
      document.getElementById(`${modalId}InputValue`).value = response.data['value']
      document.getElementById(`${modalId}InputNotes`).value = response.data['notes']
      document.getElementById(`${modalId}InputType`).value = response.data['type']
      console.debug(response.data)
    })
  }, [itemId])

  const handleSubmit = () => {
    const form = document.querySelector(`#form_${modalId}`)
    axios.post(!itemId ? 'api/scheduled-cd' : 'api/scheduled', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      form.reset()
      console.debug(response.data)
    })
  }

  return <ModalForm id={modalId} title={t('label_scheduled')} onSubmit={handleSubmit} label_close={t('label_close')} label_cancel={t('label_cancel')} label_save={t('label_save')}>
  <FormInput name="description" label={t('label_description')} help={t('help_description')} modalId={modalId} />
  <div class="form-group">
    <label for={`${modalId}InputScheduled`}>{t('label_date')}</label>
    <input type="datetime-local" class="form-control" id={`${modalId}InputScheduled`} aria-describedby={`${modalId}HelpScheduled`} name="scheduled" />
    <small id={`${modalId}HelpScheduled`} class="form-text text-muted">{t('help_scheduled')}</small>
  </div>
  <div class="form-group">
    <label for={`${modalId}InputValue`}>{t('label_donation')}</label>
    <input type="number" min="10.00" max="500" step="0.01" class="form-control" id={`${modalId}InputValue`} aria-describedby={`${modalId}valueHelp`} name="value" />
    <small id={`${modalId}valueHelp`} class="form-text text-muted">{t('help_value')}</small>
  </div>
  <FormInput name="notes" label={t('label_notes')} help={t('help_notes')} modalId={modalId} />
  <input type="hidden" class="form-control" id={`${modalId}InputId`} name="id" />
  <input type="hidden" class="form-control" id={`${modalId}InputType`} name="type" />
</ModalForm>
}


/* Manage */
const Manage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const [tenant, setTenant] = useState(store.getState().tenant)
  const [selectedTab, setSelectedTab] = useState('dashboardLink')

  useEffect(() => {
    axios.get('api/signin').then(response => {
      if (!response.data || response.data.length > 99 || response.data.includes(';')) {
        store.dispatch({ type: 'tenant/set', payload: undefined })
        setTenant(undefined)
        navigate('/signin')
      }
      else {
        store.dispatch({ type: 'tenant/set', payload: response.data })
        setTenant(response.data)
      }
      console.debug(response.data)
    })
  }, [])

  const handleSignout = () => {
    axios.get('api/signin-cd').then(response => {
      store.dispatch({ type: 'tenant/set', payload: undefined })
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
    else if ('orderLink' === selectedTab) {
      return <CurrentWeek type="eucharystia" />
    }
    else if ('departureLink' === selectedTab) {
      return <CurrentWeek date={ datePart() } type="departure" />
    }
    else if ('visitLink' === selectedTab) {
      return <Visit />
    }
    else if ('confirmationLink' === selectedTab) {
      return <Confirmation />
    }
    else if ('settingsLink' === selectedTab) {
      return <Settings />
    }
    return <></>
  }
  
  return !tenant ? <></> : <>
    <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href={`https://parafia.wlap.pl/#/${tenant}`}>{`${t('label_tenant')}: ${tenant}`}</a>
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
                  <a class="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="#" onClick={handleSwitchTab} id="dashboardLink"><i class="bi bi-house-fill"></i> {t('label_dashboard')} </a>
                </li>
              </ul>
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>{t('label_scheduled_event')}</span>
                <a class="link-secondary" href="#" aria-label={t('label_add_scheduled')} data-bs-toggle="modal" data-bs-target="#newScheduledModal">
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
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="orderLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_order')} </a>
                </li>
              </ul>
              <hr class="my-3" />
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>{t('label_visit')}</span>
                <a class="link-secondary" href="#" aria-label={t('label_add_visit')} data-bs-toggle="modal" data-bs-target="#newVisitModal">
                  <i class="bi bi-plus-circle"></i>
                </a>
              </h6>
              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="visitLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_visit')} </a>
                </li>
              </ul>
              <hr class="my-3" />
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>{t('label_departure')}</span>
                <a class="link-secondary" href="#" aria-label={t('label_add_departure')} data-bs-toggle="modal" data-bs-target="#newDepartureModal">
                  <i class="bi bi-plus-circle"></i>
                </a>
              </h6>
              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="departureLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_departure')} </a>
                </li>
              </ul>
              <hr class="my-3" />
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>{t('label_confirmation')}</span>
                <a class="link-secondary" href="#" aria-label={t('label_add_confirmation')} data-bs-toggle="modal" data-bs-target="#newConfirmationModal">
                  <i class="bi bi-plus-circle"></i>
                </a>
              </h6>
              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" id="confirmationLink" onClick={handleSwitchTab}><i class="bi bi-file-earmark-text"></i> {t('label_confirmation')} </a>
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
    <Modal modalId="newScheduledModal" type="eucharystia" />
    <Modal modalId="newDepartureModal" type="departure" />
    <VisitModal modalId="newVisitModal" />
  </>
}


/* Signin */
const Signin = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [signinFailure, setSigninFailure] = useState(false)

  useEffect(() => {
    axios.get('api/signin').then(response => {
      if (response.data && !response.data.includes(';')) {
        store.dispatch({ type: 'tenant/set', payload: response.data })
        navigate('/manage')
      }
      console.debug(response.data)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSigninFailure(false)
    const form = document.querySelector('#form_submit')
    axios.post('api/signin', form).then(response => {
      if (response.data.length > 0) {
        navigate('/manage')
      }
      else {
        setSigninFailure(true)
      }
    })
  }
  
  return <div class="d-flex align-items-center py-4 bg-body-tertiary">
    <main class="form-signin w-100 m-auto" style={{maxWidth: '330px', padding: '1rem'}}>
      <div class="alert alert-info" role="alert">
        <h4 class="alert-heading">{t('label_try_title')}</h4>
        <p>{t('label_try_description')}</p>
        <hr />
        <p class="mb-0">{t('label_try_footer')}</p>
      </div>
      {signinFailure && <div class="alert alert-danger" role="alert">{t('label_signin_failure')}</div>}
      <form id="form_submit"  onSubmit={handleSubmit}>
        <h1 class="h3 mb-3 fw-normal">{t('label_please_sign_in')}</h1>
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
        <p class="mt-5 mb-3 text-body-secondary">{t('label_copyright')}</p>
      </form>
    </main>
  </div>
}


/* Reader */
const Reader = () => {
  const { t } = useTranslation()
  
  const [currentWeek, setCurrentWeek] = useState([])
  const [contact, setContact] = useState()
  const [departure, setDeparture] = useState([])
  const [settings, setSettings] = useState()
  const [visit, setVisit] = useState([])

  const { tenant } = useParams()
  const locale = (getUrlParam('lang') ?? navigator.language.substring(3)).toLocaleLowerCase()

  const dayOfWeek = [
    { order: '2', name: t('label_monday')}, 
    { order: '3', name: t('label_tuesday')}, 
    { order: '4', name: t('label_wednesday')}, 
    { order: '5', name: t('label_thursday')}, 
    { order: '6', name: t('label_friday')}, 
    { order: '7', name: t('label_saturday')}, 
    { order: '1', name: t('label_sunday')}
  ]

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = document.querySelector(`#form_order`)
    axios.post('api/scheduled-cd', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      form.reset()
      console.debug(response.data)
    })
    
    event.stopPropagation()
  }

  const handleBook = (event) => {
    event.preventDefault()

    const form = document.querySelector(`#form_book`)
    axios.post('api/visit-cd', form, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      form.reset()
      console.debug(response.data)
    })
    
    event.stopPropagation()
  }

  useEffect(() => {
    const searchParams = new URLSearchParams({ tenant: tenant })
    axios.get(`api/contact?${searchParams.toString()}`).then(response => {
      setContact(response.data)
      console.debug(response.data)
    })
    axios.get(`api/settings?${searchParams.toString()}`).then(response => {
      setSettings(response.data)
      console.debug(settings?.showBooking)
    })
    axios.get(`api/visit?${searchParams.toString()}`).then(response => {
      setVisit(response.data)
      console.debug(response.data)
    })
    const postCurrent = {
      tenant: tenant,
      type: "eucharystia",
      today: datePart()
    }
    axios.post('api/scheduled-week', postCurrent, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      setCurrentWeek(response.data)
      console.debug(response.data)
    })
    const postDeparture = {
      tenant: tenant,
      type: "departure",
      today: datePart()
    }
    axios.post('api/scheduled-week', postDeparture, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
      setDeparture(response.data)
      console.debug(response.data)
    })
  }, [tenant])

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
        <div class="accordion" id="accordionExample">
          <AccordionItem id="scheduled" parent="accordionExample" show={true}>
            <Table columns={['#', t('label_day'), t('label_description')]}>
              { dayOfWeek.map((e, i) => <tr>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{ currentWeek.filter(f => f.dayOfWeek === e.order).map(g => <p>{`${g.time} ${g.description}`}</p>) }</td>
              </tr>) }
            </Table>
          </AccordionItem>
          <AccordionItem id="announcements" parent="accordionExample"></AccordionItem>
          <AccordionItem id="order" parent="accordionExample">
            <form id="form_order" enctype="multipart/form-data">
              <fieldset>
                <legend>{t('label_order')}</legend>
                <InputText name="description" label={t('label_description')} help="" parentId="order" />
                <InputText name="notes" label={t('label_from')} help="" parentId="order" />
                <input type="hidden" name="tenant" value={tenant} />
                <input type="hidden" name="type" value="eucharystia" />
                <button type="submit" class="btn btn-primary" onClick={handleSubmit}>{t('label_submit')}</button>
              </fieldset>
            </form>
          </AccordionItem>
          <AccordionItem id="departure" parent="accordionExample">
            <Table columns={['#', t('label_date'), t('label_description')]}>
              { departure.map((e, i) => <tr>
                <td>{i + 1}</td>
                <td><DateFormatter timestamp={e.scheduled} locale={locale} /></td>
                <td>{e.description}</td>
              </tr>) }
            </Table>
          </AccordionItem>
          { !!settings?.showVisits && <AccordionItem id="visit" parent="accordionExample">
            <Table columns={['#', t('label_firstname'), t('label_surname'), t('label_street'), t('label_number'), t('label_city'), t('label_donation'), t('label_date')]}>
              { visit.map((e, i) => <tr>
                <td>{i + 1}</td>
                <td>{e.firstname}</td>
                <td>{e.surname}</td>
                <td>{e.street}</td>
                <td>{e.number}</td>
                <td>{e.city}</td>
                <td><NumberFormatter value={e.donation} locale={locale} /></td>
                <td><DateFormatter timestamp={e.created} locale={locale} format="date" /></td>
              </tr>) }
            </Table>
          </AccordionItem>
          }
          { !!settings?.showBooking && <AccordionItem id="book" parent="accordionExample">
            <form id="form_book" enctype="multipart/form-data">
              <fieldset>
                <legend>{t('label_book')}</legend>
                <InputText name="firstname" label={t('label_firstname')} help="" parentId="book" />
                <InputText name="surname" label={t('label_surname')} help="" parentId="book" />
                <InputText name="street" label={t('label_street')} help="" parentId="book" />
                <InputText name="number" label={t('label_number')} help="" parentId="book" />
                <InputText name="city" label={t('label_city')} help="" parentId="city" />
                <input type="hidden" name="tenant" value={tenant} />
                <button type="submit" class="btn btn-primary" onClick={handleBook}>{t('label_submit')}</button>
              </fieldset>
            </form>
          </AccordionItem>
          }
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
  </>
}


/* Selected */
const Selected = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const translate = 'https://translate.google.com/translate?js=n&sl=pl&tl=en&u='

  const handleBack = (event) => {
    event.preventDefault()
    navigate(-1)
  }

  const handleSelect = (event) => {
    event.preventDefault()
    store.dispatch({ type: 'selected/added', payload: name })
  }

  const selected = clients.clients.find(i => i.name === name)

  const urls = 'pl' === store.getState().lang ? selected : {
    ...selected,
    schedule: `${translate}${selected.schedule}`,
    announcement: `${translate}${selected.announcement}`,
    contact: `${translate}${selected.contact}`
  }

  const saved = name === store.getState().value

  return <>
  <Navi current="selected" />
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#" onClick={handleBack}> {t('button_back')} </a></li>
        {selected && <li class="breadcrumb-item active" aria-current="page">{selected.name}</li>}
      </ol>
    </nav>
    {selected ? <div class="list-group">
      <a href={urls.schedule} rel="external" class="list-group-item list-group-item-action">{t('list_schedule')}</a>
      <a href={urls.announcement} rel="external" class="list-group-item list-group-item-action">{t('list_announcement')}</a>
      <a href={urls.contact} rel="external" class="list-group-item list-group-item-action">{t('list_contact')}</a>
      {selected.other && <a href={selected.other} rel="external" class="list-group-item list-group-item-action">{t('list_other')}</a>}
      {selected.live && <a href={selected.live} rel="external" class="list-group-item list-group-item-action">{t('list_live')}</a>}
      <a href={`https://www.openstreetmap.org/directions?from=&to=${selected.latitude}%2C${selected.longitude}`} rel="external" class="list-group-item list-group-item-action">{t('list_directions')}</a>
      {!saved && <a href="#" onClick={handleSelect} class="list-group-item list-group-item-action">{t('list_select')}</a>}
    </div> : <p>{t('label_missing')}</p>}
  </div>
</>
}


/* List */
const List = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const all = getClients()

  const [filtered, setFiltered] = useState(all)
  const [phrase, setPhrase] = useState('')
  const [active, setActive] = useState(false)
  const [live, setLive] = useState(false)

  const filterByCriteria = (active: Boolean, live: Boolean, phrase: String) => {
    let preFiltered = all
    if (active) {
      preFiltered = preFiltered.filter(i => !!i.incoming)
      preFiltered.sort((a, b) => a.incoming.localeCompare(b.incoming))
    }
    if (live) {
      preFiltered = preFiltered.filter(i => (true === i.live) && !!i.incoming)
      preFiltered.sort((a, b) => a.incoming.localeCompare(b.incoming))
    }
    setFiltered(2 < phrase.length ? preFiltered.filter(i => i.name.toLowerCase().includes(phrase)) : preFiltered)
  }

  const handleClick = (name: String) => navigate(`/selected/${name}`)

  const handleFilter = (event) => {
    const p = event.target.value.toLowerCase().trim()

    filterByCriteria(active, live, p)

    setPhrase(p)
  }

  const handleSwitchLive = (event) => {
    filterByCriteria(active, !live, phrase)

    setLive(!live)
  }

  const handleSwitchActive = (event) => {
    filterByCriteria(!active, live, phrase)

    setActive(!active)
  }

  return <>
  <Navi current="list" />
  <div class="container">
    <form class="form-inline my-2">
      <input class="form-control mr-sm-2" type="search" name="search" placeholder={t('label_search')} aria-label="Search" onKeyUp={handleFilter} />
      <div class="form-check form-switch">
        <input type="checkbox" class="form-check-input" id="switchLive" onChange={handleSwitchLive} />
        <label class="form-check-label" for="switchLive">{t('label_live')}</label>
      </div>
      <div class="form-check form-switch">
        <input type="checkbox" class="form-check-input" id="switchActive" onChange={handleSwitchActive} />
        <label class="form-check-label" for="switchActive">{t('label_active')}</label>
      </div>
    </form>
    <div class="list-group">
      {filtered.map(i => <a onClick={() => handleClick(i.name)} className="list-group-item list-group-item-action d-flex justify-content-between align-tems-start"><div className="ms-2 me-auto">{i.name}</div><span class={`badge text-bg-${i.live ? 'danger' : 'primary'}`}>{i.incoming}</span></a>)}
    </div>
  </div>
</>
}


/* Navi */
const Navi = (props) => {
  const { current } = props

  const [count, setCount] = useState(0)
  
  const { t } = useTranslation()
  const navigate = useNavigate()

  const selected = clients.clients.find(i => i.name === store.getState().value)

  useEffect(() => {
    document.title = t('title_app')

    axios.get('api/statistics').then(response => {
      setCount(response.data.count)
      console.debug(response.data)
    })
  }, [])
  
  const handleInstall = (event) => {
    event.preventDefault()
    if (installPrompt) {
      installPrompt.prompt()
    }
    else {
      window.location.href = 'https://wlap.pl/howto/'
    }
  }

  return <>
  <div class="navbar navbar-expand-md">
    <div class="container">
      <h1 class="visually-hidden">{t('title_app')}</h1>
      <div class="navbar-brand"><img src="https://raw.githubusercontent.com/wojtekl/google-play/refs/heads/main/myparish/MojaParafia/app/src/main/res/mipmap-mdpi/ic_launcher_round.webp" width="30px" height="30px" alt="" />{t('title_app')}</div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#basic-navbar-nav" aria-controls="basic-navbar-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="basic-navbar-nav">
        <div className="navbar-nav me-auto">
          {selected && 'selected' != current && <div class="nav-item"><a class="nav-link" href={`#/selected/${selected.name}`}>{t('nav_your')}</a></div>}
          {'map' != current && <div class="nav-item"><a class="nav-link" aria-current="page" href="#/">{t('nav_map')}</a></div>}
          {'list' != current && <div class="nav-item"><a class="nav-link" href="#/list">{t('nav_list')}</a></div>}
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{t('nav_news')}</a>
            <ul class="dropdown-menu">
              <li><p class="dropdown-item">{t('label_views')}{count}</p></li>
              <li><a href="https://m.niedziela.pl/" rel="external" class="dropdown-item">Niedziela</a></li>
              <li><a href="https://www.gosc.pl/mobile" rel="external" class="dropdown-item">Gość Niedzielny</a></li>
              <li><a href="https://rycerzniepokalanej.pl/" rel="external" class="dropdown-item">Rycerz Niepokalanej</a></li>
              <li><a href="https://biblia.deon.pl/" rel="external" class="dropdown-item">Biblia Tysiąclecia</a></li>
              <li><a href={t('url_privacy')} rel="privacy-policy" class="dropdown-item">{t('nav_privacy')}</a></li>
              <li><a href="https://wlap.pl/" rel="author" class="dropdown-item">{t('nav_aboutus')}</a></li>
              <li><a href="https://cennik.wlap.pl/" rel="external" class="dropdown-item">Historia cen produktów spożywczych w marketach</a></li>
            </ul>
          </div>
          <div class="nav-item"><a class="nav-link link-danger" href="#" onClick={handleInstall}>{t('nav_install')}</a></div>
          <div class="nav-item"><a class="nav-link" href="#/manage">{t('nav_manage')}</a></div>
        </div>
      </div>
    </div>
  </div>
</>
}


/* App */
const App = () => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(clients.clients.find(i => i.name === store.getState().value))

  useEffect(() => {
    const map = L.map('map').setView(selected ? [selected.latitude, selected.longitude] : [52.114503, 19.423561], 9)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" rel="external">OpenStreetMap</a>'
    }).addTo(map)

    const markerDefault = L.divIcon({ html: '<i class="bi bi-geo-alt-fill" style="font-size: 20px" aria-label="Marker default"></i>', className: "markerDefault", size: [20, 23], iconAnchor: [10, 11] })
    const markerLive = L.divIcon({ html: '<i class="bi bi-geo-alt-fill" style="font-size: 20px; color: red" aria-label="Marker live"></i>', className: "markerLive", size: [20, 23], iconAnchor: [10, 11] })
    const markerActive = L.divIcon({ html: '<i class="bi bi-geo-alt-fill" style="font-size: 20px; color: blue" aria-label="Marker active"></i>', className: "markerActive", size: [20, 23], iconAnchor: [10, 11] })

    const list = getClients()
    const inactive = L.layerGroup(list.filter(i => !i.incoming).map(i => L
      .marker([i.latitude, i.longitude], { icon: markerDefault })
      .bindPopup(`<p>${i.name}</p><p>${i.incoming}</p><a href="#/selected/${i.name}"> ${t('see_link')} </a>`))).addTo(map)
    const active = L.layerGroup(list.filter(i => !!i.incoming).map(i => L
      .marker([i.latitude, i.longitude], { icon: i.live ? markerLive : markerActive })
      .bindPopup(`<p>${i.name}</p><p>${i.incoming}</p><a href="#/selected/${i.name}"> ${t('see_link')} </a>`))).addTo(map)

    L.control.layers(null, { [t('overlay_inactive')]: inactive, [t('overlay_active')]: active }).addTo(map)
  }, [])

  const mapDiv = createElement('div', { id: "map", style: { width: "100%", height: "100%" } })

  return <>
  <Navi current="map" />
  <div class="container" style={{ height: "calc(100vh - 59px)" }}>{mapDiv}</div>
</>
}


const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Provider store={store}>
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="selected/:name" element={<Selected />} />
      <Route path="list" element={<List />} />
      <Route path="manage" element={<Manage />} />
      <Route path="signin" element={<Signin />} />
      <Route path="password" element={<Password />} />
      <Route path=":tenant" element={<Reader />} />
    </Routes>
  </Router>
</Provider>)
