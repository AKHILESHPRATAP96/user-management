import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

const AddParticles = () => {
  const particlesInit = useCallback(async (engine) => {
   
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
 
  }, []);

  const options = {
    fpsLimit: 90,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        onClick: {
          enable: false,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 125,
          duration: 1,
        },
      },
    },
    particles: {
      color: {
        value: "#333",
      },
      links: {
        color: "#666",
        distance: 175,
        enable: true,
        opacity: 0.3,
        width: 0.3,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 0.75,
        straight: true,
      },
      number: {
        density: {
          enable: true,
          area: 500,
        },
        value: 75,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 0, max: 2.5 },
      },
    },
    detectRetina: true,
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
      />
    </>
  );
};

export default AddParticles;
