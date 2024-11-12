import { Result } from "./models/Result";
import * as API from "@aws-amplify/api";
import { Observable, Subject } from "rxjs";
import { RestApiOptionsBase } from "@aws-amplify/api-rest/src/types";
import { DocumentType } from "@aws-amplify/core/src/singleton/API/types";
import { ApiResponse } from "./models/ApiResponse";

export const API_NAME = "api";

interface AWSApiResult<T> extends Result {
	data?: T;
}

/**
 * Invokes a GET API through AWS API Gateway
 * @param path The request path
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsGet = <T = any>(
	path: string,
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> => {
	const options: RestApiOptionsBase = {
		queryParams,
	};

	return awsAPI("get", path, options);
};

/**
 * Invokes a DEL API through AWS API Gateway
 * @param path The request path
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsDel = <T = any>(
	path: string,
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> => {
	const options: RestApiOptionsBase = {
		queryParams,
	};

	return awsAPIWithoutBody("del", path, options);
};

/**
 * Invokes a HEAD API through AWS API Gateway
 * @param path The request path
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsHead = <T = any>(
	path: string,
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> => {
	const options: RestApiOptionsBase = {
		queryParams,
	};

	return awsAPIWithoutBody("head", path, options);
};

/**
 * Invokes a POST API through AWS API Gateway
 * @param path The request path
 * @param body Payload of the request, in an object of key-value pairs
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsPost = <T = any>(
	path: string,
	body: DocumentType = {},
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> => {
	const options: RestApiOptionsBase = {
		body,
		queryParams,
	};

	return awsAPI("post", path, options);
};

/**
 * Invokes a PUT API through AWS API Gateway
 * @param path The request path
 * @param body Payload of the request, in an object of key-value pairs
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsPut = <T = any>(
	path: string,
	body: DocumentType = {},
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> => {
	const options: RestApiOptionsBase = {
		body,
		queryParams,
	};

	return awsAPI("put", path, options);
};

/**
 * Invokes a PATCH API through AWS API Gateway
 * @param path The request path
 * @param body Payload of the request, in an object of key-value pairs
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsPatch = <T = any>(
	path: string,
	body: DocumentType = {},
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> => {
	const options: RestApiOptionsBase = {
		body,
		queryParams,
	};

	return awsAPI("patch", path, options);
};

const awsAPI = <T = any>(
	method: "get" | "post" | "put" | "patch",
	path: string,
	options: RestApiOptionsBase,
): Observable<AWSApiResult<T>> => {
	const result: AWSApiResult<T> = {
		success: false,
	};

	const resultSubject = new Subject<AWSApiResult<T>>();

	if (path[0] !== "/") path = "/" + path;

	API[method]({ apiName: API_NAME, path, options })
		.response.then((response) => response.body.json())
		.then((json) => {
			if (json) {
				const response = json as unknown as ApiResponse<T>;
				result.success = true;
				result.code = response.code;
				result.message = response.message;
				result.data = response.data;

				resultSubject.next(result);
			}
		})
		.catch((err) => {
			result.success = false;
			result.code = err.code;
			result.message = err.message;

			resultSubject.next(result);
		});

	return resultSubject.asObservable();
};

const awsAPIWithoutBody = <T = any>(
	method: "del" | "head",
	path: string,
	options: RestApiOptionsBase,
): Observable<AWSApiResult<T>> => {
	const result: AWSApiResult<T> = {
		success: false,
	};

	const resultSubject = new Subject<AWSApiResult<T>>();

	if (path[0] !== "/") path = "/" + path;

	API[method]({ apiName: API_NAME, path, options })
		.response.then((response) => {
			if (response) {
				result.success = response.statusCode === 200;
				result.code = response.statusCode.toString();

				resultSubject.next(result);
			}
		})
		.catch((err) => {
			result.success = false;
			result.code = err.code;
			result.message = err.message;

			resultSubject.next(result);
		});

	return resultSubject.asObservable();
};
