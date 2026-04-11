# Milestack

A simple escrow-based freelancing platform focused on milestone payments and accountability.

## Problem

Freelancing platforms often fail at enforcing accountability. Common issues include:

* Clients not paying after work is completed
* Freelancers abandoning projects midway
* No structured approval or milestone validation system

## Solution

Milestack introduces a milestone-driven escrow system where:

* Funds are locked before work begins
* Work is divided into clear milestones
* Each milestone must be approved before payment is released

## Current Status (Phase 0)

* Basic contract creation system implemented
* Client can create contracts and define milestones

## Known Issue

Currently, freelancers are automatically added to contracts without approval.

### Planned Fix

* Introduce a freelancer approval step before joining a contract
* Workflow:

  1. Client creates contract
  2. Freelancer receives request
  3. Freelancer accepts or rejects
  4. Contract becomes active only after acceptance

## Tech Stack

* Frontend: (TBD)
* Backend: Node.js, Express.js
* Database: MongoDB
* Auth: JWT

## Future Plans

* Milestone dispute system
* Automated escrow handling
* Ratings and reputation system
* Notifications

## Goal

Build a minimal but reliable system that prevents payment fraud and project ghosting in small freelance gigs.

---

This is an MVP project and will evolve based on real-world testing.
