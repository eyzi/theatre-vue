<script setup>
import { ref, onMounted, computed } from "vue";
import * as THREE from "three";
import studio from "@theatre/studio";
import { getProject, types } from "@theatre/core";
import extension from "@theatre/r3f/dist/extension";

const canvas = ref(null);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  10,
  200
);
camera.position.z = 50;
const geometry = new THREE.TorusKnotGeometry(10, 3, 300, 16);
const material = new THREE.MeshStandardMaterial({ color: "#f00" });
material.color = new THREE.Color("#049ef4");
material.roughness = 0.5;
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight("#ff0000", 30 /* , 0, 1 */);
directionalLight.position.y = 20;
directionalLight.position.z = 20;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.left = -20;
scene.add(directionalLight);
const rectAreaLight = new THREE.RectAreaLight("#ff0", 1, 50, 50);
rectAreaLight.position.z = 10;
rectAreaLight.position.y = -40;
rectAreaLight.position.x = -20;
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(rectAreaLight);

onMounted(() => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas.value,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);

  const tick = function () {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  window.addEventListener(
    "resize",
    function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },
    false
  );

  tick();

  studio.initialize();
  studio.extend(extension);
  const project = getProject("TheatreVue");
  const sheet = project.sheet("Sheet");
  const torusKnotObj = sheet.object("Torus Knot", {
    rotation: types.compound({
      x: types.number(mesh.rotation.x, { range: [-2, 2] }),
      y: types.number(mesh.rotation.y, { range: [-2, 2] }),
      z: types.number(mesh.rotation.z, { range: [-2, 2] }),
    }),
  });

  torusKnotObj.onValuesChange((values) => {
    const { x, y, z } = values.rotation;
    mesh.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI);
  });
});
</script>

<template>
  <canvas id="canvas" ref="canvas"></canvas>
</template>

<style scoped>
#canvas {
  width: 100%;
  height: 100%;
}
</style>
