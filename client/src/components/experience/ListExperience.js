import React, { Component } from "react";
import API from "../../utils/api";
import isEmpty from "../../validation/is-empty";
import Moment from "react-moment";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ListExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: [],
      errors: {},
      expItem: {},
      modal: false,
      postModal: false,
      editingID: "",
      emp: "",
      from: "",
      to: "",
      desc: "",
      responsibility: ""
    };
    this.updateExperience = this.updateExperience.bind(this);
    this.addExperience = this.addExperience.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.togglePostModal = this.togglePostModal.bind(this);
  }

  componentDidMount() {
    this.getExperience();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  togglePostModal() {
    this.setState(prevState => ({
      postModal: !prevState.postModal
    }));
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setEditingNull = () => {
    this.setState({
      expItem: {},
      editingID: "",
      modal: false,
      postModal: false
    });
  };

  getExperienceById = id => {
    this.toggle();
    API.get(`/api/GET/experience/${id}`)
      .then(res => {
        const expItem = res.data;
        this.setState({
          expItem,
          errors: {},
          editingID: expItem._id
        });
        console.log(expItem);
      })
      .catch(err => {
        console.log(err.response);
        console.log(err.response.data);
      });
  };

  updateExperience = e => {
    e.preventDefault();
    const updateExp = {
      emp: this.emp.value,
      from: this.from.value,
      to: this.to.value,
      responsibility: this.responsibility.value,
      desc: this.desc.value
    };
    API.patch(`/api/PATCH/exp/${this.state.editingID}`, updateExp)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.setState({ errors: {} });
        this.getExperience();
        this.toggle();
      })
      .catch(err => console.log(err));
  };

  getExperience = () => {
    API.get(`/api/GET/experience`)
      .then(res => {
        const experiences = res.data;
        this.setState({
          experiences,
          errors: {}
        });
        this.setEditingNull();
      })
      .catch(err => console.log(err));
  };

  addExperience = e => {
    e.preventDefault();
    const newExp = {
      emp: this.state.emp,
      from: this.state.from,
      to: this.state.to,
      desc: this.state.desc,
      responsibility: this.state.responsibility
    };
    API.post(`/api/POST/add/exp`, newExp).then(res => {
      console.log(res);
      console.log(res.data);
      this.setState({
        errors: {},
        emp: "",
        from: "",
        to: "",
        desc: "",
        responsibility: ""
      });
      this.getExperience();
      this.setEditingNull();
    });
  };

  deleteExperience = id => {
    API.delete(`/api/DELETE/exp/${id}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.getExperience();
      })
      .catch(err => console.log(err));
  };

  render() {
    const { experiences, errors, expItem } = this.state;
    let listExp;
    let editingModal;

    const closeBtn = (
      <button className="close" onClick={this.setEditingNull}>
        &times;
      </button>
    );

    if (!isEmpty(experiences)) {
      listExp = experiences.map(e => (
        <div
          className="col-md-8 offset-md-2 shadowed p-5 mt-3 mb-3"
          key={e._id}
        >
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-warning mr-3"
                onClick={this.getExperienceById.bind(this, e._id)}
              >
                <i className="fas fa-edit" />
              </button>
              <button
                className="btn btn-danger"
                onClick={this.deleteExperience.bind(this, e._id)}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
            <div className="col-md-12">
              <p>
                Employer: <span className="text-success">{e.emp}</span>
              </p>
              <p>
                From:{" "}
                <Moment className="text-success" format="D MMM YYYY">
                  {e.from}
                </Moment>
              </p>

              <p>
                To:{" "}
                {!isEmpty(e.to) ? (
                  <span>
                    <Moment className="text-success" format="D MMM YYYY">
                      {e.to}
                    </Moment>
                  </span>
                ) : (
                  <span className="text-success">Current</span>
                )}
              </p>
            </div>
            <div className="col-md-12 p-3">
              <h3 className="text-info">Description</h3>
              <p>{e.desc}</p>
            </div>
            <div className="col-md-12 p-3">
              <h3 className="text-info">Responsibilities</h3>
              {e.responsibility.map((r, index) => (
                <div key={index}>
                  <p className="text-muted">
                    <i className="fas fa-check text-success" />
                    {r}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ));
    } else {
      listExp = null;
    }

    if (!isEmpty(expItem)) {
      editingModal = (
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          size="lg"
          backdrop="static"
        >
          <ModalHeader
            toggle={this.toggle}
            className="text-info"
            close={closeBtn}
          >
            Edit this experience
          </ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <label htmlFor="emp" className="text-info">
                  Employer
                </label>
                <input
                  name="emp"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={expItem.emp}
                  ref={emp => (this.emp = emp)}
                  className={
                    errors && errors.emp
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-danger">{errors.emp}</small>
              </div>
              <div className="form-group">
                <label htmlFor="from" className="text-info">
                  From
                </label>
                <input
                  name="from"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  onChange={this.handleChange}
                  defaultValue={new Date(expItem.from).toLocaleDateString()}
                  ref={from => (this.from = from)}
                  className={
                    errors && errors.from
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />

                <small>{errors.from}</small>
              </div>
              <div className="form-group">
                <label htmlFor="to" className="text-info">
                  To
                </label>
                <input
                  name="to"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  onChange={this.handleChange}
                  defaultValue={new Date(expItem.to).toLocaleDateString()}
                  ref={to => (this.to = to)}
                  className="form-control form-control-lg"
                />
                <small className="text-muted">
                  Leave blank if this is your current employer
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="responsibility" className="text-info">
                  Responsibilities
                </label>
                <textarea
                  name="responsibility"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={this.state.expItem.responsibility}
                  ref={responsibility => (this.responsibility = responsibility)}
                  className={
                    errors && errors.responsibility
                      ? "form-control form-control-lg is-invalid"
                      : "form-control form-control-lg"
                  }
                />
                <small className="text-muted">
                  Seperate each responsibility with a comma.
                </small>
                <small className="text-danger">{errors.responsibility}</small>
              </div>
              <div className="form-group">
                <label htmlFor="description" className="text-info">
                  Description
                </label>
                <textarea
                  name="desc"
                  type="text"
                  onChange={this.handleChange}
                  defaultValue={this.state.expItem.desc}
                  ref={desc => (this.desc = desc)}
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
            <Button color="success" size="sm" onClick={this.updateExperience}>
              Update
            </Button>{" "}
            <Button color="warning" size="sm" onClick={this.setEditingNull}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      );
    }

    const postingModal = (
      <Modal
        isOpen={this.state.postModal}
        toggle={this.togglePostModal}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={this.togglePostModal} className="text-info">
          Post new experience
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="emp" className="text-info">
                Employer
              </label>
              <input
                name="emp"
                type="text"
                onChange={this.handleChange}
                value={this.state.emp}
                className={
                  errors && errors.emp
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-danger">{errors.emp}</small>
            </div>
            <div className="form-group">
              <label htmlFor="from" className="text-info">
                From
              </label>
              <input
                name="from"
                type="date"
                placeholder="DD/MM/YYYY"
                onChange={this.handleChange}
                value={this.state.from}
                className={
                  errors && errors.from
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small>{errors.from}</small>
            </div>
            <div className="form-group">
              <label htmlFor="to" className="text-info">
                To
              </label>
              <input
                name="to"
                type="date"
                placeholder="DD/MM/YYYY"
                onChange={this.handleChange}
                value={this.state.to}
                className="form-control form-control-lg"
              />
              <small className="text-muted">
                Leave blank if this is your current employer
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="responsibility" className="text-info">
                Responsibilities
              </label>
              <textarea
                name="responsibility"
                type="text"
                value={this.state.responsibility}
                onChange={this.handleChange}
                className={
                  errors && errors.responsibility
                    ? "form-control form-control-lg is-invalid"
                    : "form-control form-control-lg"
                }
              />
              <small className="text-muted">
                Seperate each responsibility with a comma.
              </small>
              <small className="text-danger">{errors.responsibility}</small>
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
          <Button color="success" size="sm" onClick={this.addExperience}>
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
            Experience
          </h1>
          <button
            onClick={this.togglePostModal}
            className="btn btn-dark btn-lg"
          >
            Add Experience <i className="fas fa-plus-square" />
          </button>
        </div>
        {listExp}
        {editingModal}
        {postingModal}
      </div>
    );
  }
}

export default ListExperience;
