# Landing Page Patterns

## Triggers
- "create landing page"
- "build landing"
- "new landing page"
- "add hero section"
- "create pricing page"
- "add testimonials"
- "build features section"

## Overview

This skill provides patterns for building high-converting SaaS landing pages using Nuxt UI Pro components. Works with the `nuxt-ui-builder` agent.

## Landing Page Anatomy

A complete landing page follows this flow:

```
1. Hero          → Capture attention, primary CTA
2. Social Proof  → Logos, trust badges
3. Features      → Core value proposition
4. Benefits      → How it helps (with visuals)
5. Testimonials  → Customer validation
6. Pricing       → Clear options
7. FAQ           → Address objections
8. Final CTA     → Convert visitors
```

---

## Core Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `UPageHero` | Hero section with title, description, CTAs | `title`, `description`, `links` |
| `UPageSection` | Content sections with features | `title`, `description`, `features`, `orientation` |
| `UPageCTA` | Call-to-action blocks | `title`, `description`, `links`, `variant` |
| `UPageCard` | Feature/benefit cards | `title`, `description`, `icon`, `spotlight` |
| `UPageGrid` | Responsive card grid | Children: `UPageCard` |
| `UPageFeature` | Showcase key features | `title`, `description`, `icon` |
| `UPageLogos` | Logo cloud for social proof | Children: icons/images |
| `UPricingPlans` | Pricing tier container | `scale` |
| `UPricingPlan` | Individual pricing card | `title`, `price`, `features`, `highlight` |
| `UPricingTable` | Feature comparison table | `plans`, `features` |

---

## Section Patterns

### Hero Section

```vue
<script setup lang="ts">
const { t } = useI18n()

const heroLinks = computed(() => [
  {
    label: t('hero.cta.primary'),
    icon: 'i-lucide-arrow-right',
    trailing: true,
    to: '/signup',
    size: 'xl' as const
  },
  {
    label: t('hero.cta.secondary'),
    icon: 'i-lucide-play',
    size: 'xl' as const,
    color: 'neutral' as const,
    variant: 'subtle' as const,
    to: '/demo'
  }
])
</script>

<template>
  <UPageHero
    :description="t('hero.description')"
    :links="heroLinks"
  >
    <template #top>
      <HeroBackground />
    </template>

    <template #title>
      {{ t('hero.title') }}
      <span class="text-primary">{{ t('hero.titleHighlight') }}</span>
    </template>

    <!-- Optional: Video/Image/Demo -->
    <PromotionalVideo />
  </UPageHero>
</template>
```

### Social Proof / Logo Cloud

```vue
<template>
  <UPageSection>
    <UPageLogos :title="t('logos.title')">
      <UIcon
        v-for="icon in logoIcons"
        :key="icon"
        :name="icon"
        class="w-12 h-12 flex-shrink-0 text-muted"
      />
    </UPageLogos>
  </UPageSection>
</template>

<script setup lang="ts">
const logoIcons = [
  'i-simple-icons-google',
  'i-simple-icons-microsoft',
  'i-simple-icons-apple',
  'i-simple-icons-meta',
  'i-simple-icons-amazon'
]
</script>
```

### Features Grid

```vue
<script setup lang="ts">
const { t } = useI18n()

const features = computed(() => [
  {
    title: t('features.speed.title'),
    description: t('features.speed.description'),
    icon: 'i-lucide-zap'
  },
  {
    title: t('features.security.title'),
    description: t('features.security.description'),
    icon: 'i-lucide-shield-check'
  },
  {
    title: t('features.scale.title'),
    description: t('features.scale.description'),
    icon: 'i-lucide-trending-up'
  },
  {
    title: t('features.support.title'),
    description: t('features.support.description'),
    icon: 'i-lucide-headphones'
  },
  {
    title: t('features.analytics.title'),
    description: t('features.analytics.description'),
    icon: 'i-lucide-bar-chart-3'
  },
  {
    title: t('features.integrations.title'),
    description: t('features.integrations.description'),
    icon: 'i-lucide-puzzle'
  }
])
</script>

<template>
  <UPageSection
    :title="t('features.title')"
    :description="t('features.description')"
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
</template>
```

### Benefits with Images (Alternating)

