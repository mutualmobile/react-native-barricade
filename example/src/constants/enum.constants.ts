export enum HttpMethod {
	GET = "GET",
	POST = "POST",
	DELETE = "DELETE",
	PATCH = "PATCH",
	PUT = "PUT"
}

export enum HttpStatus {
	error = "error",
	ok = "ok"
}

export enum HttpStatusCodes {
	SUCCESS = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER = 500,
	NOT_IMPLEMETED = 501,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
	GATEWAY_TIMEOUT = 504,
	REFRESH = 999,
	NO_NETWORK = 998,
	APP_UPDATE = 997,
	BAD_RESPONSE = 996
}

export enum NavigationStack {
	Home,
	Signup
}

export enum SearchContentType {
	Photos = 1,
	Screenshots = 2,
	Other = 3,
	PhotosScreenshots = 4,
	ScreenshotsOther = 5,
	PhotosOther = 6,
	All = 7
}

export enum ImageSizeClass {
	Thumbnail = "thumbnail",
	Small = "small",
	Medium = "medium",
	Large = "large",
	ExtraLarge = "extra large",
	Original = "original"
}

export enum ImageSizeSuffix {
	Small = "w",
	Large = "c"
}
