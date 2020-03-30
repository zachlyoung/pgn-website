import React from "react"
import Image from "gatsby-image"
import { StaticQuery, graphql } from "gatsby"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

class Gallery extends React.Component {
  constructor(props)
  {
    super(props);
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
    if (i)
    {
      // Wrap index to make sure it doesn't overflow
      if (curr === 0)
      {
        curr = this.galleryCount;
      }
      curr--;
    }
    // If the user toggled right
    else {
      // Wrap index to make sure it doesn't overflow
      curr++;
      if (curr === this.galleryCount)
      {
        curr = 0;
      }
    }
    this.setState({
      galleryIndex: curr
    });
  }
  renderGalleryComponent(data) {
    let galleryData = data.allContentfulGallery.edges;
    galleryData.sort(function(a,b) {
      return a.index - b.index;
    });
    this.galleryCount = Object.keys(galleryData).length;
    return (
      <div className="gallery-wrapper">
        <button className="gallery-button" onClick={() => this.handleGalleryClick(true)}><FontAwesomeIcon title="Left gallery Button" icon={faChevronLeft} size="4x" /></button>
        <Image loading="lazy" className="section__image mr-1 ml-1" fluid={galleryData[this.state.galleryIndex].node.photo.fluid} alt="logo"/>
        <button className="gallery-button" onClick={() => this.handleGalleryClick(false)}><FontAwesomeIcon title="Right gallery Button" icon={faChevronRight} size="4x" /></button>
      </div>
    )
  }

  render() {

    // Sort the gallery array according to Contentful indices

    return (
      <StaticQuery
        query={graphql`
          query {
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
          }
        `}
        render={(data) => this.renderGalleryComponent(data)}
      />
    );
  }
}

export default Gallery