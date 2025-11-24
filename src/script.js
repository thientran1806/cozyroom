import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import FireVertexShader from './shaders/fire/vertex.glsl'
import FireFragmentShader from './shaders/fire/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400
})
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/*** Baked Textures & Perlin */
const perlinTexture = textureLoader.load("perlin.png")
perlinTexture.wrapS = THREE.RepeatWrapping
perlinTexture.wrapT = THREE.RepeatWrapping

/** Texture */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

/** Material */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/** Light material */
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/** Fire material */
const fireMaterial = new THREE.ShaderMaterial({
    vertexShader: FireVertexShader,
    fragmentShader: FireFragmentShader,
    uniforms:
    {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture)
    },
    side: THREE.DoubleSide,
})

/** Model */
gltfLoader.load(
    'cozyhouse.glb',
    (gltf) =>
    {
        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        const balllight1 = gltf.scene.children.find((child) => child.name === 'ball1')
        const balllight2 = gltf.scene.children.find((child) => child.name === 'ball2')
        const balllight3 = gltf.scene.children.find((child) => child.name === 'ball3')
        const balllight4 = gltf.scene.children.find((child) => child.name === 'ball4')
        const balllight5 = gltf.scene.children.find((child) => child.name === 'ball5')
        const balllight6 = gltf.scene.children.find((child) => child.name === 'ball6')
        const balllight7 = gltf.scene.children.find((child) => child.name === 'ball7')
        const eyeghost = gltf.scene.children.find((child) => child.name === 'eyeball')
        const keyboarddesktop = gltf.scene.children.find((child) => child.name === 'keyboarddesk')
        const keyboardmac = gltf.scene.children.find((child) => child.name === 'keyboardmac')
        const screenlight1 = gltf.scene.children.find((child) => child.name === 'screen1')
        const screenlight2 = gltf.scene.children.find((child) => child.name === 'screen2')
        const spideylight1 = gltf.scene.children.find((child) => child.name === 'spidey1')
        const spideylight2 = gltf.scene.children.find((child) => child.name === 'spidey2')
        const fire = gltf.scene.children.find((child) => child.name === 'fire')
        console.log(fire)

        bakedMesh.material = bakedMaterial
        balllight1.material = poleLightMaterial
        balllight2.material = poleLightMaterial
        balllight3.material = poleLightMaterial
        balllight4.material = poleLightMaterial
        balllight5.material = poleLightMaterial
        balllight6.material = poleLightMaterial
        balllight7.material = poleLightMaterial
        eyeghost.material = poleLightMaterial
        keyboarddesktop.material = poleLightMaterial
        keyboardmac.material = poleLightMaterial
        screenlight1.material = poleLightMaterial
        screenlight2.material = poleLightMaterial
        spideylight1.material = poleLightMaterial
        spideylight2.material = poleLightMaterial
        fire.material = fireMaterial
        scene.add(gltf.scene)
    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 200
camera.position.y = 2
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(0, 1, 1) // Set the orbit target to the center
controls.minDistance = 4
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI / 2 // Prevent camera from going below floor (90 degrees is horizontal)
controls.minPolarAngle = 0 // Allow looking from above
controls.minAzimuthAngle = -Math.PI/// Limit horizontal rotation (prevent going through walls)
controls.maxAzimuthAngle = Math.PI// Limit horizontal rotation (prevent going through walls)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update fire material time
    fireMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()