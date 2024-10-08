"use client";

import React, { FC, useEffect, useState } from "react";
import { collapseAccount } from "@/shared/helpers";
import {
  Filters,
  filterOptions,
  OperationTypes,
  OperationTypesOptions,
} from "@/shared/lib";
import { Transaction } from "stellar-sdk";
import { Dropdown } from "@/entities";
import { DecodedTransactions, SortBy, TransactionData } from "@/shared/types"; // SortBy is "DESC" | "ASC"

interface Props {
  ID: string;
  showedTransactions: DecodedTransactions;
  setShowedTransactions: (transactions: DecodedTransactions) => void;
  transactionsFromFirebase: TransactionData[] | null[];
  setTransactionFromFirebase: (data: TransactionData[]) => void;
}

interface TransactionWithCreatedAt {
  transaction: Transaction;
  createdAt: number;
  index: number;
}

const TransactionsSort: FC<Props> = ({
  ID,
  showedTransactions,
  setShowedTransactions,
  transactionsFromFirebase,
  setTransactionFromFirebase,
}) => {
  const collapseID = collapseAccount(ID);

  const [selectedFilter, setSelectedFilter] = useState<Filters | null>(null);
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<OperationTypes[]>([]);
  const [originalTransactions] = useState<Transaction[]>(
    showedTransactions
      ? showedTransactions
          .map(item => item?.transaction)
          .filter((transaction): transaction is Transaction => transaction != null)
      : []
  );

  const [sortByNumberOfSignatures, setSortByNumberOfSignatures] = useState<SortBy | null>(null);
  const [sortByCreatedAt, setSortByCreatedAt] = useState<SortBy | null>(null);

  useEffect(() => {
    // Mapping transaction data with 'createdAt' from Firebase
    const transactionsWithCreatedAt: TransactionWithCreatedAt[] = originalTransactions.map(
      (transaction, index) => {
        const xdr = transaction.toEnvelope().toXDR("base64");
        const matchingData = transactionsFromFirebase.find(
          (data) => data?.xdr === xdr
        );
        const createdAt = matchingData ? matchingData.createdAt : 0;
        return { transaction, createdAt, index };
      }
    );

    let filteredTransactions = [...transactionsWithCreatedAt];

    // Filter transactions based on the selected operation types
    if (selectedOperationTypes.length > 0) {
      filteredTransactions = filteredTransactions.filter(({ transaction }) =>
        transaction.operations.some((operation) =>
          selectedOperationTypes.includes(operation.type as OperationTypes)
        )
      );
    }

    // Sort by creation date
    if (sortByCreatedAt) {
      filteredTransactions.sort((a, b) => {
        const dateA = a.createdAt;
        const dateB = b.createdAt;
        return sortByCreatedAt === "ASC" ? dateA - dateB : dateB - dateA;
      });
    }

    // Sort by number of signatures
    if (sortByNumberOfSignatures) {
      filteredTransactions.sort((a, b) => {
        const signaturesA = a.transaction.signatures.length;
        const signaturesB = b.transaction.signatures.length;
        return sortByNumberOfSignatures === "ASC" ? signaturesA - signaturesB : signaturesB - signaturesA;
      });
    }

    // Update the displayed transactions based on filters and sorting
    setShowedTransactions(filteredTransactions.map(({ transaction, index }) => ({
      transaction,
      index,
    })));
  }, [
    selectedOperationTypes,
    sortByCreatedAt,
    sortByNumberOfSignatures,
    originalTransactions,
    transactionsFromFirebase,
    setShowedTransactions,
    setTransactionFromFirebase,
  ]);

  return (
    <div className="op-filters">
      filters{" "}
      <span title={ID} aria-label={ID}>
        <span className="account-key">/ {collapseID} </span>

        {selectedFilter && selectedFilter !== Filters.typeOperation && (
          <span className="account-key">
            / {selectedFilter}{" "}
          </span>
        )}

        {selectedFilter === Filters.typeOperation &&
          selectedOperationTypes.map((type) => (
            <span key={type} className="account-key">
              / {type}{" "}
            </span>
          ))}

        {/* Dropdown for selecting filters */}
        <Dropdown<Filters>
          options={filterOptions}
          onSelect={(filter) => {
            setSelectedFilter(filter);

            // Reset previous values when changing filters
            setSelectedOperationTypes([]);
            setSortByCreatedAt(null);
            setSortByNumberOfSignatures(null);

            switch (filter) {
              case Filters.createdAtDESC:
                setSortByCreatedAt("DESC");
                break;
              case Filters.createdAtASC:
                setSortByCreatedAt("ASC");
                break;
              case Filters.byNumberSignaturesDESC:
                setSortByNumberOfSignatures("DESC");
                break;
              case Filters.byNumberSignaturesASC:
                setSortByNumberOfSignatures("ASC");
                break;
              case Filters.typeOperation:
                break;
              default:
                break;
            }
          }}
          placeholder="Add filter"
          selectedOption={selectedFilter || undefined}
          multiSelect={false}
        />

        <div className="micro-space"></div>

        {/* Dropdown for selecting operation types */}
        {selectedFilter === Filters.typeOperation && (
          <Dropdown<OperationTypes>
            options={OperationTypesOptions.filter(
              (type) => type !== "Select operation type"
            )}
            onSelect={(selected) => {
              setSelectedOperationTypes(selected);
            }}
            selectedOptions={selectedOperationTypes}
            placeholder="Select operation type"
            multiSelect={true}
          />
        )}
      </span>
    </div>
  );
};

export default TransactionsSort;
