import React, { Component } from "react";
import API from "../../../utils/api";
import isEmpty from "../../../validation/is-empty";

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutInfo: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getAbout();
  }

  getAbout = () => {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      API.get(`/api/GET/about`)
        .then(res => {
          const aboutInfo = res.data;
          this.setState({
            errors: {},
            aboutInfo,
            loading: false
          });
        })
        .catch(err => console.log(err));
    }, 2000);
  };

  render() {
    const { aboutInfo, loading } = this.state;
    let spinner;

    if (loading === true) {
      spinner = (
        <div className="col-md-12 text-center mt-5 mb-5">
          <h1 className="">
            Loading <i className="fas fa-spinner fa-pulse" />
          </h1>
        </div>
      );
    } else {
      spinner = null;
    }
    let listAbout;
    if (!isEmpty(aboutInfo)) {
      listAbout = aboutInfo.map(a => (
        <div className="col-md-12 pt-5 pb-5" key={a._id}>
          <img
            src={a.imgsrc}
            className="img-fluid d-block mx-auto abt-img mt-2 mb-2 rounded-circle"
            alt={a.imgsrc}
          />
          <h1 className=" text-center">{a.name.toUpperCase()}</h1>
          <div className="text-center">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={a.github}
              className="btn btn-primary mr-1"
            >
              <i className="fab fa-github" /> GitHub
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={a.linkedin}
              className="btn btn-info ml-1"
            >
              <i className="fab fa-linkedin-in" /> LinkedIn
            </a>
            <p>
              <i className="far fa-envelope " />{" "}
              <span className=" mr-1"> {a.contactemail}</span>
              <i className="fas fa-map-pin  ml-1" />{" "}
              <span className=""> {a.region}</span>
            </p>
          </div>
        </div>
      ));
    } else {
      listAbout = null;
    }
    return (
      <div className="row pb-5 pt-5 justify-content-center">
        {spinner}
        {listAbout}
      </div>
    );
  }
}
