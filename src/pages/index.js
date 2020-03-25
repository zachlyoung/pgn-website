import React from "react"
 
import { graphql } from "gatsby"
import Image from "gatsby-image"
import BackgroundImage from "gatsby-background-image"
import SEO from "../components/seo"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagramSquare, faFacebookSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import "../styles/index.css"

// TODO: SEPARATE PAGES INTO COMPONENTS FOR BETTER READABILITY

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    // Sort the gallery array according to Contnetful indices
    let galleryArray = props.data.allContentfulGallery.edges;
    galleryArray.sort(function(a,b) {
      return a.index - b.index;
    });

    // Get brothers in leadership and put brothers into JSON in order to put them in buckets

    let brothersMap = {};
    let leadershipArray = [];
    for (let i = 0; i < props.data.allContentfulBrothers.edges.length; i++) {
      let greek = props.data.allContentfulBrothers.edges[i].node.greek.toUpperCase();
      if (props.data.allContentfulBrothers.edges[i].node.position)
      {
        leadershipArray.push(props.data.allContentfulBrothers.edges[i]);
      }
      if (!(greek in brothersMap))
      {
        brothersMap[greek] = [props.data.allContentfulBrothers.edges[i]];
      }
      else 
      {
        brothersMap[greek].push(props.data.allContentfulBrothers.edges[i]);
      }
    }

    // Format brothers in leadership to JSON object

    let leadershipClass = {};
    leadershipClass.category = "LEADERSHIP";
    leadershipClass.data = leadershipArray;

    // Place leadership JSON object in array

    let leadershipBuffer = [];
    leadershipBuffer.push(leadershipClass);

    // Format brothers to JSON object 
    let brothersArray = [];
    for (let key in brothersMap)
    {
      let greekClass = {};
      greekClass.category = key;
      greekClass.data = brothersMap[key];
      brothersArray.push(greekClass);
    }
    // Sort classes by greek alphabetical order
    let order = ["ALPHA","BETA","GAMMA","DELTA","EPSILON","ZETA","ETA","THETA","IOTA","KAPPA","LAMBDA","MU","NU","XI","OMICRON","PI","RHO","SIGMA","TAU","UPSILON","PHI","CHI","PSI","OMEGA"]
    brothersArray.sort(function(a,b) {
      return order.indexOf(b.category) - order.indexOf(a.category);
    })
    for (let i = 0; i < brothersArray.length; i++)
    {
      // Sort brothers alphabetically
      brothersArray[i].data.sort(function(a,b) {
        return a.node.name.toLowerCase().localeCompare(b.node.name.toLowerCase());
      });
    }
    // Concatenate brothers JSON objects by appending with leadership JSON object
    brothersArray = leadershipBuffer.concat(brothersArray);

    // Put careers into JSON in order to put them in buckets
    let careersMap = {};
    for (let i = 0; i < props.data.allContentfulCareers.edges.length; i++) {
      let sector = props.data.allContentfulCareers.edges[i].node.sector.toUpperCase();
      if (!(sector in careersMap))
      {
        careersMap[sector] = [props.data.allContentfulCareers.edges[i]];
      }
      else 
      {
        careersMap[sector].push(props.data.allContentfulCareers.edges[i]);
      }
    }

    // Format careers to JSON object to place into array
    let careersArray = [];
    for (let key in careersMap)
    {
      let sectorIndustry = {};
      sectorIndustry.sector = key;
      sectorIndustry.data = careersMap[key];
      careersArray.push(sectorIndustry);
    }
    // Sort career sectors alphabetically
    careersArray.sort(function(a,b) {
      return a.sector.toLowerCase().localeCompare(b.sector.toLowerCase());
    })
    for (let i = 0; i < careersArray.length; i++)
    {
      // Sort careers alphabetically
      careersArray[i].data.sort(function(a,b) {
        return a.node.name.toLowerCase().localeCompare(b.node.name.toLowerCase());
      });
    }

    // Get rush events and sort by start time
    let rushEventsArray = props.data.allContentfulEvents.edges;
    rushEventsArray.sort(function(a,b) {
      return a.node.startTime.localeCompare(b.node.startTime)
    })

    // Init state and bind handlers
    this.state = {
        topScreen: true,
        mobile: true,
        navbarExpand: false,
        data: props.data,
        galleryCount: Object.keys(props.data.allContentfulGallery.edges).length,
        galleryIndex: 0,
        galleryArray: galleryArray,
        brothersFilterIndex: 0,
        brothersArray: brothersArray,
        careersFilterIndex: 0,
        careersArray: careersArray,
        rushEvents: rushEventsArray,
    }
    this.handleToggle = this.handleToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleGalleryClick = this.handleGalleryClick.bind(this);
    this.handleBrothersFilter = this.handleBrothersFilter.bind(this);
    this.handleCareersFilter = this.handleCareersFilter.bind(this);
  }
  componentDidMount() {
    // Check mobile on mount
    this.updateMobile();
    // Add event listeners
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    // Remove event listeners when component unmounts
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleResize() {
    // Check mobile on resize
    this.updateMobile();
  }
  updateMobile() {
    // Check to see if the user has a window width of less than 1000 (mobile) or not
    let windowWidth = window.innerWidth;
    if (windowWidth < 1000 && !this.state.mobile) {
      this.setState({
        mobile: true,
      });
    }
    else if (windowWidth >= 1000 && this.state.mobile)
    {
      this.setState({
        mobile: false,
      });
    }
  }
  handleScroll() {
    // Get the distance of scroll to the top
    let scrollTop = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
    // Check to see if the user is at top of screen
    if (scrollTop > 5 && this.state.topScreen === true)
    {
      this.setState({
        topScreen: false,
      });
    }
    // Otherwise user has scrolled down
    else if (scrollTop <= 5 && this.state.topScreen === false)
    {
      this.setState({
        topScreen: true,
      });
    }
  }
  // Manage the state of the navbar toggle
  handleToggle()
  {
    this.setState({
      navbarExpand: !this.state.navbarExpand,
    });
  }
  handleGalleryClick(i)
  {

    // Get the current gallery Index
    let curr = this.state.galleryIndex;
    // If the user toggled left
    if (i)
    {
      // Wrap index to make sure it doesn't overflow
      if (curr === 0)
      {
        curr = this.state.galleryCount;
      }
      curr--;
    }
    // If the user toggled right
    else {
      // Wrap index to make sure it doesn't overflow
      curr++;
      if (curr === this.state.galleryCount)
      {
        curr = 0;
      }
    }
    this.setState({
      galleryIndex: curr
    });
  }
  // Set index to selected button to filter brothers
  handleBrothersFilter(i)
  {
    this.setState({
      brothersFilterIndex: i,
    });
  }
  // Set index to selected button to filter careers
  handleCareersFilter(i)
  {
    this.setState({
      careersFilterIndex: i,
    });
  }
  render() {
    return (
      <div>
        <SEO title="Home" />
        <nav className={(this.state.mobile || !this.state.topScreen) ? "navbar navbar--opaque" : "navbar navbar--transparent"}>
          <a href="http://www.phigammanu.com"> <Image className="navbar__logo" fixed={(this.state.mobile || !this.state.topScreen) ? this.state.data.logoBlack.childImageSharp.fixed : this.state.data.logoWhite.childImageSharp.fixed} alt="logo"/></a>
          <div className={(this.state.navbarExpand && this.state.mobile) ? "navbar__buttons navbar__buttons--expand" : "navbar__buttons"}>
            <a href="#about"><h4 className="navbar__link">ABOUT</h4></a>
            <a href="#gallery"><h4 className="navbar__link">GALLERY</h4></a>
            <a href="#brothers"><h4 className="navbar__link">BROTHERS</h4></a>
            <a href="#careers"><h4 className="navbar__link">CAREERS</h4></a>
            <a href="#contact"><h4 className="navbar__link">CONTACT</h4></a>
            <a href="#rush" className="navbar__rush-link"><h4 className="navbar__link">RUSH</h4></a>
            <a href="#rush" className="navbar__rush-button"><button className="navbar__button">RUSH</button></a>
          </div>
          <button className="navbar__toggle" onClick={this.handleToggle}>
            <div className="toggle__bar" id="top-bar"></div>
            <div className="toggle__bar" id="middle-bar"></div>
            <div className="toggle__bar" id="bottom-bar"></div>
          </button>
        </nav>
        <BackgroundImage fluid={['linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))', this.state.data.background.photo.fluid]} className="jumbotron">
          <div className="jumbotron__wrapper">
            <div className="jumbotron__details">
              <h1 className="jumbotron__header">{this.state.data.jumbotronHeader.value.value}</h1>
              <p className="jumbotron__desc">{this.state.data.jumbotronSubtitle.value.value}</p>
              <a href="#rush"><button className="jumbotron__button">Learn More</button></a>
            </div>
          </div>
        </BackgroundImage>
        <section className="content-section">
          <div className="content-section__anchor" id="about"></div>
          <div className="content-section__wrapper content-section__wrapper--row content-section__wrapper-left">
            <div className="content-section__detail">
              <h2 className="content-section__header">ABOUT</h2>
              <em className="content-section__emphasis mt-4">{this.state.data.aboutEmphasis.value.value}</em>
              <p className="content-section__desc mt-1">{this.state.data.aboutDescription.value.value}</p>
              <a href="http://www.phigammanu.com"><button className="content-section__button mt-2">VISIT WEBSITE</button></a>
            </div>
            <div className="content-section__main-wrapper">
              <Image className="content-section__image" fluid={this.state.data.aboutPhoto.photo.fluid} alt="logo"/>
            </div>
          </div>
        </section>
        <section className="content-section">
          <div className="content-section__anchor" id="gallery"></div>
          <div className="content-section__wrapper content-section__wrapper--row content-section__wrapper-right">
            <div className="content-section__main-wrapper">
              <button className="gallery-button" onClick={() => this.handleGalleryClick(true)}><FontAwesomeIcon icon={faChevronLeft} size="4x" /></button>
              <Image className="content-section__image mr-1 ml-1" fluid={this.state.galleryArray[this.state.galleryIndex].node.photo.fluid} alt="logo"/>
              <button className="gallery-button" onClick={() => this.handleGalleryClick(false)}><FontAwesomeIcon icon={faChevronRight} size="4x" /></button>
            </div>
            <div className="content-section__detail">
              <h2 className="content-section__header">GALLERY</h2>
              <p className="content-section__desc mt-4">{this.state.data.galleryDescription.value.value}</p>
            </div>
          </div>
        </section>
        <section className="content-section">
          <div className="content-section__anchor" id="brothers"></div>
          <div className="content-section__wrapper">
            <div className="content-section__detail content-section__detail--middle">
              <h2 className="content-section__header mb-4">BROTHERS</h2>
              <div className="filter-widget">
                <div className="filter-widget__buttons">
                  {this.state.brothersArray.map((obj, index) => {
                    return <button key={index} className={(index === this.state.brothersFilterIndex) ? "filter-widget__button filter-widget__button--active mb-1" : "filter-widget__button mb-1"} onClick={() => this.handleBrothersFilter(index)}>{obj.category}</button>
                  })}
                </div>
                <div className="filter-widget__cards">
                  {this.state.brothersArray[this.state.brothersFilterIndex].data.map((obj,index) => {
                    return (
                      <div key={index} className="filter-widget__card">
                        <Image className="card__photo card__photo--tall" fluid={obj.node.headshot.fluid} alt="logo"/>
                        <div className="card__details">
                          <div className="card__text mr-1">
                            <h5 className="card__name">{obj.node.name}</h5>
                            <h5 className="card__position">{obj.node.position}</h5>
                          </div>
                          <a className="icons__link" href={obj.node.linkedinUrl}><FontAwesomeIcon icon={faLinkedin} size="3x" /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section">
          <div className="content-section__anchor" id="careers"></div>
          <div className="content-section__wrapper">
            <div className="content-section__detail content-section__detail--middle">
              <h2 className="content-section__header mb-4">CAREERS</h2>
              <div className="filter-widget">
                <div className="filter-widget__buttons">
                  {this.state.careersArray.map((obj, index) => {
                    return <button key={index} className={(index === this.state.careersFilterIndex) ? "filter-widget__button filter-widget__button--active mb-1" : "filter-widget__button mb-1"} onClick={() => this.handleCareersFilter(index)}>{obj.sector}</button>
                  })}
                </div>
                <div className="filter-widget__cards">
                  {this.state.careersArray[this.state.careersFilterIndex].data.map((obj,index) => {
                    return (
                      <div key={index} className="filter-widget__card">
                        <Image className="card__photo card__photo--short" fluid={obj.node.photo.fluid} alt="logo"/>
                        <div className="card__details">
                          <h5 className="card__text mt-2 mb-2">{obj.node.name}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section">
          <div className="content-section__anchor" id="contact"></div>
          <div className="content-section__wrapper">
            <div className="content-section__detail content-section__detail--middle">
              <h2 className="content-section__header">CONTACT US</h2>
              <p className="content-section__desc content-section__desc--wrap mt-4 mb-4">{this.state.data.contactDescription.value.value}</p>
              <div className="icons">
                <a className="icons__link" href={this.state.data.instagramLink.value.value}><FontAwesomeIcon icon={faInstagramSquare} size="4x" /></a>
                <a className="icons__link mr-2 ml-2" href={this.state.data.facebookLink.value.value}><FontAwesomeIcon icon={faFacebookSquare} size="4x" /></a>
                <a className="icons__link" href={"mailto: " + this.state.data.email.value.value}><FontAwesomeIcon icon={faEnvelope} size="4x" /></a>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section">
          <div className="content-section__anchor" id="rush"></div>
          <div className="content-section__wrapper content-section__wrapper--row content-section__wrapper-right">
            <div className="content-section__main-wrapper">
              <div className="events">
                {this.state.rushEvents.map((obj,index) => {
                  let startTime = obj.node.startTime;
                  let month = parseInt(startTime.substring(5,7));
                  let day = parseInt(startTime.substring(8,10));
                  let hourBegin = parseInt(startTime.substring(11,13));
                  let minuteBegin = parseInt(startTime.substring(14,16));
                  let endTime = obj.node.endTime;
                  let hourEnd = parseInt(endTime.substring(11,13));
                  let minuteEnd = parseInt(endTime.substring(14,16));

                  return (
                    <div key={index} className="event mb-4">
                      <h3 className="event__title">{month}.{day} | {obj.node.title}</h3>
                      <h6 className="event__subtitle mt-1 mb-2">{(hourBegin === 0 || hourBegin === 12) ? '12' : (hourBegin % 12)}:{(minuteBegin < 10) ? ('0' + minuteBegin) : minuteBegin} {(hourBegin >= 12) ? 'PM' : 'AM'} - {(hourEnd === 0 || hourEnd === 12) ? '12' : (hourEnd % 12) % 12}:{(minuteEnd < 10) ? ('0' + minuteEnd) : minuteEnd} {(hourEnd >= 12) ? 'PM' : 'AM'} at {obj.node.location}</h6>
                      <p className="event__desc">{obj.node.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="content-section__detail">
              <h2 className="content-section__header">RUSH</h2>
              <p className="content-section__desc content-section__desc--wrap mt-4">{this.state.data.rushDescription.value.value}</p>
              <a href={this.state.data.rushLink.value.value}><button className="content-section__button mt-2">REGISTER</button></a>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export const query = graphql`
  {
    background: contentfulPhotos(title: {eq: "background"}) {
      ...contentfulPhotosFields
    }
    aboutPhoto: contentfulPhotos(title: {eq: "aboutPhoto"}) {
      ...contentfulPhotosFields
    }
    logoWhite: file(relativePath: {eq: "logo-white.png"}) {
      ...logoFields
    }
    logoBlack: file(relativePath: {eq: "logo-black.png"}) {
      ...logoFields
    }
    allContentfulGallery {
      edges {
        node {
          index
          photo {
            fluid {
              ...GatsbyContentfulFluid
            }
          }
        }
      }
    }
    allContentfulBrothers {
      edges {
        node {
          name
          greek
          position
          linkedinUrl
          headshot {
            fluid {
              ...GatsbyContentfulFluid
            }
          }
        }
      }
    }
    allContentfulCareers {
      edges {
        node {
          name
          sector
          photo {
            fluid {
              ...GatsbyContentfulFluid
            }
          }
        }
      }
    }
    allContentfulEvents {
      edges {
        node {
          title
          description
          startTime
          endTime
          location
        }
      }
    }
    jumbotronHeader: contentfulText(title:{eq: "jumbotronHeader"}) {
      value {
        value
      }
    }
    jumbotronSubtitle: contentfulText(title:{eq: "jumbotronSubtitle"}) {
      value {
        value
      }
    }
    aboutEmphasis: contentfulText(title:{eq: "aboutEmphasis"}) {
      value {
        value
      }
    }
    aboutDescription: contentfulText(title:{eq: "aboutDescription"}) {
      value {
        value
      }
    }
    galleryDescription: contentfulText(title:{eq: "galleryDescription"}) {
      value {
        value
      }
    }
    rushDescription: contentfulText(title:{eq: "rushDescription"}) {
      value {
        value
      }
    }
    rushLink: contentfulText(title:{eq: "rushLink"}) {
      value {
        value
      }
    }
    contactDescription: contentfulText(title:{eq: "contactDescription"}) {
      value {
        value
      }
    }
    instagramLink: contentfulText(title:{eq: "instagramLink"}) {
      value {
        value
      }
    }
    facebookLink: contentfulText(title:{eq: "facebookLink"}) {
      value {
        value
      }
    }
    email: contentfulText(title:{eq: "email"}) {
      value {
        value
      }
    }
  }
  
  fragment logoFields on File {
    childImageSharp {
      fixed(width: 40) {
        ...GatsbyImageSharpFixed
      }
    }
  }
  fragment contentfulPhotosFields on ContentfulPhotos {
    photo {
      fluid {
        ...GatsbyContentfulFluid
      }
    }
  }
`

export default IndexPage
