import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "react-three-fiber";
import circleImg from "./jon favicon.png";
import { Suspense, useCallback, useMemo, useRef } from "react";
import Text from "./components/Text";

extend({ OrbitControls });

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update());

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      autoRotate
      autoRotateSpeed={-0.2}
    />
  );
}

function Points() {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef();

  let t = 2;
  let f = 0.0005;
  let a = 4;
  const graph = useCallback(
    (x, z) => {
      return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    },
    [t, f, a]
  );

  const count = 100;
  const sep = 5;
  let positions = useMemo(() => {
    let positions = [];

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = graph(x, z);
        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions);
  }, [count, sep, graph]);

  useFrame(() => {
    t += 15;
    if (a < 50) {
      a += 0.001;
    } else if (a > 50) {
      a -= 0.001;
    }
    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);

        positions[i + 1] = graph(x, z);
        i += 3;
      }
    }

    bufferRef.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={bufferRef}
          attachObject={["attributes", "position"]}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach="material"
        map={imgTex}
        size={3.5}
        sizeAttenuation
        transparent={true}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

function Jumbo() {
  const ref = useRef();
  useFrame(
    ({ clock }) =>
      (ref.current.rotation.x =
        ref.current.rotation.y =
        ref.current.rotation.z =
          Math.sin(clock.getElapsedTime()) * 0.3)
  );
  return (
    <group ref={ref}>
      <Text hAlign="right" position={[-12, 6.5, 0]} children="REACT" />
      <Text hAlign="right" position={[-12, 0, 0]} children="THREE" />
      <Text hAlign="right" position={[-12, -6.5, 0]} children="FIBER" />
    </group>
  );
}

function AnimationCanvas() {
  return (
    <Canvas camera={{ position: [100, 2, 0], fov: 75 }}>
      <pointLight position={[100, 2, 0]} intensity={200} />
      <Suspense fallback={null}>
        <Jumbo />
        <Points />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}

function App() {
  return (
    <div className="anim">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}

export default App;
