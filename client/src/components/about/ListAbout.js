import React, { Component } from "react";
import API from "../../utils/api";
import isEmpty from "../../validation/is-empty";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ListProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutInfo: [],
      aboutItem: {},
      errors: {},
      editingId: "",
      editingModal: false,
      postingModal: false,
      name: "",
      bio: "",
      region: "",
      contactemail: "",
      github: "",
      linkedin: "",
      imgsrc: ""
    };
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.togglePostModal = this.togglePostModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addAbout = this.addAbout.bind(this);
    this.updateAbout = this.updateAbout.bind(this);
  }

  componentDidMount() {
    this.getAbout();
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

  getAbout = () => {
    API.get(`/api/GET/about`)
      .then(res => {
        const aboutInfo = res.data;
        console.log(res);
        console.log(window.location);
        this.setState({
          errors: {},
          aboutInfo
        });
      })
      .catch(err => console.log(err));
  };
  getAboutById = id => {
    this.toggleEditModal();
    API.get(`/api/GET/about/${id}`)
      .then(res => {
        const aboutItem = res.data;
        this.setState({
          aboutItem,
          errors: {},
          editingId: aboutItem._id
        });
        console.log(aboutItem);
      })
      .catch(err => console.log(err));
  };
  addAbout = e => {
    e.preventDefault();
    const newAbout = {
      name: this.state.name,
      bio: this.state.bio,
      region: this.state.region,
      contactemail: this.state.contactemail,
      github: this.state.github,
      linkedin: this.state.linkedin,
      imgsrc: this.state.imgsrc
    };

    API.post(`/api/POST/add/about`, newAbout)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({
          errors: {},
          name: "",
          bio: "",
          region: "",
          contactemail: "",
          github: "",
          linkedin: "",
          imgsrc: ""
        });
        this.getAbout();
        this.togglePostModal();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
      });
  };

  updateAbout = e => {
    e.preventDefault();
    const updatedAbout = {
      name: this.name.value,
      bio: this.bio.value,
      region: this.region.value,
      contactemail: this.contactemail.value,
      github: this.github.value,
      linkedin: this.linkedin.value,
      imgsrc: this.imgsrc.value
    };
    API.patch(`/api/PATCH/about/${this.state.editingId}`, updatedAbout)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ errors: {} });
        this.getAbout();
        this.setEditingNull();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
      });
  };

  deleteAbout = id => {
    API.delete(`/api/DELETE/about/${id}`).then(res => {
      console.log(res);
      console.log(res.data);
      this.getAbout();
    });
    this.setState({ errors: {} });
  };
  setEditingNull = () => {
    this.setState({
      aboutItem: {},
      editingId: "",
      postingModal: false,
      editingModal: false
    });
  };

  render() {
    const { aboutInfo, errors, aboutItem } = this.state;
    let listAbout;
    let editModal;
    let addOrEditBtn;

    if (!isEmpty(aboutInfo)) {
      addOrEditBtn = null;
    } else {
      addOrEditBtn = (
        <button onClick={this.togglePostModal} className="btn btn-dark btn-lg">
          Add About info <i className="fas fa-plus-square" />
        </button>
      );
    }

    if (!isEmpty(aboutInfo)) {
      listAbout = aboutInfo.map(a => (
        <div
          className="col-md-8 offset-md-2 shadowed p-5 mt-3 mb-3"
          key={a._id}
        >
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-warning mr-3"
                onClick={this.getAboutById.bind(this, a._id)}
              >
                <i className="fas fa-edit" />
              </button>
              <button
                className="btn btn-danger"
                onClick={this.deleteAbout.bind(this, a._id)}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
            <div className="col-md-12">
              <img
                src={a.imgsrc}
                className="img-fluid d-block mx-auto abt-img mt-2 mb-2 rounded-circle"
                alt={a.imgsrc}
              />
              <h3 className="text-primary text-center">{a.name}</h3>
              <p>
                Bio: <span className="text-success">{a.bio}</span>
              </p>
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
                className="btn btn-info"
              >
                <i className="fab fa-linkedin-in" /> LinkedIn
              </a>
            </div>
            <div className="col-md-12 p-3">
              <p>
                <i className="far fa-envelope" />{" "}
                <span className="text-success">{a.contactemail}</span>
              </p>
              <p>
                <i className="fas fa-map-pin text-primary" />{" "}
                <span className="text-success">{a.region}</span>
              </p>
            </div>
          </div>
        </div>
      ));
    } else {
      listAbout = null;
    }

    if (!isEmpty(aboutItem)) {
      editModal = (
        <Modal
          isOpen={this.state.editingModal}
          toggle={this.toggleEditModal}
          size="lg"
          backdrop="static"
        >
          <ModalHeader toggle={this.toggleEditModal} className="text-info">
            Edit About info
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
                  defaultValue={aboutItem.imgsrc}
                  ref={imgsrc => (this.imgsrc = imgsrc)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name" className="text-info">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={aboutItem.name}
                  ref={name => (this.name = name)}
                  className={
                    errors && errors.name
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.name}</small>
              </div>
              <div className="form-group">
                <label htmlFor="img" className="text-info">
                  GitHub Profile
                </label>
                <input
                  name="github"
                  type="url"
                  onChange={this.handleChange}
                  defaultValue={aboutItem.github}
                  ref={github => (this.github = github)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkedin" className="text-info">
                  LinkedIn
                </label>
                <input
                  name="linkedin"
                  type="url"
                  onChange={this.handleChange}
                  defaultValue={aboutItem.linkedin}
                  ref={linkedin => (this.linkedin = linkedin)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio" className="text-info">
                  Bio
                </label>
                <textarea
                  name="bio"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={aboutItem.bio}
                  ref={bio => (this.bio = bio)}
                  className={
                    errors && errors.bio
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.bio}</small>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="text-info">
                  Contact Email
                </label>
                <textarea
                  name="contactemail"
                  type="email"
                  onChange={this.handleChange}
                  defaultValue={this.state.aboutItem.contactemail}
                  ref={contactemail => (this.contactemail = contactemail)}
                  className={
                    errors && errors.contactemail
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.contactemail}</small>
              </div>
              <div className="form-group">
                <label htmlFor="region" className="text-info">
                  Region
                </label>
                <input
                  name="region"
                  type="url"
                  onChange={this.handleChange}
                  defaultValue={this.state.aboutItem.region}
                  ref={region => (this.region = region)}
                  className="form-control form-control-lg"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" size="sm" onClick={this.updateAbout}>
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
          Create About info
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
              <label htmlFor="name" className="text-info">
                Name
              </label>
              <input
                name="name"
                type="text"
                onChange={this.handleChange}
                value={this.state.name}
                className={
                  errors && errors.name
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.name}</small>
            </div>
            <div className="form-group">
              <label htmlFor="img" className="text-info">
                GitHub Profile
              </label>
              <input
                name="github"
                type="url"
                onChange={this.handleChange}
                value={this.state.github}
                className="form-control form-control-lg"
              />
            </div>
            <div className="form-group">
              <label htmlFor="linkedin" className="text-info">
                LinkedIn
              </label>
              <input
                name="linkedin"
                type="url"
                onChange={this.handleChange}
                value={this.state.linkedin}
                className="form-control form-control-lg"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio" className="text-info">
                Bio
              </label>
              <textarea
                name="bio"
                type="text"
                onChange={this.handleChange}
                value={this.state.bio}
                className={
                  errors && errors.bio
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.bio}</small>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="text-info">
                Contact Email
              </label>
              <input
                name="contactemail"
                type="text"
                onChange={this.handleChange}
                value={this.state.contactemail}
                className={
                  errors && errors.contactemail
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.contactemail}</small>
            </div>
            <div className="form-group">
              <label htmlFor="region" className="text-info">
                Region
              </label>
              <input
                name="region"
                type="url"
                onChange={this.handleChange}
                value={this.state.region}
                className="form-control form-control-lg"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" size="sm" onClick={this.addAbout}>
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
          <h1 className="display-2 text-info d-sm-none d-md-block">About Me</h1>
          {addOrEditBtn}
        </div>
        {listAbout}
        {editModal}
        {postModal}
      </div>
    );
  }
}

export default ListProjects;
