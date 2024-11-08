import { MainLayout } from "@/widgets";
import React, { FC } from "react";

const Features: FC = () => {
  return (
    <MainLayout defaultContainer={true}>
      <h2>Features</h2>
      <span>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </span>
    </MainLayout>
  );
};

export default Features;
