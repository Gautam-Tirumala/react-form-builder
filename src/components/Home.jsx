import axios from "axios";
import React, { useEffect, useState } from "react";
import {Sidebar} from "./Sidebar"
import {Canvas} from "./Canvas"

import ReactDND from './ReactDND'


export default function FormBuilder() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Canvas />

      <ReactDND/>
    </div>
  );
}
