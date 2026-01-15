<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface Component {
  id: string
  name: string
  type: 'agent' | 'skill' | 'command' | 'mcp'
  description: string
  path: string
}

const { data: components } = await useFetch<Component[]>('/api/components')
const selectedComponent = ref<Component | null>(null)
const componentContent = ref<string>('')
const isEditing = ref(false)
const isPanelOpen = ref(false)
const isListOpen = ref(false)
const selectedType = ref<'agent' | 'skill' | 'command' | 'mcp' | null>(null)
const canvasRef = ref<HTMLCanvasElement>()
const nodeLabels = ref<{ name: string; x: number; y: number; type: string }[]>([])

const filteredComponents = computed(() => {
  if (!selectedType.value || !components.value) return []
  return components.value.filter(c => c.type === selectedType.value)
})

function openTypeList(type: 'agent' | 'skill' | 'command' | 'mcp') {
  selectedType.value = type
  isListOpen.value = true
}

const typeColors = {
  agent: 0x3b82f6,    // blue
  skill: 0x22c55e,    // green
  command: 0xf97316,  // orange
  mcp: 0xa855f7       // purple
}

const typeLabels = {
  agent: 'Agents',
  skill: 'Skills',
  command: 'Commands',
  mcp: 'MCP Servers'
}

const stats = computed(() => {
  if (!components.value) return {}
  return {
    agents: components.value.filter(c => c.type === 'agent').length,
    skills: components.value.filter(c => c.type === 'skill').length,
    commands: components.value.filter(c => c.type === 'command').length,
    mcp: components.value.filter(c => c.type === 'mcp').length
  }
})

async function selectComponent(component: Component) {
  selectedComponent.value = component
  isEditing.value = false
  componentContent.value = '' // Reset to show loading state
  isPanelOpen.value = true
  try {
    const { content } = await $fetch<{ content: string }>(`/api/component/${component.path}`)
    componentContent.value = content
  } catch (e) {
    componentContent.value = 'Error loading content'
  }
}

const isSaving = ref(false)
const toast = useToast()

