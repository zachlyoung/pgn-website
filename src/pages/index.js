import React from "react"
 
import { graphql } from "gatsby"
import Image from "gatsby-image"
import BackgroundImage from "gatsby-background-image"
import SEO from "../components/seo"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagramSquare, faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import "../styles/index.css"

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        topScreen: true,
        mobile: true,
        navbarExpand: false,
    }
    this.handleToggle = this.handleToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    this.updateMobile();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleResize() {
    this.updateMobile();
  }
  updateMobile() {
    let windowWidth = window.innerWidth;
    if (windowWidth < 800 && !this.state.mobile) {
      this.setState({
        mobile: true,
      });
    }
    else if (windowWidth >= 800 && this.state.mobile)
    {
      this.setState({
        mobile: false,
      });
    }
  }
  handleScroll() {
    let scrollTop = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
    if (scrollTop > 5 && this.state.topScreen === true)
    {
      this.setState({
        topScreen: false,
      });
    }
    else if (scrollTop <= 5 && this.state.topScreen === false)
    {
      this.setState({
        topScreen: true,
      });
    }
  }
  handleToggle()
  {
    this.setState({
      navbarExpand: !this.state.navbarExpand,
    });
  }
  render() {
    const { data } = this.props;
    return (
      <div>
      <SEO title="Home" />
      <nav className={(this.state.mobile || !this.state.topScreen) ? "navbar navbar--opaque" : "navbar navbar--transparent"}>
        <a href="www.phigammanu.com"><Image className="navbar__logo" fixed={(this.state.mobile || !this.state.topScreen) ? data.logoBlack.childImageSharp.fixed : data.logoWhite.childImageSharp.fixed} alt=""/></a>
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
      <BackgroundImage fluid={['linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))', data.contentfulPhotos.photo.fluid]} className="jumbotron">
        <div className="jumbotron__wrapper">
          <h1 className="jumbotron__header">Rush Phi Gamma Nu this Fall</h1>
          <p className="jumbotron__desc">We are a co-ed professional business fraternity at Washington University in St. Louis open to all majors and schools.</p>
          <a href="#rush"><button className="jumbotron__button">Learn More</button></a>
        </div>
      </BackgroundImage>
      <section className="content-section">
        <div className="content-section__anchor" id="about"></div>
      </section>
      <section className="content-section">
        <div className="content-section__anchor" id="gallery"></div>
      </section>
      <section className="content-section">
        <div className="content-section__anchor" id="brothers"></div>
      </section>
      <section className="content-section">
        <div className="content-section__anchor" id="careers"></div>
      </section>
      <section className="content-section">
        <div className="content-section__anchor" id="contact"></div>
        <div className="content-section__wrapper">
          <h2 className="content-section__header">Contact Us</h2>
          <p className="content-section__desc">Check us out on social media! Please reach out to our email with any questions or concerns.</p>
          <div className="icons">
            <a className="icons__link" href="https://instagram.com/wustlpgn?igshid=1pf6ghfj04xj4"><FontAwesomeIcon icon={faInstagramSquare} size="4x" /></a>
            <a className="icons__link" href="https://www.facebook.com/wustlpgn/"><FontAwesomeIcon icon={faFacebookSquare} size="4x" /></a>
            <a className="icons__link" href="mailto: phigammanuwustl@gmail.com"><FontAwesomeIcon icon={faEnvelope} size="4x" /></a>
          </div>
        </div>
      </section>
      <section className="content-section">
        <div className="content-section__anchor" id="rush"></div>
      </section>
    </div>
    );
  }
}

export const query = graphql`
  {
    contentfulPhotos(title: {eq: "Background"}) {
      photo {
        fluid {
          ...GatsbyContentfulFluid
        }
      }
    }
    logoWhite: file(relativePath: {eq: "logo-white.png"}) {
      ...logoFields
    }
    logoBlack: file(relativePath: {eq: "logo-black.png"}) {
      ...logoFields
    }
  }
  
  fragment logoFields on File {
    childImageSharp {
      fixed(width: 40) {
        ...GatsbyImageSharpFixed
      }
    }
  }  
`

export default IndexPage
