import type { Message, Pin } from "./chatTypes";

export const mockMessages: Message[] = [
  {
    id: "m1",
    role: "user",
    content:
      "I want to add dark mode to our app. Not sure exactly how to approach it though.",
    timestamp: "2024-01-15T14:00:00Z",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "Great idea! Let me help you think through this. Dark mode is a popular feature that can improve user experience, especially in low-light environments.\n\nA few questions to start:\n\n1. Do you want to support automatic theme detection based on the user's system preferences?\n2. Should users be able to manually override the theme?\n3. Are there any specific design constraints or brand colors we need to preserve in dark mode?\n\nAlso, I'm thinking about the technical implementation - we could use CSS custom properties for theming, which gives us a lot of flexibility.",
    timestamp: "2024-01-15T14:00:15Z",
    reasoning:
      "User wants dark mode but seems uncertain. I should ask clarifying questions to understand requirements before jumping to solutions. This is a brainstorming phase, so exploration is more valuable than immediate answers.",
  },
  {
    id: "m3",
    role: "user",
    content:
      "Yes to both 1 and 2 - auto-detect by default, but let users choose. For colors, we need to make sure everything stays accessible. WCAG AA at minimum.",
    timestamp: "2024-01-15T14:01:30Z",
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "Perfect! Accessibility is crucial. I'll make sure we test contrast ratios for all color combinations.\n\n**Approach I'm thinking:**\n\n- Use `prefers-color-scheme` media query for system detection\n- Store user preference in localStorage\n- Apply theme via CSS class on root element (.dark)\n- Define all colors as CSS custom properties\n\nOne thing to consider: should theme switching be animated (smooth fade), or instant? Some users find animations jarring, others love them.\n\n📌 *This feels like something we should decide on - want me to pin this for later?*",
    timestamp: "2024-01-15T14:02:00Z",
    toolCalls: [
      {
        id: "t1",
        name: "analyze_codebase",
        input: { path: "src/styles", pattern: "*.css" },
        output: "Found theme.css with existing color definitions",
      },
    ],
    reasoning:
      "User confirmed key requirements. I can now propose a concrete technical approach. The animation question is a good candidate for a pin - it's important but shouldn't block us from moving forward.",
  },
  {
    id: "m5",
    role: "user",
    content: "Yeah, pin that. What about the color palette itself?",
    timestamp: "2024-01-15T14:02:45Z",
  },
  {
    id: "m6",
    role: "assistant",
    content:
      "For the color palette, we'll need to define both light and dark variants for each token:\n\n**Background layers:**\n- Primary background (pure white → dark gray)\n- Secondary background (light gray → darker gray)\n- Elevated surfaces (white → medium gray)\n\n**Foreground colors:**\n- Primary text (dark → light)\n- Secondary text (gray → light gray)\n- Muted/disabled text\n\n**Accent colors:**\n- Brand colors (may need adjustment for dark mode)\n- Success, warning, error states\n- Interactive elements (links, buttons)\n\nI recommend starting with a baseline dark background around `#0a0a0f` or `#1a1a1a` - not pure black, which can cause eye strain and makes it harder to layer UI elements.\n\nShould we support a \"dim\" mode too (between light and dark)? Twitter/X does this.",
    timestamp: "2024-01-15T14:03:30Z",
    reasoning:
      "Providing specific color guidance. The 'dim mode' question is another potential pin - nice-to-have but not essential for v1.",
  },
  {
    id: "m7",
    role: "user",
    content:
      "Dim mode sounds cool but let's keep it simple for now. Just light and dark.",
    timestamp: "2024-01-15T14:04:00Z",
  },
  {
    id: "m8",
    role: "assistant",
    content:
      "Smart call - nail the basics first. ✓\n\n**Summary of what we've discussed:**\n\n1. ✅ Auto-detect system theme, allow manual override\n2. ✅ Store preference in localStorage  \n3. ✅ WCAG AA compliance minimum\n4. ✅ CSS custom properties for all colors\n5. ✅ Two modes: light and dark (no dim mode for v1)\n6. 📌 **Pinned:** Animation duration/style for theme transitions\n\n**Open questions I'm seeing:**\n- How should we handle images/illustrations in dark mode? (Invert? Provide alternate assets?)\n- What about code syntax highlighting? Need dark-friendly highlighting theme?\n- Should theme toggle be in main nav, settings, or both?\n\nReady to move forward with a design doc, or want to explore these questions first?",
    timestamp: "2024-01-15T14:05:00Z",
    toolCalls: [
      {
        id: "t2",
        name: "suggest_next_steps",
        input: { context: "dark_mode_brainstorm" },
        output:
          "Recommend creating design doc to capture decisions and open questions",
      },
    ],
    reasoning:
      "Good stopping point to check in. User seems ready to move forward but I want to surface remaining questions before committing to a design doc. This gives them agency to continue exploring or lock in what we have.",
  },
  {
    id: "m9",
    role: "user",
    content:
      "Good questions. For images, let's just keep them as-is for now - we don't have many illustrations. Code highlighting - yes, we'll need a dark theme for that. And put the toggle in the main nav for easy access.",
    timestamp: "2024-01-15T14:06:00Z",
  },
  {
    id: "m10",
    role: "assistant",
    content:
      "Perfect! I think we have a solid foundation here.\n\n**Decision Log:**\n- Images: Keep as-is (no special dark mode handling)\n- Code syntax: Add dark-friendly highlighting theme  \n- Theme toggle: Main navigation placement\n\nI'm ready to create a design document that captures:\n- The overall approach and architecture\n- Technical implementation details\n- Color token definitions\n- User stories and acceptance criteria\n- The open question about animation transitions (from pins)\n\nThis design doc will go through review where you can add comments and request changes before we move to the planning phase.\n\nSound good?",
    timestamp: "2024-01-15T14:07:00Z",
  },
];

export const mockPins: Pin[] = [
  {
    id: "p1",
    content: "Animation duration/style for theme transitions",
    category: "question",
    createdAt: "2024-01-15T14:02:00Z",
  },
  {
    id: "p2",
    content: "Consider dim mode for v2 (deferred for now)",
    category: "idea",
    createdAt: "2024-01-15T14:03:30Z",
    resolved: false,
  },
];
