<script setup>
import { ref, onMounted, computed, defineComponent, reactive } from "vue";
import studio from "@theatre/studio";
import { getProject, types as t, onChange } from "@theatre/core";
import {
  TorusKnot,
  Camera,
  LambertMaterial,
  AmbientLight,
  DirectionalLight,
  Renderer,
  Scene,
  StandardMaterial,
  Box,
  FbxModel,
  BasicMaterial,
  CubeTexture,
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
    FbxModel,
    BasicMaterial,
    CubeTexture,
  },
});
const cameraPosition = reactive({
  x: 0,
  y: 0,
  z: 10,
});
const cameraRotation = reactive({
  x: 0,
  y: 0,
  z: 0,
});
const boxPosition = reactive({
  x: 0,
  y: 0,
  z: -30,
});
const boxMetallness = 0;
const boxRotation = reactive({
  x: 0,
  y: 0,
  z: 0,
});

const slideIndex = ref(0);
const slides = [0, 1.5, 2];
const waitingForNextSlide = ref(false);

const project = getProject("TheatreVue");
const sheet1 = project.sheet("Sheet1");
const sheet2 = project.sheet("Sheet2");

onMounted(() => {
  studio.initialize();
  const boxObj = sheet1
    .object("Box", {
      position: t.compound({
        x: t.number(boxPosition.x),
        y: t.number(boxPosition.y),
        z: t.number(boxPosition.z),
      }),
      rotation: t.compound({
        x: t.number(boxRotation.x, { range: [0, 20] }),
        y: t.number(boxRotation.y, { range: [0, 20] }),
        z: t.number(boxRotation.z, { range: [0, 20] }),
      }),
    })
    .onValuesChange((values) => {
      boxPosition.x = values.position.x;
      boxPosition.y = values.position.y;
      boxPosition.z = values.position.z;
      boxRotation.x = (values.rotation.x % 2) * Math.PI;
      boxRotation.y = (values.rotation.y % 2) * Math.PI;
      boxRotation.z = (values.rotation.z % 2) * Math.PI;
    });
  const camObj = sheet2
    .object("Camera", {
      position: t.compound({
        x: t.number(cameraPosition.x),
        y: t.number(cameraPosition.y),
        z: t.number(cameraPosition.z),
      }),
      rotation: t.compound({
        x: t.number(cameraRotation.x, { range: [0, 20] }),
        y: t.number(cameraRotation.y, { range: [0, 20] }),
        z: t.number(cameraRotation.z, { range: [0, 20] }),
      }),
    })
    .onValuesChange((values) => {
      cameraPosition.x = values.position.x;
      cameraPosition.y = values.position.y;
      cameraPosition.z = values.position.z;
    });
  project.ready.then(() => {
    sheet1.sequence.play({ range: [0, 1], iterationCount: Infinity });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        nextSlide();
      }
    });
  });
});

function previousSlide() {
  if (slideIndex.value <= 0) {
    slideIndex.value = 0;
  } else {
    slideIndex.value--;
    sheet2.sequence.position = slides[slideIndex.value];
  }
}

function nextSlide() {
  const nextSlide = slideIndex.value + 1;
  if (nextSlide >= slides.length) return;

  slideIndex.value++;
  sheet2.sequence.play({
    range: [sheet2.sequence.position, slides[slideIndex.value]],
  });
}
</script>

<template>
  <Renderer id="renderer" ref="renderer" antialias resize>
    <Camera
      ref="camera"
      :position="cameraPosition"
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
      <Box ref="box" :position="boxPosition" :size="10" :rotation="boxRotation">
        <StandardMaterial color="#049ef4" />
      </Box>
    </Scene>
  </Renderer>
  <div id="slide-info">
    <div>Slide: {{ slideIndex }}</div>
    <button @click="previousSlide">&lt;</button>
    <button @click="nextSlide">&gt;</button>
  </div>
</template>

<style scoped>
#renderer {
  width: 100%;
  height: 100%;
}

#slide-info {
  position: absolute;
  bottom: 5px;
  left: 5px;
  color: white;
}
</style>
