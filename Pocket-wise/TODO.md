# Fix Plan for Pocket Wise App

## Issues Identified:

1. **Backup File Has Syntax Error**: The `index-new.js` file has a critical syntax error in the Round-up Savings section:
   - Wrong: `style.text, fontSize: 13 }}={{ color: colors>🎯`
   - Correct: `style={{ color: colors.text, fontSize: 13 }}>🎯`
   
   This file appears to be corrupted/backup and should be deleted or fixed.

2. **ThemeContext Provider**: Verified that the main `index.js` correctly wraps the entire app with ThemeContext.Provider, so AuthScreen can access the theme.

## Status:
- [x] Verified index.js code is correct
- [x] Identified syntax error in backup file index-new.js
