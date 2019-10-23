# GraphQL and React Hooks Workshop
A combination of 4 apps in 1 repo which demonstrate GraphQL and React Hooks basics, as well as GraphQL schema federation.

## Basic Layout
Each of the 4 apps contains a `start` and a `finish` folder.

Each app's `start` folder contains the bones of that app, with select files left blank that we are going to fill out.

Each app's `finish` folder contains the completed app, including comments and examples to help demonstrate additional concepts. Note that we even have an alternate User Service schema which demonstrates more schema concepts at `user-service/finish/db/schema_ALTERNATE.js`.

At the top level of this repo there will be 2 files to consider:
- `schema_ORIGINAL.js`, which will serve as our guidepost for what the finished aggregated schema would look like if we were not using schema federation.
- `store.sqlite`, which will serve as our database file. Note it does not exist when you first clone the repo, but will get created in the next steps.

## Getting started
1. From the top level of this repo, enter the shell command (for Mac users) to install all dependencies and check out the first commit tag.
```
cd gateway/start && npm i && cd ../../ui/start && npm i && cd ../../user-service/start && npm i && cd ../../music-service/start && npm i && git checkout 1-setup
```
- Note that if you want the `final` versions of the apps to work you'll need to do the same thing there.

2. From within the `user-service/start` folder run the npm command to create or amend the `store.sqlite` file:
```
npm run db:create
```

3. From within the `music-service/start` folder run the npm command to create or amend the `store.sqlite` file:
```
npm run db:create
```

4. Copy the `*/start/.env.sample` file for each app and create an `.env` file for each.
- Note that if you want the `final` versions of the apps to work you'll need to do the same thing there.

## A Note About the Commit Tags
This repo's commit history is tagged at multiple points so that you can easily move from checkpoint to checkpoint in the app creation process. If you want to see a list of all of the tags in this repo type `git tag -l`.

## Related links
- [Presentation](https://docs.google.com/presentation/d/19Kq4eP5aL5iVHtLxNjL_6HM0L5jKVX_gRD93_B7h65M/edit?usp=sharing)
- [Supplemental Notes (presentation info + lots more)](https://docs.google.com/document/d/1NRo6fnmB1GuARKf2UTNcP2s3mVb7iU-9Ei_s11u8ApU/edit?usp=sharing)
