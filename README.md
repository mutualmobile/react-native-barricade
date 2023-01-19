
# react-native-barricade

The module is used to mock the responses of apis.

You have to navigate to the react native `debug` menu and you will se one more option
of `Enable Barricade` at the last of the debugger menu. 

Just click on it and the Barricade 
view come into action. Later select the api which you want to mock from the list of option
you will get after enabling the Barricade View.

Now select the type of response from the screen you are navigated after selecting the api. 

Click on Done and refresh the api, you will get the mocked response.

If this project has helped you out, please support us with a star 🌟.


# Why barricade ?
`react-native-barricade` is a module for setting up a run-time configurable local server for react native apps. This works by enabling "barricade" that blocks outgoing network traffic and redirects it to a custom, local response, without requiring any changes to existing networking code.

Most other local server implementations only support a single response per request, but `react-native-barricade` supports multiple responses per request. This allows us to present the user with an interface for modifying which response will be returned for a request at runtime.



# When to use ?
During development barricade is useful for easily exercising all edge cases of a feature while you are building it without needing to frequently adjust the live server state.

For unit tests and integration tests barricade allows you to easily toggle through each predefined response for a request so tests can cover edge cases thoroughly.



## Features

- Mocked the response of apis.
- Support various rest methods - get, post, put and delete.
- You can create your own json file for the response type as per your api response.
- Support both android and IOS platforms. 
- The main features are `enableBarricade`, `shutdown` and `BarricadeView`.




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



 
**1. Barricade View**

Adding `BarricadeView` is the second step after enabling the mock server.
 Add the following code to app.ts file to enable the `BarricadeView`.

```tsx
import { BarricadeView } from 'react-native-barricade';

const App = () => {
  return (
    <View>
      // rest of the app code
      <BarricadeView /> // add Barricade view at the end so that it overlays the entire app.
    </View>
  );
};

```

**2. Enable Barricade**

 - You have to enable the Barricade View to add the barricade to the debug menu. You can do that in root index.ts file.


```tsx
import { enableBarricade } from 'react-native-barricade';

const mockedApiRequestConfig = [] // add the config for all the apis that needs to be mocked
enableBarricade(mockedApiRequestConfig);

AppRegistry.registerComponent('App', () => App);

```
Create the config files for all the mocked apis. 
You can refer the examle app for generating the config files.


**RequestConfig:**  
- The object contains the configuration for a mocked api.


| Property                         | Description                                                                            | Type |
| -----------------------        | -------------------------------------------------------------------------------------- | ------- |
| **`label`**                    | Represent api in the Barricade View.                                       | `string`  |
| **`Method`**                   | The request method type(get, post , put or delete).                                    | `string` |
| **`pathEvaluation`**           | An object defining path(endpoint) and additional params of an api call.                             | `string`  |
| **`responseHandler`**          | Collection of responses the api can return.                                              |  `array`   |
| **`delay`**                    | Delay in api response.                                          |  `number`   |


**pathEvaluation:**  
| Property                       | Description                                                                            | Type |
| -----------------------        | -------------------------------------------------------------------------------------- | ------- |
| **`path`**                     | endpoint of an api call.                                                              | `string` |
| **`type`**                     | api type can be `include` or `suffix`.                                     | `string` |
| **`callback`**                 | Identify if the current requestConfig needs to be used for resolving response by executing the callback function which passed the request object.                          | `string` |


**type:**  
| Property                         | Description                                                                            | Type |
| -----------------------        | -------------------------------------------------------------------------------------- | ------- |
| **`suffix`**                     |  Check the path presence at the end in the requested url to consider it for mocking.                                            | `string` |
| **`include`**                     |Check the path presence anywhere in the requested url to consider it for mocking.                                 | `string` |


**responseHandler:**  
| Property                         | Description                                                                            | Type |
| -----------------------        | -------------------------------------------------------------------------------------- | ------- |
| **`label`**                    | Represent api response type | `string` |
| **`handler`**                  | Returns the response for an api call                            | `function` |
| **`isSelected`**               | Which response is selected by default| `boolean` |

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

