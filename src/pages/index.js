import React from "react"
 
import Image from "gatsby-image"
import BackgroundImage from "gatsby-background-image"
import SEO from "../components/seo"

import "../styles/index.css"

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        navbarTransparent: true,
    }
    this.handleToggle = this.handleToggle.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll(e) {
    let scrollTop = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
    if (scrollTop > 550 && this.state.navbarTransparent === true)
    {
      this.setState({
        navbarTransparent: false,
      })
    } else if (scrollTop <= 550 && this.state.navbarTransparent === false)
    {
      this.setState({
        navbarTransparent: true,
      })
    }
  }
  handleToggle()
  {
    console.log("woah");
  }
  render() {
    const { data } = this.props;
    return (
      <div>
      <SEO title="Home" />
      <nav className={this.state.navbarTransparent ? "navbar navbar--transparent" : "navbar navbar--opaque"}>
        <a href="www.phigammanu.com"><Image className="navbar__logo" fixed={this.state.navbarTransparent ? data.logoWhite.childImageSharp.fixed : data.logoBlack.childImageSharp.fixed} alt=""/></a>
        <div className="navbar__buttons">
          <a href="#about"><h4 className="navbar__link">ABOUT</h4></a>
          <a href="#gallery"><h4 className="navbar__link">GALLERY</h4></a>
          <a href="#brothers"><h4 className="navbar__link">BROTHERS</h4></a>
          <a href="#careers"><h4 className="navbar__link">CAREERS</h4></a>
          <a href="#contact"><h4 className="navbar__link">CONTACT</h4></a>
          <a href="#rush"><button className="navbar__button">RUSH</button></a>
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
          <button className="jumbotron__button">Learn More</button>
        </div>
      </BackgroundImage>
      <section id="rush">
      </section>
      <section id="about">
      </section>
      <section id="gallery">
      </section>
      <section id="brothers">
      </section>
      <section id="careers">
      </section>
      <section id="contact">
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
