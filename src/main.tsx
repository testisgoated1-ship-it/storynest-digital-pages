import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as ort from "onnxruntime-web";
import "./styles.css";

type ClassMap = {
  classes: string[];
  recyclable_classes: string[];
  non_recyclable_classes: string[];
};

type Result = {
  label: string;
  confidence: number;
  recyclable: boolean;
};

function App() {
  const input = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [classMap, setClassMap] = useState<ClassMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      ort.InferenceSession.create("./recycle-model.onnx"),
      fetch("./recycle-class-map.json").then((response) => {
        if (!response.ok) throw new Error("Could not load class map");
        return response.json() as Promise<ClassMap>;
      }),
    ])
      .then(([nextSession, nextClassMap]) => {
        if (cancelled) return;
        setSession(nextSession);
        setClassMap(nextClassMap);
        setModelReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("The classifier could not be loaded. Please refresh and try again.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const scan = async (file: File) => {
    setError("");
    setResult(null);
    setImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      if (!session || !classMap) {
        throw new Error("Model is not ready");
      }

      const imageElement = new Image();
      imageElement.src = URL.createObjectURL(file);
      await imageElement.decode();

      // Match the model's evaluation pipeline: resize the shorter side to 256,
      // then take a centered 224x224 crop.
      const scale = 256 / Math.min(imageElement.naturalWidth, imageElement.naturalHeight);
      const width = Math.round(imageElement.naturalWidth * scale);
      const height = Math.round(imageElement.naturalHeight * scale);

      const resizeCanvas = document.createElement("canvas");
      resizeCanvas.width = width;
      resizeCanvas.height = height;
      const resizeContext = resizeCanvas.getContext("2d");
      if (!resizeContext) throw new Error("Canvas unavailable");
      resizeContext.drawImage(imageElement, 0, 0, width, height);

      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");

      const sx = Math.floor((width - 224) / 2);
      const sy = Math.floor((height - 224) / 2);
      context.drawImage(resizeCanvas, sx, sy, 224, 224, 0, 0, 224, 224);

      const pixels = context.getImageData(0, 0, 224, 224).data;
      const mean = [0.485, 0.456, 0.406];
      const std = [0.229, 0.224, 0.225];
      const plane = 224 * 224;
      const data = new Float32Array(3 * plane);

      for (let y = 0; y < 224; y++) {
        for (let x = 0; x < 224; x++) {
          const source = (y * 224 + x) * 4;
          const target = y * 224 + x;
          data[target] = (pixels[source] / 255 - mean[0]) / std[0];
          data[plane + target] = (pixels[source + 1] / 255 - mean[1]) / std[1];
          data[2 * plane + target] = (pixels[source + 2] / 255 - mean[2]) / std[2];
        }
      }

      const tensor = new ort.Tensor("float32", data, [1, 3, 224, 224]);
      const output = await session.run({
        [session.inputNames[0]]: tensor,
      });

      const logits = Array.from(
        output[session.outputNames[0]].data as Float32Array
      );
      const maxLogit = Math.max(...logits);
      const exponentials = logits.map((value) => Math.exp(value - maxLogit));
      const total = exponentials.reduce((sum, value) => sum + value, 0);
      const probabilities = exponentials.map((value) => value / total);

      let bestIndex = 0;
      for (let i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > probabilities[bestIndex]) bestIndex = i;
      }

      const label = classMap.classes[bestIndex];
      setResult({
        label,
        confidence: probabilities[bestIndex],
        recyclable: classMap.recyclable_classes.includes(label),
      });
    } catch {
      setError("Could not classify that image. Please try another photo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError("");
    if (input.current) input.current.value = "";
  };

  return (
    <main>
      <nav>
        <strong>RecycleCheck</strong>
        <span>Know before you throw.</span>
      </nav>

      <section className="hero">
        <div className="badge">AI-powered recycling guide</div>
        <h1>Is it recyclable?</h1>
        <p>
          Take a photo or upload an item. RecycleCheck identifies common waste
          materials and gives you a quick answer.
        </p>

        <button
          className="primary"
          disabled={!modelReady}
          onClick={() => input.current?.click()}
        >
          {modelReady ? "Scan an item" : "Loading classifier…"}
        </button>

        <input
          ref={input}
          hidden
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void scan(file);
          }}
        />
      </section>

      {(image || error) && (
        <section className="card">
          {image && <img src={image} alt="Item being classified" />}

          {loading && <div className="loading">Analyzing your item…</div>}

          {!loading && result && (
            <div className={result.recyclable ? "answer yes" : "answer no"}>
              <small>RESULT</small>
              <h2>{result.recyclable ? "Recyclable" : "Not recyclable"}</h2>
              <p>
                Detected: <b>{result.label}</b>
              </p>
              <p>{Math.round(result.confidence * 100)}% model confidence</p>
              <button onClick={reset}>Scan another</button>
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </section>
      )}

      <section className="info">
        <h2>How it works</h2>
        <div>
          <article>
            <b>01</b>
            <h3>Snap</h3>
            <p>Take a clear photo of the item.</p>
          </article>
          <article>
            <b>02</b>
            <h3>Identify</h3>
            <p>A machine-learning model analyzes the image in your browser.</p>
          </article>
          <article>
            <b>03</b>
            <h3>Decide</h3>
            <p>See whether it falls into our recyclable category.</p>
          </article>
        </div>
        <p className="note">
          Recycling rules vary by location. Always check your local recycling
          program for the final answer.
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
