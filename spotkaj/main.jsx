import * as bootstrap from 'bootstrap'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'


const lang = getUrlParam('lang') ?? navigator.language.substring(0, 2).toLocaleLowerCase()

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
    <div class="container">
            <header class="border-bottom lh-1 py-3">
                <div class="row flex-nowrap justify-content-between align-items-center">
                    <div class="col-4 pt-1">
                        <a class="link-secondary" href="#">Subscribe</a>
                    </div>
                    <div class="col-4 text-center">
                        <a class="blog-header-logo text-body-emphasis text-decoration-none" href="#">Large</a>
                    </div>
                    <div class="col-4 d-flex justify-content-end align-items-center">
                        <a class="link-secondary" href="#" aria-label="Search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="mx-3" role="img" viewBox="0 0 24 24">
                                <title>Search</title>
                                <circle cx="10.5" cy="10.5" r="7.5"></circle>
                                <path d="M21 21l-5.2-5.2"></path>
                            </svg>
                        </a>
                        <a class="btn btn-sm btn-outline-secondary" href="#">Sign up</a>
                    </div>
                </div>
            </header>
            <div class="nav-scroller py-1 mb-3 border-bottom">
                <nav class="nav nav-underline justify-content-between">
                    <a class="nav-item nav-link link-body-emphasis active" href="#">World</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">U.S.</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Technology</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Design</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Culture</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Business</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Politics</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Opinion</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Science</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Health</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Style</a>
                    <a class="nav-item nav-link link-body-emphasis" href="#">Travel</a>
                </nav>
            </div>
        </div>
        <main class="container">
            <div class="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
                <div class="col-lg-6 px-0">
                    <h1 class="display-4 fst-italic">Title of a longer featured blog post</h1>
                    <p class="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what’s most interesting in this post’s contents.</p>
                    <p class="lead mb-0">
                        <a href="#" class="text-body-emphasis fw-bold">Continue reading...</a>
                    </p>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-6">
                    <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                        <div class="col p-4 d-flex flex-column position-static">
                            <strong class="d-inline-block mb-2 text-primary-emphasis">World</strong>
                            <h3 class="mb-0">Featured post</h3>
                            <div class="mb-1 text-body-secondary">Nov 12</div>
                            <p class="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                            <a href="#" class="icon-link gap-1 icon-link-hover stretched-link">
                                Continue reading

                                <svg class="bi" aria-hidden="true">
                                    <use xlink:href="#chevron-right"></use>
                                </svg>
                            </a>
                        </div>
                        <div class="col-auto d-none d-lg-block">
                            <svg aria-label="Placeholder: Thumbnail" class="bd-placeholder-img " height="250" preserveAspectRatio="xMidYMid slice" role="img" width="200" xmlns="http://www.w3.org/2000/svg">
                                <title>Placeholder</title>
                                <rect width="100%" height="100%" fill="#55595c"></rect>
                                <text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                        <div class="col p-4 d-flex flex-column position-static">
                            <strong class="d-inline-block mb-2 text-success-emphasis">Design</strong>
                            <h3 class="mb-0">Post title</h3>
                            <div class="mb-1 text-body-secondary">Nov 11</div>
                            <p class="mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                            <a href="#" class="icon-link gap-1 icon-link-hover stretched-link">
                                Continue reading

                                <svg class="bi" aria-hidden="true">
                                    <use xlink:href="#chevron-right"></use>
                                </svg>
                            </a>
                        </div>
                        <div class="col-auto d-none d-lg-block">
                            <svg aria-label="Placeholder: Thumbnail" class="bd-placeholder-img " height="250" preserveAspectRatio="xMidYMid slice" role="img" width="200" xmlns="http://www.w3.org/2000/svg">
                                <title>Placeholder</title>
                                <rect width="100%" height="100%" fill="#55595c"></rect>
                                <text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-5">
                <div class="col-md-8">
                    <h3 class="pb-4 mb-4 fst-italic border-bottom">From the Firehose
