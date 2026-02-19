import { useEffect, useState } from "react";
import {
  CheckAutoCompleteReturn,
  checkForAutoComplete,
} from "@Chatter/util/autcomplete.ts";
import { InputData } from "@/components/Chat";

const InitialAutoCompleteState = {
  left: -1,
  right: -1,
  word: "",
  isAutoComplete: false,
};
export function useAutocomplete(inputData: InputData) {
  const [autocomplete, setAutocomplete] = useState<CheckAutoCompleteReturn>(
    InitialAutoCompleteState,
  );
  const disableAutoComplete = () =>
    setAutocomplete({ ...InitialAutoCompleteState });

  useEffect(() => {
    if (inputData.startingIndex === null) {
      if (autocomplete.isAutoComplete) disableAutoComplete();
      return;
    }
    const ac = checkForAutoComplete(inputData.text, inputData.startingIndex);
    setAutocomplete(ac);
  }, [inputData, autocomplete.isAutoComplete]);

  return {
    disableAutoComplete,
    autocomplete,
    checkForAutoComplete,
  };
}
