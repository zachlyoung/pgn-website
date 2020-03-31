import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

class Navbar extends React.Component {
  constructor(props) {
    super(props)
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
  handleToggle()
  {
    if (this.state.mobile) {
      this.setState({
        navbarExpand: !this.state.navbarExpand,
      });
    }
  }
  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            logoWhite: file(relativePath: { eq: "logo-white.png" }) {
              ...logoFields
            }
            logoBlack: file(relativePath: { eq: "logo-black.png" }) {
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
        `}
        render={(data) => (
          <nav className={(this.state.mobile || !this.state.topScreen) ? "navbar navbar--opaque" : "navbar navbar--transparent"}>
            <a href="http://www.phigammanu.com"> <Image className="navbar__logo" fixed={(this.state.mobile || !this.state.topScreen) ? data.logoBlack.childImageSharp.fixed : data.logoWhite.childImageSharp.fixed} alt="Logo"/></a>
            <div className={(this.state.navbarExpand && this.state.mobile) ? "navbar__buttons navbar__buttons--expand" : "navbar__buttons"}>
              <a href="#about" onClick={this.handleToggle}><h4 className="navbar__link">ABOUT</h4></a>
              <a href="#gallery" onClick={this.handleToggle}><h4 className="navbar__link">GALLERY</h4></a>
              <a href="#brothers" onClick={this.handleToggle}><h4 className="navbar__link">BROTHERS</h4></a>
              <a href="#careers" onClick={this.handleToggle}><h4 className="navbar__link">CAREERS</h4></a>
              <a href="#contact" onClick={this.handleToggle}><h4 className="navbar__link">CONTACT</h4></a>
              <a href="#rush" className="navbar__rush-link" onClick={this.handleToggle}><h4 className="navbar__link">RUSH</h4></a>
              <a href="#rush" className="navbar__rush-button"><button className="navbar__button">RUSH</button></a>
            </div>
            <button title="Navigation bar toggle" className="navbar__toggle" onClick={this.handleToggle}>
              <div className="toggle__bar" id="top-bar"></div>
              <div className="toggle__bar" id="middle-bar"></div>
              <div className="toggle__bar" id="bottom-bar"></div>
            </button>
          </nav>
        )}
      />
    )
  }
}

export default Navbar
