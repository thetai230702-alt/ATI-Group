# ATI Group – V62 Language Switch Fix

- Added the missing 🇻🇳 VI / 🇺🇸 EN controls to the Topbar, between global search and notifications.
- Connected the controls to persistent language state (`ati-language` in localStorage).
- Updates the document language and passes the selected language to Sidebar and Dashboard.
- The selected language is retained after refresh.

This patch fixes the missing control in V61. It does not claim that every learning screen/content is fully translated.
