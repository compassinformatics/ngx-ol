# @compassinformatics/ngx-ol

## Demo

TODO

## Installation

To install this library, run:

```bash
npm install @compassinformatics/ngx-ol --save
or
yarn add @compassinformatics/ngx-ol
```

## Example

Here is a "minimal" map example that fetches tiles from OpenStreetMap and center the map in Meylan (France):

```html
<aol-map [width]="'500px'" [height]="'300'">
  <aol-view [zoom]="2">
    <aol-coordinate [x]="5.795122" [y]="45.210225" [srid]="'EPSG:4326'"></aol-coordinate>
  </aol-view>
  <aol-layer-tile>
    <aol-source-osm></aol-source-osm>
  </aol-layer-tile>
</aol-map>
```

## Documentation

See `/src/app` for examples

## Development

TODO

Live example will be viewable at locahost:4200

## Publish to NPM

Update package.json version. Choose major, minor or patch
Run both commands to update both package.json files

```
npm version major --prefix projects/ngx-ol --no-git-tag-version
npm version major --no-git-tag-version

npm version minor --prefix projects/ngx-ol --no-git-tag-version
npm version minor --no-git-tag-version

npm version patch --prefix projects/ngx-ol --no-git-tag-version
npm version patch --no-git-tag-version
```

Push changes to GitHub
Create a release with title new version number, e.g. v18.x.x
Package will be automattically published to NPM

To manually publish to npm:

```
npm run build:lib
cd dist/ngx-ol
npm publish --access public
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request and enjoy! :D
