# Release Template

Use this template when creating a new GitHub Release.

---

## Title Format

```
vX.Y.Z - [Release Name]
```

Example: `v0.6.0 - Open Source Maintainer Layer`

## Body Template

```markdown
## Summary

[One paragraph describing the overall theme and purpose of this release.]

## Highlights

- [Key feature or change 1]
- [Key feature or change 2]
- [Key feature or change 3]

## Added

- [New feature or file 1]
- [New feature or file 2]
- [New feature or file 3]

## Changed

- [Modified behavior or file 1]
- [Modified behavior or file 2]

## Fixed

- [Bug fix 1]
- [Bug fix 2]

## Verification

Run the following commands to verify this release:

```bash
npm install
npm run build
npm run self-test
npm run preflight
npm run test:all
```

## Known Limitations

- [Known limitation 1]
- [Known limitation 2]

## Upgrade Notes

[If upgrading from a previous version, note any breaking changes or migration steps.]

- [Step 1]
- [Step 2]

## Links

- 🔗 [Online Demo](https://YOUR_USERNAME.github.io/YOUR_REPO/)
- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
```

## Checklist Before Publishing

- [ ] Version bumped in package.json, siteMeta.ts, sw.js, manifest.webmanifest
- [ ] README badge updated
- [ ] RELEASE_NOTES.md updated with this version
- [ ] `npm run test:all` passes
- [ ] `npm run test:ci` passes
- [ ] Tag matches version in package.json
- [ ] Summary is clear and concise
- [ ] All sections are filled in
