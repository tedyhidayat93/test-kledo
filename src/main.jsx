import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import FilterPage, { loader as filterLoader } from "./FilterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FilterPage />,
    loader: filterLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);