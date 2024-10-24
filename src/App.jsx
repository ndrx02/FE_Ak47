import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const [hand, setHand] = useState(null);
  const [token, seToken] = useState("");
  const [nick, setNick] = useState("");
  let shouldConnect = true;

  const WS_URL = "ws://localhost:8080";
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    },
    shouldConnect
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);
    }

    if (lastJsonMessage?.cards !== undefined || null) {
      setHand(lastJsonMessage);
    }

    // if (lastJsonMessage?.token !== undefined || null) {
    //   sessionStorage.setItem("token", lastJsonMessage.token);
    //   if (lastJsonMessage?.id !== undefined || null) {
    //     if (sessionStorage.getItem("id") !== lastJsonMessage.id) {
    //       sessionStorage.setItem("id", lastJsonMessage.id);
    //     }
    //   }
    // }

    return () => {
      shouldConnect = false;
    };
  }, [lastJsonMessage]);

  return (
    <>
      <div>
        {hand &&
          hand.cards.map((c, i) => (
            <div key={i}>
              <img
                src={`data:image/svg+xml;base64, ${c}`}
                className="logo"
              ></img>
              {hand.cardsName[i].startsWith("4") ||
              hand.cardsName[i].startsWith("7") ||
              hand.cardsName[i].startsWith("asso") ||
              hand.cardsName[i].startsWith("re") ||
              hand.cardsName[i].startsWith("jolly") ? (
                <button
                  onClick={() => {
                    sendJsonMessage({
                      cmd: "SAVE IN STOCK",
                      card: hand.cardsName[i],
                      cardIndex: i,
                    });
                  }}
                >
                  SAVE IN STOCK
                </button>
              ) : (
                <p></p>
              )}
              <button
                onClick={() =>
                  sendJsonMessage({
                    cmd: "THROW A CARD",
                    card: hand.cardsName[i],
                    cardIndex: i,
                  })
                }
              >
                THROW
              </button>
            </div>
          ))}
      </div>
      <div className="card">
        <button
          onClick={() => {
            sendJsonMessage({ cmd: "NEW", player: nick });
            if (lastJsonMessage?.token !== undefined || null) {
              sessionStorage.setItem("token", lastJsonMessage.token);
            }
            if (sessionStorage.setItem("id", lastJsonMessage.id)) {
              sessionStorage.setItem("id", lastJsonMessage.id);
            }
          }}
        >
          NEW
        </button>
        <h3>Token</h3>
        <input value={token} onChange={(e) => seToken(e.target.value)} />
        <h3>Name</h3>
        <input value={nick} onChange={(e) => setNick(e.target.value)} />
        <button
          onClick={() => {
            sendJsonMessage({ cmd: "JOIN", player: nick, token: token });
            if (lastJsonMessage?.token !== undefined || null) {
              sessionStorage.setItem("token", lastJsonMessage.token);
            }
            if (sessionStorage.setItem("id", lastJsonMessage.id)) {
              sessionStorage.setItem("id", lastJsonMessage.id);
            }
          }}
        >
          JOIN
        </button>
        <button
          onClick={() => {
            sendJsonMessage({ cmd: "START" });
          }}
        >
          START
        </button>
        <button
          onClick={() => {
            sendJsonMessage({ cmd: "DRAW FROM DECK" });
          }}
        >
          DRAW FROM DECK
        </button>
        <button
          onClick={() => {
            sendJsonMessage({ cmd: "DRAW FROM STOCK" });
          }}
        >
          DRAW FROM STOCK
        </button>
        <button
          onClick={() =>
            sendJsonMessage({
              cmd: "FIRE",
              hand: hand.cardsName,
            })
          }
        >
          FIRE
        </button>
        <button
          onClick={() =>
            sendJsonMessage({
              cmd: "END",
            })
          }
        >
          END
        </button>
        <button
          onClick={() =>
            sendJsonMessage({
              cmd: "RECONNECT",
              token: sessionStorage.getItem("token"),
              id: sessionStorage.getItem("id"),
            })
          }
        >
          RECONNECT
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
