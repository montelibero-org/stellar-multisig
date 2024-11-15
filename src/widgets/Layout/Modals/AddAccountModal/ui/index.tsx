"use client";
import s from "@/widgets/OperationTypes/index.module.scss";
import { FC, useState, FormEvent } from "react";
import "./index.scss";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";
import { IAccount } from "@/shared/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModalLayout } from "@/features";

type AccountType = "Personal" | "Corporate";

const AddAccountModal: FC = () => {
  const [accountType, setAccountType] = useState<AccountType>("Personal");
  const [accountIdInput, setAccountIdInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const {
    setIsOpenAddAccountModal,
    net,
    accounts,
    setAccounts,
    setIsAuth,
    theme,
    isOpenAddAccountModal,
  } = useStore(useShallow((state) => state));

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (StellarSdk.StrKey.isValidEd25519PublicKey(accountIdInput)) {
      const accountExistsInCurrentNet = accounts
        .filter((account) => account.net === net)
        .map((account) => account.accountID)
        .includes(accountIdInput);

      if (accountExistsInCurrentNet) {
        setError(`Account already exists`);

        return;
      }

      const updatedAccounts = accounts.map((account) =>
        account.net === net ? { ...account, isCurrent: false } : account
      );

      const newAccount: IAccount = {
        id: (accounts.length + 1).toString(),
        accountID: accountIdInput,
        net: net,
        isMultiSig: accountType === "Corporate",
        isCurrent: true,
      };

      setAccounts([...updatedAccounts, newAccount]);

      setError("");
      setIsOpenAddAccountModal(false);

      setIsAuth(true);

      router.push(`/${net}/account?id=${accountIdInput}`);
    } else {
      setError("Invalid account ID");
    }
  };

  return (
    <ModalLayout
      isOpenModal={isOpenAddAccountModal}
      setIsOpenModal={setIsOpenAddAccountModal}
    >
      <form onSubmit={handleSubmit}>
        <div
          className={
            theme === "night"
              ? "add-account-container-content-title"
              : "add-account-container-content-title-light"
          }
        >
          <div className={`tabs ${s.tabs}`}>
            <div className={`tabs-header ${s.tabsheader} `}>
              {["Personal", "Corporate"].map((type) => (
                <Link
                  key={type}
                  onClick={() => handleAccountTypeChange(type as AccountType)}
                  href="#"
                  className={
                    `tabs-item ${s.tabsitem} condensed ` +
                    (accountType === type ? "selected" : "")
                  }
                  style={{ marginInline: "10px" }}
                >
                  <span
                    className="tabs-item-text  "
                    style={{ paddingInline: "4px"   }}
                  >
                    {type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Account ID"
            value={accountIdInput}
            onChange={(e) => setAccountIdInput(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-center">
          <button className="button" type="submit">
            Add
          </button>
        </div>
        {error && (
          <div>
            <p className="text-center" style={{ color: "red" }}>
              {error}
            </p>
          </div>
        )}
      </form>
    </ModalLayout>
  );
};

export default AddAccountModal;
