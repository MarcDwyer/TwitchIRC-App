import { useCallback, useEffect } from "react";
import { useTwitchCtx } from "../context/twitchctx.tsx";
import { CLIENT_ID_KEY } from "../util/storageKeys.ts";

export const useClientID = () => {
  const { clientID, _setClientID } = useTwitchCtx();

  const setClientID = useCallback(
    (newClientID: string | null) => {
      if (newClientID) {
        localStorage.setItem(CLIENT_ID_KEY, newClientID);
      }
      _setClientID(newClientID);
    },
    [],
  );

  useEffect(() => {
    const lsClientID = localStorage.getItem(CLIENT_ID_KEY);
    if (lsClientID) {
      _setClientID(lsClientID);
    }
  }, []);

  const clear = () => {
    localStorage.removeItem(CLIENT_ID_KEY);
    _setClientID(null);
  };

  return {
    clientID,
    setClientID,
    clear,
  };
};
