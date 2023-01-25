# @mutualmobile/react-native-barricade

A local server configurable at runtime to develop, test, and prototype your React Native app. Using just mock responses, Barricade can build the whole app without getting blocked by the unavailability of APIs.

`Barricade` works by replacing the global `XMLHttpRequest` and `fetch` object with the `MockedXMLHttpRequest`. It blocks all outgoing network calls that are configured with Barricade and returns a registered local response without requiring any changes to the existing network code.

## Why Barricade?

Most other local server implementations only support a single response per request, but Barricade supports multiple responses per request. This allows us to present the user with an interface to modify the selected mock response for a request at runtime.

<p align="center">
<img src="https://github.com/mutualmobile/react-native-barricade/blob/main/docs/media/demo.gif?raw=true" alt="Example App" width="231" height="500" />
</p>

## How does Barricade help?

During **development**, Barricade is useful for easily exercising all edge cases of a feature while you are building it without needing to frequently adjust the live server state.

Barricade also helps you test edge cases better during **unit and integration testing** as it can easily let you toggle each predefined response to a request.

## Features

- Mock API responses.
- Change mocked API responses at runtime.
- Disable/Enable mocking API responses at runtime.
- Support both Android and iOS platforms.
- Built-in TypeScript definitions.

## Installation
```bash
$ npm install --save @mutualmobile/react-native-barricade
# --- or ---
$ yarn add @mutualmobile/react-native-barricade
```

## Usage

**1. Create and start Barricade**

Create an instance of Barricade with the help of the `createBarricade` function. While calling this function, you can pass an array of `RequestConfig`(optional) to register the request configs. You can also register a request config later by making use of `registerRequest` method on the barricade instance.

**:warning: Make sure to do this in index.js so that you can start Barricade before hitting any API.**

```tsx
import { createBarricade } from '@mutualmobile/react-native-barricade';

const requestConfig = []; // Optional: Array of RequestConfigs for all the APIs that needs to be mocked
const barricade = createBarricade(requestConfig);
barricade.start(); // Start the Barricade

AppRegistry.registerComponent('App', () => App);
```

**2. Add BarricadeView**

Add `BarricadeView` to the root component (App.tsx) of your app. This shows the list of mocked APIs and is used to change the selected response at runtime.

**:warning: Make sure you add BarricadeView at the end so that it overlays the entire app.**

```tsx
import { BarricadeView } from '@mutualmobile/react-native-barricade';

const App = () => {
  return (
    <View>
      /* Rest of your app */
      <BarricadeView />
    </View>
  );
};
```
**BarricadeView:**  
| Property              | Description                                                                                                                                                            | Type                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **`theme`**           | Use this to select the preferred color scheme. It can be `dark` or `light`. This is optional and by default it's `light`.                                              | `ThemeType` / `undefined` |

**3. Create RequestConfigs**

Create a `RequestConfig` for each API you want to mock. Then, add these to the list of request configs shown in Step 1 or register them individually by calling the `registerRequest` method as shown below.

```tsx
import { getBarricadeInstance } from '@mutualmobile/react-native-barricade';

const apiRequestConfig = {} // RequestConfig for a particular API that you wish to mock.
getBarricadeInstance()?.registerRequest(apiRequestConfig);
```

**:warning: Make sure to call the `registerRequest` method only after barricade instance is created.**

In case you want to unregister a config programmatically, you can do this by calling the `unregisterRequest` method similar to the registerRequest method.

```tsx
import { getBarricadeInstance } from '@mutualmobile/react-native-barricade';

const apiRequestConfig = {} // RequestConfig object that was previously used for registering
getBarricadeInstance()?.unregisterRequest(apiRequestConfig);
```

**RequestConfig:**  
| Property              | Description                                                                                                                                                            | Type                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **`label`**           | String used by developer to identify the request in BarricadeView.                                                                                                     | `string`                  |
| **`method`**          | Request method type. It can be `Delete`, `Get`, `Head`, `Options`, `Patch`, `Post` or `Put`.                                                                           | `Method`                  |
| **`pathEvaluation`**  | Data used to identify the current API triggered from the list of RequestConfigs.                                                                                       | `PathEvaluation`          |
| **`responseHandler`** | List of mocked responses the current API can return with. By default, the first response from the list is selected.                                                    | `ResponseHandler[]`       |
| **`delay`**           | The time (in milliseconds) Barricade needs to wait before responding with the mocked response. This is optional and by default it's `400`.                             | `number` / `undefined`    |
| **`disabled`**        | Boolean used to enable/disable mocking of current API. This is optional and by default it's `undefined`.                                                               | `boolean` / `undefined`   |

**PathEvaluation:**  
| Property              | Description                                                                                                                                                            | Type                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **`path`**            | Request URL endpoint.                                                                                                                                                  | `string`                  |
| **`type`**            | Type of evaluation that needs to be done on path/request to identify the RequestConfig. It can be `Callback`, `Include` or `Suffix`.                                   | `PathEvaluationType`      |
| **`callback`**        | Function used to identify if this requestConfig needs to be used for resolving the current API with the help of the `Request` argument.                                | `function`                |

**PathEvaluationType:**  
| Enum Options          | Description                                                                                                                                                            | Type                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **`Callback`**        | Use this when you cannot identify the RequestConfig with just the help of `path` along with the `callback` function in `pathEvaluation`.                               | `number`                  |
| **`Include`**         | Use this when the `path` passed in `pathEvaluation` can be anywhere within the Request URL.                                                                            | `number`                  |
| **`Suffix`**          | Use this when the `path` passed in `pathEvaluation` must be at the end of the Request URL.                                                                             | `number`                  |

