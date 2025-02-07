import { Html, useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3, Euler } from "three";

useGLTF.preload("/student.glb");
useGLTF.preload("/alexa.glb");

export default function Model() {
  const group = useRef<Group>(null);
  const alexaGroup = useRef<Group>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { scene: studentScene, animations: studentAnimations } =
    useGLTF("/student.glb");
  const { scene: alexaScene, animations: alexaAnimations } =
    useGLTF("/alexa.glb");

  const { actions: studentActions } = useAnimations(
    studentAnimations,
    studentScene
  );
  const { actions: alexaActions } = useAnimations(alexaAnimations, alexaScene);
  const [showAlexaChat, setShowAlexaChat] = useState(false);

  useEffect(() => {
    if (group.current) {
      group.current.position.set(-0.5, -2, 0);
      group.current.scale.set(1.5, 1.5, 1.5);
    }
    if (alexaGroup.current) {
      alexaGroup.current.position.set(1, 0, 0);
      alexaGroup.current.scale.set(0.4, 0.4, 0.4);
      alexaGroup.current.rotation.set(1, -0.2, 1);
    }

    const talkAction = studentActions["mixamo.com"];
    if (talkAction) {
      talkAction.play();
    }

    setTimeout(() => {
      setShowAlexaChat(true);
      if (talkAction) {
        talkAction.paused = true;
        talkAction.clampWhenFinished = true;
      }
      alexaActions["alexa_low_poly.002Action"]?.play();
    }, 4000);
  }, [studentActions, alexaActions]);

  return (
    <group>
      <group ref={group}>
        <primitive object={studentScene} />
        <Html position={[0, 2, 0]} transform>
          <style>
            {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
            `}
          </style>
          <div
            style={{
              animation: "fadeIn 2s ease-out forwards",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "3px",
              borderRadius: "4px",
              fontSize: "3.5px",
              maxWidth: "35px",
            }}
          >
            Alexa, what are the 4 principles of Amazon?
          </div>
        </Html>
      </group>
      <group ref={alexaGroup}>
        <primitive object={alexaScene} />
        {showAlexaChat && (
          <Html position={[6.1, 6.8, 3]}>
            <div style={{ position: "relative", width: "max-content" }}>
              <div
                style={{
                  animation: "fadeIn 2s ease-out forwards",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "8px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  maxWidth: "200px",
                  textAlign: "center",
                }}
              >
                Amazon is guided by four principles: customer obsession rather
                than competitor focus, passion for invention, commitment to
                operational excellence, and long-term thinking. Amazon strives
                to be Earth&apos;s most customer-centric company, Earth&apos;s
                best employer, and Earth&apos;s safest place to work.
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
