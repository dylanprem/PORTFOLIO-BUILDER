import React, { Component } from "react";
import API from "../../utils/api";
import isEmpty from "../../validation/is-empty";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ListProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      projectItem: {},
      errors: {},
      editingId: "",
      editingModal: false,
      postingModal: false,
      projectname: "",
      desc: "",
      githuburl: "",
      demourl: "",
      features: "",
      imgsrc: ""
    };
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.togglePostModal = this.togglePostModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addProject = this.addProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
  }

  componentDidMount() {
    this.getProjects();
  }

  toggleEditModal() {
    this.setState(prevState => ({
      editingModal: !prevState.editingModal
    }));
  }

  togglePostModal() {
    this.setState(prevState => ({
      postingModal: !prevState.postingModal
    }));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getProjects = () => {
    API.get(`/api/GET/projects`)
      .then(res => {
        const projects = res.data;
        this.setState({
          errors: {},
          projects
        });
      })
      .catch(err => console.log(err));
  };
  getProjectById = id => {
    this.toggleEditModal();
    API.get(`/api/GET/projects/${id}`)
      .then(res => {
        const projectItem = res.data;
        this.setState({
          projectItem,
          errors: {},
          editingId: projectItem._id
        });
        console.log(projectItem);
      })
      .catch(err => console.log(err));
  };
  addProject = e => {
    e.preventDefault();
    const newProject = {
      projectname: this.state.projectname,
      desc: this.state.desc,
      githuburl: this.state.githuburl,
      demourl: this.state.demourl,
      features: this.state.features,
      imgsrc: this.state.imgsrc
    };

    API.post(`/api/POST/add/project`, newProject)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({
          errors: {},
          projectname: "",
          desc: "",
          githuburl: "",
          demourl: "",
          features: "",
          imgsrc: ""
        });
        this.getProjects();
        this.togglePostModal();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
      });
  };

  updateProject = e => {
    e.preventDefault();
    const updatedProject = {
      projectname: this.projectname.value,
      desc: this.desc.value,
      githuburl: this.githuburl.value,
      demourl: this.demourl.value,
      features: this.features.value,
      imgsrc: this.imgsrc.value
    };
    API.patch(`/api/PATCH/project/${this.state.editingId}`, updatedProject)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ errors: {} });
        this.getProjects();
        this.setEditingNull();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
      });
  };

  deleteProject = id => {
    API.delete(`/api/DELETE/project/${id}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.getProjects();
      })
      .catch(err => console.log(err));
  };
  setEditingNull = () => {
    this.setState({
      projectItem: {},
      editingId: "",
      postingModal: false,
      editingModal: false
    });
  };

  render() {
    const { projects, errors, projectItem } = this.state;
    let listProjects;
    let editModal;

    const closeBtn = (
      <button className="close" onClick={this.setEditingNull}>
        &times;
      </button>
    );

    if (!isEmpty(projects)) {
      listProjects = projects.map(p => (
        <div
          className="col-md-8 offset-md-2 shadowed p-5 mt-3 mb-3"
          key={p._id}
        >
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-warning mr-3"
                onClick={this.getProjectById.bind(this, p._id)}
              >
                <i className="fas fa-edit" />
              </button>
              <button
                className="btn btn-danger"
                onClick={this.deleteProject.bind(this, p._id)}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
            <div className="col-md-12">
              <img
                src={p.imgsrc}
                className="img-fluid d-block mx-auto project-img mt-2 mb-2"
                alt={p.imgsrc}
              />
              <h3 className="text-center text-primary">{p.projectname}</h3>
              <p>
                Description: <span className="text-success">{p.desc}</span>
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={p.githuburl}
                className="btn btn-primary mr-1"
              >
                <i className="fab fa-github" /> GitHub
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
            <div className="col-md-12 p-3">
              <h3 className="text-info">Features</h3>
              {p.features.map((f, index) => (
                <div key={index}>
                  <p className="text-muted">
                    <i className="fas fa-check text-success" />
                    {f}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ));
    } else {
      listProjects = null;
    }

    if (!isEmpty(projectItem)) {
      editModal = (
        <Modal
          isOpen={this.state.editingModal}
          toggle={this.toggleEditModal}
          size="lg"
          backdrop="static"
        >
          <ModalHeader
            toggle={this.toggleEditModal}
            className="text-info"
            close={closeBtn}
          >
            Edit this project
          </ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <label htmlFor="img" className="text-info">
                  Image
                </label>
                <input
                  name="imgsrc"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={projectItem.imgsrc}
                  ref={imgsrc => (this.imgsrc = imgsrc)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectname" className="text-info">
                  Project name
                </label>
                <input
                  name="projectname"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={projectItem.projectname}
                  ref={projectname => (this.projectname = projectname)}
                  className={
                    errors && errors.projectname
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.projectname}</small>
              </div>

              <div className="form-group">
                <label htmlFor="githuburl" className="text-info">
                  GitHub URL
                </label>
                <input
                  name="githuburl"
                  type="url"
                  onChange={this.handleChange}
                  defaultValue={projectItem.githuburl}
                  ref={githuburl => (this.githuburl = githuburl)}
                  className={
                    errors && errors.githuburl
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.githuburl}</small>
              </div>
              <div className="form-group">
                <label htmlFor="demourl" className="text-info">
                  Demo URL
                </label>
                <input
                  name="demourl"
                  type="url"
                  onChange={this.handleChange}
                  defaultValue={projectItem.demourl}
                  ref={demourl => (this.demourl = demourl)}
                  className={
                    errors && errors.demourl
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.demourl}</small>
              </div>
              <div className="form-group">
                <label htmlFor="features" className="text-info">
                  Features
                </label>
                <textarea
                  name="features"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={projectItem.features}
                  ref={features => (this.features = features)}
                  className={
                    errors && errors.features
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-muted">
                  Seperate each feature with a comma.
                </small>
                <small className="text-danger">{errors.features}</small>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="text-info">
                  Description
                </label>
                <textarea
                  name="desc"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={this.state.projectItem.desc}
                  ref={desc => (this.desc = desc)}
                  className={
                    errors && errors.desc
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.desc}</small>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" size="sm" onClick={this.updateProject}>
              Update
            </Button>{" "}
            <Button color="warning" size="sm" onClick={this.setEditingNull}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      );
    }

    const postModal = (
      <Modal
        isOpen={this.state.postingModal}
        toggle={this.togglePostModal}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={this.togglePostModal} className="text-info">
          Post a new project
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="img" className="text-info">
                Image
              </label>
              <input
                name="imgsrc"
                type="text"
                onChange={this.handleChange}
                value={this.state.imgsrc}
                className="form-control form-control-lg"
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectname" className="text-info">
                Project name
              </label>
              <input
                name="projectname"
                type="url"
                onChange={this.handleChange}
                value={this.state.projectname}
                className={
                  errors && errors.projectname
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.projectname}</small>
            </div>
            <div className="form-group">
              <label htmlFor="githuburl" className="text-info">
                GitHub URL
              </label>
              <input
                name="githuburl"
                type="url"
                onChange={this.handleChange}
                value={this.state.githuburl}
                className={
                  errors && errors.githuburl
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.githuburl}</small>
            </div>
            <div className="form-group">
              <label htmlFor="demourl" className="text-info">
                Demo URL
              </label>
              <input
                name="demourl"
                type="url"
                onChange={this.handleChange}
                value={this.state.demourl}
                className={
                  errors && errors.demourl
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.demourl}</small>
            </div>
            <div className="form-group">
              <label htmlFor="features" className="text-info">
                Features
              </label>
              <textarea
                name="features"
                type="text"
                onChange={this.handleChange}
                value={this.state.features}
                className={
                  errors && errors.features
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-muted">
                Seperate each feature with a comma.
              </small>
              <small className="text-danger">{errors.features}</small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="text-info">
                Description
              </label>
              <textarea
                name="desc"
                type="text"
                onChange={this.handleChange}
                value={this.state.desc}
                className={
                  errors && errors.desc
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small>{errors.desc}</small>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" size="sm" onClick={this.addProject}>
            Post
          </Button>{" "}
          <Button color="warning" size="sm" onClick={this.setEditingNull}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );

    return (
      <div className="">
        <div className="col-md-12 mt-3 mb-3">
          <h1 className="display-2 text-info d-sm-none d-md-block">Projects</h1>
          <button
            onClick={this.togglePostModal}
            className="btn btn-dark btn-lg"
          >
            Add Project <i className="fas fa-plus-square" />
          </button>
        </div>
        {listProjects}
        {editModal}
        {postModal}
      </div>
    );
  }
}

export default ListProjects;
