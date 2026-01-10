# Ralph PRD Converter Skill

Convert PRD documents into `prd.json` format for Ralph autonomous execution.

## Purpose

This skill takes a PRD (markdown or text) and converts it into the structured JSON format that Ralph needs to autonomously implement each user story.

## Critical Rules

### Story Sizing (IMPORTANT)

**Each story must be completable in ONE Ralph iteration (one context window).**

Ralph operates with fresh context per task. Oversized stories cause incomplete work.

**Right-sized examples:**
- Add a database column
- Create a single UI component
- Implement one API endpoint
- Add form validation to one form

**Too large (must be split):**
- "Build the entire feature"
- "Implement the full authentication system"
- "Create all the UI components"

### Dependency Ordering

Stories execute sequentially by priority. Order them by dependencies:
1. Database/schema changes first
2. Backend logic second
3. Frontend/UI last

### Verifiable Acceptance Criteria

Requirements must be checkable, not subjective:

**Good:**
- "Add `status` column with default 'pending'"
- "Button displays in top-right corner"
- "Form submits without page reload"

**Bad:**
- "Works correctly"
- "Has good UX"
- "Is responsive"

**Required for ALL stories:**
- "Typecheck passes"

**Required for UI stories:**
- "Verify in browser"

## Output Format

```json
{
  "project": "ProjectName",
  "branchName": "ralph/feature-name",
  "overview": "Brief description of the feature",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short descriptive title",
      "description": "As a [user], I want [feature] so that [benefit]",
      "acceptanceCriteria": [
        "Specific criterion 1",
        "Specific criterion 2",
        "Typecheck passes"
      ],
      "priority": 1,
      "passes": false
    }
  ]
}
```

## Branch Naming

- Use kebab-case with `ralph/` prefix
- Example: `ralph/user-authentication`, `ralph/task-priority`

## Archive Protocol

Before creating a new `prd.json`:
1. Check if one already exists
2. If it's for a different feature, archive it first
3. Archive location: `archive/YYYY-MM-DD-feature-name/`

---

## Instructions

When the user invokes this skill:

1. Ask for the PRD file location (if not provided)
2. Read the PRD document
3. Extract user stories and requirements
4. **Split any oversized stories** into single-context-window chunks
5. Order by dependencies (DB -> Backend -> Frontend)
6. Add "Typecheck passes" to all stories
7. Add "Verify in browser" to UI stories
8. Generate the `prd.json` file
9. Save to the `ralph/` directory

**Output location:** `ralph/prd.json`
