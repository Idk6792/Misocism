"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export function Cat3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    scene.background = null // Transparent background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5
    camera.position.y = 1

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background
    renderer.outputEncoding = THREE.sRGBEncoding
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
    backLight.position.set(-5, 5, -5)
    scene.add(backLight)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // Cat model
    let cat: THREE.Object3D
    const loader = new GLTFLoader()

    // Use a placeholder cat model (in a real app, you'd use your own model)
    loader.load(
      "https://threejs.org/examples/models/gltf/Nefertiti/Nefertiti.glb",
      (gltf) => {
        cat = gltf.scene
        cat.scale.set(0.5, 0.5, 0.5)
        scene.add(cat)

        // Add some animation
        const mixer = new THREE.AnimationMixer(cat)
        if (gltf.animations.length > 0) {
          const action = mixer.clipAction(gltf.animations[0])
          action.play()
        }
      },
      undefined,
      (error) => {
        console.error("An error occurred loading the model:", error)
      },
    )

    // Animation loop
    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Render scene
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
