import React, { Component } from "react";
import API from "../../utils/api";
import isEmpty from "../../validation/is-empty";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
      settingItem: {},
      editingId: "",
      disableRegisterPage: "",
      editingModal: false,
      postingModal: false
    };
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.togglePostModal = this.togglePostModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postSettings = this.postSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  componentDidMount() {
    this.getSettings();
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  getSettings = () => {
    API.get(`/api/GET/settings`)
      .then(res => {
        const settings = res.data;
        this.setState({
          settings
        });
      })
      .catch(err => console.log(err));
  };

  getSettingById = id => {
    API.get(`/api/GET/setting/${id}`)
      .then(res => {
        const settingItem = res.data;
        this.setState({
          settingItem,
          editingId: settingItem._id
        });
        this.toggleEditModal();
      })
      .catch(err => console.log(err));
  };

  postSettings = e => {
    e.preventDefault();
    const newSettings = {
      disableRegisterPage: this.state.disableRegisterPage
    };
    API.post(`/api/POST/add/setting`, newSettings)
      .then(res => {
        console.log(res);
        this.getSettings();
        this.togglePostModal();
      })
      .catch(err => console.log(err));
  };

  updateSettings = e => {
    e.preventDefault();
    const updatedSetting = {
      disableRegisterPage: this.disableRegisterPage.value
    };
    API.patch(`/api/PATCH/setting/${this.state.editingId}`, updatedSetting)
      .then(res => {
        console.log(res);
        this.getSettings();
        this.setEditingNull();
      })
      .catch(err => console.log(err.response));
  };

  setEditingNull = () => {
    this.setState({
      settingItem: {},
      editingId: "",
      postingModal: false,
      editingModal: false
    });
  };

  render() {
    const { settingItem, settings } = this.state;
    let listSettings;
    let editModal;
    let postModal;
    let addOrEditBtn;

    if (!isEmpty(settings)) {
      addOrEditBtn = null;
    } else {
      addOrEditBtn = (
        <button onClick={this.togglePostModal} className="btn btn-dark btn-lg">
          Configure Settings <i className="fas fa-cog" />
        </button>
      );
    }

    if (!isEmpty(settings)) {
      listSettings = settings.map(s => (
        <div
          className="col-md-8 offset-md-2 shadowed p-5 mt-3 mb-3"
          key={s._id}
        >
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-warning mr-3"
                onClick={this.getSettingById.bind(this, s._id)}
              >
                <i className="fas fa-edit" />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                {s.disableRegisterPage === "disabled" ? (
                  <p className="text-success">
                    The Registration page is currently disabled
                  </p>
                ) : (
                  <p className="text-danger">
                    The Registration page is currently enabled. This will allow
                    anyone to register and gain access to your page.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ));
    } else {
      listSettings = null;
    }

    if (!isEmpty(settingItem)) {
      editModal = (
        <Modal
          isOpen={this.state.editingModal}
          toggle={this.toggleEditModal}
          size="lg"
          backdrop="static"
        >
          <ModalHeader toggle={this.toggleEditModal} className="text-info">
            Enable/Disable Register Page
          </ModalHeader>
          <ModalBody>
            <form>
              <div className="form-group">
                <select
                  className="form-control"
                  id="sel1"
                  name="disableRegisterPage"
                  defaultValue={settingItem.disableRegisterPage}
                  ref={disableRegisterPage =>
                    (this.disableRegisterPage = disableRegisterPage)
                  }
                >
                  <option className="text-danger" value="enabled">
                    Enable Register Page
                  </option>
                  <option className="text-success" value="disabled">
                    Disable Register Page
                  </option>
                </select>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" size="sm" onClick={this.updateSettings}>
              Update
            </Button>{" "}
            <Button color="warning" size="sm" onClick={this.setEditingNull}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      );
    }

    postModal = (
      <Modal
        isOpen={this.state.postingModal}
        toggle={this.togglePostModal}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={this.togglePostModal} className="text-info">
          Enable/Disable Register Page
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <select
                className="form-control"
                id="sel1"
                name="disableRegisterPage"
                value={this.state.disableRegisterPage}
              >
                <option value="0">Select an option</option>
                <option className="text-danger" value="enabled">
                  Enable Register Page
                </option>
                <option className="text-success" value="disabled">
                  Disable Register Page
                </option>
              </select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" size="sm" onClick={this.postSettings}>
            Update
          </Button>{" "}
          <Button color="warning" size="sm" onClick={this.setEditingNull}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );

    return (
      <div>
        <div className="col-md-12 mt-3 mb-3">
          <h1 className="display-2 text-info">Settings</h1>
          {addOrEditBtn}
        </div>
        {listSettings}
        {editModal}
        {postModal}
      </div>
    );
  }
}

export default Settings;