```vue
<script setup lang="ts">
const { t } = useI18n()

const sections = computed(() => [
  {
    title: t('benefits.automation.title'),
    description: t('benefits.automation.description'),
    orientation: 'horizontal' as const,
    features: [
      { name: t('benefits.automation.f1'), icon: 'i-lucide-bot' },
      { name: t('benefits.automation.f2'), icon: 'i-lucide-clock' },
      { name: t('benefits.automation.f3'), icon: 'i-lucide-repeat' }
    ]
  },
  {
    title: t('benefits.insights.title'),
    description: t('benefits.insights.description'),
    orientation: 'horizontal' as const,
    reverse: true,
    features: [
      { name: t('benefits.insights.f1'), icon: 'i-lucide-line-chart' },
      { name: t('benefits.insights.f2'), icon: 'i-lucide-target' },
      { name: t('benefits.insights.f3'), icon: 'i-lucide-lightbulb' }
    ]
  }
])
</script>

<template>
  <UPageSection
    v-for="(section, index) in sections"
    :key="index"
    :title="section.title"
    :description="section.description"
    :orientation="section.orientation"
    :reverse="section.reverse"
    :features="section.features"
  >
    <img
      :src="`/images/benefit-${index + 1}.png`"
      :alt="section.title"
      class="rounded-lg shadow-xl"
    />
  </UPageSection>
</template>
```

### Testimonials

```vue
<script setup lang="ts">
const { t } = useI18n()

const testimonials = computed(() => [
  {
    quote: t('testimonials.1.quote'),
    author: {
      name: t('testimonials.1.name'),
      title: t('testimonials.1.title'),
      avatar: '/avatars/user1.jpg'
    }
  },
  {
    quote: t('testimonials.2.quote'),
    author: {
      name: t('testimonials.2.name'),
      title: t('testimonials.2.title'),
      avatar: '/avatars/user2.jpg'
    }
  },
  {
    quote: t('testimonials.3.quote'),
    author: {
      name: t('testimonials.3.name'),
      title: t('testimonials.3.title'),
      avatar: '/avatars/user3.jpg'
    }
  }
])
</script>

<template>
  <UPageSection
    :title="t('testimonials.title')"
    :description="t('testimonials.description')"
  >
    <UPageGrid>
      <UCard v-for="(item, index) in testimonials" :key="index">
        <p class="text-muted italic mb-4">"{{ item.quote }}"</p>
        <div class="flex items-center gap-3">
          <UAvatar :src="item.author.avatar" :alt="item.author.name" />
          <div>
            <p class="font-medium">{{ item.author.name }}</p>
            <p class="text-sm text-muted">{{ item.author.title }}</p>
          </div>
        </div>
      </UCard>
    </UPageGrid>
  </UPageSection>
</template>
```

### Pricing Section

```vue
<script setup lang="ts">
const { t } = useI18n()

const isYearly = ref(false)

const billingOptions = computed(() => [
  { label: t('pricing.monthly'), value: false },
  { label: t('pricing.yearly'), value: true }
])

const plans = computed(() => [
  {
    title: t('pricing.starter.title'),
    description: t('pricing.starter.description'),
    price: isYearly.value ? '$99' : '$12',
    billingCycle: isYearly.value ? t('pricing.perYear') : t('pricing.perMonth'),
    features: t('pricing.starter.features'),
    button: {
      label: t('pricing.getStarted'),
      color: 'neutral' as const,
      variant: 'subtle' as const
    }
  },
  {
    title: t('pricing.pro.title'),
    description: t('pricing.pro.description'),
    price: isYearly.value ? '$199' : '$24',
    billingCycle: isYearly.value ? t('pricing.perYear') : t('pricing.perMonth'),
    features: t('pricing.pro.features'),
    highlight: true,
    scale: true,
    badge: { label: t('pricing.popular') },
    button: { label: t('pricing.getStarted') }
  },
  {
    title: t('pricing.enterprise.title'),
    description: t('pricing.enterprise.description'),
    price: t('pricing.custom'),
    features: t('pricing.enterprise.features'),
    button: {
      label: t('pricing.contactSales'),
      color: 'neutral' as const,
      variant: 'subtle' as const
    }
  }
])
</script>

<template>
  <UPageSection id="pricing">
    <UPageHero
      :title="t('pricing.title')"
      :description="t('pricing.description')"
    >
      <template #links>
        <USwitch
          v-model="isYearly"
          :label="t('pricing.yearlyDiscount')"
        />
      </template>
    </UPageHero>

    <UContainer>
      <UPricingPlans scale>
        <UPricingPlan
          v-for="(plan, index) in plans"
          :key="index"
          v-bind="plan"
        />
      </UPricingPlans>
    </UContainer>
  </UPageSection>
</template>
```

### FAQ Section

```vue
<script setup lang="ts">
const { t } = useI18n()

const faqItems = computed(() => {
  return t('faq.items') as unknown as Array<{ label: string; content: string }>
})
</script>

<template>
  <UPageSection
    :title="t('faq.title')"
    :description="t('faq.description')"
  >
    <UAccordion
      :items="faqItems"
      :default-value="['0']"
      type="multiple"
      class="max-w-3xl mx-auto"
      :ui="{
        trigger: 'text-base text-highlighted',
        body: 'text-base text-muted'
      }"
    />
  </UPageSection>
</template>
```

### Final CTA

