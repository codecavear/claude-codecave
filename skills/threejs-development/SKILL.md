---
name: threejs-development
description: Best practices for Three.js 3D development. Use when the user asks to "create a scene", "add 3D objects", "build a game", or discusses Three.js patterns for Nuxt applications.
---

# Three.js Development Patterns

## Project Structure
```
app/
├── composables/
│   ├── useThree.ts        # Scene setup
│   ├── useGameLoop.ts     # Animation loop
│   └── useInputManager.ts # Input handling
└── components/three/
    └── Scene.vue          # Main container
```

## Core Setup

### useThree Composable
- Initialize renderer, camera, scene
- Set up OrbitControls
- Add ambient + directional lights
- Handle resize with useResizeObserver

### useGameLoop
- Use requestAnimationFrame
- Calculate delta time in seconds
- Clean up on unmount

## Performance Rules
1. **Object Pooling** - Reuse Vector3, Matrix4
2. **Geometry Caching** - Store shared geometries
3. **Instanced Meshes** - For many identical objects
4. **Dispose Resources** - Clean up on unmount

## MCP Tools (when server running)
- `getSceneState()` - Check current objects
- `addObject()` - Add to scene
- `moveObject()` - Change position
- `startRotation()` / `stopRotation()` - Animate

## Common Patterns

### Raycasting
```ts
raycaster.setFromCamera(pointer, camera)
const intersects = raycaster.intersectObjects(scene.children)
```

### Model Loading
```ts
const loader = new GLTFLoader()
const gltf = await loader.loadAsync(url)
scene.add(gltf.scene)
```

## Checklist
- [ ] Container has ref and dimensions
- [ ] Game loop with delta time
- [ ] Cleanup in onUnmounted
- [ ] Object pooling for allocations
- [ ] Resize handler connected
