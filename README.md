
# Developed by Mutual Mobile Team 👋


# React Native Barricade

The project is used to mock the responses of apis.

You have to navigate to the react native debub menu and you will se one more option
of enable Barricade at the last of the bebugger menu. 

Just click on it and the Barricade 
view come into action. Later select the api which you want to mock from the list of option
you will get after enabling the Barricade View.

Now select the type of response from the screen you are navigated after selecting the api. 

Click on Done and refresh the api, you will get the mocked response.

If this project has helped you out, please support us with a star 🌟.
## Features

- Mocked the response of apis.
- Support various rest methods - get, post, put and delete.
- You can create your own json file for the response type as per your api response.
- Support both android and IOS platforms. 
- The three main functionalities are Enable Barricade, Disable Barricade and Barricade View.




## Screenshots

![App Screenshot](https://user-images.githubusercontent.com/113414293/212898114-6c32b25c-6c9f-47c7-b748-5996492e8510.png)
## Demo

Insert gif or link to demo


## Installation


```bash
  npm install react-native-barricade

```
or

```bash
  yarn add react-native-barricade

```
## Usage/Examples

The three main functionalities are Barricade View, Enable Barricade amd Disable Barricade.

 
**1. Barricade View**

Adding Barricade View is the second step after enabling the mock server in index.ts file.
 Add the following code to app.ts file to enable the Barricade View.

```tsx
import { BarricadeView } from 'react-native-barricade';

const App = () => {
  return (
    <Provider store={store}>
    // rest of the app code
      <BarricadeView /> // add Barricade view at the end so that it overlays the entire app.
    </Provider>
  );
};

```

**2. Enable Barricade**

 - You have to enable the Barricade View to add the barricade to the debug menu. You can do that in index.ts file.


```tsx
import { enableBarricade } from 'react-native-barricade';

const mockedApiRequestConfig = [] // add the config for all the apis that needs to be mocked
enableBarricade(mockedApiRequestConfig);

AppRegistry.registerComponent('App', () => App);

```
Create the config files for all the mocked apis. 
You can refer the examle app for generating the config files.

 **Methods**

| Method                    | Description                                                                            | Return Type |
| ----------------------- | -------------------------------------------------------------------------------------- | ------- |
| **`successResponseHandler`**   | It will return the response for successful mocked api call.                     | `json`  |
| **`noDataResponseHandler`**    | It will return empty response for successful mocked api call.                   | `json` |
| **`errorResponseHandler`**     | It will return the response for failed mocked api request.                      | `json`  |
| **`loadMoreResponseHandler`**  | It will return the next items for paginated apis.                               | `json`   |


**SearchApiRequestConfig:**  
- The object contains the configuration for a mocked api.
| Method                         | Description                                                                            | Default |
| -----------------------        | -------------------------------------------------------------------------------------- | ------- |
| **`label`**                    | Name by which api appears in the Barricade View.                                       | `string`  |
| **`Method`**                   | The request method type(get, post , put or delete).                                    | `string` |
| **`pathEvaluation`**           | An object defining path(endpoint) and type of an api call.                             | `string`  |
| **`path`**                     | endpoint for an api call.                                                              | `string` |
| **`type`**                     | api type can be `include`, `callback` or `suffix`.                                     | `string` |
| **`include`**                  |                                                                                        | `string` |
| **`callback`**                 |                                                                                        | `function` |
| **`suffix`**                   |                                                                                        | `string` |
| **`responseHandler`**          | An array of responses the api can return.                                              |  `array`   |
| **`responseHandler-label`**    |  `label` is the name by which response type appears in Barricade View.                 | `string` |
| **`responseHandler-handler`**  | `handler` is the method corresponding to the `label` .                                 | `function` |

**3. Disable Barricade**
- To disable the barricade, open the debug menu and select `Disable Barricade` option to close the Barricade mock server.





## Used By

This project is used by the following companies:

- 
- 


## Roadmap

- Support for paginated apis.

- Add more integrations.


## Feedback

If you have any feedback, please reach out to us at info@mutualmobile.com.


## Support

For support, email info@mutualmobile.com.

