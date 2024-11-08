const collapseAccount = (accountId: string) => {
  if (accountId == "" || accountId == null || accountId == undefined) {
    return <br />;
  }
  const first4Str = accountId.substring(0, 4);
  const last4Str = accountId.substr(-4);
  return first4Str + "..." + last4Str;
};

export default collapseAccount
