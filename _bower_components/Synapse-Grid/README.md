# Synapse Grid

Synapse is a sass grid system with the fun and simplicity of Expressive CSS without the bloat and HTML classes.

[Expressive CSS](http://johnpolacek.github.io/expressive-css/) is a CSS philosophy that emphasizes, among many things, using utility classes to make layout and styling simpler, DRYer, and more modular. The classic drawbacks, however, are lots of CSS classes that likely won't all be used and lots of HTML classes on elements, which risks bloat and disorganization.

Synapse aims for the best of both worlds:
* Using Sass mixins to avoid unneeded CSS and HTML classes
* Still uses Expressive CSS utility classes and principles to make responsive layouts fun, simple, and easy to customize

Here are the basic steps to using Synapse

## Create your settings
Synapse lets you set your own columns, breakpoints, breakpoint labels, and spacing units. They're set by writing a Sass map like the following:

```
$synapse: (
  columns: 12,
  layouts: (
        xs:  0px,
        sm:  480px, 
        md:  787px,
        lg: 1024px,
        xlg: 1200px
    ),
  spaceUnits: (8px, 1em, 2em, 3em, 4em),
);
```

You can make the values whatever you want and add however many you want, so Synapse is very flexible. These are set as the defaults, but you can declare your own map to override them for a more custom Synapse grid.

## Use the Synapse mixin to create your grid

Simply use the mixin on an element to say how wide they should be at a breakpoint. You can also add offset to push or pull the column. Here are some examples:
```
@include syn(sm, 12, 0, ('')); // At 480px it's 12 columns wide
@include syn(md, 9, 3, ('')); // At 787px it's 9 columns wide and pushed 3 columns to the right
@include syn(lg, 8, -2, ('')); // At 1024px it's 8 columns wide and pulled 2 columns to the left
```

## Add utility classes 
You may be wondering what the empty mixin variable is at the end. That's where you put utility classes, a key part of Expressive CSS carried over here. These do things like align the text in your element, hide it, or add padding and margins. These will respond to the breakpoints as well. These classes can then make your text align differently at different screen sizes.

If you don't want any utilities in your element, use the same syntax as above.

Utility classes for padding and margin are set in your settings. With the spacing units above, the spacing utilities would be like this:
* **pad-0:** 0 padding on all sides
* **pad-1:** 8px of padding on all sides
* **pad-2:** 1em of padding on all sides
* **pad-3:** 2em of padding on all sides
* **pad-4:** 3em of padding on all sides
* **pad-5:** 4em of padding on all sides
* **marg-0:** 0 margin on all sides
* **marg-1:** 8px of margin on all sides
* **marg-2:** 1em of margin on all sides
* **marg-3:** 2em of margin on all sides
* **marg-4:** 3em of margin on all sides
* **marg-5:** 4em of margin on all sides

More can be added and the classes would increase to include pad-6, marg-7, etc. More classes like this are explained later.

Some examples explaining the utility classes follow:

```
@include syn(sm, 10, 2, (align-l, pad-0)); 
// In addition to the width and offset settings, text is aligned on the left with no padding

@include syn(md, 8, 2, (align-c, pad-2, marg-1)); 
// At this breakpoint text will then align to the center, have 1em padding and .5em margin on all sides

@include syn(lg, 0, 0, (pad-4)); 
// The element will add extra padding without changing the width or offset

@include syn(xlg, 0, 0, (hide)); 
// The entire element will be hidden at this breakpoint
```

> If you want to use Synapse similarly to a traditional grid system, add the "float-l" or "float-r" utilities. These will make sure the items line up next to each other. For example, if you want a sidebar to take up three columns on the right side of a screen on a certain width, add the "float-r" utility on that breakpoint.

All the included utility classes are:
* **block**: Display as block
* **inline-b**: Display as inline block
* **inline**: Display as inline
* **align-l**: Align text to the left
* **align-r**: Align text to the right
* **align-c**: Align text in center
* **float-l**: Float to left
* **float-r**: Float to right
* **float-n**: No float
* **border-b**: Add box-sizing: border-box
* **center-m**: Margin auto for left and right sides
* **hide**: Hides elements with display:none
* **pad-#**: Adds custom padding to all sides
* **pad-t-#**: Adds custom padding to the top
* **pad-r-#**: Adds custom padding to the right
* **pad-b-#**: Adds custom padding to the bottom
* **pad-l-#**: Adds custom padding to the left
* **pad-tr-#**: Adds custom padding to the top and right
* **pad-tl-#**: Adds custom padding to the top and left
* **pad-br-#**: Adds custom padding to the bottom and right
* **pad-bl-#**: Adds custom padding to the bottom and left
* **pad-vert-#**: Adds custom padding to the top and bottom
* **pad-sides-#**: Adds custom padding to the right and left

* **marg-#**: Adds custom margin to all sides
* **marg-t-#**: Adds custom margin to the top
* **marg-r-#**: Adds custom margin to the right
* **marg-b-#**: Adds custom margin to the bottom
* **marg-l-#**: Adds custom margin to the left
* **marg-tr-#**: Adds custom margin to the top and right
* **marg-tl-#**: Adds custom margin to the top and left
* **marg-br-#**: Adds custom margin to the bottom and right
* **marg-bl-#**: Adds custom margin to the bottom and left
* **marg-vert-#**: Adds custom margin to the top and bottom
* **marg-sides-#**: Adds custom margin to the right and left

> Note: Want to add utility classes at certain breakpoints without changing the width? Simply put 0 for the columns, and they'll all be added without touching the width.

## Custom Utility Classes

You can create custom utility classes with multiple styles to better manage your CSS across different breakpoints. Simply copy the **synapse-custom** mixin below and add them in the following format, then reference them in your utilities class.

```
@mixin synapse-custom($var) { // Add this to your stylesheet
  @if ($var == 'big-font') {
    font-weight: 700;
    font-style: italic;
  } @elseif ($var == 'small-font') {
    font-weight: 300;
    text-decoration: underline;
  }
}

article {
  @include syn(xs, 12, 0, (pad-1, small-font));
  @include syn(sm, 10, 1, (pad-2, big-font));
}
```

## Expressive Grid Generator

If you're more of an Expressive CSS fan, Synapse lets you generate a grid system based on your settings. Simply use the following mixin:

```
// @include generate-grid-classes($row-padding, $col-padding, $max-width);
```

You'll then have HTML classes for making a responsive grid. How they're named, the column amounts, and their breakpoints all come from your config file. For the config in this README, some examples are:

```
<section class="syn-row">
  <article class="syn-col syn-xs-12 syn-sm-6 syn-md-2 syn-offset-md-1"></article>
  <article class="syn-col syn-xs-12 syn-sm-6 syn-md-3"></article>
  <article class="syn-col syn-xs-12 syn-sm-6 syn-md-3"></article>
  <article class="syn-col syn-xs-12 syn-sm-6 syn-md-2 syn-offset-md-1"></article>
</section>
```

The container element needs the `syn-row` class, and all columns need the `syn-col` class in addition to the ones that set the different sizes.

This mixin needs three arguments to help you customize your grid more:
* *row-padding* is your spacing unit for the padding on the sides of row elements. Using "1" creates zero padding, "2" is your first unit of spacing from your config, "3" is the following, and so on.
* *col-padding* is the same as above, but for your columns' side padding
* *max-width* is how wide your rows can get before stopping and centering.

## Extra Utility Classes

Include these two mixins to generate some fast utility classes for elements.

```
@include generate-padding();
@include generate-margin();
```

The resulting classes will be based on your spacing sizes, and are similarly named to what's used in the "syn" mixin. These are different since you add them directly to an element in the HTML, not in the Sass files. Useful if you have lots of elements that need general padding or margin changes consistent with your layout but not dependent on screen sizes.

* .pad-1
* .pad-top-1
* .pad-right-1
* .pad-bottom-1
* .pad-left-1
* .pad-vert-1
* .pad-sides-1
* .marg-1
* .marg-top-1
* .marg-right-1
* .marg-bottom-1
* .marg-left-1
* .marg-vert-1
* .marg-sides-1

> Note: you can use "0" to remove part or all of an element's padding or margin.

## Enjoy!