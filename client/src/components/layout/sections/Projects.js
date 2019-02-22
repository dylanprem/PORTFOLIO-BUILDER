import React, { Component } from "react";
import API from "../../../utils/api";
import isEmpty from "../../../validation/is-empty";

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getProjects();
  }

  getProjects = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      API.get(`/api/GET/projects`)
        .then(res => {
          const projects = res.data;
          this.setState({
            errors: {},
            projects,
            loading: false
          });
        })
        .catch(err => console.log(err));
    }, 2000);
  };

  render() {
    const { projects, loading } = this.state;
    let listProjects;
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

    if (!isEmpty(projects)) {
      listProjects = projects.map(p => (
        <div className="col-md-4" key={p._id}>
          <img
            src={p.imgsrc}
            className="img-fluid d-block mx-auto project-img mt-2 mb-2"
            alt={p.imgsrc}
          />
          <h3 className="text-center eggshell">{p.projectname}</h3>
          <p>
            <span className="baby-blue">{p.desc}</span>
          </p>
          <div className="text-center">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={p.githuburl}
              className="btn btn-primary mr-1"
            >
              <i className="fab fa-github" /> GitHub Repo
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={p.demourl}
              className="btn btn-info"
            >
              <i className="fas fa-desktop" /> Demo
            </a>
          </div>

          <h3 className="text-info">Features</h3>
          {p.features.map((f, index) => (
            <div key={index}>
              <p className="eggshell">
                <i className="fas fa-check text-primary" />
                {f}
              </p>
            </div>
          ))}
        </div>
      ));
    } else {
      listProjects = null;
    }
    return (
      <div className="row dark-blue-background pb-5 pt-5 justify-content-center">
        <div className="col-md-12 pt-3 pb-3 text-center">
          <h1 className="baby-blue">PROJECTS</h1>
        </div>
        {spinner}
        {listProjects}
      </div>
    );
  }
}
