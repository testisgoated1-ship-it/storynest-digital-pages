export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  cover_image: string | null;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  description: string;
  synopsis: string | null;
  version_type: string;
  cover_image: string | null;
  features: string[] | null;
  external_link: string | null;
}

export const blogPosts: BlogPost[] = [
  {
    id: '8450acc3-0e37-432a-99bd-d643017e0d75',
    title: 'Creating Branching Narratives',
    slug: 'creating-branching-narratives',
    excerpt: 'Learn the art of crafting stories where every decision matters and multiple paths lead to different destinies.',
    content: `# Creating Branching Narratives

Interactive storytelling is an art form that combines the craft of traditional narrative with the engagement of player agency. When readers become participants, the story transforms into something deeply personal.

## The Power of Choice

Every branching point in a narrative represents a moment where the reader's values, instincts, and desires shape the story. These choices should feel meaningful—not arbitrary selections, but genuine crossroads that reveal character.

## Designing Decision Trees

Effective branching narratives require careful planning. Each path must feel complete, each ending must satisfy, and the overall structure must remain coherent despite its complexity.

## Balancing Scope and Depth

The challenge lies in creating enough branches to feel meaningful without diluting the narrative quality. Quality over quantity ensures each path offers a compelling experience.`,
    author: 'StoryNest Media',
    published_at: '2026-01-18T04:31:15.985106+00:00',
    cover_image: null,
  },
  {
    id: '0ecd48c3-ec63-46cd-9073-a0b653d64056',
    title: 'Building Meaningful Character Relationships',
    slug: 'building-meaningful-character-relationships',
    excerpt: 'Discover how interactive storytelling creates deeper connections between readers and characters through customization and choice.',
    content: `# Building Meaningful Character Relationships

In interactive fiction, characters aren't just observed—they're shaped by the reader's choices and customizations. This creates a unique bond between participant and protagonist.

## The Customization Connection

When readers choose their character's appearance, background, or values, they invest a piece of themselves in the story. This investment deepens engagement and emotional response.

## Dynamic Relationships

Relationships in interactive stories evolve based on choices. A harsh word to a friend, a moment of kindness to a stranger—these decisions accumulate, creating relationship dynamics as complex as real life.

## Emotional Authenticity

The goal is emotional truth. Whether the story explores family bonds, romantic connections, or friendships, the feelings must resonate with genuine human experience.`,
    author: 'StoryNest Media',
    published_at: '2026-01-18T04:31:15.985106+00:00',
    cover_image: null,
  },
  {
    id: '3fe33801-5312-4e11-8283-f15ebfdc9aa2',
    title: 'The Future of Interactive Storytelling',
    slug: 'future-of-interactive-storytelling',
    excerpt: 'Explore emerging technologies and trends shaping the next generation of interactive narratives and immersive experiences.',
    content: `# The Future of Interactive Storytelling

As technology evolves, so do the possibilities for interactive narrative. We stand at the threshold of experiences that blur the line between story and reality.

## Emerging Technologies

From AI-driven narrative adaptation to immersive VR experiences, new technologies are expanding what interactive stories can be. The future promises stories that respond to readers in increasingly sophisticated ways.

## Personalization at Scale

Imagine stories that adapt not just to choices, but to reading patterns, emotional responses, and personal preferences. The next generation of interactive fiction will know its readers.

## Preserving the Human Element

Despite technological advancement, the heart of storytelling remains human. Technology should enhance, not replace, the emotional truths that make stories matter.`,
    author: 'StoryNest Media',
    published_at: '2026-01-18T04:31:15.985106+00:00',
    cover_image: null,
  },
];

export const stories: Story[] = [
  {
    id: '387f9da8-817d-4adb-9ed1-357bd385a29b',
    title: 'Sons of Distant Fathers',
    slug: 'sons-of-distant-fathers-black',
    description: 'Experience the powerful narrative with Black characters, exploring themes of family, identity, and reconciliation.',
    synopsis: 'A moving interactive story about fathers and sons navigating the complexities of their relationships across generations. Your choices shape the journey of healing and understanding.',
    version_type: 'Black Characters Version',
    cover_image: null,
    features: ['Character Customization', 'Choice-Driven Narrative', 'Multiple Endings', 'Emotional Depth'],
    external_link: null,
  },
  {
    id: 'ce02b680-4358-40a1-a49b-65d96bc7155b',
    title: 'Sons of Distant Fathers',
    slug: 'sons-of-distant-fathers-white',
    description: 'Experience the powerful narrative with White characters, exploring themes of family, identity, and reconciliation.',
    synopsis: 'A moving interactive story about fathers and sons navigating the complexities of their relationships across generations. Your choices shape the journey of healing and understanding.',
    version_type: 'White Characters Version',
    cover_image: null,
    features: ['Character Customization', 'Choice-Driven Narrative', 'Multiple Endings', 'Emotional Depth'],
    external_link: null,
  },
  {
    id: 'b92a8ae2-d0c6-48e5-ba75-8c5aa93362ec',
    title: 'Sons of Distant Fathers',
    slug: 'sons-of-distant-fathers-animated',
    description: 'Experience the animated version of our flagship story with dynamic visuals and immersive storytelling.',
    synopsis: 'A moving interactive story about fathers and sons navigating the complexities of their relationships across generations. Now with stunning animation that brings every scene to life.',
    version_type: 'Animated Version',
    cover_image: null,
    features: ['Full Animation', 'Voice Acting', 'Dynamic Visuals', 'Immersive Experience'],
    external_link: null,
  },
];
