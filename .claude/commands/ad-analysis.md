---
description: Analyze a competitor's advertising strategy using public ad libraries
agent: ad-strategist
---

# Ad Strategy Analysis Request

Analyze the advertising strategy for: **$ARGUMENTS**

## Your Task

1. **Identify the company** - Use the identifier provided (website URL, Instagram handle, or company name) to find their official advertising presence

2. **Research their active ads** via:
   - Meta Ad Library (Facebook/Instagram ads)
   - Google Ads Transparency Center
   - Their landing page(s)

3. **Deliver a complete analysis** following the ad-reverse-engineer skill framework

## Required Output Format

```
## [Company Name] Ad Strategy Analysis
Generated: [Date]

### Executive Summary
[2-3 sentences on their overall ad approach]

### Platform Presence
- Meta (FB/IG): [Active/Inactive, estimated # of ads]
- Google: [Active/Inactive, ad types found]
- Other: [Any other platforms discovered]

### Top Performing Ads (Longest Running)
[Analyze 3-5 ads that have run the longest - these are likely winners]

### Copy Patterns
- Primary hooks used:
- CTA language:
- Tone/voice:

### Offer Structure
- Main offer:
- Price anchoring:
- Risk reversals:

### Actionable Takeaways
[3-5 specific tactics that could be applied to other businesses]
```

## Important Notes
- Use ONLY public ad libraries - no scraping or unauthorized access
- If limited ads found, note this and analyze what IS available
- Focus on patterns, not just individual ad descriptions
