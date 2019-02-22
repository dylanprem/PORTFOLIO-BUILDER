import React, { Component } from "react";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Frameworks from "./sections/Frameworks";
import Experience from "./sections/Experience";

class Landing extends Component {
  render() {
    return (
      <div>
        <About />
        <Projects />
        <Frameworks />
        <Experience />
      </div>
    );
  }
}

export default Landing;
