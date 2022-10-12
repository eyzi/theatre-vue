<script setup>
import { ref, onMounted, computed, defineComponent, reactive } from "vue";
import studio from "@theatre/studio";
import { getProject, types as t } from "@theatre/core";
import {
  TorusKnot,
  Camera,
  LambertMaterial,
  AmbientLight,
  DirectionalLight,
  Renderer,
  Scene,
  StandardMaterial,
} from "troisjs";

defineComponent({
  components: {
    TorusKnot,
    Camera,
    LambertMaterial,
    AmbientLight,
    DirectionalLight,
    Renderer,
    Scene,
    StandardMaterial,
  },
});

const torusKnotRotation = reactive({
  x: 0,
  y: 0,
  z: 0,
});

onMounted(() => {
  studio.initialize();
  const project = getProject("TheatreVue");
  const sheet = project.sheet("Sheet");
  const torusKnotObj = sheet.object("Torus Knot", {
    rotation: t.compound({
      x: t.number(torusKnotRotation.x, { range: [-2, 2] }),
      y: t.number(torusKnotRotation.y, { range: [-2, 2] }),
      z: t.number(torusKnotRotation.z, { range: [-2, 2] }),
    }),
  });
  torusKnotObj.onValuesChange((values) => {
    const { x, y, z } = values.rotation;
    torusKnotRotation.x = x * Math.PI;
    torusKnotRotation.y = y * Math.PI;
    torusKnotRotation.z = z * Math.PI;
  });
});
</script>

<template>
  <Renderer id="renderer" ref="renderer" antialias resize>
    <Camera
      ref="camera"
      :position="{ z: 10 }"
      :aspect="1"
      :fov="70"
      :near="0.1"
      :far="2000"
    />
    <Scene ref="scene">
      <AmbientLight
        :position="{ y: 50, z: 50 }"
        color="#ffffff"
        :intensity="0.5"
      />
      <DirectionalLight
        :position="{ y: 20, z: 20 }"
        color="#ff0000"
        :intensity="30"
        castShadow
        :shadowMapSize="{ width: 2048, height: 2048 }"
        :shadowCamera="{
          far: 50,
          near: 1,
          top: 20,
          right: 20,
          bottom: -20,
          left: -20,
        }"
      />
      <TorusKnot
        ref="torusKnot"
        :position="{ z: -30 }"
        :rotation="torusKnotRotation"
        :radius="10"
        :tube="3"
        :tubularSegments="300"
        :radialSegments="16"
        castShadow
        receiveShadow
      >
        <StandardMaterial color="#049ef4" />
      </TorusKnot>
    </Scene>
  </Renderer>
</template>

<style scoped>
#renderer {
  width: 100%;
  height: 100%;
}
</style>