</h3>
                    <article class="blog-post">
                        <h2 class="display-5 link-body-emphasis mb-1">Sample blog post</h2>
                        <p class="blog-post-meta">
                            January 1, 2021 by <a href="#">Mark</a>
                        </p>
                        <p>This blog post shows a few different types of content that’s supported and styled with Bootstrap. Basic typography, lists, tables, images, code, and more are all supported as expected.</p>
                        <hr>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <h2>Blockquotes</h2>
                        <p>This is an example blockquote in action:</p>
                        <blockquote class="blockquote">
                            <p>Quoted text goes here.</p>
                        </blockquote>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <h3>Example lists</h3>
                        <p>This is some additional paragraph placeholder content. It's a slightly shorter version of the other highly repetitive body text used throughout. This is an example unordered list:</p>
                        <ul>
                            <li>First list item</li>
                            <li>Second list item with a longer description</li>
                            <li>Third list item to close it out</li>
                        </ul>
                        <p>And this is an ordered list:</p>
                        <ol>
                            <li>First list item</li>
                            <li>Second list item with a longer description</li>
                            <li>Third list item to close it out</li>
                        </ol>
                        <p>And this is a definition list:</p>
                        <dl>
                            <dt>HyperText Markup Language (HTML)</dt>
                            <dd>The language used to describe and define the content of a Web page</dd>
                            <dt>Cascading Style Sheets (CSS)</dt>
                            <dd>Used to describe the appearance of Web content</dd>
                            <dt>JavaScript (JS)</dt>
                            <dd>The programming language used to build advanced Web sites and applications</dd>
                        </dl>
                        <h2>Inline HTML elements</h2>
                        <p>
                            HTML defines a long list of available inline tags, a complete list of which can be found on the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">Mozilla Developer Network</a>
                            .
                        </p>
                        <ul>
                            <li>
                                <strong>To bold text</strong>
                                , use <code class="language-plaintext highlighter-rouge">&lt;strong &gt;</code>
                                .
                            </li>
                            <li>
                                <em>To italicize text</em>
                                , use <code class="language-plaintext highlighter-rouge">&lt;em &gt;</code>
                                .
                            </li>
                            <li>
                                Abbreviations, like <abbr title="HyperText Markup Language">HTML</abbr>
                                should use <code class="language-plaintext highlighter-rouge">&lt;abbr &gt;</code>
                                , with an optional <code class="language-plaintext highlighter-rouge">title</code>
                                attribute for the full phrase.
                            </li>
                            <li>
                                Citations, like <cite>— Mark Otto</cite>
                                , should use <code class="language-plaintext highlighter-rouge">&lt;cite &gt;</code>
                                .
                            </li>
                            <li>
                                <del>Deleted</del>
                                text should use <code class="language-plaintext highlighter-rouge">&lt;del &gt;</code>
                                and <ins>inserted</ins>
                                text should use <code class="language-plaintext highlighter-rouge">&lt;ins &gt;</code>
                                .
                            </li>
                            <li>
                                Superscript <sup>text</sup>
                                uses <code class="language-plaintext highlighter-rouge">&lt;sup &gt;</code>
                                and subscript <sub>text</sub>
                                uses <code class="language-plaintext highlighter-rouge">&lt;sub &gt;</code>
                                .
                            </li>
                        </ul>
                        <p>Most of these elements are styled by browsers with few modifications on our part.</p>
                        <h2>Heading</h2>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <h3>Sub-heading</h3>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <pre>
                            <code>Example code block</code>
                        </pre>
                        <p>This is some additional paragraph placeholder content. It's a slightly shorter version of the other highly repetitive body text used throughout.</p>
                    </article>
                    <article class="blog-post">
                        <h2 class="display-5 link-body-emphasis mb-1">Another blog post</h2>
                        <p class="blog-post-meta">
                            December 23, 2020 by <a href="#">Jacob</a>
                        </p>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <blockquote>
                            <p>
                                Longer quote goes here, maybe with some <strong>emphasized text</strong>
                                in the middle of it.
                            </p>
                        </blockquote>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <h3>Example table</h3>
                        <p>And don't forget about tables in these posts:</p>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Upvotes</th>
                                    <th>Downvotes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Alice</td>
                                    <td>10</td>
                                    <td>11</td>
                                </tr>
                                <tr>
                                    <td>Bob</td>
                                    <td>4</td>
                                    <td>3</td>
                                </tr>
                                <tr>
                                    <td>Charlie</td>
                                    <td>7</td>
                                    <td>9</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Totals</td>
                                    <td>21</td>
                                    <td>23</td>
                                </tr>
                            </tfoot>
                        </table>
                        <p>This is some additional paragraph placeholder content. It's a slightly shorter version of the other highly repetitive body text used throughout.</p>
                    </article>
                    <article class="blog-post">
                        <h2 class="display-5 link-body-emphasis mb-1">New feature</h2>
                        <p class="blog-post-meta">
                            December 14, 2020 by <a href="#">Chris</a>
                        </p>
                        <p>This is some additional paragraph placeholder content. It has been written to fill the available space and show how a longer snippet of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.</p>
                        <ul>
                            <li>First list item</li>
                            <li>Second list item with a longer description</li>
                            <li>Third list item to close it out</li>
                        </ul>
                        <p>This is some additional paragraph placeholder content. It's a slightly shorter version of the other highly repetitive body text used throughout.</p>
                    </article>
                    <nav class="blog-pagination" aria-label="Pagination">
                        <a class="btn btn-outline-primary rounded-pill" href="#">Older</a>
                        <a class="btn btn-outline-secondary rounded-pill disabled" aria-disabled="true">Newer</a>
                    </nav>
                </div>
                <div class="col-md-4">
                    <div class="position-sticky" style="top: 2rem;">
                        <div class="p-4 mb-3 bg-body-tertiary rounded">
                            <h4 class="fst-italic">About</h4>
                            <p class="mb-0">Customize this section to tell your visitors a little bit about your publication, writers, content, or something else entirely. Totally up to you.</p>
                        </div>
                        <div>
                            <h4 class="fst-italic">Recent posts</h4>
                            <ul class="list-unstyled">
                                <li>
                                    <a class="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href="#">
                                        <svg aria-hidden="true" class="bd-placeholder-img " height="96" preserveAspectRatio="xMidYMid slice" width="100%" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="100%" height="100%" fill="#777"></rect>
                                        </svg>
                                        <div class="col-lg-8">
                                            <h6 class="mb-0">Example blog post title</h6>
                                            <small class="text-body-secondary">January 15, 2024</small>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a class="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href="#">
                                        <svg aria-hidden="true" class="bd-placeholder-img " height="96" preserveAspectRatio="xMidYMid slice" width="100%" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="100%" height="100%" fill="#777"></rect>
                                        </svg>
                                        <div class="col-lg-8">
                                            <h6 class="mb-0">This is another blog post title</h6>
                                            <small class="text-body-secondary">January 14, 2024</small>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a class="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top" href="#">
                                        <svg aria-hidden="true" class="bd-placeholder-img " height="96" preserveAspectRatio="xMidYMid slice" width="100%" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="100%" height="100%" fill="#777"></rect>
                                        </svg>
                                        <div class="col-lg-8">
                                            <h6 class="mb-0">Longer blog post title: This one has multiple lines!</h6>
                                            <small class="text-body-secondary">January 13, 2024</small>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="p-4">
                            <h4 class="fst-italic">Archives</h4>
                            <ol class="list-unstyled mb-0">
                                <li>
                                    <a href="#">March 2021</a>
                                </li>
                                <li>
                                    <a href="#">February 2021</a>
                                </li>
                                <li>
                                    <a href="#">January 2021</a>
                                </li>
                                <li>
                                    <a href="#">December 2020</a>
                                </li>
                                <li>
                                    <a href="#">November 2020</a>
                                </li>
                                <li>
                                    <a href="#">October 2020</a>
                                </li>
                                <li>
                                    <a href="#">September 2020</a>
                                </li>
                                <li>
                                    <a href="#">August 2020</a>
                                </li>
                                <li>
                                    <a href="#">July 2020</a>
                                </li>
                                <li>
                                    <a href="#">June 2020</a>
                                </li>
                                <li>
                                    <a href="#">May 2020</a>
                                </li>
                                <li>
                                    <a href="#">April 2020</a>
                                </li>
                            </ol>
                        </div>
                        <div class="p-4">
                            <h4 class="fst-italic">Elsewhere</h4>
                            <ol class="list-unstyled">
                                <li>
                                    <a href="#">GitHub</a>
                                </li>
                                <li>
                                    <a href="#">Social</a>
                                </li>
                                <li>
                                    <a href="#">Facebook</a>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <footer class="py-5 text-center text-body-secondary bg-body-tertiary">
            <p>
                Blog template built for <a href="https://getbootstrap.com/">Bootstrap</a>
                by <a href="https://x.com/mdo">@mdo</a>
                .
            </p>
            <p class="mb-0">
                <a href="#">Back to top</a>
            </p>
        </footer>
  </>
}


const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/howto" element={<Howto />} />
    </Routes>
  </Router>
)
