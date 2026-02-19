const getUrlParams = () => new URLSearchParams(new URL(window.location).search)
const getUrlParam = (param) => getUrlParams().get(param) ?? undefined


/* DateFormatter */
const DateFormatter = (props: { timestamp: Number, locale: String, format: String }) => {
  const { timestamp, locale, format } = props
  if (!timestamp) {
    return '---'
  }
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const formatDefault = { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric", timezone: timezone }
  const formatDate = { weekday: "short", month: "short", day: "numeric", timezone: timezone }
  const formatTime = { hour: "numeric", minute: "numeric", timezone: timezone }
  return new Date(timestamp).toLocaleString(locale, 'time' === format ? formatTime : 'date' === format ? formatDate : formatDefault)
}


/* NumberFormatter */
const NumberFormatter = (props: { value: Number, locale: String }) => {
  const { value, locale } = props
  const format = { maximumFractionDigits: 2, minimumFractionDigits: 2 }
  return value.toLocaleString(locale, format)
}


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

    console.debug('handleSubmit')
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
