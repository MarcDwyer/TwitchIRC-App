import { useEffect } from "react";
import { TwitchViewer } from "./components/TwitchViewer/index.tsx";
import { useViewing } from "./context/chatterctx.tsx";

export function Chatter() {
  const { viewing, clearViewing } = useViewing();

  useEffect(() => {
    return function() {
      clearViewing();
    }
  }, [])
  return (
    <>
      <main className="w-full h-full bg-zinc-800 overflow-y-scroll p-2">
        {viewing.size === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">
              Select a channel from the sidebar to join
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-1 h-full ${(() => {
              const count = viewing.size;
              const cols = Math.min(count, 3);
              const rows = Math.ceil(count / 3);
              // Tailwind needs full class strings — no dynamic interpolation
              const colClasses = [
                "grid-cols-1",
                "grid-cols-2",
                "grid-cols-3",
              ] as const;
              const rowClasses = ["grid-rows-1", "grid-rows-2"] as const;
              const colClass = colClasses[cols - 1];
              if (rows <= 2) {
                return `${colClass} ${rowClasses[rows - 1]}`;
              }
              return `${colClass} auto-rows-[50%] overflow-y-auto`;
            })()}`}
          >
            {Array.from(viewing.values()).map((stream) => (
              <TwitchViewer key={stream.id} stream={stream} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
