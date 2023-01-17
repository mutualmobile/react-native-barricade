
# Developed by Mutual Mobile Team 👋


![Logo](https://getvectorlogo.com/wp-content/uploads/2018/11/mutual-mobile-vector-logo.png)


# React Native Barricade

The project is used to mock the responses of apis.

You have to navigate to the react native debub menu and you will se one more option
of enable Barricade at the last of the bebugger menu. 

Just click on it and the Barricade 
view come into action. Later select the api which you want to mock from the list of option
you will get after enabling the Barricade View.

Now select the type of response from the screen you are navigated after selecting the api. 

Click on Done and refresh the api, you will get the mocked response.


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Demo

Insert gif or link to demo


## Features

- Mocked the response of apis.
- Support various rest methods - get, post, put and delete.
- You can create your own json file for the response type as per your api response.
- Support both android and IOS platforms. 
- The three main functionalities are Enable Barricade, Disable Barricade and Barricade View.




## Installation

Install react-native-barricade with npm

```bash
  npm install react-native-barricade

```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/mutualmobile/react-native-barricade.git
```

Go to the project directory

```bash
  cd example
```

Install dependencies

```bash
  npm install or yarn install
```

Start the server

```bash
 Android:    yarn android

 IOS:        yarn ios
```


## Tech Stack

**Client:** React Native, Redux, Typescript

**Server:** Metro bundler


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Usage/Examples

The three main functionalities are Enable Barricade, Disable Barricade and Barricade View.
- Enable Barricade:  You have to enable the Barricade View to add the barricade to the debug menu. You can do that in index.ts file.
 
**1. Barricade View**

Adding Barricade View is the second step after enabling the mock server in index.ts file.
 Add the foolowing code to app.ts file to enable the Barricade View.
 
```javascript
import React from 'react';
import { StatusBar } from 'react-native';
import { BarricadeView } from 'react-native-barricade';
import { Provider } from 'react-redux';
import { AppRouter } from './navigation';

const AppContent = () => {
  return (
    <>
      <StatusBar/>
      <AppRouter />
      <BarricadeView />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

```

**2. Enable Barricade**

To Enable Barricade
Create a mock-server directory at the root of the project.

Create a index.js file and add the following code:

```javascript
import { enableBarricade } from 'react-native-barricade';

import { RecentApiRequestConfig } from './api/recent.api.mock';
import { SearchApiRequestConfig } from './api/search.api.mock';

export const mockServer = () => {
  enableBarricade([RecentApiRequestConfig, SearchApiRequestConfig]);
};

```
Create two mock files as shown in above code inside the api directory.
Add the following code to `recent.api.mock` file.

```javascript
import {
  HttpStatusCode,
  Method,
  PathEvaluaionType,
  Request,
  RequestConfig,
} from 'react-native-barricade';

import * as recentPageOne from '../mocks/recent/success/recentPage1.mock.json';
import * as recentPageTwo from '../mocks/recent/success/recentPage2.mock.json';
import * as errorData from '../mocks/recent/error/recentError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};
  const response = page === '1' ? recentPageOne : recentPageTwo;

  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(response),
  };
};

const noDataResponseHandler = (request: Request) => {
  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(noData),
  };
};

const errorResponseHandler = (request: Request) => {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(errorData),
  };
};

const loadMoreResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};

  if (page === '1') {
    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(recentPageOne),
    };
  } else {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(errorData),
    };
  }
};

const RecentApiRequestConfig: RequestConfig = {
  label: 'Recent',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.recent,
    type: PathEvaluaionType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: successResponseHandler,
    },
    {
      label: 'No data',
      handler: noDataResponseHandler,
      isSelected: true,
    },
    {
      label: 'Failure',
      handler: errorResponseHandler,
    },
    {
      label: 'Failure on load more',
      handler: loadMoreResponseHandler,
    },
  ],
};

