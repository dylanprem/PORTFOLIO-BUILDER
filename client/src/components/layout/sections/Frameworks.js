import React, { Component } from "react";
import API from "../../../utils/api";
import isEmpty from "../../../validation/is-empty";

class Frameworks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frameworks: [],
      about: [],
      loading: false
    };
  }
  componentDidMount() {
    this.getAbout();
    this.getFrameworks();
  }
  getAbout = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      API.get(`/api/GET/about`)
        .then(res => {
          const about = res.data;
          this.setState({
            errors: {},
            about,
            loading: false
          });
        })
        .catch(err => console.log(err));
    }, 2000);
  };

  getFrameworks = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      API.get(`/api/GET/frameworks`)
        .then(res => {
          const frameworks = res.data;
          this.setState({
            errors: {},
            frameworks,
            loading: false
          });
        })
        .catch(err => console.log(err));
    }, 2000);
  };

  render() {
    const { about, frameworks, loading } = this.state;

    let listBio;
    let listFrameworks;
    let spinner;

    if (loading === true) {
      spinner = (
        <div className="col-md-12 text-center mt-5 mb-5">
          <h1 className="eggshell">
            Loading <i className="fas fa-spinner fa-pulse" />
          </h1>
        </div>
      );
    } else {
      spinner = null;
    }

    if (!isEmpty(about)) {
      listBio = about.map(b => (
        <div className="col-md-6 offset-md-3 mb-5" key={b._id}>
          <h2 className="dark-blue">
            <i className="fas fa-book" /> About {b.name}
          </h2>
          <h4 className="eggshell">{b.bio}</h4>
        </div>
      ));
    } else {
      listBio = null;
    }

    if (!isEmpty(frameworks)) {
      listFrameworks = frameworks.map(f => (
        <div className="col-md-6 offset-md-3" key={f._id}>
          <h2 className="dark-blue">
            {f.framework.toUpperCase()}{" "}
            {!isEmpty(f.imgsrc) ? (
              <img
                src={f.imgsrc}
                className="img-fluid d-inline framework-img"
                alt={f.framework}
              />
            ) : null}
          </h2>
          <div className="col-md-12 p-3">
            <h3 className="eggshell">
              <i className="fas fa-code eggshell" /> Skills
            </h3>
            {f.skills.map((s, index) => (
              <div key={index}>
                <p className="dark-blue">
                  <i className="fas fa-check teal-blue" />
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      ));
    } else {
      listFrameworks = null;
    }

    return (
      <div className="row pb-5 pt-5 light-green-background">
        <div className="col-md-12 text-center p-5">
          <h1 className="dark-blue">BIO &amp; FRAMEWORKS</h1>
        </div>
        {spinner}
        {listBio}
        {listFrameworks}
      </div>
    );
  }
}

export default Frameworks;
