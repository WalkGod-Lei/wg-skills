# Design Notes

KV Insight Engine is the positive twin of `kv-clarity-mirror`.

- `kv-clarity-mirror` prevents fake completion, scope drift, stale confidence, and other quality failures.
- `kv-insight-engine` raises the ceiling: stronger framing, stronger prioritization, stronger synthesis, stronger recommendations.

## Core idea

Many model outputs are competent but ordinary. They answer the stated question without reaching the real leverage point. This skill exists to push the model from:

- surface action -> underlying decision
- acceptable answer -> stronger answer
- equal-option listing -> actual recommendation
- mechanical execution -> higher-order judgment

## Why mixed mode

If the skill is always explicit, it becomes performance. If it is always silent, it fails to upgrade the moments that need intervention.

So the posture is mixed:

- quiet by default
- explicit at leverage points

## What counts as a good upgrade

A good upgrade is not extra flourish. It creates one of these improvements:

1. better framing
2. better ordering
3. better decision quality
4. better information density
5. better final form

## Failure modes to avoid

- pseudo-depth: abstract language without better decisions
- over-upgrading: adding sophistication to trivial tasks
- false boldness: recommending a path without enough basis
- teacher drift: explaining the framework when the user only needs the result

## Relationship with KV Clarity Mirror

Use clarity first when the task is risky, factual, or prone to self-deception.
Use insight when the task is underpowered, flat, or framed too low.
Use both when the task is both high-stakes and high-leverage.