```vue
<script setup lang="ts">
const { t } = useI18n()

const ctaLinks = computed(() => [
  {
    label: t('cta.primary'),
    to: '/signup',
    trailingIcon: 'i-lucide-arrow-right'
  },
  {
    label: t('cta.secondary'),
    to: '/contact',
    variant: 'subtle' as const,
    icon: 'i-lucide-message-circle'
  }
])
</script>

<template>
  <USeparator />

  <UPageCTA
    :title="t('cta.title')"
    :description="t('cta.description')"
    :links="ctaLinks"
    variant="naked"
    class="overflow-hidden"
  >
    <LazyStarsBg />
  </UPageCTA>
</template>
```

---

## Complete Landing Page Template

```vue
<script setup lang="ts">
const { t } = useI18n()

// SEO
useSeoMeta({
  titleTemplate: '',
  title: t('seo.title'),
  ogTitle: t('seo.title'),
  description: t('seo.description'),
  ogDescription: t('seo.description')
})

defineOgImageComponent('Saas')

// Data structures...
const heroLinks = computed(() => [...])
const features = computed(() => [...])
const testimonials = computed(() => [...])
const plans = computed(() => [...])
const faqItems = computed(() => [...])
const ctaLinks = computed(() => [...])
</script>

<template>
  <div>
    <!-- 1. Hero -->
    <UPageHero :links="heroLinks">
      <template #title>...</template>
      <PromotionalVideo />
    </UPageHero>

    <!-- 2. Social Proof -->
    <UPageSection>
      <UPageLogos>...</UPageLogos>
    </UPageSection>

    <!-- 3. Features Grid -->
    <UPageSection :title="t('features.title')">
      <UPageGrid>
        <UPageCard v-for="f in features" v-bind="f" spotlight />
      </UPageGrid>
    </UPageSection>

    <!-- 4. Benefits (alternating) -->
    <UPageSection v-for="section in benefits" v-bind="section">
      <img :src="section.image" />
    </UPageSection>

    <!-- 5. Testimonials -->
    <UPageSection :title="t('testimonials.title')">
      <UPageGrid>...</UPageGrid>
    </UPageSection>

    <!-- 6. Pricing -->
    <UContainer>
      <UPricingPlans scale>
        <UPricingPlan v-for="plan in plans" v-bind="plan" />
      </UPricingPlans>
    </UContainer>

    <!-- 7. FAQ -->
    <UPageSection :title="t('faq.title')">
      <UAccordion :items="faqItems" />
    </UPageSection>

    <!-- 8. Final CTA -->
    <USeparator />
    <UPageCTA :links="ctaLinks">
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
```

---

## i18n Structure

Create translations in `i18n/locales/en.json`:

```json
{
  "seo": {
    "title": "Your App - Tagline Here",
    "description": "A compelling meta description for search engines"
  },
  "hero": {
    "title": "Transform Your ",
    "titleHighlight": "Workflow",
    "description": "The all-in-one platform that helps teams...",
    "cta": {
      "primary": "Get Started Free",
      "secondary": "Watch Demo"
    }
  },
  "logos": {
    "title": "Trusted by innovative teams"
  },
  "features": {
    "title": "Everything you need",
    "description": "Powerful features to help you succeed",
    "speed": {
      "title": "Lightning Fast",
      "description": "Built for performance..."
    }
  },
  "pricing": {
    "title": "Simple, transparent pricing",
    "description": "No hidden fees. Cancel anytime.",
    "monthly": "Monthly",
    "yearly": "Yearly",
    "perMonth": "/month",
    "perYear": "/year",
    "getStarted": "Get Started",
    "popular": "Most Popular"
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "description": "Everything you need to know",
    "items": [
      { "label": "Question 1?", "content": "Answer 1..." },
      { "label": "Question 2?", "content": "Answer 2..." }
    ]
  },
  "cta": {
    "title": "Ready to get started?",
    "description": "Join thousands of teams already using our platform",
    "primary": "Start Free Trial",
    "secondary": "Contact Sales"
  }
}
```

---

## Visual Components

### Hero Background

```vue
<!-- components/HeroBackground.vue -->
<template>
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
  </div>
</template>
```

### Stars Background (for CTA)

```vue
<!-- components/StarsBg.vue -->
<template>
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div v-for="i in 50" :key="i" class="star" />
  </div>
</template>

<style scoped>
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s ease-in-out infinite;
}
</style>
```

---

## Checklist

Before launch:

- [ ] SEO meta tags (`useSeoMeta`)
- [ ] OG image component (`defineOgImageComponent`)
- [ ] All text in i18n files
- [ ] Mobile responsive (test all breakpoints)
- [ ] Dark mode support
- [ ] Hero CTA links to signup/demo
- [ ] Pricing links to checkout
- [ ] FAQ covers common objections
- [ ] Social proof (logos, testimonials, stats)
- [ ] Page speed optimized (lazy load images)
- [ ] Analytics tracking
