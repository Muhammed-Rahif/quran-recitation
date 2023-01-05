import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import ViewChapter from "../pages/ViewChapter";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quran-recitation" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="/quran-recitation/:chapterNo" element={<ViewChapter />} /> */}

          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
