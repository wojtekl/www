import * as bootstrap from 'bootstrap'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'


const lang = new URLSearchParams(new URL(window.location).search).get('lang') ?? navigator.language.substring(0, 2).toLocaleLowerCase()

i18n.use(initReactI18next).init({
  resources: resources,
  lng: lang,
  fallbacking: "pl",
  interpolation: {
    escapeValue: false
  }
})

/* Feature */
const Feature = (props) => {
  const { title, paragraph, image, url } = props

  const { t } = useTranslation()
  
  return <div class="feature col">
  <div class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3" style={{width: '4rem', height: '4rem', borderRadius: '0.75rem'}}>
    <img style={{width: '1em', height: '1em'}} src={image} />
  </div>
  <h3 class="fs-2 text-body-emphasis">{t(title)}</h3>
  <p>{t(paragraph)}</p>
  <a href={url} class="icon-link">{t('label_link')} <i class="bi bi-chevron-right"></i></a>
</div>}


/* Divider */
const Divider = () => <div style={{width: '100%', height: '3rem', backgroundColor: '#0000001a', border: 'solid rgba(0,0,0,.15)', borderWidth: '1px 0', boxShadow: 'inset 0 .5em 1.5em #0000001a,inset 0 .125em .5em #00000026'}}></div>


/* Hero */
/*const Hero = (props) => {
  const { image, description, urlButtonOnline, small } = props
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleClick = () => navigate(`${urlButtonOnline}`)
  
  return <div class="px-4 py-5 my-5 text-center">
      <img class="d-block mx-auto mb-4" src={image} />
      <h1 class="display-5 fw-bold">{t(small)}</h1>
      <div class="col-lg-6 mx-auto">
        <p class="lead m-4">{t(description)}</p>
        <div class="d-grip gap-2 d-sm-flex justify-content-sm-center">
          <a class="btn btn-primary btn-lg px-4 gap-3" href={urlButtonOnline}>{t('button_online')}</a>
        </div>
      </div>
    </div>
}*/


/* Carousel */
const Carousel = (props) => {
  const { id, gallery, images } = props
  const { t } = useTranslation()

  return <div id={`carousel${id}`} class="carousel slide">
    <div class="carousel-inner">
      {images.map((element, index) => {
        const caption = `${t('carousel_image')} ${index + 1}`
        return <div class={`carousel-item ${0 === index ? 'active' : ''}`}>
          <figure class="figure">
            <img src={`${gallery}${id}_${element}`} class="d-block img-fluid" alt={caption} />
            <figcaption class="figcaption">{caption}</figcaption>
          </figure>
        </div>
      }
      )}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target={`#carousel${id}`} data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">{t('carousel_previous')}</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target={`#carousel${id}`} data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">{t('carousel_next')}</span>
    </button>
  </div>
}


/* Accordion */
const AccordionItem = (props) => {
  const { id, parent, show = false, children } = props
  const { t } = useTranslation()

  return <div class="accordion-item">
    <h2 class="accordion-header">
      <button class={`accordion-button ${!show ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${id}`} aria-expanded="true" aria-controlls={`collapse${id}`}>{t(`accordion_header_${id}`)}</button>
    </h2>
    <div id={`collapse${id}`} class={`accordion-collapse collapse ${!!show ? 'show' : ''}`} data-bs-parent={`#${parent}`}>
      <div class="accordion-body">
        <div class="row">
          {children}
        </div>
      </div>
    </div>
  </div>
}


