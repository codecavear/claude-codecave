# /new-landing-page

Scaffold a complete landing page with all sections and i18n setup.

## Usage

```
/new-landing-page [page-name]
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page-name` | `index` | Page filename (without .vue) |

## What It Creates

### Files

1. **Page file** (`app/pages/{page-name}.vue`)
   - Complete landing page structure
   - SEO meta setup
   - All section components

2. **i18n translations** (`i18n/locales/en.json` additions)
   - Hero, features, pricing, FAQ, CTA sections
   - Ready-to-customize placeholder text

3. **Visual components** (if not exist)
   - `app/components/HeroBackground.vue`
   - `app/components/StarsBg.vue`

## Execution Steps

### Step 1: Gather Information

Ask for:
- Page name (default: `index`)
- App/product name
- Primary color preference
- Which sections to include:
  - [ ] Hero (always)
  - [ ] Social proof / logos
  - [ ] Features grid
  - [ ] Benefits with images
  - [ ] Testimonials
  - [ ] Pricing
  - [ ] FAQ
  - [ ] Final CTA (always)

### Step 2: Create Page

```vue
<!-- app/pages/{page-name}.vue -->
<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  titleTemplate: '',
  title: t('{page}.seo.title'),
  ogTitle: t('{page}.seo.title'),
  description: t('{page}.seo.description'),
  ogDescription: t('{page}.seo.description')
})

defineOgImageComponent('Saas')

// Hero links
const heroLinks = computed(() => [
  {
    label: t('{page}.hero.cta.primary'),
    icon: 'i-lucide-arrow-right',
    trailing: true,
    to: '/signup',
    size: 'xl' as const
  },
  {
    label: t('{page}.hero.cta.secondary'),
    icon: 'i-lucide-play',
    size: 'xl' as const,
    color: 'neutral' as const,
    variant: 'subtle' as const,
    to: '/demo'
  }
])

// Features
const features = computed(() => [
  {
    title: t('{page}.features.items.0.title'),
    description: t('{page}.features.items.0.description'),
    icon: 'i-lucide-zap'
  },
  {
    title: t('{page}.features.items.1.title'),
    description: t('{page}.features.items.1.description'),
    icon: 'i-lucide-shield-check'
  },
  {
    title: t('{page}.features.items.2.title'),
    description: t('{page}.features.items.2.description'),
    icon: 'i-lucide-trending-up'
  },
  {
    title: t('{page}.features.items.3.title'),
    description: t('{page}.features.items.3.description'),
    icon: 'i-lucide-headphones'
  },
  {
    title: t('{page}.features.items.4.title'),
    description: t('{page}.features.items.4.description'),
    icon: 'i-lucide-bar-chart-3'
  },
  {
    title: t('{page}.features.items.5.title'),
    description: t('{page}.features.items.5.description'),
    icon: 'i-lucide-puzzle'
  }
])

// CTA links
const ctaLinks = computed(() => [
  {
    label: t('{page}.cta.primary'),
    to: '/signup',
    trailingIcon: 'i-lucide-arrow-right'
  },
  {
    label: t('{page}.cta.secondary'),
    to: '/contact',
    variant: 'subtle' as const,
    icon: 'i-lucide-message-circle'
  }
])
</script>

<template>
  <div>
    <!-- Hero -->
    <UPageHero
      :description="t('{page}.hero.description')"
      :links="heroLinks"
    >
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        {{ t('{page}.hero.title') }}
        <span class="text-primary">{{ t('{page}.hero.titleHighlight') }}</span>
      </template>
    </UPageHero>

    <!-- Features -->
    <UPageSection
      :title="t('{page}.features.title')"
      :description="t('{page}.features.description')"
    >
      <UPageGrid>
        <UPageCard
          v-for="(feature, index) in features"
          :key="index"
          v-bind="feature"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <!-- CTA -->
    <USeparator />

    <UPageCTA
      :title="t('{page}.cta.title')"
      :description="t('{page}.cta.description')"
      :links="ctaLinks"
      variant="naked"
      class="overflow-hidden"
    >
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
```

### Step 3: Add i18n Translations

Add to `i18n/locales/en.json`:

```json
{
  "{page}": {
    "seo": {
      "title": "{App Name} - Your Tagline",
      "description": "A compelling description for search engines and social sharing"
    },
    "hero": {
      "title": "Transform Your ",
      "titleHighlight": "Workflow",
      "description": "The all-in-one platform that helps teams collaborate, automate, and scale their operations.",
      "cta": {
        "primary": "Get Started Free",
        "secondary": "Watch Demo"
      }
    },
    "features": {
      "title": "Everything you need",
      "description": "Powerful features designed to help your team succeed",
      "items": [
        {
          "title": "Lightning Fast",
          "description": "Optimized for speed with instant load times"
        },
        {
          "title": "Enterprise Security",
          "description": "Bank-grade encryption and compliance"
        },
        {
          "title": "Scalable",
          "description": "Grows with your business needs"
        },
        {
          "title": "24/7 Support",
          "description": "Round-the-clock expert assistance"
        },
        {
          "title": "Analytics",
          "description": "Deep insights into your data"
        },
        {
          "title": "Integrations",
          "description": "Connect with your favorite tools"
        }
      ]
    },
    "cta": {
      "title": "Ready to get started?",
      "description": "Join thousands of teams already transforming their workflow",
      "primary": "Start Free Trial",
      "secondary": "Contact Sales"
    }
  }
}
```

### Step 4: Create Background Components

If they don't exist, create:

**HeroBackground.vue:**
```vue
<template>
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
  </div>
</template>
```

**StarsBg.vue:**
```vue
<template>
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div
      v-for="i in 50"
      :key="i"
      class="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
      :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`
      }"
    />
  </div>
</template>
```

## Checklist

After scaffolding:

- [ ] Update SEO title and description
- [ ] Customize hero text and CTAs
- [ ] Replace placeholder feature content
- [ ] Add product images/screenshots
- [ ] Connect CTA buttons to actual routes
- [ ] Test mobile responsiveness
- [ ] Verify dark mode appearance
