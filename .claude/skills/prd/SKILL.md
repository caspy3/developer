# PRD Generator Skill

Generate detailed Product Requirements Documents for new features.

## How It Works

This skill guides you through creating an implementation-ready PRD:

1. **Clarifying Questions** - I'll ask 3-5 essential questions about your feature
2. **PRD Generation** - I'll produce a structured document saved to `tasks/prd-[feature-name].md`

## Question Format

I'll present questions with lettered options. Respond compactly:
- Example: "1A, 2C, 3B" or "1A, 2: custom answer, 3B"

## PRD Structure

The generated PRD includes:
- **Introduction** - Problem statement and context
- **Goals** - What success looks like
- **User Stories** - "As a [user], I want [feature] so that [benefit]"
- **Functional Requirements** - Numbered (FR-1, FR-2, etc.)
- **Non-Goals** - Explicitly out of scope
- **Design Considerations** - Technical approach
- **Success Metrics** - How to measure completion
- **Open Questions** - Items needing clarification

## User Story Format

Each story includes:
- Title
- Description (As a [user], I want [feature] so that [benefit])
- Acceptance Criteria (verifiable, specific)

## Quality Standards

- **Explicit language** - No ambiguity
- **Numbered requirements** - Easy reference
- **Concrete examples** - Not vague descriptions
- **Verifiable criteria** - Can be checked, not subjective

## UI Story Requirements

Any story involving UI changes MUST include:
- "Verify in browser" as acceptance criteria
- Specific visual requirements (colors, placement, etc.)

---

## Instructions

When the user invokes this skill:

1. Ask what feature they want to build (if not provided)
2. Present 3-5 clarifying questions with lettered options covering:
   - Problem/goal being solved
   - Core functionality needed
   - Scope boundaries
   - Success criteria
3. Wait for user responses
4. Generate the full PRD document
5. Save to `tasks/prd-[feature-name].md`

**Important:** Do NOT start implementing. Just create the PRD.
