import { IOperation, TX } from "@/shared/types";

const setOperationType = (
  index: number,
  type: string,
  tx: TX,
  setOperations: (operations: IOperation[]) => void
) => {
  if (index >= 0 && index < tx.tx.operations.length) {
    const updatedOperations = [...tx.tx.operations];
    
    // Обновляем тело операции в зависимости от типа
    updatedOperations[index] = {
      ...updatedOperations[index],
      body:
        type === "set_options"
          ? { set_options: { signer: null } }
          : type === "manage_data"
          ? { manage_data: { data_name: "", data_value: null } }
          : {},
    };

    // Обновляем состояние операций
    setOperations(updatedOperations);

    // Создаём новый объект URLSearchParams
    const currentUrlParams = new URLSearchParams(window.location.search);

    // Удаляем все старые параметры, связанные с операциями
    currentUrlParams.delete("masterWeight0");
    currentUrlParams.delete("lowThreshold0");
    currentUrlParams.delete("medThreshold0");
    currentUrlParams.delete("highThreshold0");
    currentUrlParams.delete("homeDomain0");
    currentUrlParams.delete("entryName0");
    currentUrlParams.delete("entryValue0");
    currentUrlParams.delete("sourceAccount0");

    // Добавляем параметры для текущей операции
    if (type === "manage_data") {
      currentUrlParams.set(`entryName${index}`, "");
      currentUrlParams.set(`entryValue${index}`, "");
      currentUrlParams.set(
        `sourceAccount${index}`,
        updatedOperations[index].source_account || ""
      );
    } else if (type === "set_options") {
      currentUrlParams.set(`masterWeight${index}`, "");
      currentUrlParams.set(`lowThreshold${index}`, "");
      currentUrlParams.set(`medThreshold${index}`, "");
      currentUrlParams.set(`highThreshold${index}`, "");
      currentUrlParams.set(`homeDomain${index}`, "");
      currentUrlParams.set(
        `sourceAccount${index}`,
        updatedOperations[index].source_account || ""
      );
    }

    // Обновляем адресную строку
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${currentUrlParams.toString()}`
    );
  }
};
export default setOperationType;