/* Howto */
const Howto = () => {
  const { t } = useTranslation()

  const gallery = 'https://raw.githubusercontent.com/wojtekl/www/refs/heads/main/images/'

  return <>
    <header>
      <div class=" text-bg-dark collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 col-md-7 py-4">
              <h4>{t('title_contact')}</h4>
              <p class="text-body-secondary">{t('description_contact')}</p>
            </div>
           <div class="col-sm-4 offset-md-1 py-4">
              <h4>{t('subtitle_contact')}</h4>
               <ul class="list-unstyled">
                <li>
                   <a href="mailto:wleap.zhulp@slmails.com" class="text-white">{t('link_emailus')}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center">
            <strong>{t('title_home')}</strong>
          </a>
          <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>
    <main>
      <div class="container">
        <h1 class="text-body-emphasis">{t('header_install')}</h1>
        <p class="fs-5 col-md-8 mb-5">{t('description_install')}</p>
        <hr class="col-3 col-md-2 mb-5"></hr>
        <div class="accordion" id="accordionExample">
          <AccordionItem id="iphone" parent="accordionExample" show={true}>
            <div class="col-md-10 col-sm-6">
              <strong>{t('accordion_intro_iphone')}</strong>
              <ul>
                <li>{t('accordion_contd1_iphone')}</li>
                <li>{t('accordion_contd2_iphone')}</li>
                <li>{t('accordion_contd3_iphone')}</li>
                <li>{t('accordion_contd4_iphone')}</li>
              </ul>
            </div>
            <div class="col-md-2 col-sm-6" data-bs-theme="dark">
              <Carousel id="iphone" gallery={gallery} images={['1.png', '2.png', '3.png', '4.png']} />
            </div>
          </AccordionItem>
          <AccordionItem id="android" parent="accordionExample">
            <div class="col-md-2 col-sm-6" data-bs-theme="dark">
              <Carousel id="android" gallery={gallery} images={['1.png', '2.png', '3.png', '4.png']} />
            </div>
            <div class="col-md-10 col-sm-6">
              <ul>
                <strong>{t('accordion_intro_android')}</strong>
                <li>{t('accordion_contd1_android')}</li>
                <li>{t('accordion_contd2_android')}</li>
                <li>{t('accordion_contd3_android')}</li>
                <li>{t('accordion_contd4_android')}</li>
              </ul>
            </div>
          </AccordionItem>
          <AccordionItem id="windows" parent="accordionExample">
            <div class="col-md-6 col-sm-6">
              <ul>
                <strong>{t('accordion_intro_windows')}</strong>
                <li>{t('accordion_contd1_windows')}</li>
                <li>{t('accordion_contd2_windows')}</li>
                <li>{t('accordion_contd3_windows')}</li>
                <li>{t('accordion_contd4_windows')}</li>
              </ul>
            </div>
            <div class="col-md-6 col-sm-6" data-bs-theme="dark">
              <Carousel id="windows" gallery={gallery} images={[`1.png`, '2.png', '3.png', '4.png']} />
            </div>
          </AccordionItem>
        </div>
      </div>
    </main>
    <footer class="text-body-secondary py-5">
      <div class="container">
        <p class="float-end mb-1">
          <a href="#">{t('button_backtotop')}</a>
        </p>
        <p class="mb-1">{t('description_copyright')}</p>
        <p class="mb-0"><a href="/">{t('button_home')}</a></p>
      </div>
    </footer>
  </>
}


/* Card */
/*const Card = (props) => {
  const { image, description, urlButtonOnline, urlButtonGet, small } = props
  const { t } = useTranslation()

  return <div class="col">
    <div class="card shadow-sm">
      <img src={image} style={{ padding: '3rem' }} alt={t(small)} />
      <div class="card-body">
        <p class="card-text">{t(description)}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a href={urlButtonOnline} class={`btn btn-sm btn-outline-secondary ${!urlButtonOnline ? "d-none" : ""}`} role="button">{t('button_online')}</a>
            <a href={urlButtonGet} class={`btn btn-sm btn-outline-secondary ${!urlButtonGet ? "d-none" : ""}`} role="button" rel="external">{t('button_get')}</a>
          </div>
          <small class="text-body-secondary">{t(small)}</small>
        </div>
      </div>
    </div>
  </div>
}*/


/* App */
const App = () => {
  const { t } = useTranslation()

  return <>
    <header>
      <div class=" text-bg-dark collapse" id="navbarToggleExternalContent" data-bs-theme="dark">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 col-md-7 py-4">
              <h4>{t('title_contact')}</h4>
              <p class="text-body-secondary">{t('description_contact')}</p>
            </div>
            <div class="col-sm-4 offset-md-1 py-4">
              <h4>{t('subtitle_contact')}</h4>
              <ul class="list-unstyled">
                <li>
                  <a href="mailto:wleap.zhulp@slmails.com" class="text-white">{t('link_emailus')}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center">
            <strong>{t('title_home')}</strong>
          </a>
          <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>

    <main>
      <h1 class="visually-hidden">{t('title_home')}</h1>
      <div class="container px-4 py-5" id="featured">
        <h2 class="pb-2 border-bottom">{t('title_featured')}</h2>
        <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <Feature 
            title="name_myparish" 
            paragraph="description_myparish" 
            url="https://parafia.wlap.pl/" 
            image="https://raw.githubusercontent.com/wojtekl/google-play/refs/heads/main/myparish/MojaParafia/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.webp" />
          <Feature 
            title="name_pricey" 
            paragraph="description_pricey" 
            url="https://cennik.wlap.pl/" 
            image="https://raw.githubusercontent.com/wojtekl/google-play/refs/heads/main/pricey/Pricey/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.webp" />
        </div>
      </div>
      <Divider />
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">{t('title_products')}</h1>
            <p class="lead text-body-secondary">{t('description_products')}</p>
            <p>
              <a href="/howto/" class="btn btn-primary my-2" role="button" rel="external">{t('button_howto')}</a>
              <a href="" class="btn btn-secondary my-2 d-none" role="button" rel="external">{t('')}</a>
            </p>
          </div>
        </div>
      </section>
    </main>

    <footer class="text-body-secondary py-5">
      <div class="container">
        <p class="float-end mb-1">
          <a href="#">{t('button_backtotop')}</a>
        </p>
        <p class="mb-1">{t('description_copyright')}</p>
        <p class="mb-0">{t('description_guide')}</p>
      </div>
    </footer>
  </>
}


/* RedirectSite */
const RedirectSite = () => {
  window.location.href = '/test.html'
  return <></>
}


const container = document.getElementById('root')

const root = createRoot(container)

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/howto" element={<Howto />} />
      <Route path="/test" element={<RedirectSite />} />
    </Routes>
  </Router>
)
