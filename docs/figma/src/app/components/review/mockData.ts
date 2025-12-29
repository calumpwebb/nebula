import type { Document, Comment } from "./types";

export const mockDocuments: Document[] = [
  {
    id: "design-doc",
    title: "Design Doc",
    content: `# Dark Mode Feature Design

## Overview
Implement a comprehensive dark mode solution for the entire application with user preference persistence and system theme detection.

## Goals
- Provide seamless dark/light theme switching
- Respect user's system preferences by default
- Persist theme choice across sessions
- Ensure WCAG AA contrast compliance in both modes

## User Stories
1. As a user, I want to toggle between dark and light modes so I can work comfortably in different lighting conditions
2. As a user, I want the app to remember my theme preference
3. As a user, I want the app to default to my system theme if I haven't set a preference

## Technical Approach

### Theme Storage
Store theme preference in localStorage with key 'nebula-theme'. Values: 'light' | 'dark' | 'system'.

### Implementation Strategy
Use CSS custom properties for all colors. Apply .dark class to root element when dark mode is active.

### Color Palette
Define comprehensive color tokens covering:
- Backgrounds (primary, secondary, tertiary)
- Foregrounds (primary, secondary, muted)
- Accents (brand, success, warning, error)
- Borders and overlays

### Detection & Initialization
On app load:
1. Check localStorage for saved preference
2. If no preference, detect system theme via matchMedia
3. Apply appropriate theme class
4. Listen for system theme changes when in 'system' mode

## Open Questions
- Should we support auto-switching (dark at night, light during day)?
- Do we need a "dim" mode between light and dark?
- Animation duration for theme transitions?

## Success Criteria
- Users can toggle theme via UI control
- Theme persists across browser sessions  
- All UI components render correctly in both modes
- No flash of unstyled content on page load
- Passes automated accessibility tests`,
  },
  {
    id: "plan-doc",
    title: "Implementation Plan",
    content: `# Dark Mode Implementation Plan

## Phase 1: Foundation (Est. 2 days)

### Task 1.1: Color Token System
- [ ] Define CSS custom properties for all color tokens
- [ ] Create light theme variable definitions
- [ ] Create dark theme variable definitions
- [ ] Test color contrast ratios with accessibility tools

**Files to modify:**
- src/styles/theme.css
- src/styles/colors.css (new)

**Commands:**
\`\`\`bash
# No build commands needed for this task
\`\`\`

### Task 1.2: Theme Context Setup  
- [ ] Create ThemeContext with React Context API
- [ ] Implement useTheme hook
- [ ] Add theme detection logic (localStorage + system)
- [ ] Add theme persistence logic

**Files to create:**
- src/contexts/ThemeContext.tsx
- src/hooks/useTheme.ts

**Commands:**
\`\`\`bash
npm install --save-dev @types/node
\`\`\`

## Phase 2: UI Components (Est. 3 days)

### Task 2.1: Theme Toggle Component
- [ ] Design toggle UI (sun/moon icons)
- [ ] Implement three-state toggle (light/dark/system)
- [ ] Add smooth transition animations
- [ ] Position in app header/settings

**Files to create:**
- src/components/ThemeToggle.tsx

**Dependencies:**
- lucide-react for icons

### Task 2.2: Update Existing Components
- [ ] Audit all components for hardcoded colors
- [ ] Replace with CSS custom properties
- [ ] Test each component in both themes
- [ ] Fix any contrast/visibility issues

**Files to review:**
- All files in src/components/

### Task 2.3: Document Review UI
- [ ] Ensure code syntax highlighting works in dark mode
- [ ] Update comment bubble styling
- [ ] Verify annotation overlays are visible
- [ ] Test with various document types

## Phase 3: Testing & Polish (Est. 1 day)

### Task 3.1: Automated Tests
- [ ] Write unit tests for theme context
- [ ] Write integration tests for theme switching
- [ ] Add visual regression tests for both themes

**Commands:**
\`\`\`bash
npm run test
npm run test:visual
\`\`\`

### Task 3.2: Manual QA Checklist
- [ ] Test theme toggle functionality
- [ ] Verify localStorage persistence
- [ ] Test system theme detection on different OS
- [ ] Check for FOUC (flash of unstyled content)
- [ ] Verify all pages in both modes
- [ ] Test theme switching mid-workflow

### Task 3.3: Performance Optimization
- [ ] Minimize theme class application overhead
- [ ] Optimize CSS custom property updates
- [ ] Ensure no layout shift during theme change

## Rollout Plan
1. Deploy to staging environment
2. Internal team dogfooding (1 week)
3. Beta flag for early adopters
4. Full release to all users

## Rollback Strategy
If critical issues arise:
1. Disable theme toggle UI
2. Force light mode for all users
3. Fix issues in hotfix branch
4. Re-enable once validated`,
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    documentId: "design-doc",
    author: "Sarah Chen",
    authorType: "human",
    content: "Should we consider a gradual transition animation when switching themes? A harsh instant switch might be jarring.",
    timestamp: "2024-01-15T10:30:00Z",
    lineStart: 28,
    lineEnd: 28,
    resolved: false,
    replies: [
      {
        id: "r1",
        author: "Nebula AI",
        authorType: "ai",
        content: "Good point. I can add a 200ms transition on background and color properties. We should avoid transitioning layout properties to prevent jank. I'll add this to the open questions section.",
        timestamp: "2024-01-15T10:32:00Z",
      },
    ],
  },
  {
    id: "c2",
    documentId: "design-doc",
    author: "Nebula AI",
    authorType: "ai",
    content: "I notice we haven't specified browser support requirements. Should we polyfill CSS custom properties for IE11, or is it safe to assume modern browsers only?",
    timestamp: "2024-01-15T10:35:00Z",
    lineStart: 34,
    lineEnd: 38,
    resolved: false,
  },
  {
    id: "c3",
    documentId: "design-doc",
    author: "Mike Torres",
    authorType: "human",
    content: "The auto-switching feature (dark at night) is interesting but adds complexity. I'd vote to defer this to v2. Let's nail the basics first.",
    timestamp: "2024-01-15T11:00:00Z",
    lineStart: 51,
    lineEnd: 52,
    resolved: true,
  },
  {
    id: "c4",
    documentId: "design-doc",
    author: "Sarah Chen",
    authorType: "human",
    content: "Can we add a success metric around what percentage of users actually use dark mode? Would be useful data for future UI decisions.",
    timestamp: "2024-01-15T11:15:00Z",
    lineStart: 58,
    lineEnd: 61,
    resolved: false,
  },
  {
    id: "c5",
    documentId: "plan-doc",
    author: "Nebula AI",
    authorType: "ai",
    content: "The color contrast testing should happen before we finalize the color tokens. Should I move this to be the first subtask, or add it as a prerequisite?",
    timestamp: "2024-01-15T11:20:00Z",
    lineStart: 7,
    lineEnd: 10,
    resolved: false,
  },
  {
    id: "c6",
    documentId: "plan-doc",
    author: "Mike Torres",
    authorType: "human",
    content: "3 days for updating existing components feels optimistic. We have 50+ components. Should we break this down further or extend the timeline?",
    timestamp: "2024-01-15T11:30:00Z",
    lineStart: 42,
    lineEnd: 47,
    resolved: false,
    replies: [
      {
        id: "r2",
        author: "Sarah Chen",
        authorType: "human",
        content: "Agreed. Maybe we can prioritize core components first and do others in a follow-up mission?",
        timestamp: "2024-01-15T11:35:00Z",
      },
    ],
  },
];
