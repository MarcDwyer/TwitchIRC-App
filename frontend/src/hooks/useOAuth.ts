import { useEffect } from "react";
import { OAuth, useTwitchCtx } from "../context/twitchctx.tsx";
import { checkTokenForValidation } from "../lib/oauth.ts";
import { OAUTH_KEY } from "../util/storageKeys.ts";

export const useOAuth = () => {
  const { oauth, _setOAuth } = useTwitchCtx();

  const checkURLForToken = () => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    return accessToken;
  };

  const clear = () => {
    localStorage.removeItem(OAUTH_KEY);
    _setOAuth({ token: null, validated: false, error: null });
  };
  const validateToken = async () => {
    if (!oauth.token) {
      return;
    }
    const isValid = await checkTokenForValidation(oauth.token);

    if (isValid) {
      localStorage.setItem(OAUTH_KEY, oauth.token);
      setOAuth({ validated: isValid });
    } else {
      localStorage.removeItem(OAUTH_KEY);
      setOAuth({ validated: false, token: null });
    }
  };

  const setOAuth = (newOAuth: Partial<OAuth>) =>
    _setOAuth((prev) => ({
      ...prev,
      ...newOAuth,
    }));

  useEffect(() => {
    const lsToken = localStorage.getItem(OAUTH_KEY);
    if (lsToken) {
      _setOAuth((prevOAuth) => ({ ...prevOAuth, token: lsToken }));
    } else {
      const hashToken = checkURLForToken();
      if (hashToken) {
        _setOAuth((prevOAuth) => ({ ...prevOAuth, token: hashToken }));
      }
    }
  }, []);

  useEffect(() => {
    if (oauth.token && !oauth.validated) {
      checkTokenForValidation(oauth.token).then((isValid) => {
        if (isValid) {
          _setOAuth((prevOAuth) => ({ ...prevOAuth, validated: true }));
        } else {
          _setOAuth((prevOAuth) => ({ ...prevOAuth, token: null }));
        }
      });
    }
  }, [oauth]);

  useEffect(() => {
    if (oauth.validated && oauth.token) {
      localStorage.setItem(OAUTH_KEY, oauth.token);
    }
  }, [oauth]);

  return {
    oauth,
    validateToken,
    checkURLForToken,
    clear,
  };
};
