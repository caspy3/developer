---
name: architecture-design
description: System architecture design and optimization guidance
---

# Architecture Design Skill

## Purpose
Design scalable, maintainable system architectures and provide optimization recommendations.

## Architecture Assessment Areas

### System Design
- Component decomposition and boundaries
- Service communication patterns
- Data flow and dependencies
- Scalability considerations
- Failure modes and resilience

### Technology Stack
- Language/framework suitability
- Database selection and design
- Caching strategies
- Message queues and async processing
- Third-party service integration

### Operational Concerns
- Deployment architecture
- Monitoring and observability
- Backup and disaster recovery
- Security architecture
- Cost optimization

## Architecture Decision Record (ADR) Format

```
## ADR-[Number]: [Title]

### Status
Proposed / Accepted / Deprecated / Superseded

### Context
What is the issue we're facing? What prompted this decision?

### Decision
What is the change we're making?

### Consequences
What are the positive and negative results of this decision?

### Alternatives Considered
What other options were evaluated?

### References
Related documents, discussions, or resources
```

## System Design Document Format

```
## System Design: [System Name]

### Overview
[High-level description of what the system does]

### Requirements
**Functional**: What the system must do
**Non-Functional**: Performance, scalability, security requirements

### Architecture Diagram
[Text description or ASCII diagram of components]

### Components
| Component | Responsibility | Technology |
|-----------|----------------|------------|
| [Name]    | [What it does] | [Stack]    |

### Data Model
Key entities and relationships

### API Design
Core endpoints and contracts

### Scalability Strategy
How the system handles growth

### Security Considerations
Authentication, authorization, data protection

### Monitoring & Alerting
Key metrics and observability approach

### Trade-offs
What we're optimizing for and what we're accepting
```

## Architecture Principles
1. **Simplicity first**: Add complexity only when required
2. **Loose coupling**: Components should be independently deployable
3. **High cohesion**: Related functionality grouped together
4. **Defense in depth**: Multiple layers of security
5. **Design for failure**: Assume components will fail
6. **Observability built-in**: Monitor everything important
