# ab-particles: vanilla javascript particle animation

Very simple, lightweight animated particles display that **does not** require any external files whatsoever. No libraries, configuration JSON or anything. This is a stripped-down version of the famous <a href="https://vincentgarreau.com/particles.js" target="_blank">'js-particles' by Vincent Garreau</a> and the code was inspired by an amazing tutorial by <a href="https://youtu.be/d620nV6bp0A" target="_blank">Franks Laboratory</a>.
- [Features](#features)
- [Usage (simple)](#usage-simple)
- [CSS customizations (colours)](#css-customizations-colours)
- [Setting feature parameters](#setting-feature-parameters)
- [Examples](#examples)
  - [default settings (explicit)](#default-settings-explicit)
  - [starry night](#starry-night)
  - [snow](#snow)
  - [bubbles](#bubbles)
  - [warp speed to the right](#warp-speed-to-the-right)
  - [warp speed to the left](#warp-speed-to-the-left)
  - [my usual settings (nice background effect)](#my-usual-settings-nice-background-effect)
- [Advanced loading](#advanced-loading)
  - [Sub-resource Integrity (SRI)](#sub-resource-integrity-sri)
  - [addEventListener](#addeventlistener)
- [Notes](#notes)
- [License and usage](#license-and-usage)
- [Final thoughts](#final-thoughts)

## Features

- One single file to link, no external libraries or function calls.
  - Minified version is only 5KB!
  - Vanilla javascript -- no jQuery, node.js or anything else.
- You do *NOT* have to link/learn/write any external configuration files, libraries or functions. Everything you need to know is in this readme.
- Colours are all set by CSS variables so theme integration is easy, no custom functions to write or libraries to figure out.
- All features are enabled/configured based on parameters passed directly to the javascript function.
- Mouse effects (only 2... for now):
  - Particle repulsion
  - Connection-line highlighting with configurable colour

## Usage (simple)

1. [Download the release file](https://git.asifbacchus.app/asif/ab-particles/releases).
2. Edit your HTML to include a canvas with *ID* 'particles'. You can put the canvas anywhere you'd like, but I'd strongly recommend putting it at the end of the *body*.

    ```html
    ...
    <canvas id='particles'></canvas>
    </body>
    ```

3. Every particles implementation I've seen relies on it being full-window. This one is no different, all the calculations are done under that assumption. Therefore, we should remove the canvas from the document flow and make it full width and height. Your CSS should look something like this:

    ```css
    #particles {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -999;
    }

    ```

4. Link your preferred file to your HTML. I find the best results are combining *defer* and loading the script at the end of the body. I'm using the minified version here:

    ```html
    <body>
        ...
        <canvas id="particles"></canvas>
        <script
            src="js/ab-particles.min.js"
            crossorigin="anonymous"
            integrity="sha384-eUruDNgO8YkfdY2sU3oCkjzhJbnXXT9kac3I8DwYkh2mjE0jCIKvTgN6yvvo9SqO"
            defer>
        </script>
    </head>
    ```

    > Remember to use the proper integrity checksum found in *js/integrity.sha384* and not copy the one here!

5. Because the script reads CSS variables, we need to wait until CSS is fully parsed. Add an *onload* event to the *body* tag of your HTML:

    ```html
    <body onload="particles()">
    ```

## CSS customizations (colours)

The default colours are boring! If you want to match the particles to your site's colour scheme, you just have to add some variables to your CSS. It's considered best practice to add variables to the *root* element, but you can add these variables directly to your canvas if you'd prefer.

These are the 3 variables read by the script and what they do:

variable|purpose|default
---|---|:---:|
--col-particle|Colour of the particle itself (little circle).|black (#000000)
--col-particle-stroke|Colour of the connecting lines.|black (#000000)
--col-particle-stroke-hover|Colour of connecting lines on mouse hover. You do not need to define this at all if you set the *hover* parameter to *false*|red (#ff0000)

You can set these variables as follows (I'm setting them on the root element). In this example, I'm setting a few shades of blue:

```css
:root {
  --col-particle: #536878;
  --col-particle-stroke: #035096;
  --col-particle-stroke-hover: #0892d0;
}
```

## Setting feature parameters

Everything that can be customized about the script is done via parameters passed directly to the *particles()* function. This avoids any need for configuration files and makes it easy to remember how to make changes. If you screw up a parameter's setting, the script will just use it's internal defaults and will display a helpful message on the console which you can view by turning on your 'developer tools'.

All parameters have default settings so *none* of them are required. Also, since this is javascript, the parameters are *cAsE seNsiTiVe*. The order does *not* matter. These are all the available parameters, what they do and their default settings.

parameter|purpose|allowed values|default
---|---|:---:|---
opacity|Overall opacity of the canvas element itself including all contents.|0 - 100|100
numParticles|Number of particles displayed in the window.<br/>Calculated as a percentage-multiple of the window width. For example, if the window is 500px wide and numParticles=10, 50 particles will be drawn.<br/>**Do not set this number too high or you can crash the browser!**|finite number|10
sizeMultiplier|Random multiplier between 0 and this number that is applied to vary the size of the particles so they aren't all uniform.|finite number|5
width|Stroke width (px) of connector lines.|integer|1
connections|Whether or not to connect the particles to each other when they get close enough.|boolean|true
connectionDensity|How densely particles connect to each other.<br/>**Careful not to set this number too high or you can crash the browser!**|finite number > 1|15
noBounceH|Particles do not bounce off the left or right sides of the window.|boolean|false
noBounceV|Particles do not bounce off the top or bottom of the window.|boolean|false
speed|How quickly the particles bounce around the window|1 < integer < 1000|50
speedH|How quickly the particles move horizontally. Positive values move to the right, negative to the left. This overrides the value of 'speed'.|-1000 < integer < 1000|1
speedV|How quickly the particles move vertically. Positive values move down, negative move up. This overrides the value of 'speed'.|-1000 < integer < 1000|1
avoidMouse|Should particles be repelled away from the mouse?|boolean|true
hover|Should connection lines change colours when the mouse is near them?|boolean|true

## Examples

### default settings (explicit)

Random balanced horizontal and vertical motion bouncing off the edges of the window. Particles are repelled by the mouse and connections are highlighted on hover. <a href="https://asifbacchus.app/public/samples/ab-particles/defaults.html" target="_blank">[Sample]</a>

```html
<body onload='particles(opacity=100, numParticles=10, sizeMultiplier=5, width=1, connections=true, connectionDensity=15, noBounceH=false, noBounceV=false, speed=50, avoidMouse=true, hover=true)'>
```

### starry night

Freeze the display, remove connections, disable mouse interaction. Creates a random assortment of particles that will change on each reload. <a href="https://asifbacchus.app/public/samples/ab-particles/starrynight.html" target="_blank">[Sample]</a>

```html
<body onload='particles(speed=0, connections=false, avoidMouse=false, hover=false)'>
```

### snow

No horizontal movement, connections or mouse interaction. Particles fall straight down, so no vertical bounce. <a href="https://asifbacchus.app/public/samples/ab-particles/snow.html" target="_blank">[Sample]</a>

```html
<body onload='particles(noBounceV=true, speedV=100, connections=false, avoidMouse=false, hover=false)'>
```

### bubbles

Opposite of snow, looks a little like bubbles. No vertical bounce and negative vertical speed. Added a little horizontal speed for effect and to show off 'skew'. <a href="https://asifbacchus.app/public/samples/ab-particles/bubbles.html" target="_blank">[Sample]</a>

```html
<body onload='particles(noBounceV=true, speedV=-100, speedH=-15,connections=false, avoidMouse=false, hover=false)'>
```

### warp speed to the right

Moving right would make the particles go left, therefore negative movement. No horizontal bounce. We don't want connections or mouse interaction here either. <a href="https://asifbacchus.app/public/samples/ab-particles/warpright.html" target="_blank">[Sample]</a>

```html
<body onload='particles(noBounceH=true, speedH=-100, connections=false, avoidMouse=false, hover=false)'>
```

### warp speed to the left

Moving left would make the particles go right, therefore positive movement. No horizontal bounce. We don't want connections or mouse interaction here either. Added a little positive vertical speed to show off skew. <a href="https://asifbacchus.app/public/samples/ab-particles/warpleft.html" target="_blank">[Sample]</a>

```html
<body onload='particles(noBounceH=true, speedH=100, speedV=15, connections=false, avoidMouse=false, hover=false)'>
```

### my usual settings (nice background effect)

I use this for screens where I can't figure out a meaningful background, so why not generate something nice to look at? Toning down the opacity a little to not distract from the text. <a href="https://asifbacchus.app/public/samples/ab-particles/index.html" target="_blank">[Sample]</a>

```html
<body onload='particles(speed=15, avoidMouse=false, opacity=65)'>
```

## Advanced loading

### Sub-resource Integrity (SRI)

I've included the proper checksums to use when loading either version of the script and using Sub-Resource Integrity (i.e. 'integrity' checksums). Lookup the version of the script you're linking and paste the checksum into the *integrity* attribute of the link tag. I included an example earlier in this document.

> Do not simply copy the checksum in this document! Always get the correct checksum from the *js/integrity.sha384* file included in this repo!

### addEventListener

If you want to load the script using a javascript file instead of an inline *onload* attribute in your HTML, you can do it like this:

```javascript
window.addEventListener('load', function(){
    particles(speed=15, avoidMouse=false)
}, false);
```

Again, I recommend using *load* instead of something like *DOMContentLoaded* since this script reads colour variables from CSS.

## Notes

- I use *position: fixed* in my CSS but you can just as easily use *position: absolute*. It makes no difference. The key is setting the canvas object to cover the entire window starting at the top left (0,0) and covering 100% height and width.
- The *z-index* is set to a very low number so that the canvas falls behind everything else. Otherwise, you'll get particles floating over your text and interfering with pointer-events like links!
- Certain parameters can overload the browser by drawing too many particles and/or calculating too many connections. Don't pick crazy numbers and you'll be fine.
- *numParticles* is a multiplier. The script takes 1% of the window width and sets that as the number of particles it will generate multiplied by the value of *numParticles*. It is because this is a multiplier that you need to be careful about setting high values!
- I don't really like most of the popular animations such as clicking to add more particles or 'grabbing' particles on hover/click. As such, I have not implemented these animations. Let me know if this is something you want!

## License and usage

You are free to use this script for anything or in any way you want including modifying it to suit your needs. While not necessary, I'd love if you put an attribution on your site if you use it and/or link back to this repo either on the page or at least in your HTML with a comment. Most important, if you improve the code, PLEASE contribute it back in this repo via a pull request or an issue or something. Thanks!

## Final thoughts

I put this together pretty quickly to generate a less boring background for a login page I was working on. As such, I didn't really add many bells and whistles. I wanted to keep it pretty lean and focussed. Also, this is one of the first javascript projects I've decided to 'release into the wild' for others to use. So, I'd love any feedback, suggestions and improvements you have to offer! I'm a horrid programmer so don't worry, I won't be offended by any criticism and look forward to maybe learning a few things from your suggestions!

Hope you find this useful. Please file issues/suggestions in the *issues* section.
