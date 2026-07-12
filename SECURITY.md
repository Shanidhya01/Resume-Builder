# Security Policy

## Supported Versions

HireReady (Resume Builder) is currently developed on a single rolling `main` branch. Only the latest commit on `main` receives security fixes.

| Version        | Supported          |
| -------------- | ------------------- |
| `main` (latest) | :white_check_mark: |
| older commits   | :x:                 |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue**. Instead:

1. Email the maintainer directly at **luckykumar0011s@gmail.com** with a description of the issue, steps to reproduce, and its potential impact.
2. Alternatively, use [GitHub's private vulnerability reporting](https://github.com/Shanidhya01/Resume-Builder/security/advisories/new) for this repository, if enabled.

You should expect an initial response within **5 business days**. We'll work with you to understand and validate the issue, and will credit you in the fix release notes unless you prefer to remain anonymous.

## Responsible Disclosure

- Please give us a reasonable amount of time to investigate and address the issue before any public disclosure.
- Do not access, modify, or exfiltrate data that isn't yours as part of your research.
- Avoid actions that could degrade the experience of other users (e.g. denial-of-service testing) against any hosted/deployed instance.

## Scope Notes

This project is a client-side resume builder: resume data is kept in the browser (`localStorage`) and is never sent to a backend server owned by this project. Reports related to third-party services this project links to (e.g. GitHub's API) should be reported to those services directly.
