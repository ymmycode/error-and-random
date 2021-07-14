import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh } from 'three'
import StatusPanel from 'three/examples/jsm/libs/stats.module'


// Debug
const debugUI = new dat.GUI()
debugUI.width = 300
debugUI.closed = true

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// COLOR PALETTE
const colorPalette = 
{
    color1: `#ccff66`,
    color2: `#ff5faa`,
    color3: `#DF00FF`,
}

// TExTURE
const textureLoader = new THREE.TextureLoader()
const matcap = textureLoader.load(`textures/matcaps/9.png`)
const checkboard = textureLoader.load(`textures/checkerboard-8x8.png`)

checkboard.magFilter = THREE.NearestFilter

// MATERIAL
const boundary = new THREE.MeshBasicMaterial()
boundary.color = new THREE.Color(colorPalette.color1)
boundary.side = THREE.BackSide

const material1 = new THREE.MeshMatcapMaterial()
material1.matcap = matcap
material1.color = new THREE.Color(colorPalette.color2)

const material2 = new THREE.MeshBasicMaterial()
material2.map = checkboard
material2.color = new THREE.Color(colorPalette.color3)

const material3 = new THREE.MeshBasicMaterial()
material3.wireframe = true
material3.color = new THREE.Color(colorPalette.color3)


// OBJECT
const sphereBound =  new THREE.SphereBufferGeometry(100, 32, 32)
const boundarySphere = new Mesh(sphereBound, boundary)
scene.add(boundarySphere)

// torus
const torusGeom = new THREE.TorusBufferGeometry(.3, .2, 16, 32)

// sphere
const sphereGeom =  new THREE.SphereBufferGeometry(.2, 8, 8)


// Text 
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    `fonts/Reality_Hyper_Regular.json`,
    function(font)
    {
        const textGeometry = new THREE.TextBufferGeometry(
            `ERROR`,
            {
                font: font,
                size: .8,
                height: .2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .03,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 1
            }
        )

        const text = new THREE.Mesh(textGeometry, material1)
        scene.add(text)

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.02) * 0.5
        // )
        textGeometry.center()

        
        for (let i = 0; i < 100; i++)
        {
            makeRandomTorus()
            makeRandomSphere()
        }        
    }
)

function makeRandomTorus()
{
    const torus = new Mesh(torusGeom, material2)

    torus.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    torus.rotation.x = Math.random() * Math.PI
    torus.rotation.y = Math.random() * Math.PI

    const randomScale = Math.random()
    torus.scale.set(
        randomScale,
        randomScale,
        randomScale
    )

    scene.add(torus)
}

function makeRandomSphere()
{
    const sphere = new Mesh(sphereGeom, material3)

    sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    sphere.rotation.x = Math.random() * Math.PI
    sphere.rotation.y = Math.random() * Math.PI

    const randomScale = Math.random() * 3
    sphere.scale.set(
        randomScale,
        randomScale,
        randomScale
    )

    scene.add(sphere)
}

// SCREEN
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

// CAMERA
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const stats = new StatusPanel()
document.body.appendChild(stats.dom)

// ANIMATe
const clock = new THREE.Clock()

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // cam pos + rot
    camera.position.x = Math.sin(5 * elapsedTime * .5) 
    camera.position.y = -Math.sin(5 * elapsedTime * .5) 
    camera.position.z = Math.sin(5 * elapsedTime * .5) + 5
    camera.rotation.y = Math.sin(20 * elapsedTime * .5) * 2

    // Update controls
    controls.update()

    // Render
    stats.begin()
    renderer.render(scene, camera)
    stats.end()

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}
animate()



// DEBUG PROPERTIES
const resetProperties = {
    resetColor: function()
    {
        boundary.color = new THREE.Color(`#ccff66`)
        material1.color = new THREE.Color(`#ff5faa`)
        material2.color = new THREE.Color(`#DF00FF`)
        material3.color = new THREE.Color(`#DF00FF`)

        material2.wireframe = false
        material3.wireframe = true
        boundary.wireframe = false
    }
}

let counter = 0
const fuckedUpButton = 
{
    randomize: ()=>
    {
        for (let i = 0; i < 100; i++)
        {
            makeRandomTorus()
            makeRandomSphere()
        }
        counter++
        counter > 7 && alert(`PLS REFRESH YOUR BROWSER, THIS IS TOO MUCH!!! XD`)
    }
}

// DEBUG UI
const colorFolder = debugUI.addFolder(`Color`)
colorFolder
.addColor(colorPalette, `color1`)
.onChange(()=>
{
    boundary.color = new THREE.Color(colorPalette.color1)
})
.name(`Boundary Color`)

colorFolder
.addColor(colorPalette, `color2`)
.onChange(()=>
{
    material1.color = new THREE.Color(colorPalette.color2)
})
.name(`Text Overlay Color`)

colorFolder
.addColor(colorPalette, `color3`)
.onChange(()=>
{
    material2.color = new THREE.Color(colorPalette.color3)
    material3.color = new THREE.Color(colorPalette.color3)
})
.name(`Other Color`)

const wireframeFolder = debugUI.addFolder(`Wireframe`)

wireframeFolder
.add(material2, `wireframe`)
.name(`Torus Wireframe`)

wireframeFolder
.add(material3, `wireframe`)
.name(`Sphere Wireframe`)

wireframeFolder
.add(boundary, `wireframe`)
.name(`Boundary Wireframe`)

debugUI
.add(resetProperties, `resetColor`)
.name(`Reset Color (Button)`)

debugUI
.add(fuckedUpButton, `randomize`)
.name(`Populate (Button)`)

