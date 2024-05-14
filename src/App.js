import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home'

import FormBuilder from './components/FormBuilder'
import {rSuiteComponents} from '@react-form-builder/components-rsuite'

import GridComponent from './components/GridComponent'

// import {BuilderView, FormBuilder} from '@react-form-builder/designer'



// const components = rSuiteComponents.map(c => c.build())
// const builderView = new BuilderView(components)

export default function App() {
  const url = window.location.href;
  console.log(url);
  return url.includes("preview") ? (
    <>
      {url === "http://localhost:3000/preview/student" ? (
        <FormBuilder name="student" />
      ) : url === "http://localhost:3000/preview/studentDropdown" ? (
        <FormBuilder name="studentDropdown" />
      ) :  url === "http://localhost:3000/preview/dropdownExample" ? (
        <FormBuilder name="dropdownExample" />
      ) :
       (
        <FormBuilder />
      )}
      {/* <GridComponent/> */}
    </>
  ) : (
    <Home />
  );
}
