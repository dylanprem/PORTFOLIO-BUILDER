import React, { Component } from "react";
import API from "../../utils/api";
import isEmpty from "../../validation/is-empty";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ListFrameworks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frameworks: [],
      frameworkItem: {},
      errors: {},
      editingId: "",
      editingModal: false,
      postingModal: false,
      framework: "",
      skills: "",
      imgsrc: ""
    };
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.togglePostModal = this.togglePostModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addFramework = this.addFramework.bind(this);
    this.updateFramework = this.updateFramework.bind(this);
  }

  componentDidMount() {
    this.getFrameworks();
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

  getFrameworks = () => {
    API.get(`/api/GET/frameworks`)
      .then(res => {
        const frameworks = res.data;
        this.setState({
          errors: {},
          frameworks
        });
      })
      .catch(err => console.log(err));
  };
  getFrameworkById = id => {
    this.toggleEditModal();
    API.get(`/api/GET/framework/${id}`)
      .then(res => {
        const frameworkItem = res.data;
        this.setState({
          frameworkItem,
          errors: {},
          editingId: frameworkItem._id
        });
        console.log(frameworkItem);
      })
      .catch(err => console.log(err));
  };
  addFramework = e => {
    e.preventDefault();
    const newFramework = {
      framework: this.state.framework,
      skills: this.state.skills,
      imgsrc: this.state.imgsrc
    };

    API.post(`/api/POST/add/framework`, newFramework)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({
          errors: {},
          framework: "",
          skills: "",
          imgsrc: ""
        });
        this.getFrameworks();
        this.togglePostModal();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
      });
  };

  updateFramework = e => {
    e.preventDefault();
    const updatedFramework = {
      framework: this.framework.value,
      skills: this.skills.value,
      imgsrc: this.imgsrc.value
    };
    API.patch(`/api/PATCH/framework/${this.state.editingId}`, updatedFramework)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ errors: {} });
        this.getFrameworks();
        this.setEditingNull();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
      });
  };

  deleteFramework = id => {
    API.delete(`/api/DELETE/framework/${id}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.getFrameworks();
      })
      .catch(err => console.log(err));
  };
  setEditingNull = () => {
    this.setState({
      frameworkItem: {},
      editingId: "",
      postingModal: false,
      editingModal: false
    });
  };

  render() {
    const { frameworks, errors, frameworkItem } = this.state;
    let listFrameworks;
    let editModal;

    const closeBtn = (
      <button className="close" onClick={this.setEditingNull}>
        &times;
      </button>
    );

    if (!isEmpty(frameworks)) {
      listFrameworks = frameworks.map(f => (
        <div
          className="col-md-8 offset-md-2 shadowed p-5 mt-3 mb-3"
          key={f._id}
        >
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-warning mr-3"
                onClick={this.getFrameworkById.bind(this, f._id)}
              >
                <i className="fas fa-edit" />
              </button>
              <button
                className="btn btn-danger"
                onClick={this.deleteFramework.bind(this, f._id)}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
            <div className="col-md-12">
              <img
                src={f.imgsrc}
                className="img-fluid d-block mx-auto framework-img mt-2 mb-2"
                alt={f.imgsrc}
              />
              <h3 className="text-center text-primary">{f.framework}</h3>
            </div>
            <div className="col-md-12 p-3">
              <h3 className="text-info">Skills</h3>
              {f.skills.map((s, index) => (
                <div key={index}>
                  <p className="text-muted">
                    <i className="fas fa-check text-success" />
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ));
    } else {
      listFrameworks = null;
    }

    if (!isEmpty(frameworkItem)) {
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
            Edit this framework
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
                  defaultValue={frameworkItem.imgsrc}
                  ref={imgsrc => (this.imgsrc = imgsrc)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="framework" className="text-info">
                  Framework
                </label>
                <input
                  name="framework"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={frameworkItem.framework}
                  ref={framework => (this.framework = framework)}
                  className={
                    errors && errors.framework
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.framework}</small>
              </div>

              <div className="form-group">
                <label htmlFor="skills" className="text-info">
                  Skills
                </label>
                <textarea
                  name="skills"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={frameworkItem.skills}
                  ref={skills => (this.skills = skills)}
                  className={
                    errors && errors.skills
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-muted">
                  Seperate each skill with a comma.
                </small>
                <small className="text-danger">{errors.skills}</small>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" size="sm" onClick={this.updateFramework}>
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
          Post a new framework
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
              <label htmlFor="framework" className="text-info">
                Framework
              </label>
              <input
                name="framework"
                type="url"
                onChange={this.handleChange}
                value={this.state.framework}
                className={
                  errors && errors.framework
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.framework}</small>
            </div>
            <div className="form-group">
              <label htmlFor="skills" className="text-info">
                Skills
              </label>
              <textarea
                name="skills"
                type="text"
                onChange={this.handleChange}
                value={this.state.skills}
                className={
                  errors && errors.skills
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-muted">
                Seperate each skill with a comma.
              </small>
              <small className="text-danger">{errors.skills}</small>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" size="sm" onClick={this.addFramework}>
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
          <h1 className="display-2 text-info d-sm-none d-md-block">
            Frameworks
          </h1>
          <button
            onClick={this.togglePostModal}
            className="btn btn-dark btn-lg"
          >
            Add Framework <i className="fas fa-plus-square" />
          </button>
        </div>
        {listFrameworks}
        {editModal}
        {postModal}
      </div>
    );
  }
}

export default ListFrameworks;