async function saveComponent() {
  if (!selectedComponent.value) return
  isSaving.value = true
  try {
    await $fetch(`/api/component/${selectedComponent.value.path}`, {
      method: 'PUT',
      body: { content: componentContent.value }
    })
    toast.add({ title: 'Saved!', description: `${selectedComponent.value.name} updated successfully`, color: 'success' })
    isEditing.value = false
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to save changes', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

function closePanel() {
  isPanelOpen.value = false
  selectedComponent.value = null
  componentContent.value = ''
  isEditing.value = false
}

onMounted(() => {
  if (!canvasRef.value || !components.value) return

  // Scene setup
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.y = 15
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Create nodes
  const nodes: { mesh: THREE.Mesh; component: Component }[] = []
  const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32)

  // Central hub
  const hubGeometry = new THREE.SphereGeometry(1, 32, 32)
  const hubMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const hub = new THREE.Mesh(hubGeometry, hubMaterial)
  scene.add(hub)

  // Group components by type
  const grouped = {
    agent: components.value.filter(c => c.type === 'agent'),
    skill: components.value.filter(c => c.type === 'skill'),
    command: components.value.filter(c => c.type === 'command'),
    mcp: components.value.filter(c => c.type === 'mcp')
  }

  const typeAngles = { agent: 0, skill: Math.PI / 2, command: Math.PI, mcp: (3 * Math.PI) / 2 }

  Object.entries(grouped).forEach(([type, comps]) => {
    const baseAngle = typeAngles[type as keyof typeof typeAngles]
    const radius = 6
    const spread = Math.PI / 4

    comps.forEach((component, i) => {
      const angle = baseAngle + (i - (comps.length - 1) / 2) * (spread / Math.max(comps.length - 1, 1))
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = 0 // Flat on same plane for top view

      const material = new THREE.MeshBasicMaterial({ color: typeColors[type as keyof typeof typeColors] })
      const mesh = new THREE.Mesh(nodeGeometry, material)
      mesh.position.set(x, y, z)
      mesh.userData = { component }
      scene.add(mesh)
      nodes.push({ mesh, component })

      // Line to hub
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        hub.position,
        mesh.position
      ])
      const lineMaterial = new THREE.LineBasicMaterial({
        color: typeColors[type as keyof typeof typeColors],
        opacity: 0.3,
        transparent: true
      })
      const line = new THREE.Line(lineGeometry, lineMaterial)
      scene.add(line)
    })
  })

  // Function to update label positions
  function updateLabels() {
    const labels: { name: string; x: number; y: number; type: string }[] = []
    nodes.forEach(({ mesh, component }) => {
      const vector = mesh.position.clone()
      vector.project(camera)
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth
      const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight
      labels.push({ name: component.name, x, y, type: component.type })
    })
    nodeLabels.value = labels
  }

  // Raycaster for click detection
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  function onMouseClick(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh))

    if (intersects.length > 0) {
      const clicked = intersects[0].object
      const node = nodes.find(n => n.mesh === clicked)
      if (node) {
        selectComponent(node.component)
      }
    }
  }

  canvasRef.value.addEventListener('click', onMouseClick)

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    updateLabels()
    renderer.render(scene, camera)
  }
  animate()

  // Handle resize
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    canvasRef.value?.removeEventListener('click', onMouseClick)
    renderer.dispose()
  })
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <!-- Three.js Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0" />

    <!-- Header -->
    <div class="absolute top-4 left-4 z-10">
      <h1 class="text-2xl font-bold text-white">Claude Codecave</h1>
      <p class="text-neutral-400">Interactive Plugin Visualizer</p>
    </div>

    <!-- Stats (clickable) -->
    <div class="absolute top-4 right-4 z-10 flex gap-2">
      <UBadge color="info" variant="soft" size="lg" leading-icon="i-lucide-bot" class="cursor-pointer hover:opacity-80" @click="openTypeList('agent')">
        {{ stats.agents }} Agents
      </UBadge>
      <UBadge color="success" variant="soft" size="lg" leading-icon="i-lucide-sparkles" class="cursor-pointer hover:opacity-80" @click="openTypeList('skill')">
        {{ stats.skills }} Skills
      </UBadge>
      <UBadge color="warning" variant="soft" size="lg" leading-icon="i-lucide-terminal" class="cursor-pointer hover:opacity-80" @click="openTypeList('command')">
        {{ stats.commands }} Commands
      </UBadge>
      <UBadge color="secondary" variant="soft" size="lg" leading-icon="i-lucide-server" class="cursor-pointer hover:opacity-80" @click="openTypeList('mcp')">
        {{ stats.mcp }} MCP
      </UBadge>
    </div>

    <!-- Node Labels -->
    <div
      v-for="label in nodeLabels"
      :key="label.name"
      class="absolute z-5 text-xs font-medium pointer-events-none whitespace-nowrap"
      :class="{
        'text-blue-400': label.type === 'agent',
        'text-green-400': label.type === 'skill',
        'text-orange-400': label.type === 'command',
        'text-purple-400': label.type === 'mcp'
      }"
      :style="{ left: `${label.x + 15}px`, top: `${label.y - 8}px` }"
    >
      {{ label.name }}
    </div>

    <!-- Legend -->
    <div class="absolute bottom-4 left-4 z-10 bg-neutral-900/80 backdrop-blur rounded-lg p-4">
      <p class="text-sm text-neutral-400 mb-2">Click a node to view details</p>
      <div class="flex gap-4 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500" />
          <span class="text-neutral-300">Agents</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-green-500" />
          <span class="text-neutral-300">Skills</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-orange-500" />
          <span class="text-neutral-300">Commands</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-purple-500" />
          <span class="text-neutral-300">MCP</span>
        </div>
      </div>
    </div>

    <!-- Detail Panel -->
    <USlideover
      v-model:open="isPanelOpen"
      side="right"
      :ui="{ content: 'max-w-[600px]' }"
      :title="selectedComponent?.name"
      :description="selectedComponent?.description"
    >
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <UBadge
              v-if="selectedComponent"
              :color="selectedComponent.type === 'agent' ? 'info' : selectedComponent.type === 'skill' ? 'success' : selectedComponent.type === 'command' ? 'warning' : 'secondary'"
              variant="soft"
              class="mb-2"
            >
              {{ typeLabels[selectedComponent.type] }}
            </UBadge>
            <h2 class="text-xl font-semibold truncate">{{ selectedComponent?.name }}</h2>
            <p class="text-muted text-sm mt-1">{{ selectedComponent?.description }}</p>
          </div>
        </div>
      </template>

      <template #body>
        <div class="space-y-4">
          <div class="flex gap-2">
            <UButton
              :variant="!isEditing ? 'solid' : 'outline'"
              color="neutral"
              size="sm"
              icon="i-lucide-eye"
              @click="isEditing = false"
            >
              Preview
            </UButton>
            <UButton
              :variant="isEditing ? 'solid' : 'outline'"
              color="neutral"
              size="sm"
              icon="i-lucide-edit"
              @click="isEditing = true"
            >
              Edit
            </UButton>
          </div>

          <div v-if="componentContent === ''" class="flex justify-center py-12">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-muted" />
          </div>

          <div v-else-if="!isEditing" class="prose prose-invert prose-sm max-w-none">
            <pre class="whitespace-pre-wrap text-sm text-neutral-300 font-mono bg-neutral-900 rounded-lg p-4">{{ componentContent }}</pre>
          </div>

          <div v-else>
            <UTextarea
              v-model="componentContent"
              :rows="30"
              variant="outline"
              class="font-mono text-sm w-full"
              autoresize
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div v-if="isEditing" class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="isEditing = false">
            Cancel
          </UButton>
          <UButton color="primary" :loading="isSaving" @click="saveComponent">
            Save Changes
          </UButton>
        </div>
      </template>
    </USlideover>

    <!-- Type List Panel -->
    <USlideover
      v-model:open="isListOpen"
      side="right"
      :ui="{ content: 'max-w-[500px]' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <UBadge
            v-if="selectedType"
            :color="selectedType === 'agent' ? 'info' : selectedType === 'skill' ? 'success' : selectedType === 'command' ? 'warning' : 'secondary'"
            variant="soft"
            size="lg"
          >
            {{ typeLabels[selectedType] }}
          </UBadge>
          <span class="text-lg font-semibold">{{ filteredComponents.length }} items</span>
        </div>
      </template>

      <template #body>
        <div class="space-y-2">
          <div
            v-for="comp in filteredComponents"
            :key="comp.id"
            class="p-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 cursor-pointer transition-colors"
            @click="isListOpen = false; selectComponent(comp)"
          >
            <h3 class="font-medium text-white">{{ comp.name }}</h3>
            <p class="text-sm text-neutral-400 mt-1">{{ comp.description }}</p>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
