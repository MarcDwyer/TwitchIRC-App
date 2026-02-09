const breakingChars = /[^a-zA-Z0-9@]/;

export function checkForAutoComplete(text: string, start: number) {
  let word = "";
  let left = start - 1;
  let right = left + 1;
  while (text[left] || text[right]) {
    const leftCheck = text[left] && !breakingChars.test(text[left]);
    const rightCheck = text[right] && !breakingChars.test(text[right]);
    console.log({ leftCheck, rightCheck });
    if (leftCheck) {
      word = text[left] + word;
      left--;
    } else if (rightCheck) {
      word = word + text[right];
      right++;
    } else {
      break;
    }
  }
  const isAutoComplete = word[0] === "@";
  return {
    isAutoComplete,
    word: isAutoComplete ? word.substring(1, word.length) : word,
    left: left + 1,
    right: right - 1,
  };
}
export type CheckAutoCompleteReturn = ReturnType<typeof checkForAutoComplete>;
