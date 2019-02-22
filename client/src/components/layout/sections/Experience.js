import React, { Component } from "react";
import API from "../../../utils/api";
import isEmpty from "../../../validation/is-empty";
import Moment from "react-moment";

class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getExperience();
  }

  getExperience = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      API.get(`/api/GET/experience`)
        .then(res => {
          const experiences = res.data;
          this.setState({
            experiences,
            errors: {},
            loading: false
          });
        })
        .catch(err => console.log(err));
    }, 2000);
  };

  render() {
    const { experiences, loading } = this.state;
    let listExp;
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

    if (!isEmpty(experiences)) {
      listExp = experiences.map(e => (
        <div className="col-md-6 offset-md-3 mb-5" key={e._id}>
          <h2 className="">
            <i className="fas fa-suitcase" /> <span className="">{e.emp}</span>
          </h2>
          <h3 className="">
            From:{" "}
            <Moment format="D MMM YYYY" className="">
              {e.from}
            </Moment>
          </h3>
          <h3 className="">
            To:{" "}
            {!isEmpty(e.to) ? (
              <Moment format="D MMM YYYY" className="">
                {e.to}
              </Moment>
            ) : (
              <span className="">Current</span>
            )}
          </h3>
          <p className="">{e.desc}</p>
          <h3 className="">Responsibilities</h3>
          {e.responsibility.map((r, index) => (
            <p className="" key={index}>
              <i className="fas fa-check " />
              {r}
            </p>
          ))}
        </div>
      ));
    } else {
      listExp = null;
    }

    return (
      <div className="row pb-5 pt-5 pb-5 ">
        <div className="col-md-12 text-center p-5">
          <h1 className="">EXPERIENCE &amp; HISTORY</h1>
        </div>
        {spinner}
        {listExp}
      </div>
    );
  }
}

export default Experience;
