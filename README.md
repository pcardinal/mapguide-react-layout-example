# multizones (mapguide-react-layout-example)

This component allows you to display the areas of a region of the world and the mouse coordinates relating to a pointed area. It is added to mapguide-react-layout-example using the mapguide-react-layout viewer module.

![image](https://github.com/pcardinal/multizones/assets/30451003/297ccf6b-2f0c-4262-8a35-d7037bffd567)


- The zone data comes from the site [https://epsg.org/](https://epsg.org/home.html)
- The data necessary to define the projections comes from the site [https://epsg.io/](https://epsg.io/)



[![Build Status](https://travis-ci.org/jumpinjackie/mapguide-react-layout-example.svg?branch=master)](https://travis-ci.org/jumpinjackie/mapguide-react-layout-example)

This repo contains an example of a customized [mapguide-react-layout](https://github.com/jumpinjackie/mapguide-react-layout) viewer bundle.

This custom viewer bundle uses the [mapguide-react-layout npm module](https://www.npmjs.com/package/mapguide-react-layout) 

## Requirements

 * MapGuide Open Source 3.0 or higher (or equivalent version of Autodesk Infrastructure Map Server) with the default Sheboygan sample data set loaded.
 * node.js 6.x or newer
 * Optional: [Yarn package manager](https://yarnpkg.com)

## Running this example

 1. Clone this repository. For ease of getting started, clone this repo into MapGuide's `www` directory with the clone directory named `sample`:
    * `C:\Program Files\OSGeo\MapGuide\Web\www\sample` on Windows
    * `/usr/local/mapguideopensource-x.y.z/webserverextensions/www/sample` on Linux
 2. Install the required packages: `yarn install` or `npm install`
 3. Choose one of the following:
    * Build the viewer in development mode:
      * `yarn run build:dev`
      * `npm run build:dev`
    * Build the viewer in development mode and have webpack continually watch the source files:
      * `yarn run watch:dev`
      * `npm run watch:dev`
    * Build the viewer in production mode:
      * `yarn run build`
      * `npm run build`
 4. Load the example Application Definition `resources/React.xml` into your site repository. If you have [MapGuide Maestro](https://github.com/jumpinjackie/mapguide-maestro), you can just drag and drop this file into the Site Explorer. For this example, make sure the Application Definition document is in `Samples/Sheboygan/FlexibleLayouts`
 5. Launch the custom viewer bundle using the sample template:
    * `http://servername/mapguide/sample/sample_template.html?resource=Library://Samples/Sheboygan/FlexibleLayouts/React.ApplicationDefinition`

