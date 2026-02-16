import { usePinnedCtx } from "../../context/pinnedctx.tsx";

export function Discovery() {
  const { pinned } = usePinnedCtx();
  console.log({ pinned });
  return (
    <>
      <span>hello world</span>
    </>
  );
}