export { RecentApiRequestConfig };
```

`recentPage1.mock.json`, `recentPage2.mock.json` and `recentPage3.mock.json` contains response of mocked api. `recentError.mock.json'` file contains the mocked error response.
 `noData.mock.json` contains mocked response when api returns empty response. `/src/network` file contains the api config for the apis which we want to be mocked. Here it is for recent used api.



Add the following code to `search.api.mock` file.

```javascript
import {
  HttpStatusCode,
  Method,
  Request,
  PathEvaluaionType,
  RequestConfig,
} from 'react-native-barricade';

import * as searchPageOne from '../mocks/search/success/searchPage1.mock.json';
import * as searchPageTwo from '../mocks/search/success/searchPage2.mock.json';
import * as searchPageThree from '../mocks/search/success/searchPage3.mock.json';
import * as errorData from '../mocks/search/error/searchError.mock.json';
import * as noData from '../mocks/common/noData.mock.json';
import { apiConfig } from '../../src/network';

const successResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};

  let response = searchPageThree;
  if (page === '1') {
    response = searchPageOne;
  } else if (page === '2') {
    response = searchPageTwo;
  }

  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(response),
  };
};

const noDataResponseHandler = (request: Request) => {
  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(noData),
  };
};

const errorResponseHandler = (request: Request) => {
  return {
    status: HttpStatusCode.BAD_REQUEST,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(errorData),
  };
};

const loadMoreResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};

  if (page === '3') {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(errorData),
    };
  } else {
    let response = page === '1' ? searchPageOne : searchPageTwo;
    return {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
      response: JSON.stringify(response),
    };
  }
};

const SearchApiRequestConfig: RequestConfig = {
  label: 'Search',
  method: Method.Get,
  pathEvaluation: {
    path: apiConfig.photos.search,
    type: PathEvaluaionType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: successResponseHandler,
    },
    {
      label: 'No data',
      handler: noDataResponseHandler,
    },
    {
      label: 'Failure',
      handler: errorResponseHandler,
    },
    {
      label: 'Failure on load more',
      handler: loadMoreResponseHandler,
    },
  ],
};

export { SearchApiRequestConfig };

```
`searchPage1.mock.json`, `searchPage2.mock.json` and `searchPage3.mock.json` contains response of mocked api. `searchError.mock.json'` file contains the mocked error response.
 `noData.mock.json` contains mocked response when api returns empty response. `/src/network` file contains the api config for the apis which we want to be mocked.Here it is for search api.

 **Methods Explanation**

- successResponseHandler: The method is called for each success request call. It will return the response for successful mocked api call.

- noDataResponseHandler: The method is called if we select the no data option when selecting the type of response from Barricade View.

- errorResponseHandler: The method is called if we select the api failure option when selecting the type of response from Barricade View.

- loadMoreResponseHandler: The method is called when we load next items in paginated apis.

**SearchApiRequestConfig:**  
- The object contains the configiguration for a mocked api.
- label: Name by which api appears in the Barricade View.
- Method: The request method type(get, post , put or delete)
- Path Evaluation: An object defining path(endpoint) and type of an api call(it is path, a suffix or a callback).
- Response handler: An array of responses the api can return. `label` is the name by which response type appears in Barricade View. `handler` is the method corresponding to the label.


Add the following code to index.ts file.
This will enable the mock server.

**3. Disable Barricade**
- To disable the barrivade, open the debug menu and select `Disable Barricade` option to close the Barricade mock server.



```javascript
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { mockServer } from './mock-server';

const enableMock = true;
if (enableMock) {
  mockServer();
}

AppRegistry.registerComponent(appName, () => App);

```


## Used By

This project is used by the following companies:

- 
- 


## Roadmap

- Support for paginated apis.

- Add more integrations.


## Optimizations

TODO: Will add later


## Change api endpoints 

To run this project, you will need to edit the endpoints in your endpoints config file

eg: 

`search: /search` 

`recent: /recent`


## Feedback

If you have any feedback, please reach out to us at info@mutualmobile.com.


## Support

For support, email info@mutualmobile.com.

