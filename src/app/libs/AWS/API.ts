import * as API from "@aws-amplify/api";
import { DocumentType } from "@aws-amplify/core/internals/utils";
import { Observable, Subject } from "rxjs";
import { ApiResponse } from "./models/ApiResponse";
import { Result } from "./models/Result";

export const API_NAME = "api";

interface AWSApiResult<T> extends Result {
	data?: T;
}

interface ApiResponsePayload {
	statusCode: number;
	body?: { json(): Promise<DocumentType> };
}

type ApiCall = () => { response: Promise<ApiResponsePayload> };

type ResponseMapper<T> = (
	response: ApiResponsePayload,
) => AWSApiResult<T> | null | Promise<AWSApiResult<T> | null>;

/**
 * Invokes an API through AWS API Gateway and maps its response to a result
 * @param call Performs the actual API call
 * @param mapResponse Maps the raw response to a result, or null to skip emitting
 * @return Returns the result of the API call
 */
const awsRequest = <T>(
	call: ApiCall,
	mapResponse: ResponseMapper<T>,
): Observable<AWSApiResult<T>> => {
	const resultSubject = new Subject<AWSApiResult<T>>();

	call()
		.response.then(mapResponse)
		.then((result) => {
			if (result) {
				resultSubject.next(result);
			}
		})
		.catch((err) => {
			resultSubject.next({
				success: false,
				code: err.code,
				message: err.message,
			});
		});

	return resultSubject.asObservable();
};

/**
 * Maps a JSON response body to a result
 * @param response The raw response
 * @return Returns null when the response has no JSON body
 */
const mapJsonBody = async <T>(response: ApiResponsePayload): Promise<AWSApiResult<T> | null> => {
	const json = await response.body?.json();

	if (!json) {
		return null;
	}

	const body = json as unknown as ApiResponse<T>;

	return {
		success: true,
		code: body.code,
		message: body.message,
		data: body.data,
	};
};

/**
 * Maps the status code of a response without a JSON body to a result
 * @param response The raw response
 */
const mapStatusCode = <T>(response: ApiResponsePayload): AWSApiResult<T> => ({
	success: response.statusCode === 200,
	code: response.statusCode.toString(),
});

/**
 * Invokes a GET API through AWS API Gateway
 * @param path The request path
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsGet = <T = any>(
	path: string,
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> =>
	awsRequest<T>(
		() =>
			API.get({
				apiName: API_NAME,
				path,
				options: { queryParams },
			}),
		mapJsonBody,
	);

/**
 * Invokes a DEL API through AWS API Gateway
 * @param path The request path
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsDel = <T = any>(
	path: string,
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> =>
	awsRequest<T>(
		() =>
			API.del({
				apiName: API_NAME,
				path,
				options: { queryParams },
			}),
		mapStatusCode,
	);

/**
 * Invokes a HEAD API through AWS API Gateway
 * @param path The request path
 * @param queryParams Parameters of the request, in an object of key-value pairs
 * @return Returns data object from the API
 */
export const awsHead = <T = any>(
	path: string,
	queryParams: Record<string, string> = {},
): Observable<AWSApiResult<T>> =>
	awsRequest<T>(
		() =>
			API.head({
				apiName: API_NAME,
				path,
				options: { queryParams },
			}),
		mapStatusCode,
	);

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
): Observable<AWSApiResult<T>> =>
	awsRequest<T>(
		() =>
			API.post({
				apiName: API_NAME,
				path,
				options: { body, queryParams },
			}),
		mapJsonBody,
	);

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
): Observable<AWSApiResult<T>> =>
	awsRequest<T>(
		() =>
			API.put({
				apiName: API_NAME,
				path,
				options: { body, queryParams },
			}),
		mapJsonBody,
	);

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
): Observable<AWSApiResult<T>> =>
	awsRequest<T>(
		() =>
			API.patch({
				apiName: API_NAME,
				path,
				options: { body, queryParams },
			}),
		mapJsonBody,
	);
