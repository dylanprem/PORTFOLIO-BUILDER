import React, { Component } from "react";
import ListExperience from "../experience/ListExperience";
import ListProjects from "../projects/ListProjects";
import ListFrameworks from "../frameworks/ListFrameworks";
import ListAbout from "../about/ListAbout";
import Images from "../images/Images";
import Settings from "../settings/Settings";

class Dashbaord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showExp: false,
      showProjects: false,
      showAboutInfo: false,
      showFrameworks: false,
      showSettings: false,
      showImages: false
    };
  }
  showExpOnClick = () => {
    this.setState({
      showExp: true,
      showProjects: false,
      showAboutInfo: false,
      showFrameworks: false,
      showSettings: false,
      showImages: false
    });
  };

  showProjectsOnClick = () => {
    this.setState({
      showProjects: true,
      showExp: false,
      showAboutInfo: false,
      showFrameworks: false,
      showSettings: false,
      showImages: false
    });
  };

  showAboutOnClick = () => {
    this.setState({
      showExp: false,
      showProjects: false,
      showAboutInfo: true,
      showFrameworks: false,
      showSettings: false,
      showImages: false
    });
  };

  showFrameworksOnClick = () => {
    this.setState({
      showExp: false,
      showProjects: false,
      showAboutInfo: false,
      showFrameworks: true,
      showSettings: false,
      showImages: false
    });
  };

  showSettingsOnClick = () => {
    this.setState({
      showExp: false,
      showProjects: false,
      showAboutInfo: false,
      showFrameworks: false,
      showSettings: true,
      showImages: false
    });
  };

  showImagesOnClick = () => {
    this.setState({
      showExp: false,
      showProjects: false,
      showAboutInfo: false,
      showFrameworks: false,
      showSettings: false,
      showImages: true
    });
  };

  render() {
    return (
      <div className="row" id="dashboard">
        <div className="col-md-3 col-sm-4 bg-secondary shadowed" id="sidebar">
          <ul className="list-group bg-secondary">
            <li className="list-group-item bg-secondary text-light">
              <span id="sidebar-link" onClick={this.showExpOnClick}>
                <i className="fas fa-suitcase" /> Experience
              </span>
            </li>
            <li className="list-group-item bg-secondary text-light">
              <span id="sidebar-link" onClick={this.showProjectsOnClick}>
                <i className="far fa-folder" /> Projects
              </span>
            </li>
            <li className="list-group-item bg-secondary text-light">
              <span id="sidebar-link" onClick={this.showAboutOnClick}>
                <i className="far fa-user" /> About Info
              </span>
            </li>
            <li className="list-group-item bg-secondary text-light">
              <span id="sidebar-link" onClick={this.showFrameworksOnClick}>
                <i className="fas fa-code" /> Frameworks
              </span>
            </li>
            <li className="list-group-item bg-secondary text-light">
              <span id="sidebar-link" onClick={this.showImagesOnClick}>
                <i className="fas fa-images" /> Images
              </span>
            </li>
            <li className="list-group-item bg-secondary text-light">
              <span id="sidebar-link" onClick={this.showSettingsOnClick}>
                <i className="fas fa-cog" /> Settings
              </span>
            </li>
          </ul>
        </div>
        <div className="col-md-8 offset-md-1 col-sm-6" id="dashboard-content">
          {this.state.showExp === true ? <ListExperience /> : null}
          {this.state.showProjects === true ? <ListProjects /> : null}
          {this.state.showFrameworks === true ? <ListFrameworks /> : null}
          {this.state.showAboutInfo === true ? <ListAbout /> : null}
          {this.state.showSettings === true ? <Settings /> : null}
          {this.state.showImages === true ? <Images /> : null}
        </div>
      </div>
    );
  }
}

export default Dashbaord;
