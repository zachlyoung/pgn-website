import React from "react"
import Image from "gatsby-image"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

class Filter extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      filterIndex: 0
    }
    
  }
  handleFilter(i)
  {
    this.setState({
      filterIndex: i,
    });
  }
  render() {
    const data = this.props.data;
    const type = this.props.type;
    return (
      <div className="filter-widget">
        <div className="filter-widget__buttons">
          {data.map((obj, index) => {
            return <button key={index} className={(index === this.state.filterIndex) ? "filter-widget__button filter-widget__button--active mb-1" : "filter-widget__button mb-1"} onClick={() => this.handleFilter(index)}>{obj.category}</button>
          })}
        </div>
        <div className="filter-widget__cards">
          {data[this.state.filterIndex].data.map((obj,index) => {
            return (
              <div key={index} className="filter-widget__card">
                <Image className={(type === "brothers") ? "card__photo card__photo--tall" : "card__photo card__photo--short"} fluid={(type === "brothers") ? obj.node.headshot.fluid : obj.node.photo.fluid} alt="logo"/>
                <div className="card__details">
                  <div className="card__text mr-1">
                    <h5 className="card__name">{obj.node.name}</h5>
                    {(type === "brothers") ? <h5 className="card__position">{obj.node.position}</h5> : null }
                  </div>
                  {(type === "brothers") ? <a className="icons-link" href={obj.node.linkedinUrl}><FontAwesomeIcon title="Linkedin" icon={faLinkedin} size="3x" /></a> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Filter
