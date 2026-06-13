/**
 * Safely serialises an object for injection into a <script type="application/ld+json"> block.
 *
 * JSON.stringify does NOT escape </script> sequences. A crafted URL param such as
 * /locations/foo</script><script>alert(1) can break out of the JSON-LD block and execute
 * arbitrary JavaScript. This function escapes the three HTML-significant characters.
 *
 * Reference: OWASP DOM XSS Prevention – Rule #1 (JSON values inside script blocks)
 */
export function safeJsonLd(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g,  "\\u003C")
    .replace(/>/g,  "\\u003E")
    .replace(/\//g, "\\u002F");
}
