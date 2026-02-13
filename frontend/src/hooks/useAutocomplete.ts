import { useEffect, useState } from "react";
import {
  CheckAutoCompleteReturn,
  checkForAutoComplete,
} from "../util/autcomplete.ts";
import { InputData } from "../components/TwitchViewer/Chat.tsx";

const InitialAutoCompleteState = {
  left: -1,
  right: -1,
  word: "",
  isAutoComplete: false,
};
export function useAutocomplete(
  inputData: InputData,
) {
  const [autocomplete, setAutocomplete] = useState<CheckAutoCompleteReturn>(
    InitialAutoCompleteState,
  );

  useEffect(() => {
    if (inputData.startingIndex === null) {
      if (autocomplete.isAutoComplete) disableAutoComplete();
      return;
    }
    const ac = checkForAutoComplete(inputData.text, inputData.startingIndex);
    setAutocomplete(
      ac,
    );
  }, [inputData]);
  const disableAutoComplete = () =>
    setAutocomplete({ ...InitialAutoCompleteState });

  return {
    disableAutoComplete,
    autocomplete,
    checkForAutoComplete,
  };
}
