# Introduction
**This project demonstrates performing API calls between MobX and mossByte**    
The application is a pretty standard todo app allowing users to perform CRUD operations on a list of tasks. The elements that differentiate it are the usage of mossByte as a NOSQL solution and a pattern for performing async actions via MobX.    

It is worth noting that I created a custom generator helpers library for this project which supports something I'm labelling as HOGs (Higher Order Generators) that are made possible by the generator being run, returning a promise itself.    

Unit tests are currently testing that the application can successfully mount and also tests core business logic. Async, API and generator-helper tests were a bit beyond the scope for an alpha release.    

Prior to development on this project my only experience with generators was via Redux Sagas so it was a great exercise to obtain significantly stronger comprehension to the point of writing a nifty helper library for coordinating them.    

Development was timeboxed to 4 days to provide a rough idea on timelines for getting similar projects up and running.    

# Design
The application has been designed as a mobile first (portrait mode) with the ability to function as a desktop application at varying display scales. Has been designed with IE11+ support.    

All images and styles were sketched / created and styled by me except for the custom scroll bar on the todo panel. This uses a 3rd party module to save re-inventing the wheel. In dev, the 2 deprecation warnings in the console can be ascribed to this module.

# Install instructions
- Clone the repository
- Open a terminal / cmd prompt and run `npm i`

# Running the application
- Once installed, run `npm start` to fire up a the application on localhost:3000 (it should open a browser window for you)

# Running the unit tests
- In a terminal / cmd prompt run `npm run test`
