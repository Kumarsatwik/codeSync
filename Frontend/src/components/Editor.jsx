import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import ACTIONS from "../Action";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes; // '+input' there is something in editor
        const getCode = instance.getValue();
        onCodeChange(getCode); //sync code
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            getCode,
          });
          // console.log(getCode);
        }
      });
    }

    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ getCode }) => {
        // console.log(getCode);

        if (getCode !== null) {
          editorRef.current.setValue(getCode);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <>
      <textarea name="" id="realTimeEditor"></textarea>
    </>
  );
}

export default Editor;
