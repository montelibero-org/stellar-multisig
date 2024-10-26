"use client";
import React, { FC } from "react";
import { MainLayout, SearchBar } from "@/widgets";

const Home: FC = () => {
  return (
    <MainLayout>
      <SearchBar />
    </MainLayout>
  );
};

export default Home;
