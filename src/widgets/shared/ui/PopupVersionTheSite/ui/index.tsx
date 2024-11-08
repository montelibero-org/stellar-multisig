import { FC, useState } from "react";

export const PopupVersionTheSite: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleClose = () => {
    setIsVisible(false);
    window.location.reload();
  };
  return (
    isVisible && (
      <div
        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-40 z-50 segment blank"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <h2 className="text-lg font-bold mb-2">
          You are using an outdated version of the site.
        </h2>
        <button
          onClick={handleClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
        >
          <i className="fa fa-refresh" aria-hidden="true"></i>
        </button>
      </div>
    )
  );
};
