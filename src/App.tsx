import { useMachine } from "@xstate/react";
import { Scene } from "./components/gl/Scene";
import { GameMachineProvider } from "./hooks/use";
import { gameMachine } from "./machines/game.machine";
import "./style/App.css";

function App() {
  const [state, _, service] = useMachine(gameMachine);

  return (
    <GameMachineProvider value={service}>
      {JSON.stringify(state.context)}
      <button onClick={() => service.send({ type: "onAddPerson" })}>
        add person
      </button>
      <button onClick={() => service.send({ type: "onRemovePerson", id: "1" })}>
        remove person
      </button>
      <Scene />
    </GameMachineProvider>
  );
}

export default App;
