const hrefToXDR = (href: string) => {
  const xdrParamIndex = href.indexOf("importXDR=");
  if (xdrParamIndex !== -1) {
    const xdrStart = xdrParamIndex + "importXDR=".length;
    const xdrEnd =
      href.indexOf("&", xdrStart) !== -1
        ? href.indexOf("&", xdrStart)
        : href.length;
    return href.substring(xdrStart, xdrEnd);
  } else return "";
};
export default hrefToXDR;
