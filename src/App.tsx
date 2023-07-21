import "./style/App.css";
import { Scene } from "./components/gl/Scene";
import { useMachine } from "@xstate/react";
import { personMachine } from "./machines/person.machine";

function App() {
  const [state, send] = useMachine(personMachine);

  return (
    <>
      {JSON.stringify(state.event)}
      {state.context.PISS_COUNT}
      <button type={"button"} onClick={() => send({ type: "on drag" })}>
        On Drag
      </button>
      <button type={"button"} onClick={() => send({ type: "Dropped" })}>
        Dropped
      </button>
      <Scene />
    </>
  );
}

export default App;
