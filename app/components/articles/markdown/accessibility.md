# Accessibility

## Why we care

27% of people have some kind of disability (mobility, vision, cognition, etc.) and they deserve the right to participate
and contribute on the web.

We, as developers, can make a relatively low effort for huge wins for those users. Plus making our sites accessible can
also yield wins for folks without disabilities (high contrast text, tab accessibility in forms, etc.).

## What are the standards

WCAG defines 3 different levels of conformance, A, AA, and AAA, with AAA being the highest-level.

For most sites AA conformance is the recommended target that will hit the majority of the problem areas for a given
site, whereas, AAA is usually more challenging to achieve given the constraints.

Here is a [WCAG checklist](https://webaim.org/standards/wcag/checklist) to evaluate your features against the
guidelines.

## How can we build accessible features with the lowest amount of effort

Migrating existing inaccessible designs to accessible designs can be challenging given the default behavior of
non-accessible HTML. But if we start early, we can get 90% of the way there with 10% effort:

- Use the right semantic element for the use case rather than by how it's styled.
  - If you are starting a project from scratch, add css resets to your semantic elements, so you and your team won't
    reach for the wrong semantic element because it gives you the right styling.
  - [Reference for picking the right HTML Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#main_root)
  - Semantic elements have a lot of accessibility features for free (tab index, touch behavior, focus trapping, etc.).
- Use existing design systems, or if you have your own design system, try to focus your effort on addressing the main
  accessibility problems there.
- Call out features that might have complex accessibility at the design phase, so you don't have to shoehorn
  accessibility in.
- If you use semantic HTML elements and design system components, you can mostly save your accessibility design for the
  end of the project.
- Run an accessibility user acceptance test (UAT) before launch using keyboards, screen readers, and touch devices.
- Use Developer tools
  - Eslint-plugin-jsx-a11y wil find common accessibility issues
  - Tools like [Axe Devtools](https://www.deque.com/axe/devtools/) and Lighthouse's Accessibility page analyzers aren't
    comprehensive but will find real issues.
  - Chrome's color picker has curves for picking accessible colors.

## Standard Keyboard Navigation Expectations

### Tab Navigation

#### Basic behavior

- Tab goes forward
- Shift+Tab goes backwards

#### Tab Indexes

- While not inherently an anti-pattern, we should always consider using the right HTML element before reaching for the
  tab-index attribute.
- Negative values (-1) indicate the element should not be reachable via keyboard navigation
- ‘0’ means the element should be reachable via keyboard navigation
- Positive values (1>=) do indicate the sequence of the tabindex, but using this is an anti-pattern and is
  [not recommended](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex#:~:text=the%20user%20agent.-,Warning,-%3A%20You%20are).
- Not every element needs to be tab-focusable since screen readers have other methods of navigating the page like
  headings and key commands.

#### Tab Trapping in Modals

- Use the new dialog HTML element and the showModal() function, and we get the correct tab trapping behavior out of the
  box.

### Keyboard Navigation

- Spacebar
  - Activate buttons, check/uncheck checkboxes, scroll down the page, open menus
- Enter
  - Activate buttons, open links, open menus, selection options from a dropdown
- Escape
  - Close dropdowns/dialogs/etc.
- Arrow Keys
  - Navigate radio options, dropdown menus, sometimes navigation menus

### Skip Links

A button that appears at the top of the page and first in the tab order when you load the page that allows users to skip
to the main content of the page

## Alt (Alternative) Text for Images

Used to describe the appearance or function of an image on a page. Alt text is meant to convey the “why” of the image as
it relates to the content of the page. Adding an alt text to an image will cause the screen reader to read whatever you
put in the alt text instead of the src image path.

### Best Practices

- [Use this Alt text decision tree if your unsure if you need alt text or not](https://www.w3.org/WAI/tutorials/images/decision-tree/)
- For decorative images or tracking pixels, use empty alt text so screen readers skip over those images.
- If there is accompanying text already part of element with the Image, you may not need to provide any alt text at all.
- Check the alt text behavior with a screen reader.

## Headings - <h1> - <h6>

- We should try to build hierarchical headings h1 -> h6.
- Avoid using multiple h1s on the page.
- An h2 should be below an h1, a h3 should be below an h2, etc.
- We should use the correct heading level for the location on the page, and not let the styling we need dictate which
  header we use.
  - Basically, lead with the right hierarchical element, and then we can adjust the styling as needed.

## Labels for <input>, <select>, and <textarea>

- Form fields are confusing for screen reader users if not labeled properly
- Use <label for=“someId”> tags along with your <input id=“someId”> element OR you can wrap the input with the label
  element <label> First Name <input type=“text/></label>
- Not every element can use labels, so in those cases, we use ARIA instead (aria-label)

## ARIA

ARIA is a W3 spec that is additive to the HTML spec that specifically helps with accessibility and is well-supported in
browsers. It fills the gap that semantic HTML does not address, but should not be the first tool we reach for.

- Labels
  - aria-label, aria-labeledby, aria-describedby
- Roles
  - e.g. button, checkbox, navbar
  - role=“none”
    - If we are trying to maintain a specific hierarchy of aria roles, we can use role=“none” to hide elements that
      don’t hold any significance for accessibility.
- Attributes
  - aria-haspopup, aria-hidden, aria-checked
  - In our code, we would set these dynamically with JS if they rely on application state.
- Live Regions
  - aria-live (=assertive, polite, off)
  - When we want to alert the user that dynamic content has changed we can set this attribute and the screen reader will
    let the user know.
- More Resources
  - [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
  - [https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

## Popular Screen Readers

JAWS, NVDA, VoiceOver for Mac are all popular screen readers

### Basic Usage of VoiceOver for Mac

- Cmd+F5 to open
- Option + Ctrl + U will show a sorted list of elements on a page
  - Use left/right arrow keys to see the available views then you can arrow up and down through the page

### Considerations

- There is not a WCAG spec or equivalent for screen readers
  - 95% of behavior will be consistent across the popular screen readers
- How to prioritize various screen reader platforms:
  - WebAIM does a survey that we can leverage to help us build our support matrix:
    [https://webaim.org/projects/screenreadersurvey9/](https://webaim.org/projects/screenreadersurvey9/)