**ResponseHandler:**  
| Property              | Description                                                                                                                                                            | Type                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **`label`**           | String used by developer to identify the response in BarricadeView.                                                                                                    | `string`                  |
| **`handler`**         | Function that returns the mocked response for the current API call. It can also tweak the response with the help of the `Request` argument.                            | `function`                |
| **`isSelected`**      | Used to identify the selected response from the `ResponseHandler[]`. This is optional and by default Barricade selects the first response on the list.                 | `boolean` / `undefined`   |

## Example

In this example, we will setup Barricade to be able to respond to the `flickr search` API with one of two possible responses.

```tsx
const SearchApiRequestConfig: RequestConfig = {
  label: 'Search',
  method: Method.Get,
  pathEvaluation: {
    path: '/services/rest?method=flickr.photos.search',
    type: PathEvaluationType.Includes,
  },
  responseHandler: [
    {
      label: 'Success',
      handler: successResponseHandler, // function that returns success data based on some computation
    },
    {
      label: 'Failure',
      handler: () => {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          headers: { 'Content-Type': 'application/json' },
          response: JSON.stringify(errorData), // JSON formatted error response.
        };
      },
    },
  ],
};
```

Everytime we hit the above API, Barricade executes the `successResponseHandler` function and returns the response data. This function will be useful in cases like the one below, where we have to return the paginated response to the same API call.

```tsx
const successResponseHandler = (request: Request) => {
  const { page } = request.params ?? {};
  const response = page === '1' ? searchPageOne : searchPageTwo; // JSON responses

  return {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
    response: JSON.stringify(response),
  };
};
```

## Selection Interface

Barricade comes packaged with an in-app interface that allows you to select  the network responses at runtime. For this to be visible, you need to add the `BarricadeView` mentioned in Step 2 under **Usage**.

<p align="center">
<img src="https://github.com/mutualmobile/react-native-barricade/blob/main/docs/screenshots/developer-menu.png?raw=true" alt="Developer Menu" width="231" height="500"/>
<img src="https://github.com/mutualmobile/react-native-barricade/blob/main/docs/screenshots/request-list.png?raw=true" alt="List View" width="231" height="500"/>
<img src="https://github.com/mutualmobile/react-native-barricade/blob/main/docs/screenshots/response-list.png?raw=true" alt="Detail View" width="231" height="500"/>
</p>

With this in place and the device shaken, you'll be able to see an option for `Barricade` in React Native's developer menu. On tapping the `Barricade` option, you’ll be redirected to a screen with the list of mocked APIs.

**:warning: The Developer Menu is disabled in release (production) builds.**

If you want to use Barricade in release mode, you will need to create a tappable text/button and onPress call `showBarricadeView`.

App.tsx:
```tsx
import { BarricadeView, showBarricadeView } from '@mutualmobile/react-native-barricade';

const App = () => {
  return (
    <View>
      /* Rest of your app */
      <Button onPress={showBarricadeView} title={"Open Barricade view"}/>
      <BarricadeView />
    </View>
  );
};
```

**Note:** In BarricadeView, apart from changing the selected response for any of the listed APIs, we can also:
- Disable/Enable Barricade. This will stop/start mocking all the registered API calls and lets you check the app with the actual/mocked API responses at runtime.
- Disable/Enable API Mock. This will stop/start mocking the current API calls and lets you check the app with the actual/mocked API response at runtime.
- Reset all the changes done to the list of selected responses.

## Store Submission

Barricade is safe to include with store builds (and could be used to support things like a demo mode for your app), but most of the time you will probably want to ensure that Barricade is disabled for store builds. You can achieve this by wrapping the creation of Barricade and BarricadeView inside an ENV check.

index.js:
```tsx
import { Env } from './src/config';

if (Env.enableBarricade) { // enableBarricade will be false in case of Production.
  const requestConfig = [];
  const barricade = createBarricade(requestConfig);
  barricade.start();
}
```

App.tsx:
```tsx
import { BarricadeView } from '@mutualmobile/react-native-barricade';
import { Env } from './config';

const App = () => {
  return (
    <View>
      /* Rest of your app */
      {Env.enableBarricade && <BarricadeView />}
    </View>
  );
};
```

## Testing with jest

Testing code which uses this library requires some setup since we might need to mock `XMLHttpRequest` and `fetch`.

To add the mocks, create a file jestSetup.ts (or any other file name) containing the following code:

```tsx
jest.mock("@mutualmobile/react-native-barricade", () => {
	return {
		fetch: jest.fn(),
		Headers: jest.fn(),
		Request: jest.fn(),
		Response: jest.fn(),
		XMLHttpRequest: jest.fn()
	};
});
```

After that, we need to add the setup file in the jest config. You can add it under setupFiles option in your jest config file:

```json
{
  "setupFiles": ["<rootDir>/jestSetup.ts"]
}
```

## Credits

Barricade was created by [Prajna Boloor](https://www.linkedin.com/in/prajna-boloor/) at [Mutual Mobile](http://www.mutualmobile.com).

A special shout-out to the React Nativeteam at Mutual Mobile for their feedback.

## License

Distributed under the MIT License. See [LICENSE.txt](https://github.com/mutualmobile/react-native-barricade/blob/feature/readme/LICENSE) for more information.


## Support Us

If this project has helped you out, please support us with a star 🌟.

## Acknowledgements

- [Pretender](https://github.com/pretenderjs/pretender)
- [FakeXMLHttpRequest](https://github.com/pretenderjs/FakeXMLHttpRequest)
