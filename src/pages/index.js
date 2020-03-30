import React from "react"
 
import { graphql } from "gatsby"
import Image from "gatsby-image"
import BackgroundImage from "gatsby-background-image"
import SEO from "../components/seo"
import Navbar from "../components/navbar"
import Filter from "../components/filter"
import Gallery from "../components/gallery"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagramSquare, faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import "../styles/index.css"

// TODO: CSS REWORK

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    // Init state and bind handlers
    this.state = {
        galleryIndex: 0,
    }
    this.handleGalleryClick = this.handleGalleryClick.bind(this);
  }
  handleGalleryClick(i)
  {

    // Get the current gallery Index
    let curr = this.state.galleryIndex;
    // If the user toggled left
    let galleryCount = Object.keys(this.props.data.allContentfulGallery.edges).length;
    if (i)
    {
      // Wrap index to make sure it doesn't overflow
      if (curr === 0)
      {
        curr = galleryCount;
      }
      curr--;
    }
    // If the user toggled right
    else {
      // Wrap index to make sure it doesn't overflow
      curr++;
      if (curr === galleryCount)
      {
        curr = 0;
      }
    }
    this.setState({
      galleryIndex: curr
    });
  }
  getBrothersData()
  {
    const data = this.props.data;

    // Get brothers in leadership and put brothers into JSON in order to put them in buckets
    let brothersMap = {};
    let leadershipData = [];
    for (let i = 0; i < data.allContentfulBrothers.edges.length; i++) {
      let category = data.allContentfulBrothers.edges[i].node.greek.toUpperCase();
      if (data.allContentfulBrothers.edges[i].node.position)
      {
        leadershipData.push(data.allContentfulBrothers.edges[i]);
      }
      if (!(category in brothersMap))
      {
        brothersMap[category] = [data.allContentfulBrothers.edges[i]];
      }
      else 
      {
        brothersMap[category].push(data.allContentfulBrothers.edges[i]);
      }
    }

    // Format brothers in leadership to JSON object
    let leadershipMap = {};
    leadershipMap.category = "LEADERSHIP";
    leadershipMap.data = leadershipData;

    // Place leadership JSON object in array
    let leadershipBuffer = [];
    leadershipBuffer.push(leadershipMap);

    // Format brothers to JSON object to place into array
    let brothersData = [];
    for (let key in brothersMap)
    {
      let categoryMap = {};
      categoryMap.category = key;
      categoryMap.data = brothersMap[key];
      brothersData.push(categoryMap);
    }
    // Sort classes by greek alphabetical order
    let order = ["ALPHA","BETA","GAMMA","DELTA","EPSILON","ZETA","ETA","THETA","IOTA","KAPPA","LAMBDA","MU","NU","XI","OMICRON","PI","RHO","SIGMA","TAU","UPSILON","PHI","CHI","PSI","OMEGA"]
    brothersData.sort(function(a,b) {
      return order.indexOf(a.category) - order.indexOf(b.category);
    })
    for (let i = 0; i < brothersData.length; i++)
    {
      // Sort brothers alphabetically
      brothersData[i].data.sort(function(a,b) {
        return a.node.name.toLowerCase().localeCompare(b.node.name.toLowerCase());
      });
    }

    // Concatenate brothers JSON objects by appending with leadership JSON object
    brothersData = leadershipBuffer.concat(brothersData);
    return brothersData;
  }
  getCareersData()
  {
    const data = this.props.data

    // Put careers into JSON in order to put them in buckets
    let careersMap = {};
    for (let i = 0; i < data.allContentfulCareers.edges.length; i++) {
      let category = data.allContentfulCareers.edges[i].node.sector.toUpperCase();
      if (!(category in careersMap))
      {
        careersMap[category] = [data.allContentfulCareers.edges[i]];
      }
      else 
      {
        careersMap[category].push(data.allContentfulCareers.edges[i]);
      }
    }
    console.log(careersMap);

    // Format careers to JSON object to place into array
    let careersData = [];
    for (let key in careersMap)
    {
      let categoryMap = {};
      categoryMap.category = key;
      categoryMap.data = careersMap[key];
      careersData.push(categoryMap);
    }
    // Sort career sectors alphabetically
    careersData.sort(function(a,b) {
      return a.category.toLowerCase().localeCompare(b.category.toLowerCase());
    })
    for (let i = 0; i < careersData.length; i++)
    {
      // Sort careers alphabetically
      careersData[i].data.sort(function(a,b) {
        return a.node.name.toLowerCase().localeCompare(b.node.name.toLowerCase());
      });
    }
    return careersData;
  }

  render() {
    const data = this.props.data;

    let brothersData = this.getBrothersData();
    let careersData = this.getCareersData();

    // Get rush events and sort by start time
    let rushEventsData = data.allContentfulEvents.edges;
    rushEventsData.sort(function(a,b) {
      return a.node.startTime.localeCompare(b.node.startTime)
    })

    return (
      <div>
        <SEO title="Home" />
        <Navbar />
        <BackgroundImage loading="lazy" fluid={['linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))', data.background.photo.fluid]} className="jumbotron">
          <div className="jumbotron__wrapper">
            <div className="jumbotron__detail">
              <h1 className="jumbotron__header">{data.jumbotronHeader.value.value}</h1>
              <p className="jumbotron__desc">{data.jumbotronSubtitle.value.value}</p>
              <a href="#rush"><button className="jumbotron__button">Learn More</button></a>
            </div>
          </div>
        </BackgroundImage>
        <section className="section-wrapper">
          <div className="section-wrapper__anchor" id="about"></div>
          <div className="section section--row section-left">
            <div className="section__detail">
              <h2 className="section__header">ABOUT</h2>
              <em className="section__emphasis mt-4">{data.aboutEmphasis.value.value}</em>
              <p className="section__desc mt-1">{data.aboutDescription.value.value}</p>
              <a href="http://www.phigammanu.com"><button className="section__button mt-2">VISIT WEBSITE</button></a>
            </div>
            <div className="section__main">
              <Image loading="lazy" className="section__image" fluid={data.aboutPhoto.photo.fluid} alt="logo"/>
            </div>
          </div>
        </section>
        <section className="section-wrapper">
          <div className="section-wrapper__anchor" id="gallery"></div>
          <div className="section section--row section-right">
            <div className="section__main">
              <Gallery />
            </div>
            <div className="section__detail">
              <h2 className="section__header">GALLERY</h2>
              <p className="section__desc mt-4">{data.galleryDescription.value.value}</p>
            </div>
          </div>
        </section>
        <section className="section-wrapper">
          <div className="section-wrapper__anchor" id="brothers"></div>
          <div className="section">
            <div className="section__detail section__detail--middle">
              <h2 className="section__header mb-4">BROTHERS</h2>
              <Filter data={brothersData} type="brothers"/>
            </div>
          </div>
        </section>
        <section className="section-wrapper">
          <div className="section-wrapper__anchor" id="careers"></div>
          <div className="section">
            <div className="section__detail section__detail--middle">
              <h2 className="section__header mb-4">CAREERS</h2>
              <Filter data={careersData} type="careers" />
            </div>
          </div>
        </section>
        <section className="section-wrapper">
          <div className="section-wrapper__anchor" id="contact"></div>
          <div className="section">
            <div className="section__detail section__detail--middle">
              <h2 className="section__header">CONTACT US</h2>
              <p className="section__desc section__desc--wrap mt-4 mb-4">{data.contactDescription.value.value}</p>
              <div className="icons-wrapper">
                <a className="icons-link" href={data.instagramLink.value.value}><FontAwesomeIcon title="Instagram" icon={faInstagramSquare} size="4x" /></a>
                <a className="icons-link mr-2 ml-2" href={data.facebookLink.value.value}><FontAwesomeIcon title="Facebook" icon={faFacebookSquare} size="4x" /></a>
                <a className="icons-link" href={"mailto: " + data.email.value.value}><FontAwesomeIcon title="E-mail" icon={faEnvelope} size="4x" /></a>
              </div>
            </div>
          </div>
        </section>
        <section className="section-wrapper">
          <div className="section-wrapper__anchor" id="rush"></div>
          <div className="section section--row section-right">
            <div className="section__main">
              <div className="events-wrapper">
                {rushEventsData.map((obj,index) => {
                  let startTime = obj.node.startTime;
                  let month = parseInt(startTime.substring(5,7));
                  let day = parseInt(startTime.substring(8,10));
                  let hourBegin = parseInt(startTime.substring(11,13));
                  let minuteBegin = parseInt(startTime.substring(14,16));
                  let endTime = obj.node.endTime;
                  let hourEnd = parseInt(endTime.substring(11,13));
                  let minuteEnd = parseInt(endTime.substring(14,16));

                  return (
                    <div key={index} className="event mb-2">
                      <h3 className="event__title">{month}.{day} | {obj.node.title}</h3>
                      <h6 className="event__subtitle mt-1 mb-1">{(hourBegin === 0 || hourBegin === 12) ? '12' : (hourBegin % 12)}:{(minuteBegin < 10) ? ('0' + minuteBegin) : minuteBegin} {(hourBegin >= 12) ? 'PM' : 'AM'} - {(hourEnd === 0 || hourEnd === 12) ? '12' : (hourEnd % 12) % 12}:{(minuteEnd < 10) ? ('0' + minuteEnd) : minuteEnd} {(hourEnd >= 12) ? 'PM' : 'AM'} at {obj.node.location}</h6>
                      <p className="event__desc">{obj.node.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="section__detail">
              <h2 className="section__header">RUSH</h2>
              <p className="section__desc section__desc--wrap mt-4">{data.rushDescription.value.value}</p>
              <a href={data.rushLink.value.value}><button className="section__button mt-2">REGISTER</button></a>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export const query = graphql`
  query {
    background: contentfulPhotos(title: {eq: "background"}) {
      ...contentfulPhotosFields
    }
    aboutPhoto: contentfulPhotos(title: {eq: "aboutPhoto"}) {
      ...contentfulPhotosFields
    }
    allContentfulBrothers {
      edges {
        node {
          name
          greek
          position
          linkedinUrl
          headshot {
            fluid (maxWidth: 350) {
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
            fluid (maxWidth: 350) {
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
  
  fragment contentfulPhotosFields on ContentfulPhotos {
    photo {
      fluid (maxWidth: 1920) {
        ...GatsbyContentfulFluid
      }
    }
  }
`

export default IndexPage
