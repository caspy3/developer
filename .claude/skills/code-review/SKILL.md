---
name: code-review
description: Systematic code review for quality, maintainability, and best practices
---

# Code Review Skill

## Purpose
Conduct thorough code reviews that identify issues and provide actionable improvement recommendations.

## Review Checklist

### Code Quality
- [ ] Clear, descriptive naming conventions
- [ ] Appropriate code organization and structure
- [ ] DRY principle adherence (no unnecessary duplication)
- [ ] Single responsibility principle
- [ ] Appropriate abstraction levels

### Readability
- [ ] Code is self-documenting where possible
- [ ] Complex logic has explanatory comments
- [ ] Consistent formatting and style
- [ ] Functions/methods are appropriately sized

### Error Handling
- [ ] Errors are caught and handled appropriately
- [ ] Edge cases are considered
- [ ] Fail states are graceful
- [ ] Error messages are helpful

### Performance
- [ ] No obvious performance bottlenecks
- [ ] Appropriate data structures used
- [ ] Database queries are efficient (if applicable)
- [ ] No memory leaks or resource issues

### Testing
- [ ] Code is testable
- [ ] Tests exist for critical paths
- [ ] Tests are meaningful (not just coverage for coverage's sake)

## Review Output Format

```
## Code Review: [File/Component Name]

### Summary
[1-2 sentence overview of code quality]

### Findings

#### Critical Issues
[Issues that must be fixed]

#### Recommendations
[Improvements that should be made]

#### Suggestions
[Nice-to-haves and minor improvements]

### Positive Observations
[What the code does well]
```

## Review Principles
1. Be specific — point to exact lines/functions
2. Explain the "why" — not just what's wrong
3. Provide solutions — not just problems
4. Acknowledge good code — not just issues
5. Prioritize — distinguish critical from minor
