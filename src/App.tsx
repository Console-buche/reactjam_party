import { useInterpret } from "@xstate/react";
import { Scene } from "./components/gl/Scene";
import { GameMachineProvider } from "./hooks/use";
import { personMachine } from "./machines/person.machine";
import "./style/App.css";

function App() {
  // const [state, send, service] = useMarchine(personMachine);
  const service = useInterpret(personMachine);

  return (
    <GameMachineProvider value={service}>
      {/* {JSON.stringify(state.event)}

      <button type={"button"} onClick={() => send({ type: "on drag" })}>
        On Drag
      </button>
      <button type={"button"} onClick={() => send({ type: "Dropped" })}>
        Dropped
      </button> */}
      <Scene />
    </GameMachineProvider>
  );
}

export default App;
