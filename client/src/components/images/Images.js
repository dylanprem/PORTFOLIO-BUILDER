import React, { Component } from "react";
import API from "../../utils/api";
import isEmpty from "../../validation/is-empty";

class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageItem: {},
      errors: {},
      baseurl: "",
      selectedFile: null,
      isUploading: false,
      uploadPercentage: null,
      isDeleting: false,
      loadingImg: false
    };
    this.uploadFile = this.uploadFile.bind(this);
  }
  componentDidMount() {
    this.getImages();
  }

  handleFileChange = e => {
    this.setState({
      selectedFile: e.target.files[0]
    });
  };

  uploadFile = e => {
    e.preventDefault();
    this.setState({ isUploading: true });
    const data = new FormData();
    data.append("image", this.state.selectedFile, this.state.selectedFile.name);
    API.post(`/api/files/POST/image/uploads`, data, {
      onUploadProgress: progressEvent => {
        console.log(
          "Upload Progress: " +
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%"
        );
        this.setState({
          uploadPercentage:
            Math.round((progressEvent.loaded / progressEvent.total) * 100) + "%"
        });
      }
    })
      .then(res => {
        console.log(res);
        this.getImages();
        this.setState({ isUploading: false });
      })
      .catch(err => console.log(err));
  };

  deleteFile = id => {
    this.setState({ isDeleting: true });
    API.delete(`/api/files/DELETE/image/${id}`)
      .then(res => {
        console.log(res);
        this.setState({ isDeleting: false });
        this.getImages();
      })
      .catch(err => {
        console.log(err);
      });
  };

  getImages = () => {
    this.setState({ loadingImg: true });
    API.get(`/api/files/GET/images`)
      .then(res => {
        console.log(res);
        console.log(res.config.baseURL);
        const images = res.data;
        const baseurl = res.config.baseURL;
        this.setState({
          images,
          baseurl,
          errors: {},
          loadingImg: false
        });
      })
      .catch(err => console.log(err));
  };
  render() {
    const {
      images,
      baseurl,
      isUploading,
      isDeleting,
      uploadPercentage,
      loadingImg
    } = this.state;
    let imageList;
    let progress;
    let loading;

    if (loadingImg === true) {
      loading = (
        <div className="col-md-12 text-center mt-5 mb-5">
          <h1 className="text-primary">
            Loading <i className="fas fa-spinner fa-pulse" />{" "}
          </h1>
        </div>
      );
    } else {
      loading = null;
    }

    if (isUploading === true) {
      progress = (
        <div className="col-md-12 text-center mt-5 mb-5">
          <h1 className="eggshell">
            Uploading <i className="fas fa-spinner fa-pulse" />{" "}
            {uploadPercentage}
          </h1>
        </div>
      );
    } else {
      progress = null;
    }

    if (isDeleting === true) {
      progress = (
        <div className="col-md-12 text-center mt-5 mb-5">
          <h1 className="text-danger">
            Deleting <i className="fas fa-spinner fa-pulse" />{" "}
            {uploadPercentage}
          </h1>
        </div>
      );
    } else {
      progress = null;
    }

    if (!isEmpty(images)) {
      imageList = images.map(i => (
        <div key={i._id} className="col-md-8 shadowed mb-3 mt-3">
          <img
            src={baseurl + "api/files/GET/image/" + i.filename}
            className="img-fluid d-block mx-auto fileImg mt-3 rounded"
            alt={baseurl}
          />
          <div className="col-md-12 text-center pb-3 pt-3">
            <p>
              Path:{" "}
              <span className="text-success">
                {baseurl + "api/files/GET/image/" + i.filename}
              </span>
            </p>
            <button
              className="btn btn-danger"
              onClick={this.deleteFile.bind(this, i._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ));
    }

    return (
      <div className="row mb-3 mt-3 justify-content-center">
        <div className="col-md-12">
          <h1 className="text-info">Images</h1>
        </div>
        <div className="col-md-12 mb-5">
          <form encType="multipart/form-data">
            <div className="form-group">
              <input
                className="form-control-file border"
                type="file"
                onChange={this.handleFileChange}
              />
              <small className="text-muted">Upload images here</small>
            </div>
            <div className="form-group">
              <button className="btn btn-success" onClick={this.uploadFile}>
                Upload
              </button>
            </div>
          </form>
        </div>
        {loading}
        {progress}
        {imageList}
      </div>
    );
  }
}

export default Images;
