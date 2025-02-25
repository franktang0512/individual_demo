import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SimulationState } from "@/lib/types";
import { generateWorld, worldMaps } from "@/lib/world";
import { runSimulation } from "@/lib/simulation-sandbox";
import { useWorkspaceStore } from "./workspace";

interface SimulationStore {
  simulationStates: SimulationState[];
  currentStateIndex: number;
  currentWorldId: number;
  isPlaying: boolean;
  isComplete: boolean;
  speed: number;

  setSimulationStates: (states: SimulationState[]) => void;
  setCurrentStateIndex: (index: number) => void;
  setCurrentWorldId: (id: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsComplete: (isComplete: boolean) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  runSimulation: (code: string) => void;
  togglePlayPause: () => void;
}

const createInitialState = (worldId: number): SimulationState => ({
  world: generateWorld(
    worldMaps.find((w) => w.id === worldId)?.map || worldMaps[0].map
  ),
  gameOver: false,
  accumulatedCoins: 0,
  direction: "none",
});

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      currentWorldId: 1,
      simulationStates: [createInitialState(1)],
      currentStateIndex: 0,
      isPlaying: false,
      isComplete: false,
      speed: 1,

      setSimulationStates: (states) => set({ simulationStates: states }),

      setCurrentStateIndex: (index) => set({ currentStateIndex: index }),

      setCurrentWorldId: (id) => {
        set({ currentWorldId: id });
        set({
          simulationStates: [
            {
              world: generateWorld(
                worldMaps.find((w) => w.id === id)?.map || worldMaps[0].map
              ),
              gameOver: false,
              accumulatedCoins: 0,
              direction: "none",
            },
          ],
          currentStateIndex: 0,
          isPlaying: false,
          isComplete: false,
        });
      },

      setIsPlaying: (isPlaying) => set({ isPlaying }),

      setIsComplete: (isComplete) => set({ isComplete }),

      setSpeed: (speed) => set({ speed }),

      reset: () => {
        const { currentWorldId } = get();
        set({
          simulationStates: [
            {
              world: generateWorld(
                worldMaps.find((w) => w.id === currentWorldId)?.map ||
                  worldMaps[0].map
              ),
              gameOver: false,
              accumulatedCoins: 0,
              direction: "none",
            },
          ],
          currentStateIndex: 0,
          isPlaying: false,
          isComplete: false,
        });
      },

      runSimulation: () => {
        const { generatedCode } = useWorkspaceStore.getState();

        set({
          simulationStates: runSimulation(generatedCode),
          currentStateIndex: 0,
          isPlaying: true,
          isComplete: false,
        });
      },

      togglePlayPause: () => {
        const { isComplete, isPlaying } = get();
        if (isComplete) {
          get().reset();
        } else {
          set({ isPlaying: !isPlaying });
        }
      },
    }),
    {
      name: "simulation-storage-v1.1",
      partialize: (state) => ({
        currentWorldId: state.currentWorldId,
        speed: state.speed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.simulationStates = [createInitialState(state.currentWorldId)];
        }
      },
    }
  )
);
